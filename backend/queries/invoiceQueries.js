// ----------------------
// Insert a single invoice item (Invoice_Print_Storage1)
// ----------------------
export const INSERT_INVOICE_ITEM = `
  INSERT INTO Invoice_Print_Storage1
    (SaleID, Item_Order_ID, Product_Name, SaleQty, Unit, MRP, Discount, Sale_Price, HSN_Code,
     S_GST_Rate, S_GST_Amount, C_GST_Rate, C_GST_Amount, Actual_Sale_Price, ShopeCode,
     Printed_By, Printed_DateTime)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`;

// ----------------------
// Insert invoice summary (Invoice_Print_Storage2)
// ----------------------
export const INSERT_INVOICE_SUMMARY = `
  INSERT INTO Invoice_Print_Storage2
    (SaleID, TotalNetPayable, Amount_Received, BalanceIfAny, SellerID, SellerName, SelllerAddress,
     SellerPin, Seller_ID, SellerStateCode, SellerMobile, ShopeCode, Customer_Name, Customer_Address,
     Customer_Mobile, Customer_Email, GSTNo, Printed_By, Printed_date, TotalReceived_InEnglish,
     Declaration, IP_Address, Locality)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`;
