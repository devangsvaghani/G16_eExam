import Student from "../models/student.js";

export const exams_result = async (req,res) => {
    try {
        const { username } = req.params;

        const student = await Student.findOne({ username }).populate({
            path: 'givenExams.exam',
            select: 'examId total_points title' 
        });

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        const results = [];

        for (const examEntry of student.givenExams) {
            const exam = examEntry.exam;

            const percentage = (examEntry.obtained_score / exam.total_points) * 100;

            results.push({
                examId: exam.examId,
                title: exam.title,
                totalPoints: exam.total_points,
                obtainedPoints: examEntry.obtained_score,
                percentage
            });
            console.log(exam.examId);
            
        }

        return res.status(200).json(results);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error fetching student results' });
    }
};


export const show_exam = async (req,res) => {
    try {
        const { username, examId } = req.params;

        const student = await Student.findOne({ username })
            .populate({
                path: 'givenExams.exam',
                match: { examId: parseInt(examId) }, 
                select: 'examId title' 
            })
            .populate({
                path: 'givenExams.questions.question', 
                select: 'questionId desc options answer' 
            });

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        const exam = student.givenExams.find(exam => exam.exam.examId === parseInt(examId));

        if (!exam) {
            return res.status(404).json({ message: 'Exam not found for this student' });
        }

        const questionDetails = [];

        for (const questionEntry of exam.questions) {
            const question = questionEntry.question; 
            const selectedAnswer = questionEntry.answer;  
            const correctAnswer = question.answer;  

            questionDetails.push({
                questionId: question.questionId,
                description: question.desc,
                options: question.options,
                selectedAnswer,
                correctAnswer,
            });
        }

        return res.status(200).json({
            examId: exam.exam.examId,
            title: exam.exam.title,
            questions: questionDetails
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error fetching exam details' });
    }
};