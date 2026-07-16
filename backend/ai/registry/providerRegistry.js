import GeminiProvider from "../providers/GeminiProvider.js";
import OpenAIProvider from "../providers/OpenAIProvider.js";
import MockProvider from "../providers/MockProvider.js";

const providers = new Map();

providers.set("gemini", new GeminiProvider());
providers.set("openai", new OpenAIProvider());
providers.set("mock", new MockProvider());

export function getProvider(name) {

  const provider = providers.get(name.toLowerCase());

  if (!provider) {
    throw new Error(`AI Provider '${name}' not registered.`);
  }

  return provider;

}