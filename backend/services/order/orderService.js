// backend/services/order/orderService.js
import { pool as userPool, productPool } from "../../db.js";
import { getOrderData }          from "./orderDataService.js";
import { sendOrderEmail }        from "./orderEmailService.js";
import { generateOrderInvoice }  from "./orderInvoiceService.js";
import { sendOrderSMS }          from "./orderSMSService.js";
import {
  ValidationError,
  DatabaseError,
} from "../../errors/AppError.js";
import {
  INSERT_INVOICE_ITEM,
  INSERT_INVOICE_SUMMARY,
} from "../../queries/invoiceQueries.js";
import { GET_USER_LOGIN_BY_ID } from "../../queries/userQueries.js";

// ─────────────────────────────────────────
// Helper — safe connection release
// ─────────────────────────────────────────
function releaseAll(...connections) {
  for (const conn of connections) {
    try { conn?.release(); } catch (_) {}
  }
}

// ─────────────────────────────────────────
// PLACE ORDER
// DB only — no email, no PDF, no SMS
// Safe to call from AI service, POS, API
// ─────────────────────────────────────────
export async function placeOrder(body) {
  const {
    soldBy, shopCode, userId,
    items, customer, shippingInfo,
  } = body;

  const orderItems = items || [];

  // ── Validate ──
  if (!orderItems.length) {
    throw new ValidationError("Order must have at least one item.");
  }

  let connection, userConn;

  try {
    // ✅ Inside try — so finally always releases both
    connection = await productPool.getConnection();
    userConn   = await userPool.getConnection();

    await connection.beginTransaction();

    // ── Build customer object ──
    let orderCustomer = customer ? { ...customer } : {};
    orderCustomer = {
      ...orderCustomer,
      Customer_Name   : orderCustomer.Customer_Name    || shippingInfo?.name    || "Customer",
      Customer_Address: orderCustomer.Customer_Address || shippingInfo?.address || "",
      Custome_Mobile  : orderCustomer.Custome_Mobile   || shippingInfo?.mobile  || "",
      Customer_Email  : orderCustomer.Customer_Email   || shippingInfo?.email   || "",
      UpdatedBy       : orderCustomer.UpdatedBy        || userId || soldBy,
    };

    const orderSoldBy   = soldBy || userId;
    const orderShopCode = shopCode || shippingInfo?.shopCode || "ONLINE";
    const paymentStatus = orderCustomer.Payment_Status ||
      (orderCustomer.BalancePayable <= 0 ? "Paid" : "Pending");
    const balanceReceivedDate = orderCustomer.BalancePayable <= 0
      ? new Date()
      : null;

    // ── Fetch UserName ──
    const [userRows] = await userConn.query(
      GET_USER_LOGIN_BY_ID, [orderSoldBy]
    );
    const userName = userRows?.[0]?.UserName || "SYSTEM";

    // ── Insert Sale via SP ──
    const [rows] = await connection.query(
      "CALL InsertSale(?, ?, ?, ?, ?, ?, ?, ?, @saleId); SELECT @saleId as SaleID;",
      [
        orderSoldBy,
        orderShopCode,
        orderCustomer.TotalPayable,
        orderCustomer.TotalPaid,
        orderCustomer.BalancePayable,
        paymentStatus,
        balanceReceivedDate,
        userName,
      ]
    );

    const saleId = rows[1][0].SaleID;
    if (!saleId) {
      throw new DatabaseError("InsertSale SP did not return a SaleID.");
    }

    // ── Insert Items ──
    for (const item of orderItems) {
      const S_GST_Rate   = item.S_GST_Rate   ?? item.GST_Percent ?? 0;
      const S_GST_Amount = item.S_GST_Amount ?? item.GST_Amount  ?? 0;
      const C_GST_Rate   = item.C_GST_Rate   ?? 0;
      const C_GST_Amount = item.C_GST_Amount ?? 0;

      // Lookup ProdID
      const [prodRows] = await connection.query(
        "SELECT ProdID FROM product_master WHERE PROD_Name = ? LIMIT 1",
        [item.PROD_Name]
      );
      const prodId = prodRows[0]?.ProdID;

      await connection.query(
        "CALL InsertOrderItem(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @itemOrderId);",
        [
          saleId,
          item.PROD_Name,
          item.SaleQty,
          item.Unit || "pcs",
          item.MRP          ?? 0,
          item.Discount     ?? 0,
          item.Sale_Price   ?? 0,
          item.HSN_Code     ?? null,
          S_GST_Rate,
          S_GST_Amount,
          C_GST_Rate,
          C_GST_Amount,
          item.Actual_Sale_Price ?? item.Sale_Price ?? 0,
          item.GST_Percent  ?? 0,
          item.GST_Amount   ?? 0,
          orderCustomer.UpdatedBy,
          prodId,
        ]
      );

      const [itemResult] = await connection.query(
        "SELECT @itemOrderId AS ItemOrderID;"
      );
      const itemOrderId = itemResult[0].ItemOrderID;

      await connection.query(INSERT_INVOICE_ITEM, [
        saleId,
        itemOrderId,
        item.PROD_Name,
        item.SaleQty,
        item.Unit         || "pcs",
        item.MRP          || 0,
        item.Discount     || 0,
        item.Sale_Price   || 0,
        item.HSN_Code     || null,
        S_GST_Rate,
        S_GST_Amount,
        C_GST_Rate,
        C_GST_Amount,
        item.Actual_Sale_Price || item.Sale_Price || 0,
        orderShopCode,
        orderCustomer.UpdatedBy,
        new Date(),
      ]);
    }

    // ── Insert Customer via SP ──
    await connection.query(
      "CALL InsertCustomer(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @customerId);",
      [
        saleId,
        userName,
        orderCustomer.Customer_Name,
        orderCustomer.Customer_Address,
        orderCustomer.Custome_Mobile,
        orderCustomer.Customer_Email,
        orderCustomer.TotalPayable,
        orderCustomer.TotalPaid,
        orderCustomer.BalancePayable,
        orderCustomer.UpdatedBy,
      ]
    );

    // ── PDF filename + update Sale_PDF ──
    const timestamp = new Date()
      .toISOString()
      .replace(/[-T:]/g, "")
      .split(".")[0];
    const pdfName = `INV_${saleId}_${timestamp}.pdf`;

    await connection.query(
      `UPDATE product_sale_to_customerdetails SET Sale_PDF = ? WHERE SaleID = ?`,
      [pdfName, saleId]
    );

    // ── Invoice Summary ──
    await connection.query(INSERT_INVOICE_SUMMARY, [
      saleId,
      orderCustomer.TotalPayable,
      orderCustomer.TotalPaid,
      orderCustomer.BalancePayable,
      orderSoldBy,
      orderCustomer.Customer_Name,
      orderCustomer.Customer_Address,
      "", "", "",
      orderCustomer.Custome_Mobile,
      orderShopCode,
      orderCustomer.Customer_Name,
      orderCustomer.Customer_Address,
      orderCustomer.Custome_Mobile,
      orderCustomer.Customer_Email,
      "",
      orderCustomer.UpdatedBy,
      new Date(),
      "", "", "", "",
    ]);

    await connection.commit();

    // ✅ Return data only — controller decides response shape
    return { saleId, pdfName };

  } catch (err) {
    if (connection) await connection.rollback();

    // Re-throw typed errors as-is
    if (err.isOperational) throw err;

    // Wrap raw MySQL errors — never expose sqlMessage to client
    throw new DatabaseError(
      `Order placement failed: ${err.sqlMessage || err.message}`
    );
  } finally {
    releaseAll(connection, userConn);
  }
}

// ─────────────────────────────────────────
// GET ORDER
// Orchestrates: data + PDF + email + SMS
// ─────────────────────────────────────────
export async function getOrder(orderId, isGreenOverride) {

  // ── 1. Pure data fetch ──
  const orderData = await getOrderData(orderId);

  // Override isGreen if passed from query param
  if (typeof isGreenOverride !== "undefined") {
    orderData.isGreen = isGreenOverride;
  }

  const { customer, mappedSale, items, isGreen } = orderData;

  // ── 2. PDF — non-fatal ──
  try {
    await generateOrderInvoice({ customer, mappedSale, items, isGreen });
  } catch (err) {
    console.error("⚠️ Invoice failed (non-fatal):", err.message);
  }

  // ── 3. Email — non-fatal ──
  try {
    await sendOrderEmail({ customer, mappedSale, items, isGreen });
  } catch (err) {
    console.error("⚠️ Email failed (non-fatal):", err.message);
  }

  // ── 4. SMS — non-fatal ──
  try {
    await sendOrderSMS({ customer, mappedSale });
  } catch (err) {
    console.error("⚠️ SMS failed (non-fatal):", err.message);
  }

  return orderData;
}