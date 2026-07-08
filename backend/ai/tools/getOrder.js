// backend/ai/tools/getOrder.js

import { getOrder } from "../../services/orderService.js";

export default async function ({ orderId }) {
  try {
    const result = await getOrder(orderId);

    return {
      found: true,
      saleId: result.sale.SaleID,
      customer: result.customer.Customer_Name,
      paymentStatus: result.sale.Payment_Status,
      total: result.sale.TotalPayable,
      items: result.items.map(item => ({
        name: item.PROD_Name,
        qty: item.SaleQty,
      })),
    };
  } catch (err) {
    if (err.name === "NotFoundError") {
      return {
        found: false,
        message: `Order '${orderId}' was not found.`,
      };
    }

    throw err; // Unexpected errors should still propagate
  }
}