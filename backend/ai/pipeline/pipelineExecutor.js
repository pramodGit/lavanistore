// backend/ai/pipeline/pipelineExecutor.js

export default class PipelineExecutor {

  constructor(stages = []) {

    this.stages = {};

    for (const stage of stages) {
      this.stages[stage.name] = stage;
    }

  }

  async execute(state) {

    let current = "generate";

    while (current) {

      const stage = this.stages[current];

      if (!stage) {
        throw new Error(`Unknown stage: ${current}`);
      }

      const result = await stage.execute(state);

      state = result.state;

      current = result.next;

    }

    return state;

  }

}