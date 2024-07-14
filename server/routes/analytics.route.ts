import express from 'express';
import { userAnalytics } from '../controllers/analytics.controller';
import e from 'express';

const analyticsRouter = express.Router();

analyticsRouter.get('/get-analytics/users', userAnalytics);

export default analyticsRouter;