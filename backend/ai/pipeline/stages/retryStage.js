// backend/ai/pipeline/stages/retryStage.js

import PipelineStage from "../pipelineStage.js";

export default class RetryStage extends PipelineStage {

  async execute(state) {

    return state;

  }

}