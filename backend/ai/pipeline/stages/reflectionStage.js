// backend/ai/pipeline/stages/reflectionStage.js

import PipelineStage from "../pipelineStage.js";
import ReflectionExecutor from "../../reflection/reflectionExecutor.js";

export default class ReflectionStage extends PipelineStage {

  constructor(provider) {

    super();

    this.name = "reflection";

    this.reflectionExecutor =
      new ReflectionExecutor(provider);

  }

  async execute(state) {

    state.reply =
      await this.reflectionExecutor.execute(
        state.plan.message
      );

    state.history.push({
      role: "model",
      parts: [
        {
          text: state.reply,
        },
      ],
    });

    return {

      state,

      next: "finish",

    };

  }

}