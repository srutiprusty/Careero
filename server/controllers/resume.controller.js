import { extractResumeText, resumeResponseFormat, formatGeminiResponse } from "../utils/extract.js";

export const analyzeResumeController = async (req, res) => {
  try {
    const resumeText = await extractResumeText(req.file);
    const prompt = `
You are an ATS resume evaluator.

Return ONLY valid JSON in this format:
${JSON.stringify(resumeResponseFormat)}

Evaluate the resume based on:
- ATS compatibility
- Skills relevance
- Experience clarity
- Missing keywords

Resume:
${resumeText}
`;




  let response;
let provider = "gemini";

try {
  // 🔹 PRIMARY: GEMINI
  response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 4096,
          responseMimeType: "application/json"
        }
      })
    }
  );

  if (!response.ok) {
    throw new Error("Gemini failed");
  }

} catch (err) {
  // 🔹 FALLBACK: GROQ
  console.warn("Gemini failed, switching to Groq...");
  provider = "groq";

  response = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.2,
        max_tokens: 4096
      })
    }
  );

  if (!response.ok) {
    throw new Error("Groq also failed");
  }
}

    const data = await response.json();

    const formattedData = formatGeminiResponse(
      data,
      resumeResponseFormat
    );

    res.status(200).json({
      success: true,
      data: formattedData
    });

  } catch (error) {
    console.error("Resume Analysis Error:", error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};