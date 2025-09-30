const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  text: { type: String, required: true },  // question text
  subject: { type: String, required: true }, // e.g., "Math", "Science"
  options: [{ type: String, required: true }], // ["A", "B", "C", "D"]
  correctAnswer: { type: String, required: true }, // "A"
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization",
    required: true
  },
  createdAt: { type: Date, default: Date.now }
});

const questionModel = mongoose.model("Question", questionSchema);

module.exports = questionModel;
