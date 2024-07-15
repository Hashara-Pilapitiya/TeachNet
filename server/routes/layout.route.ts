import express from 'express';
import { createLayout, editLayout } from '../controllers/layout.controller';

const layoutRouter = express.Router();

layoutRouter.post('/create-layout', createLayout);

layoutRouter.post('/edit-layout', editLayout);

export default layoutRouter;