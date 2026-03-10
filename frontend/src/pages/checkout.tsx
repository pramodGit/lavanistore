import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../layout/header";
import Footer from "../layout/footer";
import { useAppSelector } from "../store/hooks";
import ShippingForm from "../components/ShippingForm";
import PlaceOrderButton from "../components/PlaceOrderButton";
import OrderSummaryBox from "../components/OrderSummary";
import "../assets/checkout.css";
import CartItem from "../components/CartItem";
import PaymentMode from "../components/PaymentMode";

// ✅ import selectors
import { selectCartWithPrices } from "../store/selectors/cartSelectors";

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();

  // ✅ use priced items instead of raw store cart
  const items = useAppSelector(selectCartWithPrices);

  // ✅ redirect if cart empty
  useEffect(() => {
    if (!items.length) navigate("/shopping-cart");
  }, [items, navigate]);

  return (
    <>
      <Header />

      <div className="checkout-page">
        <h2>Checkout</h2>

        <div className="checkout-container">
          {/* LEFT — Shipping */}
          <div className="checkout-left">
            <ShippingForm />

            {/* ✅ pass id, item auto resolved with priced selector */}
            {items.map((item) => (
              <CartItem key={item.id} id={item.id} />
            ))}
          </div>

          {/* RIGHT — Payment + Order Summary */}
          <div className="checkout-right">
            <PlaceOrderButton />
            <p>&nbsp;</p>
            <PaymentMode />
            <OrderSummaryBox />            
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default CheckoutPage;
