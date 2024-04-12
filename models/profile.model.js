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
  VERIFIED_ENUM,
  GOTRAM_ENUM,
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

const addressSchema = new mongoose.Schema({
  addressLine1: {
    type: String,
    required: true,
    default: " ",
  },
  addressLine2: {
    type: String,
    default: " ",
  },
  city: {
    type: String,
    required: true,
    default: null,
    match: [/^[a-zA-Z]+$/, "Please enter a valid city"],
  },
  state: {
    type: String,
    required: true,
    default: null,
    match: [/^[a-zA-Z]+$/, "Please enter a valid state"],
  },
  country: {
    type: String,
    required: true,
    default: null,
    match: [/^[a-zA-Z]+$/, "Please enter a valid country"],
  },
  pincode: {
    type: String,
    required: true,
    default: null,
    match: [/^\d{6}$/, "Please enter a valid pincode"],
  },
},{ _id: false });

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
      unique: true,
      required: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    phoneNumber: {
      type: String,
      unique: true,
      required: true,
      match: [/^(\+\d{1,3}[- ]?)?\d{10}$/, "Please enter a valid phone number"],
    },
    fatherName: {
      type: String,
      required: true,
    },
    motherName: {
      type: String,
      required: true,
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
    swagotram: {
      type: String,
      required: true,
      enum: GOTRAM_ENUM,
    },
    maternalGotram: {
      type: String,
      required: true,
      enum: GOTRAM_ENUM,
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
    address: {
      type: addressSchema,
      required: true,
      default: () => ({}),
    },
    bio: {
      type: String,
      required: true,
    },
    seekingBio: {
      type: String,
      required: true,
    },
    verified: {
      type: String,
      required: true,
      default: "not verified",
      enum: VERIFIED_ENUM,
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
    minimize: false,
  }
);

const Profile = mongoose.model("Profile", profileSchema);

export default Profile;
