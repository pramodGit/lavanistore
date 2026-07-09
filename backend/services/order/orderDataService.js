// backend/services/order/orderDataService.js
import { pool as userPool, productPool } from "../../db.js";
import { NotFoundError, DatabaseError } from "../../errors/AppError.js";
import {
  GET_SALE_BY_ID,
  GET_CUSTOMER_BY_SALE_ID,
  GET_ORDER_ITEMS_BY_SALE_ID,
} from "../../queries/productOrderQueries.js";
import {
  GET_USER_LOGIN_BY_ID,
  GET_USER_REGISTRATION_BY_ID,
} from "../../queries/userQueries.js";

function releaseAll(...connections) {
  for (const conn of connections) {
    try { conn?.release(); } catch (_) {}
  }
}

// ─────────────────────────────────────────
// Pure data fetch — no email, no PDF, no SMS
// Safe to call from AI service, cron jobs,
// webhooks, or any other service
// ─────────────────────────────────────────
export async function getOrderData(orderId) {
  let connection, userConn;

  try {
    connection = await productPool.getConnection();
    userConn   = await userPool.getConnection();

    // ── Fetch sale ──
    const [saleRows] = await connection.query(GET_SALE_BY_ID, [orderId]);
    if (!saleRows?.length) throw new NotFoundError('Order');
    const sale = saleRows[0];

    // ── Fetch items ──
    const [items] = await connection.query(
      GET_ORDER_ITEMS_BY_SALE_ID, [sale.SaleID]
    );

    // ── Fetch customer ──
    const [customerRows] = await connection.query(
      GET_CUSTOMER_BY_SALE_ID, [sale.SaleID]
    );
    let customer = customerRows[0] || {};

    // ── Fetch login + profile ──
    const [loginRows] = await userConn.query(
      GET_USER_LOGIN_BY_ID, [sale.SoldBy]
    );
    const login = loginRows?.[0] || {};

    let profile = {};
    if (login?.RegistrationID) {
      const [profileRows] = await userConn.query(
        GET_USER_REGISTRATION_BY_ID, [login.RegistrationID]
      );
      profile = profileRows?.[0] || {};
    }

    // ── Fill missing customer fields from profile ──
    if (!customer.Customer_Email)
      customer.Customer_Email = profile.EmailID || "";
    if (!customer.Custome_Mobile)
      customer.Custome_Mobile = profile["Mobile No"] || "";
    if (!customer.Customer_Name || customer.Customer_Name === "Customer") {
      customer.Customer_Name = [
        profile["First Name"],
        profile["Middle Name"],
        profile["Last Name"],
      ].filter(Boolean).join(" ") || "Customer";
    }

    // ── isGreen from login ──
    const isGreen = login?.isGreen === 1;

    // ── Compute total ──
    const totalAmount = items.reduce((sum, i) => {
      const qty        = Number(i.SaleQty)    || 0;
      const mrp        = Number(i.MRP)         || 0;
      const salePrice  = Number(i.Sale_Price)  || 0;
      const gstPercent = Number(i.GST_Percent) || 0;
      const basePrice  = isGreen ? salePrice : mrp;
      const gstAmount  = (basePrice * qty * gstPercent) / 100;
      return sum + basePrice * qty + (isGreen ? 0 : gstAmount);
    }, 0);

    // ── Return clean data object — nothing else ──
    return {
      sale,
      items,
      customer,
      isGreen,
      totalAmount,
      mappedSale: {
        id    : sale.SaleID,
        date  : sale.Sale_DateTime,
        total : totalAmount,
      },
    };

  } catch (err) {
    if (err.isOperational) throw err;
    throw new DatabaseError(`getOrderData failed: ${err.message}`);
  } finally {
    releaseAll(connection, userConn);
  }
}