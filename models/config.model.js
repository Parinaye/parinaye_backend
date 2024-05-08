import mongoose from "mongoose";

const configSchema = new mongoose.Schema(
  {
    notices: [{ type: String }],
    env:{
        type: String,
        unique: true,
        enum:["staging","prod"]
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

const Config = mongoose.model("Config", configSchema);

export default Config;
