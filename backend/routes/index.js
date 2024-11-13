import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { authenticateToken, authenticate_admin_token } from '../middleware/authentication.js'

import { create_session, admin_login, create_examiner, create_student, forgot_password, verify_otp, reset_password, create_admin } from '../controller/authentication.js'

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


export default router;