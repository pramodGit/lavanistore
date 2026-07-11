import asyncWrapper from "../middlewares/asyncWrapper.js";
import { chat } from "./chatService.js";

import {
  createConversation,
  hasConversation,
} from "./memory/conversationStore.js";

export const chatController = asyncWrapper(async (req, res) => {

  let { conversationId, message } = req.body;

  // Validation
  if (!message?.trim()) {
    return res.status(400).json({
      success: false,
      message: "Message is required.",
    });
  }

  // New conversation
  if (!conversationId || !(await hasConversation(conversationId))) {
    conversationId = await createConversation();
  }

  const result = await chat(conversationId, message);

  res.json({
    success: true,
    conversationId,
    reply: result.reply,
  });

});