const express = require("express");


const quizModel = require("../models/quizModel");

const orgRouter = express.Router();
const dotenv = require("dotenv");
const authMiddleware = require("../middlewares/authMiddleware");
const questionModel = require("../models/questionModel");
dotenv.config();

// CREATE QUIZ - only organization users

orgRouter.post("/bulk-add-que", authMiddleware(["organization"]), async (req, res) => {
  try {
    const { questions } = req.body;
    const organizationId = req.user.id;

    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ msg: "Questions must be an array" });
    }

    // Attach orgId & createdBy to each question
    const formattedQuestions = questions.map((q) => ({
      text: q.text,
      subject: q.subject,
      options: q.options,
      correctAnswer: q.correctAnswer,
      organizationId
      
    }));

    // Insert many in one go
    const savedQuestions = await questionModel.insertMany(formattedQuestions);

    return res.status(201).json({
      msg: `${savedQuestions.length} questions uploaded successfully`,
      data: savedQuestions
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Server error", error: err.message })
  

}})

// CREATE QUIZ - only organization users
orgRouter.post("/create-quiz", authMiddleware(["organization"]), async (req, res) => {
  try {
    const { title, description, questions, duration, deadline, allowedUsers } = req.body;
    const organizationId = req.user.id; // from JWT payload

    if (!title || !questions || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ msg: "Title and questions are required" });
    }

    if (!duration || !deadline) {
      return res.status(400).json({ msg: "Duration and deadline are required" });
    }

    // Verify all questionIds belong to this organization
    const validQuestions = await questionModel.find({
      id: 
      organizationId
    });

  // if (validQuestions.length !== questions.length) {
      //console.log(validQuestions.length, questions.length);
    //  return res.status(400).json({ msg: "Some questions not found or do not belong to your organization" });
   // }

    // Create quiz
    const quiz = new quizModel({
      title,
      description,
      duration,
      deadline,
      allowedUsers,
      questions,
      organizationId
    });

    await quiz.save();

    res.status(201).json({ msg: "Quiz created successfully", data: quiz });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});


module.exports = orgRouter;
