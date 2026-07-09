// backend/services/order/orderSMSService.js
import { sendSMS } from "../../utils/smsAlert.js";

export async function sendOrderSMS({ customer, mappedSale }) {
  if (!customer.Custome_Mobile) {
    console.warn("⚠️ sendOrderSMS skipped — no mobile on customer");
    return { sent: false, reason: "no_mobile" };
  }

  const smsText =
    `Hi ${customer.Customer_Name}, thanks for your purchase! ` +
    `Sale ID: ${mappedSale.id}, Total: ₹${mappedSale.total.toFixed(2)}`;

  await sendSMS(customer.Custome_Mobile, smsText);
  console.log("✅ SMS sent to:", customer.Custome_Mobile);
  return { sent: true };
}