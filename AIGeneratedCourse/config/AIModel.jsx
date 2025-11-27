import { GoogleGenAI } from "@google/genai";
import Constants from "expo-constants";

const API_KEY = Constants.expoConfig?.extra?.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: API_KEY });

/**
 * Hàm DÙNG CHUNG để gọi đến Gemini
 */
async function callGeminiModel(prompt) {
  const response = await ai.models.generateContent({
    responseMimeType: "application/json",
    model: "gemini-2.0-flash",
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }],
      },
    ],
  });

  const rawText =
    response.outputText ??
    response?.candidates?.[0]?.content?.parts?.[0]?.text ??
    response?.candidates?.[0]?.content?.parts?.[0]?.rawText ??
    "";

  try {
    return JSON.parse(rawText);
  } catch (err) {
    return {
      error: true,
      rawText,
    };
  }
}


/**
 * HÀM TẠO TOPIC
 */
export async function GenerateTopicsAIModel(prompt) {
  try {
    return await callGeminiModel(prompt);
  } catch (err) {
    console.error("❌ Lỗi GenerateTopicsAIModel:", err);
    throw err;
  }
}

/**
 * HÀM TẠO COURSE
 */
export async function GenerateCourseAIModel(prompt) {
  try {
    const result = await callGeminiModel(prompt); // 🔥 GỌI GEMINI
    return result;
  } catch (err) {
    console.error("❌ Lỗi GenerateCourseAIModel:", err);
    throw err;
  }
}

