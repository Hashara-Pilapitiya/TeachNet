import express from 'express';
import { courseAnalytics, userAnalytics } from '../controllers/analytics.controller';

const analyticsRouter = express.Router();

analyticsRouter.get('/get-analytics/users', userAnalytics);

analyticsRouter.get('/get-analytics/courses', courseAnalytics);

export default analyticsRouter;