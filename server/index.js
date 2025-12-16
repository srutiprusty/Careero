import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import companyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.route.js";
import applicationRoute from "./routes/application.route.js";
import axios from "axios";
import chatRoute from "./routes/chat.route.js";
import resume from "./routes/resume.route.js";
import interviewRoute from "./routes/interview.route.js";

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS setup for frontend
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:5174",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));

// Root route to handle GET requests to "/"
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Job Portal API" });
});

const PORT = process.env.PORT || 4000;

// Other API routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);
app.use("/api/v1/chat", chatRoute);
app.use("/api/v1/resume", resume);
app.use("/api/v1/interview", interviewRoute);

// Start server only after DB connection — fail fast if DB cannot be reached
const startServer = async () => {
  try {
    await connectDB(); // ensure DB connected before accepting requests
    app.listen(PORT, () => {
      console.log(`Server running at port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server - DB connection error:", err);
    // exit process so the host (or dev) can restart / investigate
    process.exit(1);
  }
};

startServer();

// handle unhandled rejections/uncaught exceptions to improve robustness
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception thrown:", err);
  process.exit(1);
});
