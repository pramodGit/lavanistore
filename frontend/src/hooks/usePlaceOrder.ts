import { useCallback, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { clearCart } from "../store/cartSlice";
import { useNavigate } from "react-router-dom";
import { CartItem } from "../types/cart";
import { createOrder, OrderItem, OrderPayload } from "../api/orders";
import api from "../utils/api";

export default function usePlaceOrder() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const items = useSelector((state: RootState) => state.cart.items) as CartItem[];
  const user = useSelector((state: RootState) => state.auth.user);
  const shippingInfo = useSelector((state: RootState) => state.checkout);

  const [loading, setLoading] = useState(false);

  const handlePlaceOrder = useCallback(async () => {
    if (loading) return;
    if (!user) {
      navigate("/auth/login", { state: { from: "/checkout" } });
      return;
    }
    if (!items.length) return;

    setLoading(true);

    try {
      // Prepare customer info
      const customerInfo = {
        name: shippingInfo.name?.trim() || "",
        address: shippingInfo.address?.trim() || "",
        mobile: shippingInfo.mobile?.trim() || "",
        email: "",
        shopCode: "ONLINE",
      };

      // Fetch GST rates for products
      const productIds = items.map((i) => i.id);
      const { data: gstRates } = await api.post("/products/gst-rates", { productIds });

      // Prepare order items
      const payloadItems: OrderItem[] = items.map((item) => {
        const qty = item.quantity;
        const unitPrice = item.salePrice || 0;

        const gstData = gstRates.find((g: any) => String(g.ProdID) === String(item.id));
        const gstPercent = gstData ? Number(gstData.GST_Percent) : 0;
        const gstAmount = (unitPrice * qty * gstPercent) / 100;
        const actualSalePrice = unitPrice * qty + gstAmount;

        return {
          ProdID: item.id,
          PROD_Name: item.name,
          SaleQty: qty,
          Unit: "pcs",
          MRP: item.mrp || 0,
          Discount: 0,
          Sale_Price: unitPrice,
          GST_Percent: gstPercent,
          GST_Amount: gstAmount,
          Actual_Sale_Price: actualSalePrice,
        };
      });

      // Calculate totals
      const totalPayable = payloadItems.reduce((sum, i) => sum + i.Actual_Sale_Price, 0);

      // Unpaid / pending payment scenario
      const amountReceived = 0; // customer hasn't paid yet
      const balanceIfAny = totalPayable - amountReceived;
      const paymentStatus = balanceIfAny > 0 ? "Pending" : "Paid";
      const saleDate = new Date().toISOString();

      // Construct payload
      const orderPayload: OrderPayload = {
        soldBy: user.id,
        userId: user.id,
        shopCode: customerInfo.shopCode,
        useProfileAddress: true,
        items: payloadItems,
        customer: {
          Customer_Name: customerInfo.name,
          Customer_Address: customerInfo.address,
          Custome_Mobile: customerInfo.mobile,
          Customer_Email: customerInfo.email,
          shopCode: customerInfo.shopCode,
          TotalPayable: totalPayable,
          TotalPaid: amountReceived,
          BalancePayable: balanceIfAny,
          Payment_Status: paymentStatus,
          BalanceReceived_Datetimne: null,
          Tran_Date: saleDate,
          UpdatedBy: user.id,
        },
      };

      // Send order to backend
      const response = await createOrder(orderPayload);
      const orderId = response.SaleID;
      if (orderId) {
        dispatch(clearCart());

        // Delay navigation slightly
        setTimeout(() => {
          navigate(`/order-details/${orderId}`);
        }, 150); // 150ms delay, adjust if needed
      }


    } catch (err) {
      console.error("Failed to place order:", err);
    } finally {
      setLoading(false);
    }
  }, [user, items, shippingInfo, navigate, dispatch, loading]);

  return { handlePlaceOrder, loading };
}
