require('dotenv').config();
const Groq = require("groq-sdk");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function testGroq() {
  console.log("=== Testing Groq Analysis ===");
  try {
    const prompt = `You are an AI assistant for an NGO emergency help request platform.
Analyze the following description and respond with ONLY a raw JSON object (no markdown, no code blocks).

Description: "We need 50 blankets and warm jackets for people sleeping outside the train station."

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
    
    console.log("Analysis Result:");
    console.log(completion.choices[0]?.message?.content);
  } catch (err) {
    console.error("Analysis Error:", err.message);
  }

  console.log("\n=== Testing Groq Chat ===");
  try {
    const prompt = `You are the friendly AI assistant for NGO Connect — a platform connecting citizens in emergency need with nearby NGOs.
You are helping a citizen who wants to raise emergency help requests for food, medical, shelter, clothes, or education needs.

Keep responses concise (max 3 sentences), helpful, and warm. Use 1-2 emojis max.

User message: "How do I request food for my neighborhood?"`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
    });
    console.log("Chat Result:");
    console.log(completion.choices[0]?.message?.content);
  } catch (err) {
    console.error("Chat Error:", err.message);
  }
}

testGroq();
