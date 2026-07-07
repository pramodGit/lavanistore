// backend/services/orderService.js
import { pool as userPool, productPool } from "../db.js";
import { generateInvoicePDF } from "../utils/generateInvoicePDF.js";
import orderEmailTemplate from "../utils/orderEmailTemplate.js";
import sendEmail from "../utils/sendEmail.js";
import { sendSMS } from "../utils/smsAlert.js";
import { NotFoundError, ValidationError, DatabaseError } from "../errors/AppError.js";

import {
  GET_SALE_BY_ID,
  GET_CUSTOMER_BY_SALE_ID,
  GET_ORDER_ITEMS_BY_SALE_ID,
} from "../queries/productOrderQueries.js";

import { INSERT_INVOICE_ITEM, INSERT_INVOICE_SUMMARY } from "../queries/invoiceQueries.js";
import { GET_USER_LOGIN_BY_ID, GET_USER_REGISTRATION_BY_ID } from "../queries/userQueries.js";

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
// ─────────────────────────────────────────
export async function placeOrder(body) {
  const {
    soldBy, shopCode, userId,
    items, customer, shippingInfo
  } = body;

  const orderItems = items || [];

  // ✅ Validation — throw typed error, not res.status()
  if (!orderItems.length) {
    throw new ValidationError("Order must have at least one item");
  }

  let connection, userConn;

  try {
    // ✅ Get connections inside try — so finally can safely release both
    connection = await productPool.getConnection();
    userConn   = await userPool.getConnection();

    await connection.beginTransaction();

    // ── Build customer object ──
    let orderCustomer = customer ? { ...customer } : {};
    orderCustomer = {
      ...orderCustomer,
      Customer_Name    : orderCustomer.Customer_Name    || shippingInfo?.name    || "Customer",
      Customer_Address : orderCustomer.Customer_Address || shippingInfo?.address || "",
      Custome_Mobile   : orderCustomer.Custome_Mobile   || shippingInfo?.mobile  || "",
      Customer_Email   : orderCustomer.Customer_Email   || shippingInfo?.email   || "",
      UpdatedBy        : orderCustomer.UpdatedBy        || userId || soldBy,
    };

    const orderSoldBy   = soldBy || userId;
    const orderShopCode = shopCode || shippingInfo?.shopCode || "ONLINE";
    const paymentStatus = orderCustomer.Payment_Status ||
      (orderCustomer.BalancePayable <= 0 ? "Paid" : "Pending");
    const balanceReceivedDate = orderCustomer.BalancePayable <= 0 ? new Date() : null;

    // ── Fetch UserName ──
    const [userRows] = await userConn.query(GET_USER_LOGIN_BY_ID, [orderSoldBy]);
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
      throw new DatabaseError("InsertSale SP did not return a SaleID");
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
          item.MRP ?? 0,
          item.Discount ?? 0,
          item.Sale_Price ?? 0,
          item.HSN_Code ?? null,
          S_GST_Rate,
          S_GST_Amount,
          C_GST_Rate,
          C_GST_Amount,
          item.Actual_Sale_Price ?? item.Sale_Price ?? 0,
          item.GST_Percent ?? 0,
          item.GST_Amount ?? 0,
          orderCustomer.UpdatedBy,
          prodId,
        ]
      );

      const [itemResult] = await connection.query(
        "SELECT @itemOrderId AS ItemOrderID;"
      );
      const itemOrderId = itemResult[0].ItemOrderID;

      await connection.query(INSERT_INVOICE_ITEM, [
        saleId, itemOrderId,
        item.PROD_Name, item.SaleQty, item.Unit || "pcs",
        item.MRP || 0, item.Discount || 0, item.Sale_Price || 0,
        item.HSN_Code || null,
        S_GST_Rate, S_GST_Amount, C_GST_Rate, C_GST_Amount,
        item.Actual_Sale_Price || item.Sale_Price || 0,
        orderShopCode, orderCustomer.UpdatedBy, new Date(),
      ]);
    }

    // ── Insert Customer via SP ──
    await connection.query(
      "CALL InsertCustomer(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @customerId);",
      [
        saleId, userName,
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

    // ── PDF name + update Sale_PDF ──
    const timestamp = new Date()
      .toISOString().replace(/[-T:]/g, "").split(".")[0];
    const pdfName = `INV_${saleId}_${timestamp}.pdf`;

    await connection.query(
      `UPDATE product_sale_to_customerdetails SET Sale_PDF = ? WHERE SaleID = ?`,
      [pdfName, saleId]
    );

    // ── Invoice Summary ──
    await connection.query(INSERT_INVOICE_SUMMARY, [
      saleId,
      orderCustomer.TotalPayable, orderCustomer.TotalPaid, orderCustomer.BalancePayable,
      orderSoldBy,
      orderCustomer.Customer_Name, orderCustomer.Customer_Address,
      "", "", "",
      orderCustomer.Custome_Mobile,
      orderShopCode,
      orderCustomer.Customer_Name, orderCustomer.Customer_Address,
      orderCustomer.Custome_Mobile, orderCustomer.Customer_Email,
      "", orderCustomer.UpdatedBy, new Date(),
      "", "", "", "",
    ]);

    await connection.commit();

    return { saleId, pdfName };

  } catch (err) {
    // Rollback only if connection was opened
    if (connection) await connection.rollback();

    // Re-throw typed errors as-is
    if (err.name === "ValidationError" || err.name === "DatabaseError") throw err;

    // Wrap MySQL errors — don't expose sqlMessage to client
    throw new DatabaseError(
      `Order placement failed: ${err.sqlMessage || err.message}`
    );
  } finally {
    releaseAll(connection, userConn);
  }
}

