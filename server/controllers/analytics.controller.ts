import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/ErrorHandler";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import { generateLast12MonthsData } from "../utils/analytics.genarator";
import userModel from "../models/user.model";


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