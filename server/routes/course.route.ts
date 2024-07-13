import express from 'express';
import { editCourse, getSingleCourse, uploadCourse } from '../controllers/course.controller';


const courseRouter = express.Router();

courseRouter.post('/create-course', uploadCourse);

courseRouter.put('/edit-course/:id', editCourse);

courseRouter.get('/get-course/:id', getSingleCourse);

export default courseRouter;