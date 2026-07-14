// backend/ai/pipeline/pipelineStage.js

export default class PipelineStage {

  async execute(state) {

    return {
      state,
      next: null,
    };

  }

}