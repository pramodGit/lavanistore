import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import api from "../utils/api";

import { selectCartWithPrices, selectCartTotals } from "../store/selectors/cartSelectors";
import { RootState } from "../store/store";
import { setGstRates } from "../store/cartSlice";

const OrderSummary: React.FC = () => {
  const pricedItems = useSelector(selectCartWithPrices);
  const { totalPrice } = useSelector(selectCartTotals);
  const user = useSelector((state: RootState) => state.auth.user);
  const isGreen = user?.isGreen === 1;

  const [gstData, setGstData] = useState<{ totalGST: number }>({ totalGST: 0 });

  const dispatch = useDispatch();


  useEffect(() => {
    if (!pricedItems.length) return;

    (async () => {
      try {
        const productIds = pricedItems.map(i => i.id);
        const { data } = await api.post("/products/gst-rates", { productIds });

        let totalGST = 0;

        pricedItems.forEach(item => {
          const productGST = data.find((p: any) => Number(p.ProdID) === Number(item.id));
          const gstPercent = Number(productGST?.GST_Percent || 0);

          const itemGST = item.finalPrice * item.quantity * (gstPercent / 100);

          totalGST += itemGST;
        });

        dispatch(setGstRates(data)); // ✅ store GST in Redux
        setGstData({ totalGST });

      } catch {
        setGstData({ totalGST: 0 });
      }
    })();
  }, [pricedItems]);

  return (
    <div className="order-summary">
      <h3>Order Summary</h3>

      <div className="summary-item">
        <span>Subtotal</span>
        <strong>₹{totalPrice.toFixed(2)}</strong>
      </div>

      {/* <div className="summary-item">
        <span>GST</span>
        <strong>₹{gstData.totalGST.toFixed(2)}</strong>
      </div> */}

      <div className="summary-item total">
        <span>Total Payable</span>
        <strong>₹{(totalPrice + gstData.totalGST).toFixed(2)}</strong>
      </div>
    </div>
  );
};

export default React.memo(OrderSummary);
