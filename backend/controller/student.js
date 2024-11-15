import Student from '../models/student.js';
import Question from '../models/question.js';
import Exam from '../models/exam.js';

export const student_performance = async (req, res) => {
    try {
        const { username } = req.params;

        // Find the student by username
        const student = await Student.findOne({ username: username })
            .populate({
                path: 'givenExams.exam',
                select: 'total_points'
            });

        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        let totalPointsPossible = 0;
        let totalPointsEarned = 0;

        // Iterate through each exam
        student.givenExams.forEach((examRecord) => {
            totalPointsPossible += examRecord.exam.total_points;

            totalPointsEarned += examRecord.obtained_score;
        });

        // Calculate performance percentage
        const percentage = totalPointsPossible > 0 
            ? (totalPointsEarned / totalPointsPossible) * 100 
            : 0;

        // Send response
        return res.json({
            totalPointsPossible,
            totalPointsEarned,
            percentage: percentage.toFixed(2) + "%"
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server error" });
    }
};

export const student_submit_answer = async (req, res) => {
    try {
        const { username, examId, questionId, answer } = req.body;

        const student = await Student.findOne({ username });
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        const examData = await Exam.findOne({ examId });
        if (!examData) {
            return res.status(404).json({ message: 'Exam not found' });
        }

        const question = await Question.findOne({ questionId });
        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }

        const isCorrect = question.answer === answer;

        let student_exam = student.givenExams.find(exam => exam.exam.equals(examData._id));

        if (!student_exam) {
            student.givenExams.push({
                exam: examData._id,
                questions: [{ question: question._id, answer }],
                obtained_score: 0,
            });
            student_exam = student.givenExams[student.givenExams.length - 1];
        }
        
        student_exam.questions.push({ question: question._id, answer }); 
        
        if (isCorrect) {
            student_exam.obtained_score += question.points;
        }

        await student.save();

        return res.status(200).json({
            message: isCorrect ? 'Answer is correct. Score updated!' : 'Answer is incorrect.',
            obtained_score: student_exam.obtained_score,
        });
    } catch (error) {
        console.error('Error submitting answer:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
