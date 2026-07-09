export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
}

export interface ChatRequestMessage {
  role: "user" | "assistant";
  text: string;
}

export interface ChatResponse {
  success: boolean;
  reply: string;
}