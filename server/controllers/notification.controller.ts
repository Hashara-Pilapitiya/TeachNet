import NotificationModel from "../models/notification.model";
import { Request, Response, NextFunction } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import cron from "node-cron";


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



// Update notification status
export const updateNotification = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {

        const notification = await NotificationModel.findById(req.params.id);

        if (!notification) {
            return next(new ErrorHandler(404, 'Notification not found'));
        } else {
            notification.status ? notification.status = 'read' : notification.status = 'unread';
        }

        await notification.save();

        const notifications = await NotificationModel.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            notifications
        });

    } catch (error: any) {
        next(new ErrorHandler(error.message, 500));
    }
});



// Delete notification
cron.schedule('0 0 0 * * *', async () => {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    await NotificationModel.deleteMany({  status: 'read', createdAt: { $lte: thirtyDaysAgo } });

    console.log('Notifications deleted');
});