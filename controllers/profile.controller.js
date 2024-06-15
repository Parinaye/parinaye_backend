import e from "express";
import Profile from "../models/profile.model.js";
import { errorHandler } from "../utils/error.utils.js";
import moment from "moment";
import mongoose from "mongoose";

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
    console.log(req.query);

    if (req.query.assets) {
      match.assets = {
        $all: req.query.assets.split(","),
      };
    }
    if (req.query.createdAtGte) {

      console.log(req.query.createdAtGte)
      match.createdAt = {
        ...match.createdAt ,
        $gte: new Date(req.query.createdAtGte),
      };
    }
    if (req.query.createdAtLte) {
      console.log(req.query.createdAtLte)
      match.createdAt = {
        ...match.createdAt ,
        $lte: new Date(req.query.createdAtLte),
      };
    }

    if(req.query.ageAtGte){
      const today = moment(); // Get the current moment
      const pastDate = moment().subtract(parseInt(req.query.ageAtGte), 'years'); // Subtract desired years
      const pastGteDate = new Date(pastDate)
      // Subtracting years from full year
      console.log(pastGteDate)
      match.dob = {
        ...match.dob,
        $gte: pastGteDate
      }
    }

    if(req.query.ageAtLte){
      const today = moment(); // Get the current moment

      const pastDate = moment().subtract(parseInt(req.query.ageAtLte), 'years'); // Subtract desired years
      const pastLteDate = new Date(pastDate)
      console.log(pastLteDate)
      match.dob = {
        ...match.dob,
        $lte: pastLteDate
      }
    }

    if (req.query.profession) {
      match.profession = {
        $in: req.query.profession.split(","),
      };
    }
    if (req.query.education) {
      match.education = {
        $in: req.query.education.split(","),
      };
    }
    if (req.query.maritalStatus) {
      match.maritalStatus = {
        $in: req.query.maritalStatus.split(","),
      };
    }
    if (req.query.gender) {
      match.gender = {
        $in: req.query.gender.split(","),
      };
    }
    if(req.query.verificationStatus){
      match.verificationStatus = {
        $in: req.query.verificationStatus.split(","),
      };
    }
    if (req.query.religion) {
      match.religion = {
        $in: req.query.religion.split(","),
      };
    }
    if (req.query.caste) {
      match.caste = {
        $in: req.query.caste.split(","),
      };
    }
    if (req.query.state) {
      match.state = {
        $in: req.query.state.split(","),
      };
    }
    if (req.query.city) {
      match.city = {
        $in: req.query.city.split(","),
      };
    }
    if (req.query.country) {
      match.country = {
        $in: req.query.country.split(","),
      };
    }

    if(req.query.userRef){
      if (typeof req.query.userRef === 'string' && req.query.userRef.length === 24) {
        try {
          match.userRef = {
            $eq: new mongoose.Types.ObjectId(req.query.userRef)
          }
        } catch (error) {
          return res.status(500).json({ message: 'Invalid ObjectId format for userRef : ' + error });
        }
      } else {
        console.warn("userRef value is not a valid ObjectId format:", req.query.useruserRef);
      }
    }
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 9;

    if (page < 1 || limit < 1) {
      return res.status(400).json({ message: 'Page and limit must be positive integers' });
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
      {
        $skip: (page - 1) * limit,
      },
      {
        $limit: limit
      }

    ]);

    console.log()
    const totalProfiles = await Profile.countDocuments(match); // Get the total number of documents
    const totalPages = Math.ceil(totalProfiles / limit);
    res.status(200).json({
      profiles,
      page,
      totalPages,
      totalProfiles,
    });
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
