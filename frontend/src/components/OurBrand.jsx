import React from "react";
import "../assets/ourBrand.css";

export default function OurBrand() {
  // Just making 6 placeholders, can adjust as needed
  const brands = Array(6).fill(null);

  return (
    <section className="our-brand">
      <h2>Our Brands</h2>
      <div className="brand-container">
        {brands.map((_, i) => (
          <div className="brand-skeleton" key={i}></div>
        ))}
      </div>
    </section>
  );
}
