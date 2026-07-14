// backend/ai/pipeline/stages/finishStage.js

import PipelineStage from "../pipelineStage.js";

export default class FinishStage extends PipelineStage {

  constructor() {

    super();

    this.name = "finish";

  }

  async execute(state) {

    state.done = true;

    return {

      state,

      next: null,

    };

  }

}