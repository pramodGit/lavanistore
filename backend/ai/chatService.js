// backend/ai/chatService.js

import { ai } from "./providers/gemini.js";

export async function chat(message) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: message,
  });

  return {
    success: true,
    reply: response.text,
  };
}