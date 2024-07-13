import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import cloudinary from "cloudinary";
import { createCourse } from "../services/course.service";
import CourseModel from "../models/course.model";


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




// Edit Course
export const editCourse = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        const course = await CourseModel.findById(id);

        if (!course) {
            return next(new ErrorHandler(404, "Course not found"));
        }

        const data = req.body;

        const thumbnail = data.thumbnail;

        if (thumbnail) {
            await cloudinary.v2.uploader.destroy(thumbnail.public_id);
            
            const myCloud = cloudinary.v2.uploader.upload(thumbnail, {
                folder: "courses"
            });

            data.thumbnail = {
                public_id: (await myCloud).public_id,
                url: (await myCloud).secure_url
            }
        }

        await CourseModel.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true,
            useFindAndModify: false
        });

        res.status(200).json({
            success: true,
            message: "Course updated successfully"
        });

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});



// Get Single Course - without purchasing
export const getSingleCourse = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        const course = await CourseModel.findById(id).select('-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links');

        if (!course) {
            return next(new ErrorHandler(404, "Course not found"));
        }

        res.status(200).json({
            success: true,
            course
        });

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});




// Get All Courses - with purchasing
export const getAllCourses = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const courses = await CourseModel.find().select('-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links');

        if (!courses) {
            return next(new ErrorHandler(404, "Courses not found"));
        }

        res.status(200).json({
            success: true,
            courses
        });

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});