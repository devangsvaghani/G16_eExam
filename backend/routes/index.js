import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import * as controller from '../controller/authentication.js';

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
router.post('/signup', controller.signup);


export default router;