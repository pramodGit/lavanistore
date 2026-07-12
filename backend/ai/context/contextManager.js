import strategies from "./strategies/index.js";

const strategyMap = new Map();

for (const strategy of strategies) {

  if (strategyMap.has(strategy.tool)) {
    throw new Error(`Duplicate context strategy '${strategy.tool}'`);
  }

  strategyMap.set(strategy.tool, strategy.handler);

}

export default class ContextManager {

  update(toolName, toolResult, context = {}) {

    const handler = strategyMap.get(toolName);

    if (!handler) {
      return context;
    }

    return handler(toolResult, context);

  }

}