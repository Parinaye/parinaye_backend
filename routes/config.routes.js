import { Router } from "express";
import { verifyToken } from "../utils/verifyUser.utils.js";
import { updateConfig, getConfig } from "../controllers/config.controller.js";


const configRouter = Router();

configRouter.put("/update", verifyToken, updateConfig);

configRouter.get("/", verifyToken, getConfig)

export default configRouter;
