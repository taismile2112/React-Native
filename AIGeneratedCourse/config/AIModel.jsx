import { GoogleGenAI } from "@google/genai";
import Constants from "expo-constants";

// Khởi tạo GoogleGenAI
const API_KEY = Constants.expoConfig?.extra?.GEMINI_API_KEY;
// Lưu ý: api key phải được cung cấp
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
      // Quan trọng: Yêu cầu mô hình trả về output là chuỗi JSON
      responseMimeType: "application/json", 
    },
  });

  // ✅ Sửa: Sử dụng .text để lấy output (chuỗi JSON) từ response object
  const raw = response.text; 

  try {
    // 1. Thử phân tích cú pháp JSON thuần túy
    return JSON.parse(raw);
  } catch (err) {
    // 2. Nếu thất bại (có thể do lỗi Unexpected character: I), thử trích xuất JSON
    console.warn("Dữ liệu RAW chứa ký tự không mong muốn hoặc không phải JSON thuần túy. Đang cố gắng trích xuất JSON.");
    
    // Sử dụng Regex để tìm chuỗi JSON (bắt đầu bằng { và kết thúc bằng } cho đối tượng lớn)
    // Dùng cờ /s để cho phép khớp đa dòng (dotAll)
    const jsonMatch = raw.match(/\{[\s\S]*\}/s); 

    if (jsonMatch && jsonMatch[0]) {
      const cleanedRaw = jsonMatch[0];
      try {
        console.log("Đã trích xuất và phân tích cú pháp JSON thành công.");
        return JSON.parse(cleanedRaw);
      } catch (cleanErr) {
        // JSON được trích xuất vẫn không hợp lệ
        console.error("❌ Lỗi khi phân tích cú pháp JSON trong AIModel (sau khi làm sạch):", cleanErr, "Cleaned RAW:", cleanedRaw);
        return { error: true, raw, message: "Invalid JSON format even after cleaning." };
      }
    }
    
    // 3. Nếu không tìm thấy JSON hoặc lỗi khác, trả về lỗi ban đầu
    console.error("❌ Lỗi khi phân tích cú pháp JSON trong AIModel (ban đầu):", err, "RAW:", raw);
    return { error: true, raw, message: "Raw output is not JSON and could not be cleaned." };
  }
}

export async function GenerateTopicsAIModel(prompt) {
  return await callGeminiModel(prompt);
}

export async function GenerateCourseAIModel(prompt) {
  return await callGeminiModel(prompt);
}