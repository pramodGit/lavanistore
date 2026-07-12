// backend/ai/planner/plan.js

export default class Plan {

  constructor({
    type,
    tool = null,
    args = null,
    message = null,
  }) {

    this.type = type;
    this.tool = tool;
    this.args = args;
    this.message = message;

  }

  static answer(message) {

    return new Plan({
      type: "answer",
      message,
    });

  }

  static tool(name, args) {

    return new Plan({
      type: "tool",
      tool: name,
      args,
    });

  }

}