import express from 'express';
import { courseAnalytics, orderAnalytics, userAnalytics } from '../controllers/analytics.controller';

const analyticsRouter = express.Router();

analyticsRouter.get('/get-analytics/users', userAnalytics);

analyticsRouter.get('/get-analytics/courses', courseAnalytics);

analyticsRouter.get('/get-analytics/orders', orderAnalytics);

export default analyticsRouter;