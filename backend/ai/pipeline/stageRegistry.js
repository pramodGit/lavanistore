// backend/ai/pipeline/stageRegistry.js

import settings from "../settings.js";

import GenerateStage from "./stages/generateStage.js";
import PlannerStage from "./stages/plannerStage.js";
import ToolStage from "./stages/toolStage.js";
import ReflectionStage from "./stages/reflectionStage.js";
import FinishStage from "./stages/finishStage.js";

const STAGES = {

  generate: (provider) =>
    new GenerateStage(provider),

  planner: () =>
    new PlannerStage(),

  tool: () =>
    new ToolStage(),

  reflection: (provider) =>
    new ReflectionStage(provider),

  finish: () =>
    new FinishStage(),

};

export default class StageRegistry {

  static create(provider) {

    return settings.pipeline
      .map((name) => {

        const factory = STAGES[name];

        if (!factory) {
          throw new Error(
            `Unknown pipeline stage: ${name}`
          );
        }

        return factory(provider);

      });

  }

}