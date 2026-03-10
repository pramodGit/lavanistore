// ----------------------
// Cart / Order Item
// ----------------------
export interface CartItemType {
  id: string;             // Unique product ID
  name: string;           // Product name
  price: number;          // Unit price
  mrp: number;            // MRP
  quantity: number;       // Quantity ordered
  image?: string;         // Optional image URL

  // Optional fields for checkout / order
  unit?: string;          // Default: "pcs"
  discount?: number;      // Percentage discount
  gstSG?: number;         // GST SG
  gstCG?: number;         // GST CG
  finalPayable?: number;  // Price after discounts & taxes
  hsn?: string;
}

// ----------------------
// Sale summary from backend
// ----------------------
export interface SaleSummary {
  SaleID: number;
  TotalPayable: number;
  Amount_Received: number;
  Balance_IfAany: number;
  Sale_DateTime: string;
  ShopCode?: string;
}

// ----------------------
// Customer info for invoice/order
// ----------------------
export interface CustomerInfo {
  Customer_Name: string;
  Customer_Address: string;
  Customer_Mobile: string;
  Customer_Email: string;
}

// ----------------------
// Order Item sent from backend
// Unified with CartItemType fields
// ----------------------
export interface OrderItemType {
  id: string;
  PROD_Name: string;
  SaleQty: number;
  Unit: string;
  Sale_Price: number;
  MRP: number;
  Discount?: number;
  GST_SG?: number;
  GST_CG?: number;
  Actual_Sale_Price?: number;
  HSN_Code?: string;
  GST_Percent: number; 
  GST_Amount?: number;      
}


// ----------------------
// Complete Order details
// ----------------------
export interface OrderDetails {
  sale: SaleSummary;
  items: OrderItemType[];
  customer: CustomerInfo;
}
