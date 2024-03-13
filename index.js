import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRouter from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.route.js";
import profileRouter from "./routes/profile.routes.js";
import cors from "cors";

dotenv.config();

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("DB connected");
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();
app.use(
  cors({
    credentials: true,
    origin: [
      "http://localhost:3000",
      "https://parinaye-frontend.vercel.app",
      "https://parinaye.com",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "credentials"],
  })
);

app.use(express.json()); // by default json is not allowed to be send in request unless specified here
app.use(cookieParser());

app.listen(3000, () => {
  console.log("Api running on 3000 ! ");
});

// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', '*'); // Allow requests from any origin
//   res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE'); // Allow specified HTTP methods
//   res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Allow specified headers
//   res.header('Access-Control-Allow-Credentials', 'true'); // Allow credentials (cookies) to be sent in cross-origin requests
//   next();
// });

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/profile", profileRouter);

/* !!! the order of middleware matters */

// error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
