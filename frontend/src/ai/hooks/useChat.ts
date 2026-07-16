// frontend/src/ai/hooks/useChat.ts

import axios from "axios";
import { useState, useCallback, useEffect } from "react";
import { sendMessage, getConversation } from "../api/aiApi";
import type { ChatMessage } from "../types/chat";

export function useChat() {

  const [conversationId, setConversationId] = useState(
    () => localStorage.getItem("conversationId") ?? undefined
  );

  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {

    if (!conversationId) return;

    const id = conversationId;

    let cancelled = false;

    async function load() {

      try {

        const response = await getConversation(id);

        const history: ChatMessage[] = response.history.map((m) => ({
          id: crypto.randomUUID(),
          role: m.role === "model" ? "assistant" : "user",
          text: m.parts[0]?.text ?? "",
        }));

        if (!cancelled) {
          setMessages(history);
        }

      } catch (err) {

        console.error(err);

        // Only clear if conversation truly doesn't exist
        if (
          axios.isAxiosError(err) &&
          err.response?.status === 404
        ) {

          localStorage.removeItem("conversationId");

          if (!cancelled) {
            setConversationId(undefined);
            setMessages([]);
          }

        }

        // For 500 / 429 / network errors:
        // Keep existing messages.
      }

    }

    load();

    return () => {
      cancelled = true;
    };

  }, [conversationId]);

  function clearConversation() {

    localStorage.removeItem("conversationId");

    setConversationId(undefined);

    setMessages([]);

  }

  const send = useCallback(

    async (text: string) => {

      if (!text.trim() || loading) return;

      const userMessage: ChatMessage = {

        id: crypto.randomUUID(),

        role: "user",

        text,

      };

      // Functional update so we don't depend on messages
      setMessages(prev => [...prev, userMessage]);

      setLoading(true);

      try {

        const response = await sendMessage({

          conversationId,

          message: text,

        });

        setConversationId(response.conversationId);

        localStorage.setItem(
          "conversationId",
          response.conversationId
        );

        const aiMessage: ChatMessage = {

          id: crypto.randomUUID(),

          role: "assistant",

          text: response.reply,

        };

        setMessages(prev => [...prev, aiMessage]);

      } catch (err) {

        let message = "Sorry, something went wrong.";

        if (axios.isAxiosError(err)) {
          message =
            err.response?.data?.message ??
            message;
        }

        setMessages(prev => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            text: message,
          },
        ]);

      } finally {

        setLoading(false);

      }

    },

    [
      conversationId,
      loading,
    ]

  );

  return {

    conversationId,

    messages,

    loading,

    send,

    clearConversation,

  };

}