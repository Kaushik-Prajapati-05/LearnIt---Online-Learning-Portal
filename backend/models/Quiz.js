const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  quizTitle: {
    type: String,
    required: true,
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course', 
    required: true, 
  },
  passingScore: {
    type: Number,
    required: true,
  },
  questions: [
    {
      questionText: { type: String, required: true },
      options: [
        {
          type: String, 
          required: true
        }
      ],
      correctAnswer: { type: Number, required: true }, // Index of correct answer
    },
  ],
});

const Quiz = mongoose.model('Quiz', quizSchema);
module.exports = Quiz;
