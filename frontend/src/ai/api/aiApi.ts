// frontend/src/ai/api/aiApi.ts

import axios from "axios";

import type {
  ChatRequest,
  ChatResponse,
  ConversationResponse,
} from "../types/chat";

export async function sendMessage(
  request: ChatRequest
): Promise<ChatResponse> {

  const { data } = await axios.post("/api/ai/chat", request);

  return data;

}

export async function getConversation(
    conversationId: string
): Promise<ConversationResponse> {
    const { data } = await axios.get(
        `/api/ai/conversation/${conversationId}`
    );

    return data;
}