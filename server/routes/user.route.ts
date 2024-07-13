import express from 'express';
import { activateUser, getUserInfo, loginUser, logoutUser, registerUser, socialAuth, updateAccessToken, updateAvatar, updatePassword, updateUserInfo } from '../controllers/user.controller';

const userRouter = express.Router();

userRouter.post('/register', registerUser);

userRouter.post('/activate-user', activateUser);

userRouter.post('/login', loginUser);

userRouter.get('/logout', logoutUser);

userRouter.get('/refresh', updateAccessToken);

userRouter.get('/:id', getUserInfo);

userRouter.post('/social-auth', socialAuth)

userRouter.put('/update/:id', updateUserInfo);

userRouter.put('/update-password/:id', updatePassword);

userRouter.put('/update-avatar/:id', updateAvatar);

export default userRouter;