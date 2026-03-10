import React, { memo } from "react";
import usePlaceOrder from "../hooks/usePlaceOrder";

const PlaceOrderButton: React.FC = () => {
  const { handlePlaceOrder, loading } = usePlaceOrder();

  return (
    <button
      className="checkout-btn"
      onClick={handlePlaceOrder}
      disabled={loading}
    >
      {loading ? "Placing Order..." : "Place Order"}
    </button>
  );
};

export default memo(PlaceOrderButton);
