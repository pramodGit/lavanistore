import Planner from "../planner/planner.js";
import ToolExecutor from "../executors/ToolExecutor.js";

export default class AgentExecutor {

  constructor(provider) {
    this.provider = provider;
    this.planner = new Planner();
    this.toolExecutor = new ToolExecutor();
  }

  async execute(history, context) {

    const contents = [...history];

    while (true) {

      const response = await this.provider.generate(contents);

      const plan = this.planner.plan(response);

      if (plan.type === "answer") {

        contents.push({
          role: "model",
          parts: [
            {
              text: plan.message,
            },
          ],
        });

        return {
          reply: plan.message,
          history: contents,
          context,
        };

      }

      const tool = await this.toolExecutor.execute(
        {
          name: plan.tool,
          args: plan.args,
        },
        context
      );

      contents.push({
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

      contents.push({
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

    }

  }

}