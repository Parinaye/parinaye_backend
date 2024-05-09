import Config from "../models/config.model.js";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.utils.js";

export const updateConfig = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if ((user && user.role === "admin") || req.params.id === req.user.id) {
      const updatedConfig = await Config.findOneAndUpdate(
        { env: req.body.env },
        req.body,
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      if (updatedConfig) {
        res.status(200).json(updatedConfig._doc);
      } else {
        next(errorHandler(500, "Failed to update Config"));
      }
    } else {
      next(errorHandler(401, "Unauthorized! only admin can update config"));
    }
  } catch (err) {
    console.log(err);
    next(errorHandler(500, "Failed to update Config"));
  }
};

export const getConfig = async (req, res, next) => {
  try {
      if (req.query.env) {
        const getConfig = await Config.findOne({ env: req.query.env });
        if (getConfig == null) {
          next(errorHandler(404, "no config found for env: " + req.query.env));
        }
        res.status(200).json(getConfig._doc);
      } else {
        next(errorHandler(500, `'env' Query param is required`));
      }
  } catch (err) {
    console.log(err);
    next(errorHandler(500, "Failed to get Config"));
  }
};
