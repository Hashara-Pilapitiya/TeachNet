import express from 'express';
import { addQuestion, addReply, addReplyToReview, addReview, editCourse, getAllCourses, getCourseByUser, getSingleCourse, uploadCourse } from '../controllers/course.controller';
import { isAuthenticated } from '../middleware/auth';


const courseRouter = express.Router();

courseRouter.post('/create-course', uploadCourse);

courseRouter.put('/edit-course/:id', editCourse);

courseRouter.get('/get-course/:id', getSingleCourse);

courseRouter.get('/get-courses/all', getAllCourses);

courseRouter.get('/get-course-content/:id', getCourseByUser);

courseRouter.put('/add-question', addQuestion);

courseRouter.put('/add-answer', addReply);

courseRouter.put('/add-review/:id', addReview);

courseRouter.put('/add-reply', addReplyToReview);

export default courseRouter;