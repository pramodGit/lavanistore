// backend/ai/pipeline/stages/reflectionStage.js

import PipelineStage from "../pipelineStage.js";
import ReflectionExecutor from "../../reflection/reflectionExecutor.js";

import { debug } from "../../../utils/logger.js";

export default class ReflectionStage extends PipelineStage {

  constructor(provider) {

    super();

    this.name = "reflection";

    this.reflectionExecutor =
      new ReflectionExecutor(provider);

  }

  async execute(state) {

    const message =
      state.plan.message ??
      state.response.text ??
      "";

    state.reply =
        await this.reflectionExecutor.execute(
            message
        );

    debug("===== REFLECTION MESSAGE =====");
    console.log(state.plan.message);

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