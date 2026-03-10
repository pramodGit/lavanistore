// src/components/ProceedToBuyButton.tsx
import React, { memo, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const ProceedToBuyButton: React.FC = () => {
  const navigate = useNavigate();

  const handleClick = useCallback(() => {
    navigate("/checkout");
  }, [navigate]);

  return (
    <button className="checkout-btn" onClick={handleClick}>
      Proceed to Buy
    </button>
  );
};

export default memo(ProceedToBuyButton);
