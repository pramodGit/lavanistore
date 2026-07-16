import AIProvider from "./AIProvider.js";

export default class MockProvider extends AIProvider {

  async generate(contents) {

    const text =
      contents?.[0]?.parts?.[0]?.text?.toLowerCase() ?? "";

    // -----------------------------
    // Reflection Stage
    // -----------------------------
    if (text.includes("you are a response editor")) {

      const aiResponse =
        text.split("ai response:")[1]?.trim() ?? "";

      return {
        text: aiResponse,
      };

    }

    // -----------------------------
    // Normal Chat
    // -----------------------------
    if (text === "show order 24") {

      return {
        text: `Here are the details for order 24:

Customer: Ansh Kumar Sharma
Email: ansh@example.com
Mobile: 9876543210

Items:
• AMUL COMFY MEN GYM VEST L 90 CM
  Quantity: 1
  Price: ₹90

Total Amount: ₹125
Payment Status: Pending
Order Date: July 8, 2026`,
      };

    }

    if (text.includes("amount")) {

      return {
        text: "The total amount for order 24 is ₹125.",
      };

    }

    return {
      text: "This is a mock AI response.",
    };

  }

}