import express from 'express';
import { createOrder, getAllOrders } from '../controllers/order.controller';


const orderRouter = express.Router();

orderRouter.post('/create-order', createOrder);

orderRouter.get('/get-orders/all', getAllOrders);

export default orderRouter;