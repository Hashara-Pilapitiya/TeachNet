import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/ErrorHandler";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import LayoutModel from "../models/layout.model";
import cloudinary from "cloudinary";


// Create Layout
export const createLayout = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { type } = req.body;

        const isTypeExist = await LayoutModel.findOne({ type });

        if (isTypeExist) {
            return next(new ErrorHandler(400, "Layout already exists"));
        }

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

            const categoryItem = await Promise.all(categories.map(async (item: any) => {
                return {
                    title: item.title
                }
            }));

            await LayoutModel.create({ categories: categoryItem, type: "Categories" });
        }

        res.status(200).json({
            success: true,
            message: "Layout created successfully"
        });

    } catch (error: any) {
        next(new ErrorHandler(error.message, 500));
    }
});




// Edit Layout
export const editLayout = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { type } = req.body;

        if (type == "Banner") {

            const bannerData: any = await LayoutModel.findOne({ type: "Banner" });

            const { image, title, subtitle } = req.body;

            if (bannerData) {
                await cloudinary.v2.uploader.destroy(bannerData.image.public_id);
            }

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

            await LayoutModel.findByIdAndUpdate(bannerData._id, {banner});
        }

        if (type == "FAQ") {
            const { faq } = req.body;

            const faqData: any = await LayoutModel.findOne({ type: "FAQ" });

            const faqItem = await Promise.all(faq.map(async (item: any) => {
                return {
                    question: item.question,
                    answer: item.answer
                }
            }));

            await LayoutModel.findByIdAndUpdate(faqData?._id, { faq: faqItem , type: "FAQ" });
        }

        if (type == "Categories") {
            const { categories } = req.body;

            const categoryData: any = await LayoutModel.findOne({ type: "Categories" });

            const categoryItem = await Promise.all(categories.map(async (item: any) => {
                return {
                    title: item.title
                }
            }));

            await LayoutModel.findByIdAndUpdate(categoryData?._id, { categories: categoryItem, type: "Categories" });
        }

        res.status(200).json({
            success: true,
            message: "Layout updated successfully"
        });

    } catch (error: any) {
        next(new ErrorHandler(error.message, 500));
    }
});




// Get Layout by type
export const getLayoutByType = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { type } = req.body;

        const layout = await LayoutModel.findOne({ type });

        if (!layout) {
            return next(new ErrorHandler(400, "Layout not found"));
        }

        res.status(200).json({
            success: true,
            layout
        });

    } catch (error: any) {
        next(new ErrorHandler(error.message, 500));
    }
});