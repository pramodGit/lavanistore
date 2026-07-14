// backend/ai/chatController.js

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

export const getConversationController = asyncWrapper(async (req, res) => {

    const { conversationId } = req.params;

    if (!(await hasConversation(conversationId))) {

      return res.status(404).json({
        success: false,
        message: "Conversation not found.",
      });

    }

    const conversation =
      await loadConversation(conversationId);

    res.json({
      success: true,
      conversation,
    });

  });