// ─────────────────────────────────────────
// GET ORDER
// ─────────────────────────────────────────
export async function getOrder(id, isGreenOverride) {
  let connection, userConn;

  try {
    connection = await productPool.getConnection();
    userConn   = await userPool.getConnection();

    // ── Fetch sale ──
    const [saleRows] = await connection.query(GET_SALE_BY_ID, [id]);

    // ✅ throw typed error — not res.status(404)
    if (!saleRows?.length) throw new NotFoundError("Order");

    const sale = saleRows[0];

    // ── Fetch items + customer ──
    const [items]        = await connection.query(GET_ORDER_ITEMS_BY_SALE_ID, [sale.SaleID]);
    const [customerRows] = await connection.query(GET_CUSTOMER_BY_SALE_ID, [sale.SaleID]);
    let customer = customerRows[0] || {};

    // ── Fetch login + profile ──
    const [loginRows] = await userConn.query(GET_USER_LOGIN_BY_ID, [sale.SoldBy]);
    const login = loginRows?.[0] || {};

    let profile = {};
    if (login?.RegistrationID) {
      const [profileRows] = await userConn.query(
        GET_USER_REGISTRATION_BY_ID, [login.RegistrationID]
      );
      profile = profileRows?.[0] || {};
    }

    // ── Determine isGreen ──
    const isGreen = typeof isGreenOverride !== "undefined"
      ? isGreenOverride
      : login?.isGreen === 1;

    // ── Fill missing customer fields ──
    if (!customer.Customer_Email) customer.Customer_Email = profile.EmailID || "";
    if (!customer.Custome_Mobile) customer.Custome_Mobile = profile["Mobile No"] || "";
    if (!customer.Customer_Name || customer.Customer_Name === "Customer") {
      customer.Customer_Name = [
        profile["First Name"], profile["Middle Name"], profile["Last Name"]
      ].filter(Boolean).join(" ") || "Customer";
    }

    // ── Compute totals ──
    const totalAmount = items.reduce((sum, i) => {
      const qty        = Number(i.SaleQty)     || 0;
      const mrp        = Number(i.MRP)          || 0;
      const salePrice  = Number(i.Sale_Price)   || 0;
      const gstPercent = Number(i.GST_Percent)  || 0;
      const basePrice  = isGreen ? salePrice : mrp;
      const gstAmount  = (basePrice * qty * gstPercent) / 100;
      return sum + basePrice * qty + (isGreen ? 0 : gstAmount);
    }, 0);

    const mappedSale = { id: sale.SaleID, date: sale.Sale_DateTime, total: totalAmount };

    // ── PDF (non-fatal) ──
    const pdfName = customer.Sale_PDF || `INV_${sale.SaleID}_fallback.pdf`;
    try {
      await generateInvoicePDF(
        customer.Customer_Name || "Customer",
        mappedSale, items, isGreen, pdfName
      );
    } catch (pdfErr) {
      // ✅ non-fatal — log but don't crash the order fetch
      console.error("⚠️ PDF generation failed (non-fatal):", pdfErr.message);
    }

    // ── Email (non-fatal) ──
    if (customer.Customer_Email) {
      try {
        const subject = `Your Order #${sale.SaleID} Details`;
        const { html, text } = orderEmailTemplate(
          customer.Customer_Name || "Customer", mappedSale, items, isGreen
        );
        await sendEmail(customer.Customer_Email, subject, { html, text });
      } catch (emailErr) {
        console.error("⚠️ Email failed (non-fatal):", emailErr.message);
      }
    }

    // ── SMS (non-fatal) ──
    if (customer.Custome_Mobile) {
      try {
        const smsText = `Hi ${customer.Customer_Name}, thanks for your purchase! ` +
          `Sale ID: ${sale.SaleID}, Total: ₹${totalAmount.toFixed(2)}`;
        await sendSMS(customer.Custome_Mobile, smsText);
      } catch (smsErr) {
        console.error("⚠️ SMS failed (non-fatal):", smsErr.message);
      }
    }

    return { sale, items, customer, isGreen };

  } catch (err) {
    // Re-throw typed errors as-is (NotFoundError etc.)
    if (err.isOperational) throw err;

    // Wrap unexpected errors
    throw new DatabaseError(`Failed to fetch order: ${err.message}`);
  } finally {
    releaseAll(connection, userConn);
  }
}