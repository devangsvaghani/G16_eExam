import Exam from "../models/exam.js";
import Student from "../models/student.js";
import Examiner from "../models/examiner.js";


export const get_past_exams = async (req, res) => {
    try {
        const currentTime = new Date();

        // Fetch exams that have ended (startTime + duration < currentTime)
        const pastExams = await Exam.find({
            $expr: {
                $lt: [
                    {
                        $add: [
                            "$startTime",
                            { $multiply: ["$duration", 60000] },
                        ],
                    },
                    currentTime,
                ],
            },
            status: "Published",
        });

        return res
            .status(200)
            .json({ message: "Past exams retrieved successfully.", pastExams });
    } catch (error) {
        console.error("Error fetching past exams:", error);
        return res
            .status(500)
            .json({ message: "Failed to retrieve past exams." });
    }
};


export const get_upcoming_exams = async (req, res) => {
    try {
        const currentTime = new Date();

        // Fetch exams with a startTime in the future  (startTime > currentTime)
        const upcomingExams = await Exam.find({
            $expr: {
                $gt: [
                    {
                        $add: [
                            "$startTime",
                            { $multiply: ["$duration", 60000] },
                        ],
                    },
                    currentTime,
                ],
            },
            status: "Published",
        }).select("-questions");

        // if (upcomingExams.length === 0) {
        //     return res.status(404).json({ message: "No upcoming exams found." });
        // }

        return res
            .status(200)
            .json({
                message: "Upcoming exams retrieved successfully.",
                upcomingExams,
            });
    } catch (error) {
        console.error("Error fetching upcoming exams:", error);
        return res
            .status(500)
            .json({ message: "Failed to retrieve upcoming exams." });
    }
};


export const get_upcoming_exams_5_student = async (req, res) => {
    try {
        const username = req?.user?.username;

        if (!username) {
            return res.status(404).json({ message: "No Username Found" });
        }

        const student = await Student.findOne({ username });

        if (!student) {
            return res.status(404).json({ message: "No Student Found" });
        }

        const currentTime = new Date();

        // Fetch only 5 exams with a startTime in the future (startTime > currentTime)
        const upcomingExams = await Exam.find({
            $expr: {
                $gt: [
                    {
                        $add: [
                            "$startTime",
                            { $multiply: ["$duration", 60000] },
                        ],
                    },
                    currentTime,
                ],
            },
            status: "Published",
            batch: student.batch,
            branch: student.branch,
        })
            .sort({ startTime: 1 }) // Sort by startTime in ascending order
            .limit(5)
            .select("-questions"); // Limit to 5 results

        // if (upcomingExams.length === 0) {
        //     return res.status(404).json({ message: "No upcoming exams found." });
        // }

        return res
            .status(200)
            .json({
                message: "Upcoming exams retrieved successfully.",
                upcomingExams,
            });
    } catch (error) {
        console.error("Error fetching upcoming exams:", error);
        return res
            .status(500)
            .json({ message: "Failed to retrieve upcoming exams." });
    }
};

export const get_past_exams_5_student = async (req, res) => {
    try {
        const username = req?.user?.username;

        if (!username) {
            return res.status(404).json({ message: "No Username Found" });
        }

        const student = await Student.findOne({ username });

        if (!student) {
            return res.status(404).json({ message: "No Student Found" });
        }

        const currentTime = new Date();
        const currentYear = currentTime.getFullYear();

        // Fetch exams that have ended and are within the current year
        const pastExams = await Exam.find({
            $expr: {
                $lt: [
                    {
                        $add: [
                            "$startTime",
                            { $multiply: ["$duration", 60000] },
                        ],
                    },
                    currentTime,
                ],
            },
            status: "Published",
            batch: student.batch,
            branch: student.branch,
        })
            .sort({ startTime: -1 })
            .limit(5); // Sort by startTime in descending order

        return res
            .status(200)
            .json({ message: "Past exams retrieved successfully.", pastExams });
    } catch (error) {
        console.error("Error fetching past exams:", error);
        return res
            .status(500)
            .json({ message: "Failed to retrieve past exams." });
    }
};


