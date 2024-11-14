import Student from '../models/student.js';

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

