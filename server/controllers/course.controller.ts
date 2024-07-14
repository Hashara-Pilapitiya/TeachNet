import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import cloudinary from "cloudinary";
import { createCourse, getAllCoursesService } from "../services/course.service";
import CourseModel from "../models/course.model";
import { redis } from "../utils/redis";
import mongoose from "mongoose";
import { title } from "process";
import ejs from "ejs";
import path from "path";
import sendMail from "../utils/sendMail";
import NotificationModel from "../models/notification.model";


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
        const courseId = req.params.id;

        const isCacheExist = await redis.get(courseId);

        if (isCacheExist) {

            const course = JSON.parse(isCacheExist);

            res.status(200).json({
                success: true,
                course
            });
        }

        else {
            const { id } = req.params;

            const course = await CourseModel.findById(id).select('-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links');

            if (!course) {
                return next(new ErrorHandler(404, "Course not found"));
            }

            await redis.set(id, JSON.stringify(course));

            res.status(200).json({
                success: true,
                course
            });
        }

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




// Get Course Content for only valid users
export const getCourseByUser = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        
            const { id } = req.params;

            const course = await CourseModel.findById(id);

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




// Add Question to Course
interface IAddQuestionData {
    question: string;
    courseId: string;
    contentId: string;
}

export const addQuestion = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { question, courseId, contentId }: IAddQuestionData = req.body;

        const course = await CourseModel.findById(courseId);

        if (!mongoose.Types.ObjectId.isValid(contentId)) {
            return next(new ErrorHandler(400, "Invalid Content ID"));
        }

        const courseContent = course?.courseData.find((item: any) => item._id.equals(contentId));

        if (!courseContent) {
            return next(new ErrorHandler(404, "Content not found"));
        }

        // Create new question
        const newQuestion: any = {
            question,
            user: req.user,
            questionReplies: []
        }

        // Add question to course content
        courseContent.questions.push(newQuestion);

        await NotificationModel.create({
            user: req.user?._id,
            title: "New Question Received",
            message: `You have a new question on ${courseContent.title}`
        });

        // Save course
        await course?.save();

        res.status(200).json({
            success: true,
            message: "Question added successfully"
        });


    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});




// Add Reply to Question
interface IAddReplyData {
    answer: string;
    courseId: string;
    contentId: string;
    questionId: string;
}

export const addReply = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { answer, courseId, contentId, questionId }: IAddReplyData = req.body;

        const course = await CourseModel.findById(courseId);

        if (!mongoose.Types.ObjectId.isValid(contentId)) {
            return next(new ErrorHandler(400, "Invalid Content ID"));
        }

        const courseContent = course?.courseData.find((item: any) => item._id.equals(contentId));

        if (!courseContent) {
            return next(new ErrorHandler(404, "Content not found"));
        }

        const question = courseContent.questions.find((item: any) => item._id.equals(questionId));

        if (!question) {
            return next(new ErrorHandler(404, "Question not found"));
        }

        // Create new reply
        const newReply: any = {
            answer,
            user: req.user
        }

        // Add reply to question
        if (question.questionReplies) {
            question.questionReplies.push(newReply);
        } else {
            question.questionReplies = [newReply];
        }

        // Save course
        await course?.save();

        await NotificationModel.create({
            user: req.user?._id,
            title: "New Reply Received",
            message: `You have a new reply on ${courseContent.title}`
        });

        res.status(200).json({
            success: true,
            message: "Reply added successfully"
        });

        

    } catch (error: any) {
        return next(new ErrorHandler(500, 'eee'));
    }
});




// Add review to course
interface IAddReviewData {
    review: string;
    rating: number;
    userId: string;
}

export const addReview = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { review, rating, userId }: IAddReviewData = req.body;

        const { id } = req.params;

        const course = await CourseModel.findById(id);

        if (!course) {
            return next(new ErrorHandler(404, "Course not found"));
        }

        const isReviewed = course.reviews.find((item: any) => item.user._id.equals(userId));

        if (isReviewed) {
            return next(new ErrorHandler(400, "You have already reviewed this course"));
        }

        // Create new review
        const newReview: any = {
            review,
            rating,
            user: req.user
        }

        // Add review to course
        course.reviews.push(newReview);

        // Calculate ratings
        course.ratings = course.reviews.reduce((acc, item) => item.rating + acc, 0) / course.reviews.length;

        // Save course
        await course.save();

        res.status(200).json({
            success: true,
            message: "Review added successfully"
        });

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});




// Add reply to review
interface IAddReplyToReviewData {
    comment: string;
    reviewId: string;
    courseId: string;
}

export const addReplyToReview = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { comment, reviewId, courseId }: IAddReplyToReviewData = req.body;

        const course = await CourseModel.findById(courseId);

        if (!course) {
            return next(new ErrorHandler(404, "Course not found"));
        }

        const review = course?.reviews?.find((item: any) => item._id.equals(reviewId));

        if (!review) {
            return next(new ErrorHandler(404, "Review not found"));
        }

        const replyData: any = {
            comment,
            user: req.user
        }

        if (!review.commentReplies) {
            review.commentReplies = [];
        }

        review.commentReplies?.push(replyData);

        await course?.save();

        res.status(200).json({
            success: true,
            message: "Reply added successfully"
        });
        
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});



// Get all courses
export const getCourses = async (req: Request, res: Response, next: NextFunction) => {
    try {

        getAllCoursesService(res);

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
};



// Delete Course
export const deleteCourse = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const courseId = req.params.id;

        const course = await CourseModel.findById(courseId);

        if (!course) {
            return next(new ErrorHandler(404, 'Course not found'));
        }

        await course.deleteOne({ _id: courseId });

        res.status(200).json({
            success: true,
            message: 'Course deleted successfully'
        });

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
};

