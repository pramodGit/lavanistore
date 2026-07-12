// backend/ai/AIService.js

import ContextFormatter from "./context/contextFormatter.js";
import ProviderExecutor from "./executors/providerExecutor.js";

const contextFormatter = new ContextFormatter();

export default class AIService {

  constructor() {
    this.providerExecutor = new ProviderExecutor();
  }

  async chat(history, context) {

    const messages = [
      ...contextFormatter.format(context),
      ...history,
    ];

    return this.providerExecutor.chat(
      messages,
      context
    );

  }

}