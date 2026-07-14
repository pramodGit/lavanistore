// frontend/src/ai/types/chat.ts

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
}

export interface ChatRequest {
  conversationId?: string;
  message: string;
}

export interface ChatResponse {
  success: boolean;
  conversationId: string;
  reply: string;
}