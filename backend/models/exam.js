import mongoose from "mongoose";
import Counter from "./counter";

const examSchema = new mongoose.Schema({
    examId: {
        type : Number,
    },

    questions: [{
        type: Schema.Types.ObjectId,
        ref : 'Question'
    }],

    startTime: {
        type: Date,
        required: true
    },

    duration: {
        type: Number, // in minutes
        required: true
    },

    title: {
        type: String,
        required: true
    },

    instructions: {
        type: String,
        required: true
    }
},{
    timestamps: true
});

// Pre-save hook to increment and assign the ID
examSchema.pre('save', async function (next) {
    const exam = this;
    
    if (exam.isNew) { // Only for new documents
      try {
        // Find the counter and increment it
        const counter = await Counter.findByIdAndUpdate(
          { _id: 'examId' },      // The name of the counter document
          { $inc: { seq: 1 } },        // Increment the sequence by 1
          { new: true, upsert: true }  // Create the counter if it doesn't exist
        );
        
        exam.examId = counter.seq;    // Assign the incremented sequence as the _id
        next();
      } catch (error) {
        next(error); // Pass any errors to the next middleware
      }
    } else {
      next();
    }
  });

const Exam = mongoose.model('Exam',examSchema);

export default Exam;