import Exam from '../models/exam.js';

// Get all past exams
export const get_past_exams = async (req, res) => {
    try {
        const currentTime = new Date();

        // Fetch exams that have ended (startTime + duration < currentTime)
        const pastExams = await Exam.find({
            $expr: { 
                $lt: [
                    { $add: ["$startTime", { $multiply: ["$duration", 60000] }] }, 
                    currentTime 
                ]
            },
            status: 'Published' // Optional filter to only show published exams
        });

        return res.status(200).json({ message: "Past exams retrieved successfully.", pastExams });
    } catch (error) {
        console.error("Error fetching past exams:", error);
        return res.status(500).json({ message: "Failed to retrieve past exams." });
    }
};


// Get all upcoming exams
export const get_upcoming_exams = async (req, res) => {
    try {
        const currentTime = new Date();

        // Fetch exams with a startTime in the future  (startTime > currentTime)
        const upcomingExams = await Exam.find({
            startTime: { $gt: currentTime },
            status: 'Published' // Optional filter to only show published exams
        });

        if (upcomingExams.length === 0) {
            return res.status(404).json({ message: "No upcoming exams found." });
        }

        return res.status(200).json({ message: "Upcoming exams retrieved successfully.", upcomingExams });
    } catch (error) {
        console.error("Error fetching upcoming exams:", error);
        return res.status(500).json({ message: "Failed to retrieve upcoming exams." });
    }
};

