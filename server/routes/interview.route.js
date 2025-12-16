/* import express from "express";
import {
  startInterview,
  getQuestion,
  submitAnswer,
  getSummary,
} from "../controllers/interview.controller.js";

const router = express.Router();

router.post("/start", startInterview);
router.post("/question", getQuestion);
router.post("/evaluate", submitAnswer);
router.get("/summary", getSummary);

export default router;
 */

// routes/interviewRoutes.js
import express from "express";
import {
  startInterview,
  submitAnswer,
  getSummary,
  getNextQuestion,
  finishInterview,
} from "../controllers/interview.controller.js";

const router = express.Router();

router.post("/start-interview", startInterview);
router.post("/next", getNextQuestion);
router.post("/answer", submitAnswer);
router.get("/summary/:interviewId", getSummary);
router.post("/finish", finishInterview);

export default router;
