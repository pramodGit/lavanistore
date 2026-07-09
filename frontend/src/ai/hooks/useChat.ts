import { useState } from "react";
import { sendMessage } from "../api/aiApi";
import type { ChatMessage } from "../types/chat";

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);

  async function send(text: string) {
    if (!text.trim() || loading) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      text,
    };

    // Build updated conversation
    const updatedMessages = [...messages, userMessage];

    // Show user message immediately
    setMessages(updatedMessages);
    setLoading(true);

    try {
      // Send conversation history (without id)
      const response = await sendMessage(
        updatedMessages.map(({ role, text }) => ({
          role,
          text,
        }))
      );

      const aiMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        text: response.reply,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error(err);

      const errorMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        text: "Sorry, something went wrong.",
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  }

  return {
    messages,
    loading,
    send,
  };
}