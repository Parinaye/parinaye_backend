import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.utils.js";

export const updateUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if ((user && user.role === "admin") || req.params.id === req.user.id) {
      if (req.body.password) {
        req.body.password = await bcryptjs.hashSync(req.body.password, 10);
      }
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: {
            email: req.body.email,
            password: req.body.password,
            avatar: req.body.avatar,
            role: req.body.role,
          },
        },
        { new: true }
      );
      const { password, ...restOfUser } = updatedUser._doc;
      res.status(200).json(restOfUser);
    } else {
      return next(
        errorHandler(401, "Unauthorized! you can only update your account")
      );
    }
  } catch (err) {
    console.log(err);
    next(errorHandler(500, "Failed to update user"));
  }
};

export const deleteUser = async (req, res, next) => {
  // This part of the code is to allow only self account deletion
  // if (req.params.id !== req.user.id) {
  //   return next(
  //     errorHandler(401, "Unauthorized! you can only delete your account")
  //   );
  // }
  try {
    const user = await User.findById(req.user.id);
    if (user && user.role === "admin") {
      await User.findByIdAndDelete(req.params.id);
      res.clearCookie("access_token").status(200).json("User has been deleted");
    } else {
      return next(
        errorHandler(401, "Unauthorized! you can only Admin can delete user account")
      );
    }
  } catch (err) {
    console.log(err);
    next(errorHandler(500, "Failed to delete user"));
  }
};

export const getUsers = async (req, res, next) => {
  try {
    console.log(req.user);
    const currentUser = await User.findById(req.user.id);
    if (currentUser && currentUser.role !== "admin") {
      return next(
        errorHandler(
          401,
          "Unauthorized! you can only get all users if you are an admin"
        )
      );
    }
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (err) {
    console.log(err);
    next(errorHandler(500, "Failed to get users"));
  }
};
