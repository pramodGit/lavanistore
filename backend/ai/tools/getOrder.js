import { prepareOrderForAI } from "../../services/ai/aiOrderService.js";

async function execute({ orderId }, context) {

  try {

    const result = await prepareOrderForAI(orderId);

    if (result.exists || result.found) {

      context.currentOrder = Number(orderId);

      context.currentIntent = "order";

      context.currentCustomer = result.customer?.name ?? null;

    }

    return result;

  } catch (err) {

    if (err.name === "NotFoundError") {

      return {
        found: false,
        message: `Order '${orderId}' was not found.`,
      };

    }

    throw err;

  }

}

export default {

  name: "getOrder",

  description:
    "Retrieve complete order details using an order ID. Use this tool whenever the user asks about an order, customer, payment, amount, status, items, or follow-up questions referring to a previously discussed order.",

  parameters: {
    type: "object",
    properties: {
      orderId: {
        type: "string",
        description: "The order (Sale) ID",
      },
    },
    required: ["orderId"],
  },

  execute,

};