import Exam from "../models/exam.js";
import Question from "../models/question.js";

// Create a new exam
export const create_exam = async (req, res) => {
    try {
        const {
            creator,
            questions,
            startTime,
            duration,
            title,
            semester,
            examType,
            batch,
            branch,
            total_points,
            status,
            instructions,
            subject
        } = req.body;

        const exam = new Exam({
            creator,
            questions,
            startTime,
            duration,
            title,
            semester,
            examType,
            batch,
            branch,
            total_points,
            status,
            instructions,
            subject
        });

        await exam.save();
        return res.status(201).json({ message: "Exam created successfully.", exam });
    } catch (error) {
        console.error("Error creating exam:", error);
        return res.status(500).json({ message: "Failed to create exam." });
    }
};

// Update an existing exam by its ID
export const update_exam = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            creator,
            questions,
            startTime,
            duration,
            title,
            semester,
            examType,
            batch,
            branch,
            total_points,
            status,
            instructions,
            subject
        } = req.body;

        // Find the exam by ID and update it
        const exam = await Exam.findOne({ examId: id });

        if (!exam) {
            return res.status(404).json({ message: "Exam not found." });
        }

        // Update the fields
        exam.creator = creator;
        exam.questions = questions;
        exam.startTime = startTime;
        exam.duration = duration;
        exam.title = title;
        exam.semester = semester;
        exam.examType = examType;
        exam.batch = batch;
        exam.branch = branch;
        exam.total_points = total_points;
        exam.status = status;
        exam.instructions = instructions;
        exam.subject = subject;

        // Save the updated exam
        await exam.save();

        return res.status(200).json({ message: "Exam updated successfully.", exam });
    } catch (error) {
        console.error("Error updating exam:", error);
        return res.status(500).json({ message: "Failed to update exam." });
    }
};

// Delete an exam by its ID
export const delete_exam = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the exam by ID and delete it
        const exam = await Exam.findOne({ examId: id });

        if (!exam) {
            return res.status(404).json({ message: "Exam not found." });
        }

        // Delete the exam
        await exam.deleteOne();

        return res.status(200).json({ message: "Exam deleted successfully." });
    } catch (error) {
        console.error("Error deleting exam:", error);
        return res.status(500).json({ message: "Failed to delete exam." });
    }
};

// Add a question to an exam
export const add_question_in_exam = async (req, res) => {
    try {
        const { examId } = req.params; // Exam ID in URL
        const { questionId } = req.body; // Question ID in request body

        // Find the exam and update by pushing the new question to the questions array
        const exam = await Exam.findOne({ examId: examId });

        if (!exam) {
            return res.status(404).json({ message: "Exam not found" });
        }

        const question  = await Question.findOne({questionId});
        // Add the question to the exam's questions array
        if (!exam.questions.includes(questionId)) {
            exam.questions.push(questionId);
            exam.total_points += question.points;
            await exam.save();
        }

        return res.status(200).json({ message: "Question added to exam successfully", exam });
    } catch (error) {
        console.error("Error adding question to exam:", error);
        return res.status(500).json({ message: "Failed to add question to exam" });
    }
};

// Remove a question from an exam
export const delete_question_from_exam = async (req, res) => {
    try {
        const { examId, questionId } = req.params;

        // Find the exam by ID
        const exam = await Exam.findOne({ examId: examId });

        if (!exam) {
            return res.status(404).json({ message: "Exam not found" });
        }

        const question  = await Question.findOne({questionId});
        // Remove the question from the exam's questions array
        const questionIndex = exam.questions.indexOf(questionId);
        if (questionIndex !== -1) {
            exam.questions.splice(questionIndex, 1);
            exam.total_points -= question.points;
            await exam.save();
        }

        return res.status(200).json({ message: "Question removed from exam successfully", exam });
    } catch (error) {
        console.error("Error removing question from exam:", error);
        return res.status(500).json({ message: "Failed to remove question from exam" });
    }
};

export const fetch_exam_student = async (req, res) => {
    try {
        const { examId } = req.params;

        // Find the exam by ID without fetching questions
        const exam = await Exam.findOne({ examId }).lean();

        if (!exam) {
            return res.status(404).json({ message: "Exam not found." });
        }

        // Fetch all questions using their unique IDs
        const questions = await Question.find({ questionId: { $in: exam.questions } }).select("-answer");

        return res.status(200).json({ 
            message: "Exam Fetched Successfully", 
            exam: { ...exam, questions } 
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to fetch exam" });
    }
}

