import React, { useState } from "react";

const ShippingAddress: React.FC = () => {
  const [form, setForm] = useState({ name: "", address: "" });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!form.address.trim()) newErrors.address = "Address is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <div className="checkout-section">
      <h3>Shipping Address</h3>

      <div className="input-group">
        {errors.name && <div className="error-text">{errors.name}</div>}
        <input
          type="text"
          name="name"
          placeholder="Full Name (optional)"
          value={form.name}
          onChange={onChange}
        />
      </div>

      <div className="input-group">
        {errors.address && <div className="error-text">{errors.address}</div>}
        <textarea
          name="address"
          placeholder="Shipping Address *"
          className={errors.address ? "error-input" : ""}
          value={form.address}
          onChange={onChange}
          rows={4}
          required
          onBlur={validate}  // validate on blur
        />
      </div>
    </div>
  );
};

export default ShippingAddress;
