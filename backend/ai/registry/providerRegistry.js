import GeminiProvider from "../providers/GeminiProvider.js";
import OpenAIProvider from "../providers/OpenAIProvider.js";

const providers = new Map();

providers.set("gemini", new GeminiProvider());
providers.set("openai", new OpenAIProvider());

export function getProvider(name) {

  const provider = providers.get(name.toLowerCase());

  if (!provider) {
    throw new Error(`AI Provider '${name}' not registered.`);
  }

  return provider;

}