import express from 'express';
import { activateUser, loginUser, logoutUser, registerUser, updateAccessToken } from '../controllers/user.controller';
//import { authorizeRoles, isAuthenticated } from '../middleware/auth';

const userRouter = express.Router();

userRouter.post('/register', registerUser);

userRouter.post('/activate-user', activateUser);

userRouter.post('/login', loginUser);

userRouter.get('/logout', logoutUser);

userRouter.get('/refresh', updateAccessToken);

export default userRouter;