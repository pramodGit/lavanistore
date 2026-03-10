import api from "../utils/api";

// Customer info type
interface CustomerInfo {
  Customer_Name: string;
  Customer_Address: string;
  Custome_Mobile: string;
  Customer_Email: string;
  shopCode: string;
  TotalPayable: number;
  TotalPaid: number;
  BalancePayable: number;
  Payment_Status: string;
  BalanceReceived_Datetimne: string | null;
  Tran_Date: string;
  UpdatedBy: string;
}

// Order item type
export interface OrderItem {
  ProdID: string | number;
  PROD_Name: string;
  SaleQty: number;
  Unit: string;
  MRP: number;
  Discount: number;
  Sale_Price: number;
  GST_Percent: number;
  GST_Amount: number;
  Actual_Sale_Price: number;
}

// Full order payload
export interface OrderPayload {
  soldBy: string;
  userId: string;
  shopCode: string;
  useProfileAddress: boolean;
  items: OrderItem[];
  customer: CustomerInfo;
}

// Response type
export interface OrderResponse {
  SaleID: string;
  [key: string]: any;
}

// Path to backend API endpoint: backend/controllers/orderController.js
export const createOrder = async (orderData: OrderPayload): Promise<OrderResponse> => {
  const { data } = await api.post<OrderResponse>("/api/orders", orderData);
  return data;
};
