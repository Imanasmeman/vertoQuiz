const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const userRouter = require("./routes/userRouter");
const orgRouter = require("./routes/orgRouter");
const appRouter = require("./routes/appRouter");
const cookieParser = require("cookie-parser");

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://vertoquiz-1.onrender.com", // your frontend URL
    ],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Test route
app.get("/test", (req, res) => {
  res.status(200).json({ message: "✅ Server is running fine" });
});

// API routes
app.use("/auth", userRouter);
app.use("/org", orgRouter);
app.use("/app", appRouter);

// ✅ Serve frontend (important for Render refresh issue)
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "frontend/dist"))); // adjust if your build folder is different

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend/dist", "index.html"));
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
