// backend/ai/toolRegistry.js

import getOrder from "../tools/getOrder.js";

export const toolRegistry = new Map();

toolRegistry.set("getOrder", {
  description: "Get order details by Sale ID.",

  parameters: {
    type: "object",
    properties: {
      orderId: {
        type: "string",
        description: "Sale ID"
      }
    },
    required: ["orderId"]
  },

  execute: getOrder
});