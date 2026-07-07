// backend/ai/toolRegistry.js

import getOrder from "./tools/getOrder.js";

export const tools = [
  {
    name: "getOrder",
    description:
      "Get complete details of a customer's order using the Sale ID.",
    parameters: {
      type: "object",
      properties: {
        orderId: {
          type: "string",
          description: "Sale ID of the order",
        },
      },
      required: ["orderId"],
    },
    execute: getOrder,
  },
];