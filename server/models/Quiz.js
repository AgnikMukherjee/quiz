import mongoose from 'mongoose';

const optionSchema = new mongoose.Schema({
  text: String,
  isCorrect: Boolean,
});

const questionSchema = new mongoose.Schema({
  questionText: String,
  options: [optionSchema],
});

const quizSchema = new mongoose.Schema({
  title: String,
  tags: [String],
  questions: [questionSchema],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
   duration: { type: Number, default: 0 } //
});

export default mongoose.model('Quiz', quizSchema);