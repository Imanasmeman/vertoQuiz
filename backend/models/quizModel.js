const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema({
  title: { type: String, required: true },   // quiz title
  description: { type: String },             // optional
  duration: { type: Number, required: true }, // in minutes
  deadline: { type: Date, required: true },   // submission deadline
  allowedUsers: [{ type: String }],           // emails of participants

  // Selected questions from Question Bank
  questions: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Question" }
  ],

  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization",
    required: true
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now }
});

const quizModel = mongoose.model("Quiz", quizSchema);
module.exports = quizModel;
