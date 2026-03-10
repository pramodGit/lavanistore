export const BASE_PRODUCT_QUERY = `
  SELECT 
    p.*,
    c.Cat_Name,
    b.Brand_Name
  FROM product_master p
  LEFT JOIN product_cat_master c ON p.Cat_ID = c.Cat_ID
  LEFT JOIN product_brand_master b ON c.Brand_ID = b.Brand_ID
`;

export const PRODUCT_DETAILS_PAGE_QUERY = `
  SELECT 
    p.ProdID,
    p.Prod_Name,
    p.SalePrice,
    p.Rate,
    p.Unit,
    p.Discount,
    p.IsOutOfStock,
    c.Cat_Name,
    b.Brand_Name,
    pd.Prod_DTL_ID,
    pd.Prod_Details,
    pd.ArrivalDate,
    pd.product_image,
    pd.product_image_path
  FROM product_master p
  LEFT JOIN product_cat_master c ON p.Cat_ID = c.Cat_ID
  LEFT JOIN product_brand_master b ON c.Brand_ID = b.Brand_ID
  LEFT JOIN product_details pd ON p.ProdID = pd.ProdID
  WHERE p.IsActive = ? AND p.ProdID = ?
  ORDER BY pd.Prod_DTL_ID ASC
`;


// ----------------------
// Insert a new sale record [product_sale_daily_tran]
// ----------------------
export const INSERT_SALE = `
  INSERT INTO product_sale_daily_tran
    (SoldBy, Sale_DateTime, ShopeCode, TotalPayable, Amount_Received, Balance_IfAany, Payment_Status, BalanceReceived_Datetimne,UserNme,InvoicePDFPath)
  VALUES (?, NOW(), ?, ?, ?, ?, ?, ?,?,?)
`;


// ----------------------
// Insert customer details for a sale [product_sale_to_customerdetails]
// ----------------------
export const INSERT_CUSTOMER_DETAILS = `
  INSERT INTO product_sale_to_customerdetails
    (SaleID, Customer_Name, Customer_Address, Custome_Mobile, Customer_Email, TotalPayable, TotalPaid, BalancePayable, Tran_Date, UpdatedBy)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?)
`;

// ----------------------
// Get sale summary by ID
// ----------------------
export const GET_SALE_BY_ID = `
  SELECT * FROM product_sale_daily_tran WHERE SaleID = ?
`;

// ----------------------
// Get customer details by sale ID
// ----------------------
export const GET_CUSTOMER_BY_SALE_ID = `
  SELECT * FROM product_sale_to_customerdetails WHERE SaleID = ?
`;

// ----------------------
// Insert an order into product_sale_daily_order
// ----------------------
export const INSERT_ORDER_ITEM = `
  INSERT INTO product_sale_daily_order
(SaleID, Product_name, SaleQty, Unit, MRP, Discount, Sale_Price, HSN_Code,
 S_GST_Rate, S_GST_Amount, C_GST_Rate, C_GST_Amount, Actual_Sale_Price,
 GST_Percent, GST_Amount, Updated_By, Updated_Date,ProdID)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(),?)

`;


// ----------------------
// NEW: Get order items by SaleID from product_sale_daily_order
// ----------------------
export const GET_ORDER_ITEMS_BY_SALE_ID = `
  SELECT * FROM product_sale_daily_order WHERE SaleID = ?
`;
