// backend/ai/providers/AIProvider.js

export default class AIProvider {

  async generate(contents) {
    throw new Error("generate() must be implemented by the provider.");
  }

}