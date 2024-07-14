import NotificationModel from "../models/notification.model";
import { Request, Response, NextFunction } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";


// Get all notifications
export const getNotifications = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {

        const notifications = await NotificationModel.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            notifications
        });

    } catch (error: any) {
        next(new ErrorHandler(error.message, 500));
    }
});