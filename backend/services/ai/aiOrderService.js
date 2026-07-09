// backend/services/ai/aiOrderService.js
import { getOrderData } from "../order/orderDataService.js";

// ✅ Gets order data with ZERO side effects
// No email, no PDF, no SMS triggered
export async function analyseOrder(orderId) {
  const { sale, items, customer, totalAmount, isGreen } = await getOrderData(orderId);

  // Your AI logic here — summarise, recommend, flag anomalies etc.
  const summary = {
    orderId      : sale.SaleID,
    customerName : customer.Customer_Name,
    totalAmount,
    itemCount    : items.length,
    isGreen,
    items        : items.map(i => ({
      name     : i.PROD_Name,
      qty      : i.SaleQty,
      price    : i.Sale_Price,
    })),
  };

  return summary;
}

// Example: RAG service sending order context to LLM
export async function getOrderContext(orderId) {
  const data = await getOrderData(orderId);

  // Format as context string for your RAG/Agentic AI
  return `
    Order #${data.sale.SaleID} placed on ${data.sale.Sale_DateTime}.
    Customer: ${data.customer.Customer_Name}.
    Items: ${data.items.map(i => `${i.PROD_Name} x${i.SaleQty}`).join(", ")}.
    Total: ₹${data.totalAmount.toFixed(2)}.
    Payment: ${data.sale.Payment_Status}.
  `.trim();
}