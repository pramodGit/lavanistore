// backend/ai/pipeline/stages/generateStage.js

import PipelineStage from "../pipelineStage.js";
import RetryExecutor from "../../retry/retryExecutor.js";
import settings from "../../settings.js";

export default class GenerateStage extends PipelineStage {

  constructor(provider) {

    super();

    this.name = "generate";

    this.provider = provider;
    this.retryExecutor = new RetryExecutor();

  }

  async execute(state) {

    if (!settings.retry.enabled) {

      state.response =
        await this.provider.generate(
          state.history
        );

    } else {

      const response =
        await this.retryExecutor.execute(
          () => this.provider.generate(state.history),
          settings.retry.retries
        );

      state.response = response.result;
      state.retry = response.retry;

    }

    return {

      state,

      next: "planner",

    };

  }

}