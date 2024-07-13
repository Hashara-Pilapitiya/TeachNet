import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import cloudinary from "cloudinary";
import { createCourse } from "../services/course.service";


// Upload Course
export const uploadCourse = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {

        const data = req.body;

        const thumbnail = data.thumbnail;

        if (thumbnail) {
            const myCloud = cloudinary.v2.uploader.upload(thumbnail, {
                folder: "courses"
            });

            data.thumbnail = {
                public_id: (await myCloud).public_id,
                url: (await myCloud).secure_url
            }
        }

        createCourse(data, res, next);

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});