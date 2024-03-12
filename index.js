import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRouter from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.route.js";
import profileRouter from "./routes/profile.routes.js";

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

app.use(express.json()) // by default json is not allowed to be send in request unless specified here
app.use(cookieParser());


app.listen(3000, () => {
  console.log("Api running on 3000 ! ");
});

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/profile", profileRouter);

/* !!! the order of middleware matters */

// error handling middleware 
app.use((err,req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message =  err.message || "Internal server error";
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    });
});
