const mongoose = require("mongoose");

const quizAttemptSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required: true },
  startTime: { type: Date, default: Date.now },
  endTime: { type: Date },

  answers: [
    { 
      questionId: { type: mongoose.Schema.Types.ObjectId, ref: "Question" },
      selectedOption: { type: String },
      isCorrect: { type: Boolean }
    }
  ],
  score: { type: Number, default: 0 },
  status: { type: String, enum: ["in-progress", "completed", "blocked"], default: "in-progress" }
});

const quizAttemptModel = mongoose.model("QuizAttempt", quizAttemptSchema);

module.exports = quizAttemptModel;
