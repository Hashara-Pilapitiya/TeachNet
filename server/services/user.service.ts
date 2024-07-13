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