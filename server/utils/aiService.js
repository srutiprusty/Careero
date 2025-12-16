/* import OpenAI from "openai";

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

// Small local question bank to use when OpenAI key is not configured
const FALLBACK_QUESTIONS = [
  "Tell me about a challenging technical problem you solved.",
  "Describe a time you worked on a team and had to handle conflict.",
  "How do you prioritize tasks when you have multiple deadlines?",
  "Explain a recent project where you had to learn a new technology quickly.",
  "Why are you interested in this role and how does your background fit?",
];

export async function generateQuestion(messages = [], systemPrompt = "") {
  // If OpenAI isn't configured, return a sensible fallback question
  if (!openai) {
    // try to tailor a question based on role in system prompt
    const roleMatch = (systemPrompt || "").match(/position of (.+?)\./i);
    const role = roleMatch ? roleMatch[1] : null;
    if (role) {
      return `What about your experience makes you a strong fit for the ${role} role?`;
    }

    // choose a question based on conversation length
    const idx = Math.min(messages.length, FALLBACK_QUESTIONS.length - 1);
    return FALLBACK_QUESTIONS[idx];
  }

  try {
    const allMessages = [];
    if (systemPrompt)
      allMessages.push({ role: "system", content: systemPrompt });
    allMessages.push(...messages);

    const res = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: allMessages,
      temperature: 0.7,
      max_tokens: 500,
    });

    return res.choices[0].message.content;
  } catch (err) {
    console.error(
      "OpenAI generateQuestion failed, falling back:",
      err?.message || err
    );
    return FALLBACK_QUESTIONS[
      Math.min(messages.length, FALLBACK_QUESTIONS.length - 1)
    ];
  }
}

export async function evaluateAnswer(question, answer) {
  if (!openai) {
    // Very small heuristic evaluator if no OpenAI key
    const lengthScore = Math.min(
      7,
      Math.floor(answer.trim().split(" ").length / 10)
    );
    const score = Math.max(3, lengthScore + 3); // 3-10
    const feedback = `Score: ${score}/10\nFeedback: Good structure; expand on specifics and examples.\nImprovement: Mention concrete metrics, outcomes and your role.`;
    return feedback;
  }

  try {
    const prompt = `You are an interview evaluator.\n\nQuestion: ${question}\nCandidate Answer: ${answer}\n\nEvaluate on:\n- Correctness\n- Clarity\n- Depth\n\nRespond strictly in this format:\nScore: X/10\nFeedback:\nImprovement:`;

    const res = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
    });

    return res.choices[0].message.content;
  } catch (err) {
    console.error(
      "OpenAI evaluateAnswer failed, returning minimal feedback:",
      err?.message || err
    );
    const fallback = `Score: 6/10\nFeedback: Answer is okay but could use more depth and specific examples.\nImprovement: Add measurable outcomes and explain your exact contribution.`;
    return fallback;
  }
}
 */

import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
