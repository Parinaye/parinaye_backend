import e from "express";
import Profile from "../models/profile.model.js";
import { errorHandler } from "../utils/error.utils.js";

export const createProfile = async (req, res, next) => {
  try {
    const data = req.body;
    data.userRef = req.user.id;
    console.log(data);
    const profile = await Profile.create(req.body);
    console.log(profile);
    res.status(201).json(profile);
  } catch (err) {
    console.log(err);
    next(errorHandler(500, err.message || "Failed to create profile"));
  }
};

export const searchProfiles = async (req, res, next) => {
  try {
    const searchParam = req.query.searchParam;
    console.log(req.query);
    let profiles;
    if (searchParam.length < 1 || searchParam === undefined) {
      profiles = await Profile.find({}).sort({ createdAt: -1 });
    } else {
      profiles = await Profile.find({
        $or: [
          { firstName: { $regex: searchParam, $options: "i" } },
          { lastName: { $regex: searchParam, $options: "i" } },
          { email: { $regex: searchParam, $options: "i" } },
          { phoneNumber: { $regex: searchParam, $options: "i" } },
        ],
      }).sort({ createdAt: -1 });
    }
    res.status(200).json(profiles);
  } catch (err) {
    console.log(err);
    next(errorHandler(500, err.message || "Failed to search profiles"));
  }
};

export const getProfiles = async (req, res, next) => {
  try {
    let match = {};
    const filters = req.body.filters;
    console.log(filters);

    if (req.query.age_gte) {
      match.age = {
        $gte: parseInt(req.query.age_gte),
      };
    }
    if (req.query.age_lte) {
      match.age = {
        $lte: parseInt(req.query.age_lte),
      };
    }
    if (req.query.assets) {
      match.assets = {
        $all: JSON.parse(req.query.assets),
      };
    }
    if (req.query.createdAtGte) {
      match.createdAt = {
        ...match.createdAt ,
        $gte: new Date(req.query.createdAtGte),
      };
    }
    if (req.query.createdAtLte) {
      match.createdAt = {
        ...match.createdAt ,
        $lte: new Date(req.query.createdAtLte),
      };
    }
    if (req.query.profession) {
      match.profession = {
        $in: JSON.parse(req.query.profession),
      };
    }
    if (req.query.education) {
      match.education = {
        $in: JSON.parse(req.query.education),
      };
    }
    if (req.query.maritalStatus) {
      match.maritalStatus = {
        $in: JSON.parse(req.query.maritalStatus),
      };
    }
    if (req.query.religion) {
      match.religion = {
        $in: JSON.parse(req.query.religion),
      };
    }
    if (req.query.caste) {
      match.caste = {
        $in: JSON.parse(req.query.caste),
      };
    }
    if (req.query.state) {
      match.state = {
        $in: JSON.parse(req.query.state),
      };
    }
    if (req.query.city) {
      match.city = {
        $in: JSON.parse(req.query.city),
      };
    }
    if (req.query.country) {
      match.country = {
        $in: JSON.parse(req.query.country),
      };
    }

    console.log(match);
    const profiles = await Profile.aggregate([
      {
        $match: match,
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
    ]);
    // const profiles = await Profile.find({}).sort({createdAt: -1});
    res.status(200).json(profiles);
  } catch (err) {
    console.log(err);
    next(errorHandler(500, err.message || "Failed to create profile"));
  }
};

export const getProfile = async (req, res, next) => {
  try {
    const profile = await Profile.findById(req.params.id);
    res.status(200).json(profile);
  } catch (err) {
    console.log(err);
    next(errorHandler(500, err.message || "Failed to get profile"));
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const profile = await Profile.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!profile) {
      return next(errorHandler(404, "Profile not found to update"));
    }
    console.log(profile);
    res.status(200).json(profile);
  } catch (err) {
    console.log(err);
    next(errorHandler(500, err.message || "Failed to update profile"));
  }
};

export const deleteProfile = async (req, res, next) => {
  try {
    const profile = await Profile.findByIdAndDelete(req.params.id);
    if (!profile) {
      return next(errorHandler(404, "Profile not found to delete"));
    }
    res
      .status(200)
      .json("User with id: " + req.params.id + " has been deleted)");
  } catch (error) {
    next(errorHandler(500, err.message || "Failed to delete profile"));
  }
};
