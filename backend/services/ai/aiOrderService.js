// backend/services/ai/aiOrderService.js
import { getOrderData } from "../order/orderDataService.js";

// Gets order data
export async function prepareOrderForAI(orderId) {
  const {
    sale,
    items,
    customer,
    totalAmount,
    isGreen,
  } = await getOrderData(orderId);

  return {
    exists: true,

    order: {
      id: sale.SaleID,
      date: sale.Sale_DateTime,
      paymentStatus: sale.Payment_Status,
      totalAmount,
      isGreen,
    },

    customer: {
      name: customer.Customer_Name,
      email: customer.Customer_Email,
      mobile: customer.Custome_Mobile,
    },

    items: items.map((i) => ({
      name: i.Product_name ?? i.PROD_Name,
      qty: i.SaleQty,
      price: i.Sale_Price,
    })),
  };
}

// // Example: RAG service sending order context to LLM
// export async function getOrderContext(orderId) {
//   const data = await getOrderData(orderId);

//   // Format as context string for your RAG/Agentic AI
//   return `
//     Order #${data.sale.SaleID} placed on ${data.sale.Sale_DateTime}.
//     Customer: ${data.customer.Customer_Name}.
//     Items: ${data.items.map(i => `${i.PROD_Name} x${i.SaleQty}`).join(", ")}.
//     Total: ₹${data.totalAmount.toFixed(2)}.
//     Payment: ${data.sale.Payment_Status}.
//   `.trim();
// }