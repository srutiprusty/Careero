/* import interviewSession from "../models/interview.model.js";
import { generateQuestion, evaluateAnswer } from "../utils/aiService.js";

// Start Interview
export const startInterview = (req, res) => {
  const { role, level } = req.body;

  if (!role) {
    return res.status(400).json({ error: "Role is required" });
  }

  const sessionLevel = level || "intermediate";
  interviewSession.start(role, sessionLevel);

  res.json({
    message: "Interview started",
    role,
    level: sessionLevel,
  });
};

// Ask Next Question
export const getQuestion = async (req, res) => {
  const { model, max_tokens, system, messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Messages array required" });
  }

  try {
    const question = await generateQuestion(messages, system);

    // record that a question was asked
    interviewSession.nextQuestion();

    res.json({
      content: [
        {
          type: "text",
          text: question,
        },
      ],
    });
  } catch (err) {
    console.error("Error generating question:", err);
    res.status(500).json({ error: "Failed to generate question" });
  }
};

// Evaluate Answer
export const submitAnswer = async (req, res) => {
  const { question, answer } = req.body;

  if (!question || !answer) {
    return res.status(400).json({ error: "Question and answer required" });
  }

  try {
    const feedback = await evaluateAnswer(question, answer);

    interviewSession.addHistory(question, answer, feedback);

    res.json({ feedback });
  } catch (err) {
    res.status(500).json({ error: "Evaluation failed" });
  }
};

// Interview Summary (Optional)
export const getSummary = (req, res) => {
  res.json(interviewSession.getSummary());
};
 */

// controllers/interviewController.js
import Interview from "../models/interview.model.js";
import { openai } from "../utils/aiService.js";

async function callOpenAIJSON(prompt, schemaDescription) {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content:
          "You are an interview assistant. Always respond with valid JSON only. " +
          schemaDescription,
      },
      { role: "user", content: prompt },
    ],
  });
  return JSON.parse(completion.choices[0].message.content);
}

export const startInterview = async (req, res) => {
  try {
    const { role, level } = req.body;

    const json = await callOpenAIJSON(
      `Generate one interview questions for job role "${role}" at "${level}" level.`,
      `The JSON must be: { "questions": [ { "text": "..." } ] }`
    );

    const interview = await Interview.create({
      role,
      level,
      questions: json.questions || [],
      answers: [],
    });

    res.json({
      interviewId: interview._id,
      questions: interview.questions,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to start interview" });
  }
};

export const submitAnswer = async (req, res) => {
  try {
    const {
      interviewId,
      questionIndex,
      questionText,
      answerText,
      role,
      level,
    } = req.body;

    const interview = await Interview.findById(interviewId);
    if (!interview)
      return res.status(404).json({ error: "Interview not found" });
    if (interview.finished)
      return res.status(400).json({ error: "Interview already finished" });
    if (!interview)
      return res.status(404).json({ error: "Interview not found" });

    const prompt = `
Role: ${role}
Level: ${level}
Question: ${questionText}
Candidate answer: ${answerText}

Evaluate the answer on correctness, depth, clarity, and communication.
Return JSON with:
{
  "score": number (0-10),
  "maxScore": 10,
  "strengths": string[],
  "improvements": string[],
  "shortFeedback": string
}
`;

    const json = await callOpenAIJSON(
      prompt,
      "The JSON structure is exactly as described in the prompt."
    );

    const answerDoc = {
      questionIndex,
      questionText,
      answerText,
      score: json.score,
      maxScore: json.maxScore,
      strengths: json.strengths,
      improvements: json.improvements,
      shortFeedback: json.shortFeedback,
    };

    interview.answers.push(answerDoc);
    await interview.save();

    const savedAnswer =
      interview.answers[interview.answers.length - 1].toObject();
    res.json(savedAnswer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to evaluate answer" });
  }
};
export const getNextQuestion = async (req, res) => {
  try {
    const { interviewId } = req.body;

    const interview = await Interview.findById(interviewId);
    if (!interview)
      return res.status(404).json({ error: "Interview not found" });
    if (interview.finished)
      return res.status(400).json({ error: "Interview already finished" });
    if (!interview)
      return res.status(404).json({ error: "Interview not found" });

    const json = await callOpenAIJSON(
      `Generate another interview question for job role "${interview.role}" at "${interview.level}" level.`,
      `The JSON must be: { "question": { "text": "..." } }`
    );

    interview.questions.push(json.question);
    await interview.save();

    res.json({ question: json.question });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to get next question" });
  }
};

export const getSummary = async (req, res) => {
  try {
    const { interviewId } = req.params;
    const interview = await Interview.findById(interviewId);
    if (!interview)
      return res.status(404).json({ error: "Interview not found" });

    const answers = interview.answers.sort(
      (a, b) => a.questionIndex - b.questionIndex
    );

    const prompt = `
Give an overall summary for this mock interview.

Role: ${interview.role}
Level: ${interview.level}

Questions and answers with scores:
${answers
  .map(
    (a) =>
      `Q${a.questionIndex + 1}: ${a.questionText}
Answer: ${a.answerText}
Score: ${a.score}/${a.maxScore}
`
  )
  .join("\n")}

Return JSON:
{
  "overallScore": number (0-10),
  "overallComment": string,
  "strengths": string[],
  "weaknesses": string[],
  "improvementPlan": string[]
}
`;

    const json = await callOpenAIJSON(
      prompt,
      "The JSON structure is exactly as described in the prompt."
    );

    res.json(json);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate summary" });
  }
};

export const finishInterview = async (req, res) => {
  try {
    const { interviewId } = req.body;
    const interview = await Interview.findById(interviewId);
    if (!interview)
      return res.status(404).json({ error: "Interview not found" });

    interview.finished = true;
    await interview.save();

    const answers = interview.answers.sort(
      (a, b) => a.questionIndex - b.questionIndex
    );

    const prompt = `
Give an overall summary for this mock interview.

Role: ${interview.role}
Level: ${interview.level}

Questions and answers with scores:
${answers
  .map(
    (a) =>
      `Q${a.questionIndex + 1}: ${a.questionText}
Answer: ${a.answerText}
Score: ${a.score}/${a.maxScore}
`
  )
  .join("\n")}

Return JSON:
{
  "overallScore": number (0-10),
  "overallComment": string,
  "strengths": string[],
  "weaknesses": string[],
  "improvementPlan": string[]
}
`;

    const json = await callOpenAIJSON(
      prompt,
      "The JSON structure is exactly as described in the prompt."
    );

    res.json(json);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to finish interview" });
  }
};
