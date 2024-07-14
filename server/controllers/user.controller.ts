require('dotenv').config();
import { Request, Response, NextFunction } from "express";
import userModel, { IUser } from "../models/user.model";
import ErrorHandler from "../utils/ErrorHandler";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import ejs from "ejs";
import path from "path";
import sendMail from "../utils/sendMail";
import { accessTokenOptions, refreshTokenOptions, sendToken } from "../utils/jwt";
import { redis } from "../utils/redis";
import { getAllUsersService, getUserById } from "../services/user.service";
import cloudinary from 'cloudinary';


// A Register User
interface IRegistrationBody {
    name: string;
    email: string;
    password: string;
    avatar?: string;
}

export const registerUser = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, email, password } = req.body;

        const isEmailExist = await userModel.findOne({ email });
        if (isEmailExist) {
            return next(new ErrorHandler(400, ' Email already exists'));
        };

        const user: IRegistrationBody = {
            name,
            email,
            password
          };

          const activationToken = createActivationToken(user);

          const activationCode = activationToken.activationCode;

          const data = {user: {name: user.name}, activationCode};

          const html = await ejs.renderFile(path.join(__dirname, '../mails/activation-mail.ejs'), data);

          try {
            await sendMail({
                email: user.email,
                subject: 'Account Activation',
                template: 'activation-mail.ejs',
                data: {user: {name: user.name}, activationCode}
            });

            return res.status(200).json({
                success: true,
                message: `Please check your email: ${user.email} to activate your account`,
                activationToken: activationToken.token
            });

          } catch (error: any) {
              return next(new ErrorHandler(error.message, 400));
          }

    
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});


interface IActivationToken {
    token: string;
    activationCode: string;
}

export const createActivationToken = (user: any): IActivationToken => {
    const activationCode = Math.floor(1000 + Math.random() * 9000).toString();

    const token = jwt.sign({ user, activationCode }, process.env.ACTIVATION_SECRET as Secret, {
        expiresIn: '5m'
    });

    return { token, activationCode };

};


// Activate User
interface IAcrivationRequest {
    activation_code: string;
    activation_token: string;
}

export const activateUser = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { activation_code, activation_token } = req.body as IAcrivationRequest;

        const newUser: {user: IUser, activationCode: string} = jwt.verify(activation_token, process.env.ACTIVATION_SECRET as Secret) as {user: IUser, activationCode: string};

        if (newUser.activationCode !== activation_code) {
            return next(new ErrorHandler(400, 'Invalid activation code'));
        }

        const { name, email, password } = newUser.user;

        const existUser = await userModel.findOne({ email});

        if (existUser) {
            return next(new ErrorHandler(400, 'Email already exists'));
        }

        const user = await userModel.create({
            name,
            email,
            password
        });

        res.status(201).json({
            success: true,
            message: 'Account has been created successfully',
            user
        });


    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});




// Login User
interface ILoginRequest {
    email: string;
    password: string;
}

export const loginUser = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body as ILoginRequest;

        if (!email || !password) {
            return next(new ErrorHandler(400, 'Please enter email and password'));
        }

        const user = await userModel.findOne({ email }).select('+password');

        if (!user) {
            return next(new ErrorHandler(400, 'Invalid email or password'));
        }

        const isPasswordMatched = await user.comparePassword(password);

        if (!isPasswordMatched) {
            return next(new ErrorHandler(400, 'Invalid email or password'));
        }

        sendToken(user, 200, res);

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});




// Logout User
export const logoutUser = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
   try {
         res.cookie('access_token', '', {maxAge: 1});
         res.cookie('refresh_token', '', {maxAge: 1});

         const userId = req.user?._id;
         redis.del(userId as string);
    
         res.status(200).json({
              success: true,
              message: 'Logged out successfully'
         });
         
   } catch (error: any) {
       return next(new ErrorHandler(error.message, 400));
   }
});



// Update Access Token
export const updateAccessToken = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const refresh_token = req.cookies.refresh_token;

        const decoded = jwt.verify(refresh_token, process.env.REFRESH_TOKEN as string) as JwtPayload;

        const message = 'Could not refresh access token. Please login again';

        if (!decoded) {
            return next(new ErrorHandler(400, message));
        }

        const user = await userModel.findById(decoded.id);

        const accessToken = jwt.sign({ id: user?._id }, process.env.ACCESS_TOKEN as string, {
            expiresIn: '5m'
        });

        const refreshToken = jwt.sign({ id: user?._id }, process.env.REFRESH_TOKEN as string, {
            expiresIn: '3d'
        });

        req.user = user || undefined;

        res.cookie('access_token', accessToken, accessTokenOptions);

        res.cookie('refresh_token', refreshToken, refreshTokenOptions);

        res.status(200).json({
            success: true,
            accessToken
        });

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});




// Get User by ID
export const getUserInfo = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.params.id;
        const user = await userModel.findById(userId).select("-password");

        res.status(200).json({
            success: true,
            user
        });

    } catch (error) {
        return next(new ErrorHandler(404, "User not found."));
    }   
};



// Social Auth
interface ISocialAuthBody {
    name: string;
    email: string;
    avatar: string;
}

export const socialAuth = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, email, avatar } = req.body as ISocialAuthBody;

        const user = await userModel.findOne({email});

        if (!user) {

            const newUser = await userModel.create({
                name,
                email,
                avatar
            });

            sendToken(newUser, 200, res);

        } else {

            sendToken(user, 200, res);

        }

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }

});





// Update User Info
interface IUpdateUserInfo {
    name: string;
    email: string;
}

export const updateUserInfo = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.params.id;
        const { name, email } = req.body as IUpdateUserInfo;

        const user = await userModel.findById(userId);

        if (!user) {
            return next(new ErrorHandler(404, 'User not found'));
        }

        if (email !== user.email) {
            const isEmailExist = await userModel.findOne({ email });

            if (isEmailExist) {
                return next(new ErrorHandler(400, 'Email already exists'));
            }
        }

        user.name = name;
        user.email = email;

        await user.save();

        res.status(200).json({
            success: true,
            user
        });

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});




// Update Password
interface IUpdatePassword {
    oldPassword: string;
    newPassword: string;
}

export const updatePassword = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.params.id;
        const { oldPassword, newPassword } = req.body as IUpdatePassword;

        const user = await userModel.findById(userId).select('+password');

        if (!user) {
            return next(new ErrorHandler(404, 'User not found'));
        }

        const isPasswordMatched = await user.comparePassword(oldPassword);

        if (!isPasswordMatched) {
            return next(new ErrorHandler(400, 'Old password is incorrect'));
        }

        user.password = newPassword;

        await user.save();

        res.status(200).json({
            success: true,
            message: 'Password updated successfully'
        });

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});



// Update Avatar
export const updateAvatar = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.params.id;
        const user = await userModel. findById(userId);

        if (!user) {
            return next(new ErrorHandler(404, 'User not found'));
        }

        const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
            folder: 'avatars',
            width: 150,
            crop: 'scale'
        });

        user.avatar = {
            public_id: result.public_id,
            url: result.secure_url
        };

        await user.save();

        res.status(200).json({
            success: true,
            user
        });

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});



// Get all users
export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {

        getAllUsersService(res);

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
};


