// backend/ai/tools/getOrder.js

import { prepareOrderForAI } from "../../services/ai/aiOrderService.js";

export default async function ({ orderId }) {
  try {
    return await prepareOrderForAI(orderId);
  } catch (err) {
    if (err.name === "NotFoundError") {
      return {
        found: false,
        message: `Order '${orderId}' was not found.`,
      };
    }

    throw err; // Unexpected errors should still propagate
  }
}