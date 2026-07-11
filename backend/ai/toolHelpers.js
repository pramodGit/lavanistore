import { toolRegistry } from "./registry/toolRegistry.js";

export function getGeminiTools() {
  return [
    {
      functionDeclarations: [...toolRegistry.entries()].map(([name, tool]) => ({
        name,
        description: tool.description,
        parameters: tool.parameters
      }))
    }
  ];
}

export function getTool(name) {
  return toolRegistry.get(name);
}