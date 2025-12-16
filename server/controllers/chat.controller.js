export const chatWithAI = async (req, res) => {
  try {
    const { message, isFirstMessage, role } = req.body;

    /* ---------- GREETING ---------- */
    if (isFirstMessage) {
      return res.json({
        success: true,
        reply:
"👋 Welcome! I'm CAREERO, your AI career assistant. Feel free to ask about jobs, resumes, skills, or interviews."          ,
      });
    }

    if (!message || message.trim() === "") {
      return res.status(400).json({ error: "Message is required" });
    }

    const systemPrompt = `
You are an AI career assistant for a job platform.
You help users with jobs, resumes, interviews, and skills.
User role: ${role || "unknown"}.
Be clear, professional, and concise.
Do not answer unrelated questions.
`;

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: message },
          ],
          temperature: 0.5,
          max_tokens: 300,
        }),
      }
    );

    const data = await response.json();

    const aiReply =
      data?.choices?.[0]?.message?.content ||
      "Sorry, I couldn’t generate a response.";

    res.json({ success: true, reply: aiReply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "AI failed to respond" });
  }
};
