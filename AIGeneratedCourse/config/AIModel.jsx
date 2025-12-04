import { GoogleGenerativeAI } from "@google/generative-ai";


const apiKey = process.env.EXPO_PUBLIC_GOOGLE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

// Hàm dùng chung
async function callGeminiModel(prompt) {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
  });

  const result = await model.generateContent({
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }],
      },
    ],
    generationConfig: {
      responseMimeType: "application/json",
    },
  });

  const raw = result.response.text(); // <-- phải gọi .text()

  try {
    return JSON.parse(raw);
  } catch (err) {
    const jsonMatch = raw.match(/\{[\s\S]*\}/s);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch {}
    }
    return { error: true, raw };
  }
}

export async function GenerateTopicsAIModel(prompt) {
  return await callGeminiModel(prompt);
}

export async function GenerateCourseAIModel(prompt) {
  return await callGeminiModel(prompt);
}
