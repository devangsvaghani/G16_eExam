import Exam from '../models/exam.js';
import Student from '../models/student.js';

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
            status: 'Published' 
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
            status: 'Published' 
        }).select('-questions');

        // if (upcomingExams.length === 0) {
        //     return res.status(404).json({ message: "No upcoming exams found." });
        // }

        return res.status(200).json({ message: "Upcoming exams retrieved successfully.", upcomingExams });
    } catch (error) {
        console.error("Error fetching upcoming exams:", error);
        return res.status(500).json({ message: "Failed to retrieve upcoming exams." });
    }
};

export const get_upcoming_exams_year = async (req, res) => {
    try {
        const { year } = req.params;

        // Validate that the year is provided
        if (!year) {
            return res.status(400).json({ message: "Year is missing" });
        }

        // Define the start and end dates for the specified year
        const startDate = new Date(year, 0, 1); // January 1st of the specified year
        const endDate = new Date(year, 11, 31, 23, 59, 59, 999); // December 31st of the specified year
        const currentTime = new Date(); // Current time to filter upcoming exams

        // Fetch exams that are both upcoming and within the specified year
        const upcomingExams = await Exam.find({
            startTime: { $gte: currentTime, $gte: startDate, $lte: endDate },
            status: 'Published'
        }).select('-questions');

        // if (upcomingExams.length === 0) {
        //     return res.status(404).json({ message: "No upcoming exams found for the specified year." });
        // }

        return res.status(200).json({ message: "Upcoming exams retrieved successfully.", upcomingExams });
    } catch (error) {
        console.error("Error fetching upcoming exams:", error);
        return res.status(500).json({ message: "Failed to retrieve upcoming exams." });
    }
};

// Get the next 5 upcoming exams from the current date
export const get_upcoming_exams_5_student = async (req, res) => {
    try {
        const username = req?.user?.username; 

        if(!username){
            return res.status(404).json({ message: "No Username Found" });
        }

        const student = await Student.findOne({username});

        if(!student){
            return res.status(404).json({ message: "No Student Found" });
        }
        
        const currentTime = new Date();

        // Fetch only 5 exams with a startTime in the future (startTime > currentTime)
        const upcomingExams = await Exam.find({
            startTime: { $gt: currentTime },
            status: 'Published',
            batch: student.batch,
            branch: student.branch
        }).sort({ startTime: 1 }) // Sort by startTime in ascending order
          .limit(5).select('-questions'); // Limit to 5 results

        // if (upcomingExams.length === 0) {
        //     return res.status(404).json({ message: "No upcoming exams found." });
        // }

        return res.status(200).json({ message: "Upcoming exams retrieved successfully.", upcomingExams });
    } catch (error) {
        console.error("Error fetching upcoming exams:", error);
        return res.status(500).json({ message: "Failed to retrieve upcoming exams." });
    }
};

// Get past exams only from the current year
export const get_past_exams_5_student = async (req, res) => {
    try {

        const username = req?.user?.username;

        if(!username){
            return res.status(404).json({ message: "No Username Found" });
        }

        const student = await Student.findOne({username});

        if(!student){
            return res.status(404).json({ message: "No Student Found" });
        }

        const currentTime = new Date();
        const currentYear = currentTime.getFullYear();

        // Define the start and end dates for the current year
        const startOfYear = new Date(currentYear, 0, 1); // January 1st of the current year
        const endOfYear = new Date(currentYear, 11, 31, 23, 59, 59, 999); // December 31st of the current year

        // Fetch exams that have ended and are within the current year
        const pastExams = await Exam.find({
            $expr: { 
                $lt: [
                    { $add: ["$startTime", { $multiply: ["$duration", 60000] }] }, 
                    currentTime 
                ]
            },
            startTime: { $gte: startOfYear, $lte: endOfYear },
            status: 'Published',
            batch: student.batch,
            branch: student.branch
        }).sort({ startTime: -1 }).limit(5); // Sort by startTime in descending order

        return res.status(200).json({ message: "Past exams retrieved successfully.", pastExams });
    } catch (error) {
        console.error("Error fetching past exams:", error);
        return res.status(500).json({ message: "Failed to retrieve past exams." });
    }
};

// Get all upcoming exams
export const get_upcoming_exams_student = async (req, res) => {
    try {

        const username = req?.user?.username;

        if(!username){
            return res.status(404).json({ message: "No Username Found" });
        }

        const student = await Student.findOne({username});

        if(!student){
            return res.status(404).json({ message: "No Student Found" });
        }

        const currentTime = new Date();

        // Fetch exams with a startTime in the future  (startTime > currentTime)
        const upcomingExams = await Exam.find({
            startTime: { $gt: currentTime },
            status: 'Published',
            batch: student.batch,
            branch: student.branch
        }).select('-questions');

        upcomingExams.sort((a, b) => {
            const dateA = new Date(a.startTime);
            const dateB = new Date(b.startTime);
            return dateA - dateB; // Ascending order
          });

        // if (upcomingExams.length === 0) {
        //     return res.status(404).json({ message: "No upcoming exams found." });
        // }

        return res.status(200).json({ message: "Upcoming exams retrieved successfully.", upcomingExams });
    } catch (error) {
        console.error("Error fetching upcoming exams:", error);
        return res.status(500).json({ message: "Failed to retrieve upcoming exams." });
    }
};