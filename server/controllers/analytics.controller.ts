import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/ErrorHandler";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import { generateLast12MonthsData } from "../utils/analytics.genarator";
import userModel from "../models/user.model";
import CourseModel from "../models/course.model";
import OrderModel from "../models/order.model";


// Get user analytics
export const userAnalytics = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {

        const users = await generateLast12MonthsData(userModel);

        res.status(200).json({
            success: true,
            users,
        });

    } catch (error: any) {
        next(new ErrorHandler(error.message, 500));
    }
});



// Get course analytics
export const courseAnalytics = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {

        const courses = await generateLast12MonthsData(CourseModel);

        res.status(200).json({
            success: true,
            courses,
        });

    } catch (error: any) {
        next(new ErrorHandler(error.message, 500));
    }
});



// Get order analytics
export const orderAnalytics = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {

        const orders = await generateLast12MonthsData(OrderModel);

        res.status(200).json({
            success: true,
            orders,
        });

    } catch (error: any) {
        next(new ErrorHandler(error.message, 500));
    }
});