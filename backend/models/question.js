import mongoose from "mongoose";
import Counter from "./counter";

const questionSchema = new mongoose.Schema({
    questionId: {
        type : Number,
    },

    desc: {
        type: String,
    },

    images: [{
        type: String
    }],

    type: {
        type: String,
        enum: ['mcq', 'descriptive']
    },

    correctAns: {
        type: String,
    },

    tag: [{
        type: String
    }]
},{
    timestamps: true
});

// Pre-save hook to increment and assign the ID
questionSchema.pre('save', async function (next) {
    const question = this;
    
    if (question.isNew) { // Only for new documents
      try {
        // Find the counter and increment it
        const counter = await Counter.findByIdAndUpdate(
          { _id: 'questionId' },      // The name of the counter document
          { $inc: { seq: 1 } },        // Increment the sequence by 1
          { new: true, upsert: true }  // Create the counter if it doesn't exist
        );
        
        question.questionId = counter.seq;    // Assign the incremented sequence as the _id
        next();
      } catch (error) {
        next(error); // Pass any errors to the next middleware
      }
    } else {
      next();
    }
  });

const Question = mongoose.model('Question',questionSchema);

export default Question;