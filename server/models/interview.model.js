/* class InterviewSession {
  constructor() {
    this.role = "";
    this.level = "";
    this.questionCount = 0;
    this.history = [];
  }

  start(role, level) {
    this.role = role;
    this.level = level;
    this.questionCount = 0;
    this.history = [];
  }

  nextQuestion() {
    this.questionCount += 1;
  }

  addHistory(question, answer, feedback) {
    this.history.push({
      question,
      answer,
      feedback,
    });
  }

  getSummary() {
    return {
      role: this.role,
      level: this.level,
      totalQuestions: this.questionCount,
      history: this.history,
    };
  }
}

const interviewSession = new InterviewSession();
export default interviewSession;
 */ // models/Interview.js
import mongoose from "mongoose";

const AnswerSchema = new mongoose.Schema(
  {
    questionIndex: Number,
    questionText: String,
    answerText: String,
    score: Number,
    maxScore: Number,
    strengths: [String],
    improvements: [String],
    shortFeedback: String,
  },
  { _id: false } // optional: no separate _id per answer
);

const QuestionSchema = new mongoose.Schema({
  text: String,
});

const InterviewSchema = new mongoose.Schema(
  {
    role: String,
    level: String,
    questions: [QuestionSchema],
    answers: [AnswerSchema], // <--- embedded answers
    finished: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Interview", InterviewSchema);
