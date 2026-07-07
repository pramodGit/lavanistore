import express from "express";
import { chatController } from "../ai/chatController.js";

const router = express.Router();

router.post("/chat", chatController);

export default router;