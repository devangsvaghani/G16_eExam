import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { authenticateToken, authenticate_admin_token } from '../middleware/authentication.js'
import * as controller from '../controller/authentication.js';
import {createQuestion, updateQuestion, deleteQuestion} from '../controller/questions.js'
import {createExam,updateExam,deleteExam, examAddQuestion, deleteQuestionFromExam} from '../controller/exam.js'


dotenv.config();
const router = express.Router();

const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    allowedHeaders: ['Authorization', 'Content-Type', 'Role'],
};
  
router.use(cors(corsOptions));

router.get('/', (req, res) => {
  return res.json('Hello!');
});

// Basic routes
router.post('/create-session', controller.create_session);
router.post('/admin-login', controller.admin_login);
router.post('/create-user',authenticate_admin_token, controller.create_user);
router.post('/forgot-password',controller.forgot_password);
router.post('/verify-otp',controller.verify_otp)
router.post('/reset-password', authenticateToken, controller.reset_password)

router.post("/create-question", createQuestion);
router.put("/update-question/:id", updateQuestion);
router.delete("/delete-question/:id", deleteQuestion);

router.post("/create-exam", createExam);
router.put("/update-exam/:id", updateExam);
router.delete("/delete-exam/:id", deleteExam);

router.post('/:examId/add-question', examAddQuestion);
router.delete('/:examId/delete-question/:questionId', deleteQuestionFromExam);

export default router;