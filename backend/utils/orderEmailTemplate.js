// utils/orderEmailTemplate.js
export default function orderEmailTemplate(customerName, sale, items, isGreen = false) {

  // 🟢 Debug log
  // console.log("🧾 orderEmailTemplate called with isGreen:", isGreen);
  // console.log("🧩 Sale ID:", sale?.id || sale?.SaleID);
  // console.log("📦 Items count:", items?.length || 0);

  // -----------------------
  // Helper: number formatting
  // -----------------------
  const format = (n) =>
    (Number(n) || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  // -----------------------
  // Build item rows
  // -----------------------
  const itemRows = items
    .map((item, index) => {
      const qty = Number(item.SaleQty) || 0;
      const mrp = Number(item.MRP) || 0;
      const salePrice = Number(item.Sale_Price) || 0;

      // ✅ Corrected logic
      const showPrice = isGreen ? salePrice : mrp;
      const amount = showPrice * qty;

      return `
        <tr>
          <td style="padding:4px;border:1px solid #ccc;text-align:center;">${index + 1}</td>
          <td style="padding:4px;border:1px solid #ccc;">${item.Product_Name || item.PROD_Name || "-"}</td>
          <td style="padding:4px;border:1px solid #ccc;text-align:center;">${qty}</td>
          <td style="padding:4px;border:1px solid #ccc;text-align:right;">${format(showPrice)}</td>
          <td style="padding:4px;border:1px solid #ccc;text-align:right;">${format(amount)}</td>
        </tr>
      `;
    })
    .join("");

  // -----------------------
  // Totals
  // -----------------------
  const grandTotal = items.reduce((sum, i) => {
    const qty = Number(i.SaleQty) || 0;
    const mrp = Number(i.MRP) || 0;
    const salePrice = Number(i.Sale_Price) || 0;
    const showPrice = isGreen ? salePrice : mrp;
    return sum + showPrice * qty;
  }, 0);

  // -----------------------
  // Optional green note
  // -----------------------
  const pricingNote = isGreen
    ? `<p style="color:#2e7d32;font-weight:bold;margin:4px 0;">Green Member Pricing Applied</p>`
    : "";

  // -----------------------
  // HTML Email Body
  // -----------------------
  const html = `
    <div style="font-family:Arial,sans-serif;font-size:14px;color:#333;">
      <p>Hi ${customerName},</p>
      <p>Thank you for your purchase! Here are your order details:</p>
      ${pricingNote}

      <table style="border-collapse:collapse;width:100%;margin-bottom:10px;">
        <thead>
          <tr style="background:#f5f5f5;">
            <th style="padding:4px;border:1px solid #ccc;">S No.</th>
            <th style="padding:4px;border:1px solid #ccc;">Product</th>
            <th style="padding:4px;border:1px solid #ccc;">Qty</th>
            <th style="padding:4px;border:1px solid #ccc;">Sale Price</th>
            <th style="padding:4px;border:1px solid #ccc;">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${itemRows}
          <tr>
            <td colspan="4" style="padding:4px;border:1px solid #ccc;text-align:right;">
              <strong>Grand Total</strong>
            </td>
            <td style="padding:4px;border:1px solid #ccc;text-align:right;">
              <strong>${format(grandTotal)}</strong>
            </td>
          </tr>
        </tbody>
      </table>

      <p>We hope you enjoy your purchase!</p>
      <p>Regards,<br/>Lavani Wellness</p>
    </div>
  `;

  // -----------------------
  // Text fallback
  // -----------------------
  const text = `
Hi ${customerName},

Your order #${sale?.id || sale?.SaleID || ""} has been placed.
${isGreen ? "Green Member Pricing Applied.\n" : ""}
Grand Total: ₹${format(grandTotal)}

Thank you for shopping with Lavani Wellness.
  `;

  return { html, text };
}
