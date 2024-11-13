import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },

    batch: {
        type: Number,
        required: true
    },

    branch: {
        type: String,
        enum : ['ICT', 'CS', 'MnC', 'EVD'],
        required: true
    },

    graduation: {
        type: String,
        enum : ['UG' , 'PG'],
        required: true
    },

    givenExams: [
        {
            exam: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Exam",
                required: true,
            },
            questions: [
                {
                    question: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "Question",
                        required: true,
                    },

                    answer: { // 0 for first option and so on..
                        type: Number,
                        required: true,
                    },
                },
            ],
        },
    ],
});

const Student = mongoose.model("Student", studentSchema);

export default Student;
