import { GoogleGenAI } from "@google/genai";
import Constants from "expo-constants";

const API_KEY = Constants.expoConfig?.extra?.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: API_KEY });

// HÀM DÙNG CHUNG
async function callGeminiModel(prompt) {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }],
      },
    ],
    generationConfig: {
      responseMimeType: "application/json",   // 🔥 ĐÚNG CHUẨN SDK MỚI
    },
  });

  const raw = response.outputText();
  try {
    return JSON.parse(raw);
  } catch (err) {
    return { error: true, raw };
  }
}

export async function GenerateTopicsAIModel(prompt) {
  return await callGeminiModel(prompt);
}

export async function GenerateCourseAIModel(prompt) {
  return await callGeminiModel(prompt);
}
