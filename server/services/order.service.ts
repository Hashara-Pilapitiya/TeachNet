import { NextFunction, Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import OrderModel from "../models/order.model";


// Create a new order
export const newOrder = CatchAsyncError(async (data: any, next: NextFunction, res: Response) => {
   const order = await OrderModel.create(data);

});



// Get all orders
export const getAllOrdersService = async (res: Response) => {
   const orders = await OrderModel.find().sort({ createdAt: -1 });

   res.status(200).json({
       success: true,
       orders
   });
}