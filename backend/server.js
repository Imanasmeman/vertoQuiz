const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const userRouter = require("./routes/userRouter");
const orgRouter = require("./routes/orgRouter");
const cookieParser = require("cookie-parser");
const appRouter = require("./routes/appRouter");
const path = require("path");



dotenv.config();
connectDB();

const app = express();
const __dirname = path.resolve();

// serve the frontend build
app.use(express.static(path.join(__dirname, "client", "build")));

// all unknown routes -> send index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});
app.use(cors({
  origin: [
  'http://localhost:5173',
  'https://vertoquiz-1.onrender.com',
  // Add other allowed origins
],
 // your frontend URL
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.get("/test" , (req,res)=>{
    res.status(200).json({message: "Server is running"})
})
app.use("/auth" , userRouter )

app.use("/org" , orgRouter)

app.use("/app" , appRouter)


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
