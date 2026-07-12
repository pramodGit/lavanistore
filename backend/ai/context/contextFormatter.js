// backend/ai/context/contextFormatter.js

export default class ContextFormatter {

  format(context = {}) {

    const lines = [];

    if (context.currentOrder) {
      lines.push(`Current Order ID: ${context.currentOrder}`);
    }

    if (context.currentCustomer?.name) {
      lines.push(`Current Customer: ${context.currentCustomer.name}`);
    }

    if (context.currentProduct?.name) {
      lines.push(`Current Product: ${context.currentProduct.name}`);
    }

    if (context.currentIntent) {
      lines.push(`Current Intent: ${context.currentIntent}`);
    }

    if (!lines.length) {
      return [];
    }

    return [
      {
        role: "user",
        parts: [
          {
            text:
              "Current Session Context:\n" +
              lines.join("\n") +
              "\nUse this context when answering follow-up questions.",
          },
        ],
      },
    ];

  }

}