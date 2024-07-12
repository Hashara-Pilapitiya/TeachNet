require('dotenv').config();
import { Request, Response, NextFunction } from "express";
import userModel, { IUser } from "../models/user.model";
import ErrorHandler from "../utils/ErrorHandler";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import jwt, { Secret } from "jsonwebtoken";
import ejs from "ejs";
import path from "path";
import sendMail from "../utils/sendMail";
import { sendToken } from "../utils/jwt";
import { redis } from "../utils/redis";


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