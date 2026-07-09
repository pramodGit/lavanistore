import axios from "axios";
import type {
  ChatRequestMessage,
  ChatResponse,
} from "../types/chat";

export async function sendMessage(
  messages: ChatRequestMessage[]
): Promise<ChatResponse> {

  const { data } = await axios.post(
    "/api/ai/chat",
    {
      messages,
    }
  );

  return data;
}