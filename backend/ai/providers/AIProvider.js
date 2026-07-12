// backend/ai/providers/AIProvider.js

export default class AIProvider {

  async chat() {
    throw new Error("chat() must be implemented by the provider.");
  }

}