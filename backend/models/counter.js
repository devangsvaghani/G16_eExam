import mongoose from "mongoose";
const { Schema } = mongoose;

const counterSchema = new  mongoose.Schema({
  _id: {
    type: String,
    required: true
  },
  seq: {
    type: Number,
    default: 0
  }
});

const Counter = mongoose.model('Counter', counterSchema);
