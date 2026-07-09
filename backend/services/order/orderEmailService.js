// backend/services/order/orderEmailService.js
import sendEmail from "../../utils/sendEmail.js";
import orderEmailTemplate from "../../utils/orderEmailTemplate.js";

export async function sendOrderEmail({ customer, mappedSale, items, isGreen }) {
  if (!customer.Customer_Email) {
    console.warn("⚠️ sendOrderEmail skipped — no email on customer");
    return { sent: false, reason: "no_email" };
  }

  const subject = `Your Order #${mappedSale.id} Details`;
  const { html, text } = orderEmailTemplate(
    customer.Customer_Name || "Customer",
    mappedSale,
    items,
    isGreen
  );

  await sendEmail(customer.Customer_Email, subject, { html, text });
  console.log("✅ Email sent to:", customer.Customer_Email);
  return { sent: true };
}