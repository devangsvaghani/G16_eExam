import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import {
    authenticateToken,
    authenticate_admin_token,
} from "../middleware/authentication.js";

import {
    create_question,
    update_question,
    delete_question,
} from "../controller/questions.js";
import {
    create_exam,
    update_exam,
    delete_exam,
    add_question_in_exam,
    delete_question_from_exam,
} from "../controller/exam.js";
import {
    create_session,
    admin_login,
    create_examiner,
    create_student,
    forgot_password,
    verify_otp,
    reset_password,
    create_admin,
    resend_otp,
} from "../controller/authentication.js";
import {
    get_past_exams,
    get_past_exams_3,
    get_upcoming_exams,
    get_upcoming_exams_3,
    get_upcoming_exams_year,
} from "../controller/past_upcoming_exams.js";
import { student_performance, student_submit_answer } from "../controller/student.js";
import { exams_result, show_exam } from "../controller/exams_result.js"
import { all_students, delete_student, get_student, student_performance, student_submit_answer, update_student } from "../controller/student.js";
import { all_examiners, delete_examiner, get_examiner, update_profile } from "../controller/examiner.js";


dotenv.config();
const router = express.Router();

const corsOptions = {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    allowedHeaders: ["Authorization", "Content-Type", "Role"],
};

router.use(cors(corsOptions));

router.get("/", (req, res) => {
    return res.json("Hello!");
});

// Basic routes
router.post("/create-session", create_session);
router.post("/admin-login", admin_login);
router.post("/create-student", authenticate_admin_token, create_student);
router.post("/create-examiner", authenticate_admin_token, create_examiner);
router.post("/create-admin", create_admin);
router.post("/forgot-password", forgot_password);
router.post("/verify-otp", verify_otp);
router.post("/resend-otp", resend_otp);
router.post("/reset-password", authenticateToken, reset_password);

router.post("/create-question", create_question);
router.put("/update-question/:id", update_question);
router.delete("/delete-question/:id", delete_question);

router.post("/create-exam", create_exam);
router.put("/update-exam/:id", update_exam);
router.delete("/delete-exam/:id", delete_exam);

router.post("/:examId/add-question", add_question_in_exam);
router.delete("/:examId/delete-question/:questionId", delete_question_from_exam);

router.get("/past-exams", get_past_exams);
router.get("/upcoming-exams", get_upcoming_exams);
router.get("/upcoming-exams-per-year/:year", get_upcoming_exams_year);
router.get("/upcoming-exams-limit-3", get_upcoming_exams_3);
router.get("/past-exams-limit-3", get_past_exams_3);

router.post("/update-profile/:username", update_profile);

router.get("/student-performance/:username", student_performance);

router.post("/student-submit-answer", student_submit_answer);


router.get("/exams-result/:username", exams_result);
router.get("/show-exam/:username/:examId", show_exam);

// student related
router.get("/get-student/:username", authenticateToken, get_student);

// examiner related
router.get("/get-examiner/:username", authenticateToken, get_examiner);

// admin dashboard
router.get("/all-students", authenticate_admin_token, all_students);
router.get("/all-examiners", authenticate_admin_token, all_examiners);
router.delete("/delete-student/:username", authenticate_admin_token, delete_student);
router.put("/update-student/:username", authenticate_admin_token, update_student);
router.delete("/delete-examiner/:username", authenticate_admin_token, delete_examiner);
router.put("/update-examiner/:username", authenticate_admin_token, update_profile);

export default router;
