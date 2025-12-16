import express from "express";
import { singleUpload } from "../middlewares/multer.js";
import { analyzeResumeController } from "../controllers/resume.controller.js";

const router = express.Router();

router.route("/analyze").post(singleUpload, analyzeResumeController);
export default router;

