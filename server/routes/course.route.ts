import express from 'express';
import { uploadCourse } from '../controllers/course.controller';


const courseRouter = express.Router();

courseRouter.post('/create-course', uploadCourse);

export default courseRouter;