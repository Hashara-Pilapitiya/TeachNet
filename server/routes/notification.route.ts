import express from 'express';
import { getNotifications, updateNotification } from '../controllers/notification.controller';

const notificationRouter = express.Router();

notificationRouter.get('/get-notifications/all', getNotifications);

notificationRouter.get('/update-notification/:id', updateNotification);

export default notificationRouter;