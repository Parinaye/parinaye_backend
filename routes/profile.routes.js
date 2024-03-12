import { Router } from "express";
import { createProfile, getProfiles, updateProfile, deleteProfile, getProfile, searchProfiles } from "../controllers/profile.controller.js";
import { verifyToken } from "../utils/verifyUser.utils.js";

const profileRouter = Router();

profileRouter.post("/create", verifyToken , createProfile);

profileRouter.get("/get/:id", verifyToken, getProfile);

profileRouter.get("/get_profiles", verifyToken, getProfiles)

profileRouter.get("/search", verifyToken, searchProfiles)

profileRouter.put("/update/:id", verifyToken, updateProfile);

profileRouter.delete("/delete/:id", verifyToken, deleteProfile);

export default profileRouter;