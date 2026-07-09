// backend/services/order/orderInvoiceService.js
import { generateInvoicePDF } from "../../utils/generateInvoicePDF.js";

export async function generateOrderInvoice({ customer, mappedSale, items, isGreen }) {
  // Use existing PDF name from DB or build fallback
  const pdfName = customer.Sale_PDF || `INV_${mappedSale.id}_fallback.pdf`;

  await generateInvoicePDF(
    customer.Customer_Name || "Customer",
    mappedSale,
    items,
    isGreen,
    pdfName
  );

  console.log("📄 Invoice generated:", pdfName);
  return { pdfName };
}