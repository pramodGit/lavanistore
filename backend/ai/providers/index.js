import GeminiProvider from "./GeminiProvider.js";
import OpenAIProvider from "./OpenAIProvider.js";

const providerName = (process.env.AI_PROVIDER || "gemini").toLowerCase();

let provider;

switch (providerName) {

  case "openai":
    provider = new OpenAIProvider();
    break;

  case "gemini":
  default:
    provider = new GeminiProvider();
    break;

}

export default provider;