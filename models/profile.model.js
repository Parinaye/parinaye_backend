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
  GOTRAM_ENUM,
  VERIFICATION_STATUS_ENUM,
  RAASI_ENUM,
  NAKSHATRAM_ENUM,
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

const tobSchema = new mongoose.Schema({
  hour: {
    type: Number,
    required: true,
  },
  min: {
    type: Number,
    required: true,
  },
  ampm: {
    type: String,
    enum: ["am", "pm"],
  },
});

const addressSchema = new mongoose.Schema(
  {
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
    },
    state: {
      type: String,
      required: true,
      default: null,
    },
    country: {
      type: String,
      required: true,
      default: null,
    },
    pincode: {
      type: String,
      required: true,
      default: null,
      match: [/^\d{6}$/, "Please enter a valid pincode"],
    },
  },
  { _id: false }
);

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
    tob: {
      type: tobSchema,
      default: () => ({}),
    },
    raasi: {
      type: String,
      enum: RAASI_ENUM,
    },
    nakshatram: {
      type: String,
      enum: NAKSHATRAM_ENUM,
    },
    paadam: {
      type: Number,
      enum: [1, 2, 3, 4],
    },
    sibblings: {
      type: Number,
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
    verificationStatus: {
      type: String,
      default: "unverified",
      enum: VERIFICATION_STATUS_ENUM,
    },
    profilePictures: {
      type: [
        {
          type: String,
          required: true,
        },
      ],
      validate: [
        (v) => Array.isArray(v) && v.length > 0,
        "atleast one profile picture is required",
      ],
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
