// backend/ai/executors/providerExecutor.js

import settings from "../settings.js";
import { getProvider } from "../registry/providerRegistry.js";
import AgentExecutor from "../agents/agentExecutor.js";

export default class ProviderExecutor {

  async chat(history, context) {

    const provider = getProvider(settings.provider);

    const agent = new AgentExecutor(provider);

    return agent.execute(
      history,
      context
    );

  }

}