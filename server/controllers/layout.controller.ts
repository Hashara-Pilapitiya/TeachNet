import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/ErrorHandler";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import LayoutModel from "../models/layout.model";
import cloudinary from "cloudinary";


// Create Layout
export const createLayout = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { type } = req.body;

        if (type == "Banner") {
            const { image, title, subtitle } = req.body;

            const myCloud = await cloudinary.v2.uploader.upload(image, {
                folder: "layout"
            });

            const banner = {
                image: {
                    public_id: myCloud.public_id,
                    url: myCloud.secure_url
                },
                title,
                subtitle
            }

            await LayoutModel.create(banner);
        }

        if (type == "FAQ") {
            const { faq } = req.body;

            const faqItem = await Promise.all(faq.map(async (item: any) => {
                return {
                    question: item.question,
                    answer: item.answer
                }
            }));

            await LayoutModel.create({ faq: faqItem , type: "FAQ" });
        }

        if (type == "Categories") {
            const { categories } = req.body;

            await LayoutModel.create(categories);
        }

        res.status(200).json({
            success: true,
            message: "Layout created successfully"
        });

    } catch (error: any) {
        next(new ErrorHandler(error.message, 500));
    }
});