import React from "react";
import { useAppSelector } from "../store/hooks";
import Header from "../layout/header";
import Footer from "../layout/footer";
import CartItem from "../components/CartItem";
import OrderSummary from "../components/OrderSummary";
import ProceedToBuyButton from "../components/ProceedToBuyButton";
import "../assets/cart.css";
// import "../assets/checkout.css";

const CartPage: React.FC = () => {
  const items = useAppSelector((state) => state.cart.items);

  if (!items.length) {
    return (
      <>
        <Header />
        <div className="cart-empty">
          <h2>🛒 Shopping Cart</h2>
          <p>Your cart is empty.</p>
          <a href="/product-list">Continue Shopping</a>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="cart-page">
        <div className="cart-left">
          <h2>Your Cart ({items.length} items)</h2>

          {items.map((item) => (
            <CartItem key={item.id} id={item.id} />
          ))}

        </div>

        <div className="cart-right">
          <OrderSummary />
          <div style={{ marginTop: "15px" }}>
            <ProceedToBuyButton />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CartPage;
