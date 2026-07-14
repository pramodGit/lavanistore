// backend/ai/agents/agentExecutor.js

import AgentPipeline from "../pipeline/agentPipeline.js";

export default class AgentExecutor {

  constructor(provider) {
    this.pipeline = new AgentPipeline(provider);
  }

  async execute(history, context) {

    return this.pipeline.execute(
      history,
      context
    );

  }

}