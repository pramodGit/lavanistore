// backend/controllers/orderController.js
import { pool as userPool, productPool } from "../db.js";
import orderEmailTemplate from "../utils/orderEmailTemplate.js";
import sendEmail from "../utils/sendEmail.js";
import { sendSMS } from "../utils/smsAlert.js";

import {
  INSERT_SALE,
  INSERT_CUSTOMER_DETAILS,
  GET_SALE_BY_ID,
  GET_CUSTOMER_BY_SALE_ID,
  INSERT_ORDER_ITEM,
  GET_ORDER_ITEMS_BY_SALE_ID,
 
} from "../queries/productOrderQueries.js";

import { INSERT_INVOICE_ITEM, INSERT_INVOICE_SUMMARY } from "../queries/invoiceQueries.js";
import { GET_USER_LOGIN_BY_ID, GET_USER_REGISTRATION_BY_ID } from "../queries/userQueries.js";

//--------------------------------------------------------
// ✅ PLACE ORDER
//--------------------------------------------------------
export const placeOrderController = async (req, res) => {
  const { soldBy, shopCode, userId, items, customer, shippingInfo, useProfileAddress } = req.body;
  const orderItems = items || [];

  if (!orderItems.length) return res.status(400).json({ error: "Invalid order data" });

  const connection = await productPool.getConnection();
  const userConn = await userPool.getConnection();

  try {
    await connection.beginTransaction();
//console.log("Inserted SaleID:", saleId);
    // -----------------------
    // Trust payload customer object
    // -----------------------
    let orderCustomer = customer ? { ...customer } : {};

    // Fill missing fields from shipping info or profile
    orderCustomer = {
      ...orderCustomer,
      Customer_Name: orderCustomer.Customer_Name || shippingInfo?.name || "Customer",
      Customer_Address: orderCustomer.Customer_Address || shippingInfo?.address || "",
      Custome_Mobile: orderCustomer.Custome_Mobile || shippingInfo?.mobile || "",
      Customer_Email: orderCustomer.Customer_Email || shippingInfo?.email || "",
      UpdatedBy: orderCustomer.UpdatedBy || userId || soldBy
    };

    const orderSoldBy = soldBy || userId;
    const orderShopCode = shopCode || shippingInfo?.shopCode || "ONLINE";

    // -----------------------
    // Use frontend payment info as-is
    const paymentStatus = orderCustomer.Payment_Status || (orderCustomer.BalancePayable <= 0 ? "Paid" : "Pending");
    const balanceReceivedDate = orderCustomer.BalancePayable <= 0 ? new Date() : null;

    
    // 🔑 Fetch UserName from user login table
    const [userRows] = await userConn.query(GET_USER_LOGIN_BY_ID, [orderSoldBy]);
    const userLogin = userRows?.[0] || {};
    const userName = userLogin?.UserName || "SYSTEM";

    // -----------------------
    // Insert Sale
    // const [saleResult] = await connection.query(INSERT_SALE, [
    //   orderSoldBy,
    //   orderShopCode,
    //   orderCustomer.TotalPayable,
    //   orderCustomer.TotalPaid,
    //   orderCustomer.BalancePayable,
    //   paymentStatus,
    //   balanceReceivedDate
    // ]);
    // const saleId = saleResult.insertId;
    // -----------------------
    // Insert Sale using stored procedure
    // -----------------------
    const [rows] = await connection.query(
      "CALL InsertSale(?, ?, ?, ?, ?, ?, ?, ?, @saleId); SELECT @saleId as SaleID;",
      [
        orderSoldBy,              // p_SoldBy
        orderShopCode,            // p_ShopeCode
        orderCustomer.TotalPayable,   // p_TotalPayable
        orderCustomer.TotalPaid,      // p_AmountReceived
        orderCustomer.BalancePayable, // p_BalanceIfAny
        paymentStatus,                // p_PaymentStatus
        balanceReceivedDate,           // p_BalanceReceivedDatetime
        userName ,                     // p_UserName  
      ]
    );
  
      // The second result set contains the output parameter
    const saleId = rows[1][0].SaleID; 
    console.log("Inserted SaleID:", saleId);
    // 2️⃣ Generate PDF name: INV_orderid_date_time.pdf
    const timestamp = new Date()
      .toISOString()
      .replace(/[-T:]/g, "")
      .split(".")[0]; // YYYYMMDDHHMMSS

    const pdfName = `INV_${saleId}_${timestamp}.pdf`;

    // 3️⃣ Update Sale_PDF in table
    await connection.query(
      `UPDATE product_sale_to_customerdetails SET Sale_PDF = ? WHERE SaleID = ?`,
      [pdfName, saleId]
    );

    // -----------------------
    // Insert Items & Invoice
    for (const item of orderItems) 
      {
      const S_GST_Rate = item.S_GST_Rate ?? item.GST_Percent ?? 0;
      const S_GST_Amount = item.S_GST_Amount ?? item.GST_Amount ?? 0;
      const C_GST_Rate = item.C_GST_Rate ?? 0;
      const C_GST_Amount = item.C_GST_Amount ?? 0;

      // const [itemResult] = await connection.query(INSERT_ORDER_ITEM, [
      //   saleId,
      //   item.PROD_Name,
      //   item.SaleQty,
      //   item.Unit || "pcs",
      //   item.MRP ?? 0,
      //   item.Discount ?? 0,
      //   item.Sale_Price ?? 0,
      //   item.HSN_Code ?? null,
      //   item.S_GST_Rate ?? item.GST_Percent ?? 0,
      //   item.S_GST_Amount ?? item.GST_Amount ?? 0,
      //   item.C_GST_Rate ?? 0,
      //   item.C_GST_Amount ?? 0,
      //   item.Actual_Sale_Price ?? item.Sale_Price ?? 0,
      //   item.GST_Percent ?? 0,
      //   item.GST_Amount ?? 0,
      //   orderCustomer.UpdatedBy
      // ]);

      // const itemOrderId = itemResult.insertId;
      // Call stored procedure for each item
      
     

     // 🔎 Lookup ProdID from product master
      const [prodRows] = await connection.query(  
        "SELECT * FROM product_master WHERE PROD_Name = ? LIMIT 1",
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
          item.S_GST_Rate ?? item.GST_Percent ?? 0,
          item.S_GST_Amount ?? item.GST_Amount ?? 0,
          item.C_GST_Rate ?? 0,
          item.C_GST_Amount ?? 0,
          item.Actual_Sale_Price ?? item.Sale_Price ?? 0,
          item.GST_Percent ?? 0,
          item.GST_Amount ?? 0,           
          orderCustomer.UpdatedBy,
          prodId,
        ]
      );

      // Get inserted item ID
      const [result] = await connection.query("SELECT @itemOrderId AS ItemOrderID;");
      const itemOrderId = result[0].ItemOrderID;


      await connection.query(INSERT_INVOICE_ITEM, [
        saleId,
        itemOrderId,
        item.PROD_Name,
        item.SaleQty,
        item.Unit || "pcs",
        item.MRP || 0,
        item.Discount || 0,
        item.Sale_Price || 0,
        item.HSN_Code || null,
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

    // // -----------------------
    // // Insert Customer Details
    // await connection.query(INSERT_CUSTOMER_DETAILS, [
    //   saleId,
    //   orderCustomer.Customer_Name,
    //   orderCustomer.Customer_Address,
    //   orderCustomer.Custome_Mobile,
    //   orderCustomer.Customer_Email,
    //   orderCustomer.TotalPayable,
    //   orderCustomer.TotalPaid,
    //   orderCustomer.BalancePayable,
    //   orderCustomer.UpdatedBy
    // ]);
    // Call stored procedure
    await connection.query(
      "CALL InsertCustomer(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @customerId);",
      [
        saleId,
       // orderCustomer.UserName,             // <-- NEW REQUIRED ARGUMENT
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


    // Get inserted customer ID
    const [result] = await connection.query("SELECT @customerId AS CustomerID;");
    const customerId = result[0].CustomerID;


    // -----------------------
    // Insert Invoice Summary
    await connection.query(INSERT_INVOICE_SUMMARY, [
      saleId,
      orderCustomer.TotalPayable,
      orderCustomer.TotalPaid,
      orderCustomer.BalancePayable,
      orderSoldBy,
      orderCustomer.Customer_Name,
      orderCustomer.Customer_Address,
      "",
      "",
      "",
      orderCustomer.Custome_Mobile,
      orderShopCode,
      orderCustomer.Customer_Name,
      orderCustomer.Customer_Address,
      orderCustomer.Custome_Mobile,
      orderCustomer.Customer_Email,
      "",
      orderCustomer.UpdatedBy,
      new Date(),
      "",
      "",
      "",
      "",
    ]);

    await connection.commit();
    return res.status(201).json({ message: "Order placed successfully", SaleID: saleId });

  } catch (err) {
    await connection.rollback();
    console.error("Error placing order:", err);
    return res.status(500).json({ error: "Failed to place order" });
  } finally {
    connection.release();
    userConn.release();
  }
};

//--------------------------------------------------------
// ✅ GET ORDER + SEND EMAIL
//--------------------------------------------------------
//--------------------------------------------------------
// ✅ GET ORDER + SEND EMAIL
//--------------------------------------------------------
export const getOrderController = async (req, res) => {
  const connection = await productPool.getConnection();
  const userConn = await userPool.getConnection();

  try {
    const { id } = req.params;

    // -----------------------
    // Fetch sale record
    // -----------------------
    const [saleRows] = await connection.query(GET_SALE_BY_ID, [id]);
    if (!saleRows?.length)
      return res.status(404).json({ error: "Order not found" });

    const sale = saleRows[0];

    // -----------------------
    // Fetch all items for this SaleID
    // -----------------------
    const [items] = await connection.query(GET_ORDER_ITEMS_BY_SALE_ID, [sale.SaleID]);

    // -----------------------
    // Fetch customer details
    // -----------------------
    const [customerRows] = await connection.query(GET_CUSTOMER_BY_SALE_ID, [sale.SaleID]);
    let customer = customerRows[0] || {};
    let profile = {};
    let login = {};

    // -----------------------
    // Fetch login info (needed for fallback)
    // -----------------------
    const [loginRows] = await userConn.query(GET_USER_LOGIN_BY_ID, [sale.SoldBy]);
    login = loginRows?.[0] || {};

    // -----------------------
    // Determine isGreen
    // -----------------------
    const reqIsGreen =
      typeof req.query?.isGreen !== "undefined"
        ? String(req.query.isGreen).toLowerCase() === "true"
        : undefined;

    const isGreen =
      typeof reqIsGreen !== "undefined"
        ? reqIsGreen
        : login?.isGreen === 1;

    console.log("💚 isGreen : ", isGreen);

    // -----------------------
    // Fetch registration/profile if needed
    // -----------------------
    if (login?.RegistrationID) {
      const [profileRows] = await userConn.query(GET_USER_REGISTRATION_BY_ID, [login.RegistrationID]);
      profile = profileRows?.[0] || {};
    }

    // -----------------------
    // Fill missing customer info
    // -----------------------
    if (!customer.Customer_Email)
      customer.Customer_Email = profile.EmailID || "";
    if (!customer.Custome_Mobile)
      customer.Custome_Mobile = profile["Mobile No"] || "";

    // Construct full name if missing/generic
    if (!customer.Customer_Name || customer.Customer_Name === "Customer") {
      customer.Customer_Name =
        [profile["First Name"], profile["Middle Name"], profile["Last Name"]]
          .filter(Boolean)
          .join(" ") || "Customer";
    }

    // -----------------------
    // Compute totals same as frontend
    // -----------------------
    const totalAmount = items.reduce((sum, i) => {
      const qty = Number(i.SaleQty) || 0;
      const mrp = Number(i.MRP) || 0;
      const salePrice = Number(i.Sale_Price) || 0;
      const gstPercent = Number(i.GST_Percent) || 0;

      const basePrice = isGreen ? salePrice : mrp;
      const gstAmount = (basePrice * qty * gstPercent) / 100;

      return sum + basePrice * qty + (isGreen ? 0 : gstAmount);
    }, 0);

    // -----------------------
    // Prepare Email & SMS
    // -----------------------
    const mappedSale = {
      id: sale.SaleID,
      date: sale.Sale_DateTime,
      total: totalAmount,
    };

    const subject = `Your Lavani Wellness Order #${sale.SaleID} Details`;

    const { html, text } = orderEmailTemplate(
      customer.Customer_Name || "Customer",
      mappedSale,
      items,
      isGreen
    );

    // -----------------------
    // Send Email
    // -----------------------
    if (customer.Customer_Email) {
      await sendEmail(customer.Customer_Email, subject, { html, text });
      // console.log("✅ Email sent to:", customer.Customer_Email);
    }

    // -----------------------
    // Send SMS
    // -----------------------
    if (customer.Custome_Mobile) {
      const smsText = `Hi ${customer.Customer_Name}, thanks for your purchase! Sale ID: ${sale.SaleID}, Total: ₹${totalAmount.toFixed(2)}`;
      await sendSMS(customer.Custome_Mobile, smsText);
      // console.log("✅ SMS sent to:", customer.Custome_Mobile);
    }

    // -----------------------
    // Return response
    // -----------------------
    return res.json({ sale, items, customer, isGreen });

  } catch (err) {
    console.error("❌ Error fetching order:", err);
    return res.status(500).json({ error: "Failed to fetch order" });
  } finally {
    connection.release();
    userConn.release();
  }
};


