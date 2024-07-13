import express from 'express';
import { activateUser, getUserInfo, loginUser, logoutUser, registerUser, updateAccessToken } from '../controllers/user.controller';
import e from 'express';

const userRouter = express.Router();

userRouter.post('/register', registerUser);

userRouter.post('/activate-user', activateUser);

userRouter.post('/login', loginUser);

userRouter.get('/logout', logoutUser);

userRouter.get('/refresh', updateAccessToken);

userRouter.get('/:id', getUserInfo);

export default userRouter;