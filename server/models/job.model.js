import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    requirements: [
      {
        type: String,
      },
    ],
    salaryMin: {
      type: Number, //lpa
      required: true,
    },
    salaryMax: {
      type: Number,
      required: true,
    },
    salaryCurrency: {
      type: String,
      default: "INR",
    },
    experienceLevel: {
      type: String, // 0-2 yrs
      required: true,
    },
    location: {
      type: String,
    },
    workMode: {
      type: String,
      enum: ["Onsite", "Remote", "Hybrid"],
      required: true,
    },
    jobType: {
      type: String, // internship, fulltime etc
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
    jobLevel: {
      type: String,
      enum: ["Intern", "Fresher", "Junior", "Mid", "Senior", "Lead"],
      required: true,
    },
    position: {
      type: Number,
      required: true,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    applications: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Application",
      },
    ],
  },
  { timestamps: true }
);

export const Job = mongoose.model("Job", jobSchema);
