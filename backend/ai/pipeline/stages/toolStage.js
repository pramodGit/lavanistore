// backend/ai/pipeline/stages/toolStage.js

import PipelineStage from "../pipelineStage.js";
import ToolExecutor from "../../executors/toolExecutor.js";

export default class ToolStage extends PipelineStage {

  constructor() {

    super();

    this.name = "tool";

    this.toolExecutor = new ToolExecutor();

  }

  async execute(state) {

    const tool = await this.toolExecutor.execute(
      {
        name: state.plan.tool,
        args: state.plan.args,
      },
      state.context
    );

    state.tool = tool;

    state.history.push({
      role: "model",
      parts: [
        {
          functionCall: {
            name: tool.name,
            args: tool.args,
          },
        },
      ],
    });

    state.history.push({
      role: "user",
      parts: [
        {
          functionResponse: {
            name: tool.name,
            response: tool.result,
          },
        },
      ],
    });

    return {

      state,

      next: "generate",

    };

  }

}