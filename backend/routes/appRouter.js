const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const quizModel = require("../models/quizModel");
const userModel = require("../models/userModel");
const quizAttemptModel = require("../models/QuizAttemptModel");
const appRouter = express.Router();



appRouter.get("/all-quiz", authMiddleware(["student"]) ,async (req, res) => {
  try {
    const { email } = req.user;
    console.log(email);
    const quizzes = await quizModel.find({
   allowedUsers: { $in: [email] }}).populate('questions');
   
   
    if (!quizzes) {
      return res.status(404).json({ error: "No quizzes found" });
    }
  
   
  const response = await Promise.all(quizzes.map(async q => {

  const org = await userModel.findById(q.organizationId);
  console.log(org.name); 
  
  return {
    id: q._id,
    title: q.title,
    description: q.description,
    duration: q.duration,
    deadline: q.deadline,
    organization: org.name 
  };
}));
res.json(response);
    
    }catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

appRouter.get("/quiz/:id/start", authMiddleware(["student"]), async (req, res) => {
  try {
    const { id: quizId } = req.params;
    const { id: userId, email } = req.user;

    const quiz = await quizModel.findById(quizId).populate("questions");
    if (!quiz) return res.status(404).json({ error: "Quiz not found" });

    if (!quiz.allowedUsers.includes(email)) {
      return res.status(403).json({ error: "You are not allowed for this quiz" });
    }

    let attempt = await quizAttemptModel.findOne({ userId, quizId });

    if (!attempt) {
      attempt = new quizAttemptModel({
        userId,
        quizId,
        startTime: new Date(),
        endTime: new Date(Date.now() + quiz.duration * 60 * 1000)
      });
      await attempt.save();
    }
    if(attempt.status === "completed"){
      return res.status(400).json({ error: "Quiz already attempted" });
    } 

    if (Date.now() > attempt.endTime) {
      attempt.status = "blocked";
      await attempt.save();
      return res.status(403).json({ error: "Time expired. Quiz blocked." });
    }

    res.json({
      title: quiz.title,
      description: quiz.description,
      duration: quiz.duration,
      deadline: quiz.deadline,
      questions: quiz.questions.map(q => ({
        _id: q._id,
        text: q.text,
        options: q.options
        // ❌ don’t send correctAnswer
      })),
      attemptId: attempt._id,
       startTime: attempt.startTime,
        endTime: attempt.endTime
    });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
});
appRouter.post("/quiz/:id/submit", authMiddleware(["student"]), async (req, res) => {
  try {
    const { id: quizId } = req.params;
    const { id: userId } = req.user;
    const { answers } = req.body; 
    // answers = [{ questionId, selectedOption }]

    const attempt = await quizAttemptModel.findOne({ userId, quizId });
    if (!attempt) return res.status(400).json({ error: "Quiz not started" });

    if (Date.now() > attempt.endTime) {
      attempt.status = "completed";
      await attempt.save();
      return res.status(403).json({ error: "Time expired. Quiz blocked" });
    }
   if(attempt.status === "completed"){
      return res.status(400).json({ error: "Quiz already submitted" });
    }
    const quiz = await quizModel.findById(quizId).populate("questions");
    let score = 0;
    const storedAnswers = [];

    quiz.questions.forEach(q => {
      const userAns = answers.find(a => String(a.questionId) === String(q._id));
      if (userAns) {
        const isCorrect = userAns.selectedOption === q.correctAnswer;
        if (isCorrect) score++;
        storedAnswers.push({
          questionId: q._id,
          selectedOption: userAns.selectedOption,
          isCorrect
        });
      }
    });

    attempt.answers = storedAnswers;
    attempt.score = score;
    attempt.status = "completed";
    await attempt.save();

    res.json({ message: "Quiz submitted successfully", score });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

appRouter.get("/quiz-attempts", authMiddleware(["student"]), async (req, res) => {
  try {
    const { id: userId } = req.user;
    const attempts = await quizAttemptModel.find({ userId });
    
    res.json(attempts);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
})
appRouter.get("/:id/quiz-attempt-detailed", authMiddleware(["student"]), async (req, res) => {
  try {
    const { id: attemptId } = req.params;
    // Find by _id, not attemptId
    const attempt = await quizAttemptModel
      .findOne({ _id: attemptId })
      .populate('quizId')
      .populate('answers.questionId');
    if (!attempt) return res.status(404).json({ error: "Attempt not found" });
    res.json(attempt);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});


module.exports = appRouter;