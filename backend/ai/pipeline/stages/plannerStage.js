// backend/ai/pipeline/stages/plannerStage.js

import PipelineStage from "../pipelineStage.js";
import Planner from "../../planner/planner.js";

export default class PlannerStage extends PipelineStage {

  constructor() {

    super();

    this.name = "planner";

    this.planner = new Planner();

  }

  async execute(state) {

    // console.dir(state.response, { depth: null });

    state.plan = this.planner.plan(
      state.response
    );

    console.log("===== PLAN =====");
    console.dir(state.plan, { depth: null });

    return {

      state,

      next:
        state.plan.type === "tool"
          ? "tool"
          : "reflection",

    };

  }

}