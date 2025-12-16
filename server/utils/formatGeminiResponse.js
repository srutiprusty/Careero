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
