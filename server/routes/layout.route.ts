import express from 'express';
import { createLayout } from '../controllers/layout.controller';

const layoutRouter = express.Router();

layoutRouter.post('/create-layout', createLayout);

export default layoutRouter;