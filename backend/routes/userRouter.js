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
    const { name, email, password, role } = req.body;
    if (role === "admin") {
  return res.status(403).json({ error: "Cannot register as admin" });
}
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new userModel({ name, email, password: hashedPassword, role });
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
    { expiresIn: "1m" } // short-lived
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
    console.log(req.cookies.refreshToken);
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
  secure:false   ,  //process.env.NODE_ENV === "production", // false for localhost
  sameSite: "strict",
  //path: "/",   // 👈 MUST also add this
  maxAge: 7 * 24 * 60 * 60 * 1000
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

    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, async (err, decoded) => {
  if (err) return res.status(403).json({ error: "Invalid refresh token" });

  const accessToken = jwt.sign(
    { id: decoded.id, email: decoded.email, role: decoded.role },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );

  const user = await userModel.findById(decoded.id).select("name email role");
  console.log("refreshed",user ,accessToken)
  res.json({ accessToken, user });

});

  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

userRouter.post("/logout", async(req, res) => {
 res.clearCookie("refreshToken", { httpOnly: true, secure: false, sameSite: "strict" });
  console.log("User logged out, refresh token cookie cleared");
 // Should be undefined
  res.json({ message: "Logged out successfully" });
});


// Get user profile
userRouter.get("/profile", authMiddleware(["student"]), async (req, res) => {
  try {
    const userId = req.user.id; // set by middleware
    const user = await userModel.findById(userId).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch(err) {
    res.status(500).json({ error: "Server error" });
  }
});



module.exports = userRouter;