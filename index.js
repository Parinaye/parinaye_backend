import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRouter from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.route.js";
import profileRouter from "./routes/profile.routes.js";
import cors from "cors";
import configRouter from "./routes/config.routes.js";

dotenv.config();

mongoose
  .connect(process.env.MONGODB_URL,
    {
      dbName: "parinaye",
    })
  .then(() => {
    console.log("DB connected");
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();

// regular expression to match any URL containing "parinaye"
const parinayeRegex = /.*parinaye.*/;

const corsOptions = {
  credentials: true,
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // Allow requests with no origin (like mobile apps or curl requests)
    if (
      [
        "http://localhost:3000",
        "http://localhost",
        "http://34.28.138.152",
      ].indexOf(origin) !== -1 || parinayeRegex.test(origin)
    ) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization", "credentials"],
};

app.use(cors(corsOptions));

app.use(express.json()); // by default json is not allowed to be send in request unless specified here
app.use(cookieParser());

app.listen(8000, () => {
  console.log("Api running on 8000 ! ");
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
app.use("/api/config", configRouter)

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
