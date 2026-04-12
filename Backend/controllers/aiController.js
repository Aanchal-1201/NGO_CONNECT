const Groq = require("groq-sdk");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

/* ================================================================
   FEATURE 1 — Analyze help request description
   Returns: { helpType, priority, reason }
   ================================================================ */
const analyzeRequest = async (req, res) => {
  try {
    const { description } = req.body;

    if (!description || description.trim().length < 10) {
      return res.status(400).json({ message: "Description too short" });
    }

    const prompt = `You are an AI assistant for an NGO emergency help request platform.
Analyze the following description and respond with ONLY a raw JSON object (no markdown, no code blocks).

Description: "${description}"

Respond with exactly this structure:
{
  "helpType": "food" | "medical" | "shelter" | "clothes" | "education" | "other",
  "priority": "low" | "medium" | "high",
  "reason": "one-line explanation"
}`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      temperature: 0.1,
      response_format: { type: "json_object" },
    });

    let text = completion.choices[0]?.message?.content || "{}";

    const parsed = JSON.parse(text);
    res.status(200).json(parsed);
  } catch (error) {
    console.error("AI Analyze Error:", error.message);
    if (error.message.includes("429") || error.message.includes("quota")) {
       return res.status(200).json({
         helpType: "other",
         priority: "medium",
         reason: "AI suggestion unavailable due to high usage."
       });
    }
    res.status(500).json({ message: "AI analysis failed" });
  }
};

/* ================================================================
   FEATURE 2 — Verify image relevance using Gemini Vision
   Accepts: { imageBase64, mimeType, helpType }
   Returns: { valid, reason }
   ================================================================ */
const verifyImage = async (req, res) => {
  try {
    const { imageBase64, mimeType, helpType } = req.body;

    if (!imageBase64 || !helpType) {
      return res.status(400).json({ message: "imageBase64 and helpType required" });
    }

    // fallback to use Gemini for Vision since Groq deprecated their models temporarily
    const { GoogleGenerativeAI } = require("@google/generative-ai");
    const getGenAI = () => new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = getGenAI().getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `You are reviewing an image submitted for an emergency help request of type: "${helpType}".
Is this image appropriate and relevant to a "${helpType}" emergency?
Respond with ONLY a raw JSON object (no markdown, no code blocks):
{
  "valid": true or false,
  "reason": "one-line explanation"
}`;

    // Remove data uri prefix if it exists to pass pure base64 to Gemini
    let base64Data = imageBase64;
    if (imageBase64.startsWith('data:')) {
        base64Data = imageBase64.split(',')[1];
    }

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Data,
          mimeType: mimeType || "image/jpeg",
        },
      },
    ]);

    let text = result.response.text().trim();
    text = text.replace(/```json|```/g, "").trim();

    const parsed = JSON.parse(text);
    res.status(200).json(parsed);
  } catch (error) {
    console.error("AI Verify Error:", error.message);
    if (error.message.includes("429") || error.message.includes("quota")) {
      return res.status(200).json({ valid: true, reason: "AI verification skipped due to high usage." });
    }
    res.status(500).json({ message: "Image verification failed" });
  }
};

/* ================================================================
   FEATURE 3 — AI Chatbot
   Accepts: { message, role }
   Returns: { reply }
   ================================================================ */
const chatWithAI = async (req, res) => {
  try {
    const { message, role } = req.body;

    if (!message) {
      return res.status(400).json({ message: "Message required" });
    }

    const roleContext =
      role === "ngo"
        ? "You are helping an NGO representative who manages help requests, views notifications, and accepts or completes requests."
        : role === "admin"
        ? "You are helping a platform admin who manages users, NGOs, and platform settings."
        : "You are helping a citizen who wants to raise emergency help requests for food, medical, shelter, clothes, or education needs.";

    const prompt = `You are the friendly AI assistant for NGO Connect — a platform connecting citizens in emergency need with nearby NGOs.
${roleContext}

Key features:
- Citizens raise help requests with type, priority, location, and images
- NGOs see nearby requests and accept or complete them
- Admin manages users and settings

Keep responses concise (max 3 sentences), helpful, and warm. Use 1-2 emojis max.

User message: "${message}"`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
    });

    const reply = completion.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response.";

    res.status(200).json({ reply });
  } catch (error) {
    console.error("AI Chat Error:", error.message);
    if (error.message.includes("429") || error.message.includes("quota")) {
      return res.status(200).json({ reply: "I'm currently receiving too many requests. Please try chatting with me again later!" });
    }
    res.status(500).json({ message: "Chat failed" });
  }
};

module.exports = { analyzeRequest, verifyImage, chatWithAI };
