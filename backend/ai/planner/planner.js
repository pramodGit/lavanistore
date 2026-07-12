// backend/ai/planner/planner.js

import Plan from "./plan.js";

export default class Planner {

  plan(response) {

    const candidate = response.candidates?.[0];
    const part = candidate?.content?.parts?.[0];

    if (!part?.functionCall) {
      return Plan.answer(response.text);
    }

    return Plan.tool(
      part.functionCall.name,
      part.functionCall.args
    );

  }

}