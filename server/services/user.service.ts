import userModel from '../models/user.model';
import { Response } from 'express';

// Get User by ID
export const getUserById = async (id: string, res: Response) => {
    const user = await userModel.findById(id);

    res.status(200).json({
        success: true,
        user
    });
}


// Get all users
export const getAllUsersService = async (res: Response) => {
    const users = await userModel.find().sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        users
    });
}