const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const userRouter = require("./routes/userRouter");
const orgRouter = require("./routes/orgRouter");
const cookieParser = require("cookie-parser");
const appRouter = require("./routes/appRouter");

dotenv.config();
connectDB();

const app = express();
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
