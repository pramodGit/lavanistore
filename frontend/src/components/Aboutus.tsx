import React from "react";
import "../assets/aboutus.css"; // import CSS file

export default function Aboutus() {
  return (
    <section className="about-us">
        <h2>About Lavani Wellness</h2>
        <div className="about-container">
            {/* Left: Image */}
            {/* <div className="about-image">
            <img src="/assets/about.jpg" alt="About Lavani Wellness" />
            </div> */}
            <div className="about-content">
            <p>
                At <strong>Lavani Wellness</strong>, we are dedicated to providing
                high-quality wellness, lifestyle, and personal care products that
                bring balance to your everyday life. Our mission is to combine
                traditional values with modern innovations, offering solutions that
                improve health, beauty, and overall well-being.
            </p>
            <p>
                With a strong commitment to natural ingredients, sustainability, and
                customer satisfaction, Lavani Wellness has grown into a trusted brand for
                families across the globe. We believe in nurturing trust and
                delivering excellence in everything we do.
            </p>
            <button className="med-btn">Join Us</button>
            </div>
            {/* Right: Text */}
            <div className="about-content">
            <p>
                At <strong>Lavani Wellness</strong>, we are dedicated to providing
                high-quality wellness, lifestyle, and personal care products that
                bring balance to your everyday life. Our mission is to combine
                traditional values with modern innovations, offering solutions that
                improve health, beauty, and overall well-being.
            </p>
            <p>
                With a strong commitment to natural ingredients, sustainability, and
                customer satisfaction, Lavani Wellness has grown into a trusted brand for
                families across the globe. We believe in nurturing trust and
                delivering excellence in everything we do.
            </p>
            <button className="med-btn">Join Us</button>
            </div>
        </div>
    </section>
  );
}
