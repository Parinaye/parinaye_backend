import { errorHandler } from "./error.utils.js";
import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {
  let token;
  // let token = req.cookies.access_token;
  // if (!token)
  if (req.headers.authorization) {
    token = req.headers.authorization.split(" ")[1];
  } else {
    return res
      .status(401)
      .json({ success: false, message: "Access denied !!, provide Authorization." });
  }
  try {
    console.log(token);
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      console.log(err);
      if (err) return next(errorHandler(403, "Please Re-Authenticate. !! "));
      req.user = decoded;
      next();
    });
  } catch (err) {
    console.log(err);
    return res
      .status(401)
      .json({ success: false, message: "Error validating token !!" });
  }
};

export const verifyResetPasswordToken = async (req, res, next) => {
  // let token = req.cookies.reset_password_token;
  // if (!token)
  let token;
  if (req.headers.authorization) {
    token = req.headers.authorization.split(" ")[1];
  } else {
    return res
      .status(401)
      .json({ success: false, message: "Access denied !!, provide Authorization." });
  }
  try {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      console.log(err);
      if (err)
        return next(errorHandler(403, "Invalid token!! , please Re-Start. "));
      req.user = decoded;
      next();
    });
  } catch (err) {
    console.log(err);
    return res
      .status(401)
      .json({ success: false, message: "Error validating token !!" });
  }
};
