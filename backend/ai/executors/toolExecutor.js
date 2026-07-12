import { getTool } from "../toolHelpers.js";
import ContextManager from "../context/contextManager.js";
import { AppError } from "../../errors/AppError.js";

const contextManager = new ContextManager();

export default class ToolExecutor {

  async execute(functionCall, context) {

    const { name, args } = functionCall;

    console.log("🔧 Tool Requested:", name);
    console.log("📥 Arguments:", args);

    const tool = getTool(name);

    if (!tool) {
      throw new AppError(`Tool '${name}' not found.`, 500);
    }

    const result = await tool.execute(
      args,
      context
    );

    console.log("📤 Tool Result:", result);

    contextManager.update(name, result, context);

    return {
      name,
      args,
      result,
      context,
    };

  }

}