import express from 'express';
import { getNotifications } from '../controllers/notification.controller';

const notificationRouter = express.Router();

notificationRouter.get('/get-notifications/all', getNotifications);

export default notificationRouter;