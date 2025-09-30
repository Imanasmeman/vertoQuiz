const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
const dotenv = require("dotenv");
const authMiddleware = require("../middlewares/authMiddleware");
const quizModel = require("../models/quizModel");
const quizAttemptModel = require("../models/QuizAttemptModel");
dotenv.config();



const userRouter = express.Router();

// Register
userRouter.post("/register", async (req, res) => {
  try {
    const { name, email, password, role, organizationId } = req.body;
    if (role === "admin") {
  return res.status(403).json({ error: "Cannot register as admin" });
}
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new userModel({ name, email, password: hashedPassword, role, organizationId });
    await user.save();
    res.json({ message: "User registered successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "15m" } // short-lived
  );

  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" } // long-lived
  );

  return { accessToken, refreshToken };
};

userRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // find user
    const user = await userModel.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    // check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    // generate tokens
    const { accessToken, refreshToken } = generateTokens(user);

    // send refresh token in HttpOnly cookie (safer than localStorage)
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false, // set true if using HTTPS
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.json({
      message: "Login successful",
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// REFRESH TOKEN
userRouter.post("/refresh", (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(401).json({ error: "No refresh token" });

    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
      if (err) return res.status(403).json({ error: "Invalid refresh token" });

      const accessToken = jwt.sign(
        { id: decoded.id },
        process.env.JWT_SECRET,
        { expiresIn: "15m" }
      );

      res.json({ accessToken });
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

userRouter.post("/logout", (req, res) => {
  res.clearCookie("refreshToken", { httpOnly: true, secure: false, sameSite: "strict" });
  res.json({ message: "Logged out successfully" });
});


userRouter.get("/quiz", authMiddleware(["student"]) ,async (req, res) => {
  try {
    const { email } = req.user;
    console.log(email);
    const quizzes = await quizModel.find({
   allowedUsers: { $in: [email] }}).populate('questions');
   const organizationname = await userModel.find({id:quizzes.organizationId});
    if (!quizzes) {
      return res.status(404).json({ error: "No quizzes found" });
    }
   const isquizeAttempted =  quizAttemptModel.findOne({userId:req.user.id, quizId:quizzes._id});
   if(isquizeAttempted){
    return res.status(400).json({ error: "Quiz already attempted" });
   }
  
    const response = quizzes.map(q => ({
  title: q.title,
  description: q.description,
  duration: q.duration,
  deadline: q.deadline,
  questions: q.questions,
  organization: organizationname.name
}));


res.json(response);
    
    }catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});



module.exports = userRouter;