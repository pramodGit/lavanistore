// backend/ai/chatController.js

import asyncWrapper from "../middlewares/asyncWrapper.js";
import { chat } from "./chatService.js";

export const chatController = asyncWrapper(async (req, res) => {

    const { messages } = req.body;

    const reply = await chat(messages);

    res.json(reply);

});