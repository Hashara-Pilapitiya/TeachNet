import express from 'express';
import { createLayout, editLayout, getLayoutByType } from '../controllers/layout.controller';

const layoutRouter = express.Router();

layoutRouter.post('/create-layout', createLayout);

layoutRouter.put('/edit-layout', editLayout);

layoutRouter.get('/get-layout/all', getLayoutByType);

export default layoutRouter;