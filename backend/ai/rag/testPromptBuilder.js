import PromptBuilder from "./promptBuilder.js";

const builder = new PromptBuilder();

const prompt = builder.build(

  "How do I return a product?",

  [

    {

      source: "returns.md",

      text: "Customers can return products within 7 days."

    },

    {

      source: "shipping.md",

      text: "Orders are dispatched within 24 hours."

    }

  ]

);

console.log(prompt);