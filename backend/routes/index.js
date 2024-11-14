import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { authenticateToken, authenticate_admin_token } from '../middleware/authentication.js'

import { create_session, admin_login, create_examiner, create_student, forgot_password, verify_otp, reset_password, create_admin, resend_otp} from '../controller/authentication.js'
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
router.post('/create-session', create_session);
router.post('/admin-login', admin_login);
router.post('/create-student', authenticate_admin_token, create_student);
router.post('/create-examiner', authenticate_admin_token, create_examiner);
router.post('/create-admin', create_admin);
router.post('/forgot-password', forgot_password);
router.post('/verify-otp', verify_otp)
router.post('/resend-otp', resend_otp)
router.post('/reset-password', authenticateToken, reset_password)

router.post("/create-question", createQuestion);
router.put("/update-question/:id", updateQuestion);
router.delete("/delete-question/:id", deleteQuestion);

router.post("/create-exam", createExam);
router.put("/update-exam/:id", updateExam);
router.delete("/delete-exam/:id", deleteExam);

router.post('/:examId/add-question', examAddQuestion);
router.delete('/:examId/delete-question/:questionId', deleteQuestionFromExam);

export default router;