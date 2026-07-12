// backend/ai/agents/agentExecutor.js

import Planner from "../planner/planner.js";
import ToolExecutor from "../executors/toolExecutor.js";

export default class AgentExecutor {

  constructor(provider) {

    this.provider = provider;
    this.planner = new Planner();
    this.toolExecutor = new ToolExecutor();

  }

  async execute(history, context) {

    // Temporary migration.
    // GeminiProvider still owns the agent loop.
    return this.provider.chat(
      history,
      context
    );

  }

}