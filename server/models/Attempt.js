import mongoose from 'mongoose';

const attemptSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true,
  },
  responses: [
    {
      questionId: String,
      selectedOption: String,
      isCorrect: Boolean,
    },
  ],
  score: {
    type: Number,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
  attemptedAt: {
    type: Date,
    default: Date.now,
  },
});

//one attempt per user per quiz
attemptSchema.index({ user: 1, quiz: 1 }, { unique: true });

const Attempt = mongoose.model('Attempt', attemptSchema);

export default Attempt;
