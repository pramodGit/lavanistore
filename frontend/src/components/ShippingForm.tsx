import React, { memo } from "react";
import useShipping from "../hooks/useShipping";

const ShippingForm: React.FC = () => {
  const { shippingInfo, handleChange } = useShipping();

  return (
    <section className="checkout-section">
      <h3>Shipping Information</h3>

      {/* Name */}
      <div className="input-group">
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={shippingInfo.name}
          onChange={(e) => handleChange("name", e.target.value)}
        />
      </div>

      {/* Phone */}
      <div className="input-group">
        <input
          type="text"
          name="mobile"
          placeholder="Mobile Number"
          value={shippingInfo.mobile}
          onChange={(e) => handleChange("mobile", e.target.value)}
        />
      </div>

      {/* Address */}
      <div className="input-group">
        <textarea
          name="address"
          placeholder="Complete Address"
          rows={4}
          value={shippingInfo.address}
          onChange={(e) => handleChange("address", e.target.value)}
        ></textarea>
      </div>
    </section>
  );
};

export default memo(ShippingForm);
