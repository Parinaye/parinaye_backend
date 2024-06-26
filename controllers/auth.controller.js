import bcryptjs from "bcryptjs";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.utils.js";
import moment from "moment";
import Token from "../models/token.model.js";
import nodemailer from "nodemailer";

dotenv.config();

export const signUp = async (req, res, next) => {
  console.log(req.body);
  const { username, email, password } = req.body;
  const hashedPassword = bcryptjs.hashSync(
    password,
    parseInt(process.env.BYCRYPT_SALT)
  );

  try {
    const newUser = new User({
      username: username.trim().toLowercase(),
      email: email.trim().toLowercase(),
      password: hashedPassword,
    });
    await newUser.save();

    res.status(201).json({
      message: "user created successfully",
    });
  } catch (error) {
    next(error);
    // next (errorHandler("550", "failed creating user !!"));
  }
};

export const signIn = async (req, res, next) => {
  console.log(req.body);
  const { username, password } = req.body;
  try {
    const validUser = await User.findOne({
      username: { $regex: `^${username}$`, $options: "i" },
    });
    if (!validUser) {
      next(errorHandler(404, "User not found"));
      return;
    }
    const validPassword = bcryptjs.compareSync(
      password,
      validUser._doc.password
    );
    if (!validPassword) {
      next(errorHandler("401", "Invalid credentials!! Unable to Login"));
      return;
    }
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET, {
      expiresIn: 3600,
    });
    const { password: passwordFromUser, ...restOfUser } = validUser._doc;
    restOfUser.token = token;
    res
      .cookie("access_token", token, {
        path: "/", // Set the path for which the cookie is valid
        maxAge: 3600000, // Set the maximum age of the cookie in milliseconds (1 hour in this example)
        sameSite: "None", // Allow cookie to be sent in cross-site requests
      })
    res
      .status(200)
      .json({ ...restOfUser });
  } catch (error) {
    console.error('Error in signIn:', error); // Debug log
    next(error);
  }
};

export const signInGoogle = async (req, res, next) => {
  try {
    console.log(req.body);
    const { username, email } = req.body;
    const validUser = await User.findOne({
      email: { $regex: `^${email}$`, $options: "i" },
    });
    if (validUser) {
      const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET, {
        expiresIn: 3600,
      });
      const { password: passwordFromUser, ...restOfUser } = validUser._doc;
      restOfUser.token = token;
      res
        .cookie("access_token", token, {
          path: "/",
          httpOnly: true,
          expiresIn: 3600,
          sameSite: "None", // Allow cookie to be sent in cross-site requests
          secure: process.env.NODE_ENV === "production",
        })
        .status(200)
        .json({ ...restOfUser });
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        moment(new Date()).format("YYYYMMDDHHmmss");
      const hashedPassword = bcryptjs.hashSync(
        generatedPassword,
        parseInt(process.env.BYCRYPT_SALT)
      );
      const updatedUsername =
        username.split(" ").join("_") +
        moment(new Date()).format("YYYYMMDDHHmmss");

      console.log("generatedPassword", generatedPassword);
      console.log("hashedPassword", hashedPassword);
      console.log("updatedUsername", updatedUsername);
      const newUser = new User({
        username: updatedUsername,
        email,
        password: hashedPassword,
        avatar: req.body.photoUrl,
      });

      await newUser.save();

      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
        expiresIn: 3600,
      });
      const { password: passwordFromUser, ...restOfUser } = newUser._doc;
      restOfUser.token = token;
      res
        .cookie("access_token", token, {
          path: "/",
          httpOnly: true,
          expiresIn: 3600,
          sameSite: "None", // Allow cookie to be sent in cross-site requests
          secure: process.env.NODE_ENV === "production",
        })
        .status(200)
        .json({ ...restOfUser });
    }
  } catch (error) {
    next(error);
  }
};

export const signout = async (req, res, next) => {
  res.clearCookie("access_token").status(200).json("User has been signed out");
};

export const check_token = async (req, res, next) => {
  try {
    const validUser = await User.findOne({ _id: req.user.id });
    if (!validUser) {
      next(errorHandler(404, "User not found as in token"));
      return;
    }
    const { password: passwordFromUser, ...restOfUser } = validUser._doc;
    res.status(200).json({ ...restOfUser });
  } catch (error) {
    next(errorHandler(500, error.message || "Failed to check token"));
  }
};

