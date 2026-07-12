export default function getOrderContext(toolResult, context) {

  if (!(toolResult?.exists || toolResult?.found)) {
    return context;
  }

  context.currentOrder = toolResult.order?.id ?? null;
  context.currentCustomer = toolResult.customer ?? null;
  context.currentProduct = null;
  context.currentIntent = "order";

  return context;

}