import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { authenticateToken, authenticate_admin_token } from '../middleware/authentication.js'

import {create_question, update_question, delete_question} from '../controller/questions.js'
import {create_exam,update_exam,delete_exam, add_question_in_exam, delete_question_from_exam} from '../controller/exam.js'



import { create_session, admin_login, create_examiner, create_student, forgot_password, verify_otp, reset_password, create_admin, update_profile } from '../controller/authentication.js'

import {get_past_exams, get_upcoming_exams } from '../controller/past_upcoming_exams.js'

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
router.post('/reset-password', authenticateToken, reset_password)

router.post("/create-question", create_question);
router.put("/update-question/:id", update_question);
router.delete("/delete-question/:id", delete_question);

router.post("/create-exam", create_exam);
router.put("/update-exam/:id", update_exam);
router.delete("/delete-exam/:id", delete_exam);

router.post('/:examId/add-question', add_question_in_exam);
router.delete('/:examId/delete-question/:questionId', delete_question_from_exam);

router.get('/past-exams', get_past_exams);
router.get('/upcoming-exams', get_upcoming_exams);

router.post('/update-profile/:username', update_profile);

export default router;