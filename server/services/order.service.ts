import { NextFunction, Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import OrderModel from "../models/order.model";


// Create a new order
export const newOrder = CatchAsyncError(async (data: any, next: NextFunction, res: Response) => {
   const order = await OrderModel.create(data);

   
});