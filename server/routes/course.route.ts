import express from 'express';
import { editCourse, getAllCourses, getSingleCourse, uploadCourse } from '../controllers/course.controller';


const courseRouter = express.Router();

courseRouter.post('/create-course', uploadCourse);

courseRouter.put('/edit-course/:id', editCourse);

courseRouter.get('/get-course/:id', getSingleCourse);

courseRouter.get('/get-courses/all', getAllCourses);

export default courseRouter;