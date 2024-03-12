import { errorHandler } from "./error.utils.js";
import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token)
    return res.status(401).json({ success: false, message: "Access denied !!, provide token." });
  try {
    jwt.verify(
      token,
      process.env.JWT_SECRET,
      (err, decoded) => {
        console.log(err)
        if (err) return next(errorHandler(403, "Invalid token!! , please Re-Authenticate. "));
        req.user = decoded;
        next();
      }
    );
  } catch (err) {
    console.log(err)
    return res.status(401).json({ success: false, message: "Error validating token !!" });
  }
};

export const verifyResetPasswordToken = async (req, res, next) => {
  const token = req.cookies.reset_password_token;
  if (!token)
    return res.status(401).json({ success: false, message: "Access denied !!, provide token." });
  try {
    jwt.verify(
      token,
      process.env.JWT_SECRET,
      (err, decoded) => {
        console.log(err)
        if (err) return next(errorHandler(403, "Invalid token!! , please Re-Start. "));
        req.user = decoded;
        next();
      }
    );
  } catch (err) {
    console.log(err)
    return res.status(401).json({ success: false, message: "Error validating token !!" });
  }
};
