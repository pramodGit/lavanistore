import getOrder from "../tools/getOrder.js";

export const toolRegistry = new Map();

[
  getOrder,
].forEach((tool) => {

  toolRegistry.set(tool.name, tool);

});