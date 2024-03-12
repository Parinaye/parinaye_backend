import { Router } from "express";
import {
  signIn,
  signUp,
  signInGoogle,
  signout,
  check_token,
  sendResetPasswordOTP,
  verifyResetPasswordOTP,
  resetPassword,
} from "../controllers/auth.controller.js";
import {
  verifyResetPasswordToken,
  verifyToken,
} from "../utils/verifyUser.utils.js";



const authRouter = Router();

authRouter.post("/signup", signUp);

authRouter.post("/signin", signIn);

authRouter.post("/signin_google", signInGoogle);

authRouter.get("/signout/:id", signout);

authRouter.get("/check_token", verifyToken, check_token);

authRouter.post("/sendOtp", sendResetPasswordOTP);

authRouter.post("/verifyOtp", verifyResetPasswordToken, verifyResetPasswordOTP);

authRouter.post("/resetPassword", verifyResetPasswordToken, resetPassword);

export default authRouter;
