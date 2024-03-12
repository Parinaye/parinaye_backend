import mongoose from "mongoose";
import {
  ASSETS_ENUM,
  EDUCATION_ENUM,
  GENDER_ENUM,
  INCOME_ENUM,
  MARITAL_STATUS_ENUM,
  PROFESSION_ENUM,
  RELIGION_ENUM,
  CASTE_ENUM,
} from "../config/enums.config.js";

const heightSchema = new mongoose.Schema({
  feet: {
    type: Number,
    required: true,
  },
  inches: {
    type: Number,
    required: true,
  },
});

const profileSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    phoneNumber: {
      type: String,
      required: true,
      match: [/^(\+\d{1,3}[- ]?)?\d{10}$/, "Please enter a valid phone number"],
    },
    gender: {
      type: String,
      required: true,
      enum: GENDER_ENUM,
    },
    religion: {
      type: String,
      required: true,
      enum: RELIGION_ENUM,
    },
    caste: {
      type: String,
      required: true,
      enum: Object.keys(CASTE_ENUM).forEach((caste) => {
        return CASTE_ENUM[caste].forEach((subCaste) => {
          return caste + ":" + subCaste;
        });
      }),
    },
    dob: {
      type: Date,
      required: true,
    },
    height: {
      type: heightSchema,
      required: true,
    },
    profession: {
      type: String,
      required: true,
      enum: PROFESSION_ENUM,
    },
    education: {
      type: String,
      required: true,
      enum: EDUCATION_ENUM,
    },
    maritalStatus: {
      type: String,
      required: true,
      enum: MARITAL_STATUS_ENUM,
    },
    income: {
      type: String,
      required: true,
      enum: INCOME_ENUM,
    },
    assets: [
      {
        type: String,
        enum: ASSETS_ENUM,
      },
    ],
    bio: {
      type: String,
      required: true,
    },
    profilePictures: {
      type: [
        {
          type: String,
          required: true,
        },
      ],
      validate: [v => Array.isArray(v) && v.length > 0 , "atleast one profile picture is required"]
    },
    userRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

profileSchema.index({ email: "text", phoneNumber: "text" }, { unique: true });

const Profile = mongoose.model("Profile", profileSchema);

export default Profile;
