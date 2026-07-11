import provider from "./providers/index.js";

import {
  getConversation,
  saveConversation,
} from "./memory/conversationStore.js";

export async function chat(conversationId, message) {

  // Native Gemini history
  const history = await getConversation(conversationId);

  // Add latest user message
  history.push({
    role: "user",
    parts: [
      {
        text: message,
      },
    ],
  });

  // Provider returns both reply and updated history
  const result = await provider.chat(history);

  await saveConversation(conversationId, result.history);

  return {
    reply: result.reply,
  };
}