import mongoose from "mongoose";

const examSchema = new mongoose.Schema({
    exam: {
        type: mongoose.Schema.Types.ObjectId,
        ref : 'Exam'
    },

    question: {
        type: mongoose.Schema.Types.ObjectId,
        ref : 'Question'
    },

    answer: {
        type : String,
        required : true
    }
});

const studentSchema = new mongoose.Schema({
    username: {
        type : String,
        required : true
    },

    givenExams: [examSchema]

});

const Student = mongoose.model('Student',studentSchema);

export default Student;