export const get_upcoming_exams_student = async (req, res) => {
    try {
        const username = req?.user?.username;

        if (!username) {
            return res.status(404).json({ message: "No Username Found" });
        }

        const student = await Student.findOne({ username });

        if (!student) {
            return res.status(404).json({ message: "No Student Found" });
        }

        const currentTime = new Date();

        // Fetch exams with a startTime in the future  (startTime > currentTime)
        const upcomingExams = await Exam.find({
            $expr: {
                $gt: [
                    {
                        $add: [
                            "$startTime",
                            { $multiply: ["$duration", 60000] },
                        ],
                    },
                    currentTime,
                ],
            },
            status: "Published",
            batch: student.batch,
            branch: student.branch,
        }).select("-questions");

        upcomingExams.sort((a, b) => {
            const dateA = new Date(a.startTime);
            const dateB = new Date(b.startTime);
            return dateA - dateB; // Ascending order
        });

        // if (upcomingExams.length === 0) {
        //     return res.status(404).json({ message: "No upcoming exams found." });
        // }

        return res
            .status(200)
            .json({
                message: "Upcoming exams retrieved successfully.",
                upcomingExams,
            });
    } catch (error) {
        console.error("Error fetching upcoming exams:", error);
        return res
            .status(500)
            .json({ message: "Failed to retrieve upcoming exams." });
    }
};

export const get_upcoming_exams_5_examiner = async (req, res) => {
    try {
        const username = req?.user?.username;

        if (!username) {
            return res.status(404).json({ message: "No Username Found" });
        }

        const examiner = await Examiner.findOne({ username });

        if (!examiner) {
            return res.status(404).json({ message: "No examiner Found" });
        }

        const currentTime = new Date();

        // Fetch only 5 exams with a startTime in the future (startTime > currentTime)
        const upcomingExams = await Exam.find({
            $expr: {
                $gt: [
                    {
                        $add: [
                            "$startTime",
                            { $multiply: ["$duration", 60000] },
                        ],
                    },
                    currentTime,
                ],
            },
            status: "Published",
        })
            .sort({ startTime: 1 }) // Sort by startTime in ascending order
            .limit(5)
            .select("-questions"); // Limit to 5 results

        // if (upcomingExams.length === 0) {
        //     return res.status(404).json({ message: "No upcoming exams found." });
        // }

        return res
            .status(200)
            .json({
                message: "Upcoming exams retrieved successfully.",
                upcomingExams,
            });
    } catch (error) {
        console.error("Error fetching upcoming exams:", error);
        return res
            .status(500)
            .json({ message: "Failed to retrieve upcoming exams." });
    }
};

export const get_past_exams_5_examiner = async (req, res) => {
    try {
        const username = req?.user?.username;

        if (!username) {
            return res.status(404).json({ message: "No Username Found" });
        }

        const examiner = await Examiner.findOne({ username });

        if (!examiner) {
            return res.status(404).json({ message: "No examiner Found" });
        }

        const currentTime = new Date();

        // Fetch exams that have ended and are within the current year
        const pastExams = await Exam.find({
            $expr: {
                $lt: [
                    {
                        $add: [
                            "$startTime",
                            { $multiply: ["$duration", 60000] },
                        ],
                    },
                    currentTime,
                ],
            },
            status: "Published",
        })
            .sort({ startTime: -1 })
            .limit(5); // Sort by startTime in descending order

        return res
            .status(200)
            .json({ message: "Past exams retrieved successfully.", pastExams });
    } catch (error) {
        console.error("Error fetching past exams:", error);
        return res
            .status(500)
            .json({ message: "Failed to retrieve past exams." });
    }
};