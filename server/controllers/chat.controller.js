export const chatWithAI = async (req, res) => {
  try {
    const { message, isFirstMessage, role } = req.body;

    /* =====================================================
       GREETING
    ===================================================== */

    if (isFirstMessage) {
      return res.json({
        success: true,
        reply:
          "👋 Welcome! I'm CAREERO, your AI career assistant. Feel free to ask about jobs, resumes, skills, or interviews.",
      });
    }

    /* =====================================================
       VALIDATE MESSAGE
    ===================================================== */

    if (!message || message.trim() === "") {
      return res.status(400).json({
        success: false,
        error: "Message is required",
      });
    }

    /* =====================================================
       SYSTEM PROMPT
    ===================================================== */

    const systemPrompt = `
You are an AI career assistant for a job platform.
You help users with jobs, resumes, interviews, and skills.
User role: ${role || "unknown"}.
Be clear, professional, and concise.
Do not answer unrelated questions.
`;
    const prompt = `${systemPrompt}

User message:
${message}

Return a helpful response in plain text only.`;

    /* =====================================================
       CLEAN AI RESPONSE
    ===================================================== */
    const cleanResponse = (text) => {
      return (
        text
          // Remove bold **text**
          .replace(/\*\*(.*?)\*\*/gs, "$1")

          // Remove italic *text*
          .replace(/\*(.*?)\*/gs, "$1")

          // Remove headings
          .replace(/^#{1,6}\s*/gm, "")

          // Remove inline code
          .replace(/`([^`]+)`/g, "$1")

          // Remove markdown links but keep text
          .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")

          // Remove bullet symbols
          .replace(/^\s*[-*+]\s+/gm, "")

          // Put numbered items on separate lines
          .replace(/\s+(\d+)\.\s+/g, "\n$1. ")

          // Clean spaces after new lines
          .replace(/\n[ \t]+/g, "\n")

          // Remove excessive blank lines
          .replace(/\n{3,}/g, "\n\n")

          .trim()
      );
    };

    /* =====================================================
       1. TRY GEMINI FIRST
    ===================================================== */

    try {
      console.log("Trying Gemini...");

      const geminiResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [
                  {
                    text: prompt,
                  },
                ],
              },
            ],

            generationConfig: {
              temperature: 0.2,
              maxOutputTokens: 1000,
            },
          }),
        },
      );

      /* ---------- CHECK GEMINI RESPONSE ---------- */

      if (!geminiResponse.ok) {
        const errorText = await geminiResponse.text();

        throw new Error(
          `Gemini API error: ${geminiResponse.status} ${geminiResponse.statusText} - ${errorText}`,
        );
      }

      /* ---------- PARSE GEMINI RESPONSE ---------- */

      const geminiData = await geminiResponse.json();

      console.log("Gemini response received");

      let aiReply = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!aiReply) {
        throw new Error("Gemini returned an empty response");
      }

      /* ---------- CLEAN RESPONSE ---------- */

      aiReply = cleanResponse(aiReply);

      /* ---------- SEND RESPONSE ---------- */

      return res.json({
        success: true,
        reply: aiReply,
        provider: "gemini",
      });
    } catch (geminiError) {
      console.error("Gemini failed:", geminiError.message);

      console.log("Falling back to Groq...");
    }

    /* =====================================================
       2. FALLBACK TO GROQ
    ===================================================== */

    try {
      console.log("Trying Groq...");

      const groqResponse = await fetch(
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
              {
                role: "system",
                content: systemPrompt,
              },
              {
                role: "user",
                content: message,
              },
            ],

            temperature: 0.5,
            max_tokens: 500,
          }),
        },
      );

      /* ---------- CHECK GROQ RESPONSE ---------- */

      if (!groqResponse.ok) {
        const errorText = await groqResponse.text();

        throw new Error(
          `Groq API error: ${groqResponse.status} ${groqResponse.statusText} - ${errorText}`,
        );
      }

      /* ---------- PARSE GROQ RESPONSE ---------- */

      const groqData = await groqResponse.json();

      let aiReply = groqData?.choices?.[0]?.message?.content;

      if (!aiReply) {
        throw new Error("Groq returned an empty response");
      }

      /* ---------- CLEAN RESPONSE ---------- */

      aiReply = cleanResponse(aiReply);

      /* ---------- SEND RESPONSE ---------- */

      return res.json({
        success: true,
        reply: aiReply,
        provider: "groq",
      });
    } catch (groqError) {
      console.error("Groq failed:", groqError.message);

      return res.status(500).json({
        success: false,
        error: "Both Gemini and Groq failed to respond",
      });
    }
  } catch (error) {
    console.error("AI controller error:", error);

    return res.status(500).json({
      success: false,
      error: "AI failed to respond",
    });
  }
};
