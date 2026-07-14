import PipelineExecutor from "./pipelineExecutor.js";
import PipelineState from "./pipelineState.js";
import StageRegistry from "./stageRegistry.js";

export default class AgentPipeline {

  constructor(provider) {

    this.provider = provider;

    this.pipeline = new PipelineExecutor(
      StageRegistry.create(provider)
    );

  }

  async execute(history, context) {

    const state = new PipelineState({
      history,
      context,
      provider: this.provider,
    });

    const result = await this.pipeline.execute(state);

    return {
      reply: result.reply,
      history: result.history,
      context: result.context,
    };

  }

}