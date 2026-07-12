import AIService from "./AIService.js";

import {
  getConversation,
  saveConversation,
} from "./memory/conversationStore.js";

import {
  getSessionContext,
  saveSessionContext,
} from "./context/sessionContext.js";

export async function chat(conversationId, message) {

  // Load conversation history
  const history = await getConversation(conversationId);

  // Load structured session context
  const context = await getSessionContext(conversationId);

  // Add latest user message
  history.push({
    role: "user",
    parts: [
      {
        text: message,
      },
    ],
  });

  // AI call
  const aiService = new AIService();

  const result = await aiService.chat(history, context);

  // Save updated history
  await saveConversation(conversationId, result.history);

  // Save updated context (provider may update it)
  await saveSessionContext(
    conversationId,
    result.context || context
  );

  return {
    reply: result.reply,
  };

}