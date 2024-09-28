import mongoose from "mongoose";

const examinerSchema = new mongoose.Schema({
    username: {
        type : String,
        required : true
    },

    preparedExams: [{
        type: Schema.Types.ObjectId,
        ref : 'Exam'
    }]

});

const Examiner = mongoose.model('Examiner',examinerSchema);

export default Examiner;