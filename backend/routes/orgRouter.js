const express = require("express");
const dotenv = require("dotenv");
const authMiddleware = require("../middlewares/authMiddleware");
const questionModel = require("../models/questionModel");
const quizModel = require("../models/quizModel");
const quizAttemptModel = require("../models/quizAttemptModel");

//fixx
dotenv.config();

const orgRouter = express.Router();


orgRouter.get("/quizzes", authMiddleware(["organization"]), async (req, res) => {
  try {
    const organizationId = req.user.id;
    const quizzes = await quizModel
      .find({ organizationId });
    res.status(200).json(quizzes);
  }
  catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});


orgRouter.get("/orgquiz-attempts/:quizId", authMiddleware(["organization"]), async (req, res) => {
  try {
    const { quizId } = req.params;
    console.log(quizId);
    const organizationId = req.user.id;
    const attempts = await quizAttemptModel
      .find({ quizId })
      .populate({ path: 'userId', select: 'name email' })
      .populate({ path: 'quizId', select: 'title' });
      console.log(attempts);
    res.status(200).json(attempts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

/* ===============================
   📦 Bulk Add Questions
================================= */
orgRouter.post(
  "/add-questions",
  authMiddleware(["organization"]),
  async (req, res) => {
    try {
      const { questions } = req.body;
      const organizationId = req.user.id;

      if (!questions || !Array.isArray(questions) || questions.length === 0) {
        return res.status(400).json({ msg: "Questions must be an array" });
      }

      const formattedQuestions = questions.map((q) => ({
        text: q.text,
        subject: q.subject,
        options: q.options,
        correctAnswer: q.correctAnswer,
        organizationId,
      }));

      const savedQuestions = await questionModel.insertMany(formattedQuestions);

      res.status(201).json({
        msg: `${savedQuestions.length} questions uploaded successfully`,
        data: savedQuestions,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "Server error", error: err.message });
    }
  }
);
orgRouter.get("/questions", authMiddleware(["organization"]), async (req, res) => {
  try {
    const organizationId = req.user.id;
    const questions = await questionModel.find({ organizationId });
    res.status(200).json(questions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});


/* ===============================
   🧠 Create Quiz
================================= */
orgRouter.post(
  "/create-quiz",
  authMiddleware(["organization"]),
  async (req, res) => {
    try {
      const {
        title,
        description,
        questions,
        duration,
        deadline,
        allowedUsers,
      } = req.body;
      const organizationId = req.user.id;

      if (
        !title ||
        !questions ||
        !Array.isArray(questions) ||
        questions.length === 0
      ) {
        return res
          .status(400)
          .json({ msg: "Title and questions are required" });
      }

      if (!duration || !deadline) {
        return res
          .status(400)
          .json({ msg: "Duration and deadline are required" });
      }

      // ✅ FIXED: Use `_id` not `id`
      //const validQuestions = await questionModel.find({
      //_id: { $in: questions },
      //organizationId
      //});

      //if (validQuestions.length !== questions.length) {
      //return res.status(400).json({ msg: "Some questions not found or do not belong to your organization" });
      // }

      const quiz = new quizModel({
        title,
        description,
        duration,
        deadline,
        allowedUsers,
        questions,
        organizationId,
      });

      await quiz.save();

      res.status(201).json({ msg: "Quiz created successfully", data: quiz });
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "Server error", error: err.message });
    }
  }
);

/* ===============================
   📋 Get All Quizzes by Organization
================================= */

module.exports = orgRouter;
