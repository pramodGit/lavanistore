// backend/routes/aiRoutes.js

import express from "express";

import {
  chatController,
  getConversationController,
} from "../ai/chatController.js";

const router = express.Router();

router.post("/chat", chatController);

router.get("/conversation/:conversationId", getConversationController);

export default router;