import mongoose from "mongoose";

const examinerSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },

    prepared_exams: [{
        type: mongoose.Schema.Types.ObjectId,
        ref : 'Exam'
    }],

    prepared_questions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref : 'Question'
    }],
});

const Examiner = mongoose.model('Examiner', examinerSchema);

export default Examiner;