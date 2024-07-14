import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/ErrorHandler";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import OrderModel, { IOrder } from "../models/order.model";
import userModel from "../models/user.model";
import CourseModel from "../models/course.model";
import path from "path";
import ejs from "ejs";
import sendMail from "../utils/sendMail";
import NotificationModel from "../models/notification.model";
import { newOrder } from "../services/order.service";


// Create a new order
export const createOrder = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
            const { courseId, payment_info} = req.body as IOrder;

            const user = await userModel.findById(req.user?.id);

            const courseExistInUser = user?.courses.some((course: any) => course._id.toString() === courseId);

            if(courseExistInUser){
                return next(new ErrorHandler(400, "You have already purchase this course"));
            }

            const course = await CourseModel.findById(courseId);

            if(!course){
                return next(new ErrorHandler(404, "Course not found"));
            }

            const data: any = {
                courseId: course._id,
                userId: user?._id,
                payment_info
            }

            const mailData = {
                order: {
                    _id: (course._id as string).toString().slice(0,6),
                    name: course.name,
                    price: course.price,
                    date: new Date().toLocaleDateString('en-US', {year: 'numeric', month: 'long', day: 'numeric'}),
                },
            }

            const html = await ejs.renderFile(path.join(__dirname, "../mails/order-confirmation.ejs"),{order:mailData});

            try {
                if (user) {
                    await sendMail({
                        email: user.email,
                        subject: "Order Confirmation",
                        template: "order-confirmation.ejs",
                        data: mailData,
                    });

                }
                
            } catch (error: any) {
                next(new ErrorHandler(error.message, 500));
            }

            user?.courses.push({ courseId: course?._id as string });

            await user?.save();

            await NotificationModel.create({
                user: user?._id,
                title: "New Course Purchase",
                message: `You have a new order from ${course.name}`,
            });

            course.purchased ? course.purchased += 1 : course.purchased = 1;

            await course.save();

            newOrder(data, res, next);

            res.status(200).json({
                success: true,
                message: "Order created successfully",
                order: course
            });

    } catch (error: any) {
        next(new ErrorHandler(error.message, 500));
    }
} );
   