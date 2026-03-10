// src/components/CartItem.tsx
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { incrementQuantity, decrementQuantity, removeItem } from "../store/cartSlice";
import { selectCartWithPrices } from "../store/selectors/cartSelectors";
import { selectIsGreenUser } from "../store/selectors/authSelectors";

export default function CartItem({ id }: { id: string }) {
  const dispatch = useDispatch();
  const items = useSelector(selectCartWithPrices);
  const item = items.find(i => i.id === id);
  const isGreen = useSelector(selectIsGreenUser);

  if (!item) return null;

  return (
    <div className="cart-item">
      <div className="details">
        <h4>{item.name}</h4>

        {/* ✅ Show MRP strike & Sale price for Green users */}
        {isGreen ? (
          <p>
            <span style={{ textDecoration: "line-through", color: "gray" }}>
              ₹{item.mrp.toFixed(2)}
            </span>{" "}
            <strong>₹{item.salePrice.toFixed(2)}</strong>
          </p>
        ) : (
          <p><strong>₹{item.mrp.toFixed(2)}</strong></p>
        )}

        <div className="quantity">
          <button onClick={() => dispatch(decrementQuantity(item.id))}>−</button>
          <span>{item.quantity}</span>
          <button onClick={() => dispatch(incrementQuantity(item.id))}>+</button>
        </div>
      </div>

      {/* ✅ subtotal already computed in selector */}
      <div className="subtotal">₹{item.subtotal.toFixed(2)}</div>

      <button className="remove" onClick={() => dispatch(removeItem(item.id))}>
        ×
      </button>
    </div>
  );
}
