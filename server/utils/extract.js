// utils/extract.js
import mammoth from "mammoth";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const pdf = require("pdf-parse"); // ✅ now a function

export const resumeResponseFormat = {
  atsScore: 0,
  strengths: [],
  weaknesses: [],
  improvements: [],
  missingKeywords: [],
};

export const extractResumeText = async (file) => {
  if (!file) throw new Error("File not provided");

  // PDF
  if (file.mimetype === "application/pdf") {
    const data = await pdf(file.buffer); // ✅ WORKS
    return data.text;
  }

  // DOCX
  if (
    file.mimetype ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    const result = await mammoth.extractRawText({
      buffer: file.buffer,
    });
    return result.value;
  }

  throw new Error("Unsupported file format");
};



export const formatGeminiResponse = (geminiResponse, schema) => {
  const rawText =
    geminiResponse?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!rawText) {
    throw new Error("Empty response from Gemini");
  }

  let parsed;
  try {
    parsed = JSON.parse(rawText);
  } catch (error) {
    console.error("Invalid JSON from Gemini:", rawText);
    throw new Error("Gemini returned invalid JSON");
  }

  // Ensure all schema keys exist
  const formatted = {};
  for (const key of Object.keys(schema)) {
    formatted[key] = parsed[key] ?? schema[key];
  }

  return formatted;
};