export const sendResetPasswordOTP = async (req, res, next) => {
  try {
    const { username } = req.body;
    const validUser = await User.findOne({
      username: { $regex: `^${username}$`, $options: "i" },
    });
    if (!validUser) {
      next(errorHandler(404, "User not found"));
      return;
    } else {
      const userOtp = await Token.findOne({ userId: validUser._id });
      if (userOtp) {
        await Token.findByIdAndDelete(userOtp._id);
      }
      const otp = Math.floor(1000 + Math.random() * 900000);
      const reset_password_token = jwt.sign(
        { id: validUser._id },
        process.env.JWT_SECRET,
        {
          expiresIn: 120,
        }
      );
      console.log(otp);
      console.log(reset_password_token);
      // send otp to user email

      const newToken = new Token({
        userId: validUser._id,
        otp,
        token: reset_password_token,
      });
      await newToken.save();
      console.log(newToken);

      const transporter = nodemailer.createTransport({
        service: "Gmail ",
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASSWORD,
        },
      });
      const mailOptions = {
        from: process.env.EMAIL,
        to: validUser._doc.email,
        subject: "Parinaye : Password Reset OTP",
        html: `
        <html>
        <head>
            <title>Password Reset OTP</title>
        </head>
        <body>
            <p>Dear ${validUser._doc.username},</p>
            <p>Your OTP to reset password is: <strong>${otp}</strong></p>
            <p>This OTP is valid for a limited time. Do not share this code with anyone. If you did not request a password reset, please ignore this email.</p>
            <p>Sincerely,</p>
            <p>The Parinaye Team</p>
        </body>
        </html>
    `,
      };

      transporter.sendMail(mailOptions, async function (error, info) {
        if (error) {
          console.log(error);
          next(errorHandler(500, "Failed to send OTP"));
        } else {
          console.log("Email sent: " + info.response);
          res
            .cookie("reset_password_token", reset_password_token, {
              httpOnly: true,
              expiresIn: 120,
              sameSite: "None", // Allow cookie to be sent in cross-site requests
              secure: process.env.NODE_ENV === "production",
            })
            .status(200)
            .json({
              reset_password_token,
              message: "OTP has been sent to your email",
            });
        }
      });
    }
  } catch (error) {
    next(error);
  }
};

export const verifyResetPasswordOTP = async (req, res, next) => {
  try {
    const { otp } = req.body;
    const userId = req.user.id;
    const validUser = await User.findOne({ _id: userId });
    if (!validUser) {
      next(errorHandler(404, "User not found"));
      return;
    } else {
      console.log(validUser._id);
      console.log(otp);
      const userOtp = await Token.findOne({ userId: validUser._id, otp: otp });
      if (!userOtp) {
        next(errorHandler(404, "OTP is invalid or expired"));
        return;
      }
      const confirm_password_token = jwt.sign(
        { id: validUser._id },
        process.env.JWT_SECRET,
        {
          expiresIn: 300,
        }
      );
      await Token.findOneAndUpdate(
        { userId: validUser._id },
        { token: confirm_password_token }
      );
      res
        .cookie("reset_password_token", confirm_password_token, {
          httpOnly: true,
          expiresIn: 300,
          sameSite: "None", // Allow cookie to be sent in cross-site requests
          secure: process.env.NODE_ENV === "production",
        })
        .status(200)
        .json({
          reset_password_token: confirm_password_token,
          message: "OTP is verified",
        });
    }
  } catch (error) {
    next(errorHandler(500, error.message || "Failed to verify OTP"));
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { password } = req.body;
    const userId = req.user.id;
    const validUser = await User.findOne({ _id: userId });
    if (!validUser) {
      next(errorHandler(404, "User not found"));
      return;
    } else {
      const hashedPassword = bcryptjs.hashSync(password, 15);
      await User.findByIdAndUpdate(userId, { password: hashedPassword });
      res.status(200).json("Password has been reset successfully");
    }
  } catch (error) {
    next(errorHandler(500, error.message || "Failed to reset password"));
  }
};
