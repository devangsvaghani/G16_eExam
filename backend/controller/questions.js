 import Question from "../models/question.js";

// Create a new question
export const create_question = async (req, res) => {
    try {
        const { desc, options, points, creator, difficulty, answer, subject } = req.body;

        if (!options || options.length < 2) {
            return res.status(400).json({ message: "At least two options are required." });
        }
        
        // Create a new question
        const question = new Question({
            desc,
            options,
            points,
            creator,
            difficulty,
            answer,
            subject
        });

        // Save the question to the database
        await question.save();

        return res.status(201).json({ message: "Question created successfully.", question });
    } catch (error) {
        console.error("Error creating question:", error);
        return res.status(500).json({ message: "Failed to create question." });
    }
};


// Update a question by its ID
export const update_question = async (req, res) => {
    try {
        const { id } = req.params; // ID of the question to update
        const { desc, options, points, creator, difficulty, answer, subject } = req.body;

        if (options && options.length < 2) {
            return res.status(400).json({ message: "At least two options are required." });
        }

        // Find the question by ID
        const question = await Question.findOne({ questionId: id });

        // If the question is not found, return a 404 error
        if (!question) {
            return res.status(404).json({ message: "Question not found." });
        }

        // Update the fields of the question
        question.desc = desc || question.desc;
        question.options = options || question.options;
        question.points = points || question.points;
        question.creator = creator || question.creator;
        question.difficulty = difficulty || question.difficulty;
        question.answer = answer || question.answer;
        question.subject = subject || question.subject;

        // Save the updated question
        await question.save();

        return res.status(200).json({ message: "Question updated successfully.", question });
    } catch (error) {
        console.error("Error updating question:", error);
        return res.status(500).json({ message: "Failed to update question." });
    }
};



// Delete a question by its ID
export const delete_question = async (req, res) => {
    try {
        const { id } = req.params; // ID of the question to delete

        // Find the question by ID and delete it
        const question = await Question.findOne({ questionId: id }); // Use findOne with _id filter

        if (!question) {
            return res.status(404).json({ message: "Question not found." });
        }

        // Delete the question
        await question.deleteOne(); // deleteOne() removes the document

        return res.status(200).json({ message: "Question deleted successfully." });
    } catch (error) {
        console.error("Error deleting question:", error);
        return res.status(500).json({ message: "Failed to delete question." });
    }
};

