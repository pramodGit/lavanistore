// src/components/AddToCartButton.tsx
import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { addItem } from "../store/cartSlice";
import { useNavigate } from "react-router-dom";
import "../assets/addToCart.css";

interface AddToCartButtonProps {
  product: { id: string; name: string; price: number; mrp: number; };
}

export const AddToCartButton: React.FC<AddToCartButtonProps> = ({ product }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    // Check if user is logged in
    if (!user) {
      // navigate("/auth/login", { state: { from: "/cart" } });
      navigate("/auth/login", { state: { from: window.location.pathname } });
      return;
    }

    // If logged in, add item to cart
    dispatch(
      addItem({
        id: product.id,
        name: product.name,
        mrp: product.mrp,
        salePrice: product.price, // ✅ store salePrice separately
        quantity
      })
    );
  };

  return (
    <div className="product-controls">
      <div className="qty">
        <button
          onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
          className="btn minus"
          aria-label="Decrease quantity"
        >
          −
        </button>

        <input
          type="number"
          min={1}
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="qty-input"
        />

        <button
          onClick={() => setQuantity((prev) => prev + 1)}
          className="btn plus"
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>

      <button onClick={handleAddToCart} className="add-btn">
        Add to Cart
      </button>
    </div>
  );
};
