import React, { useRef, useState, useEffect } from 'react';
import '../assets/bestSellerSlider.css';
import { bestSeller } from '../data/mockData';


export default function BestSellerSlider() {
  const [index, setIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(6);

  useEffect(() => {
    const updateCount = () => {
      if (window.innerWidth <= 600) {
        setVisibleCount(1);
      } else if (window.innerWidth <= 900) {
        setVisibleCount(3);
      } else {
        setVisibleCount(6);
      }
    };
    updateCount();
    window.addEventListener('resize', updateCount);
    return () => window.removeEventListener('resize', updateCount);
  }, []);

  const totalItems = bestSeller.length;

  const handlePrev = () => {
    setIndex((prev) => (prev - 1 + totalItems) % totalItems);
  };

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % totalItems);
  };

  const getVisibleItems = () => {
    const result = [];
    for (let i = 0; i < visibleCount; i++) {
      const itemIndex = (index + i) % totalItems;
      result.push(bestSeller[itemIndex]);
    }
    return result;
  };

  const renderDots = () => {
    const dotCount = Math.ceil(totalItems / visibleCount);
    return [...Array(dotCount)].map((_, i) => (
      <span
        key={i}
        className={`dot ${i === Math.floor(index / visibleCount) ? 'active' : ''}`}
        onClick={() => setIndex(i * visibleCount)}
      />
    ));
  };

  // Autoplay effect
  useEffect(() => {
    const autoplay = setInterval(() => {
      handleNext();
    }, 3000); // 3 seconds
    return () => clearInterval(autoplay); // cleanup on unmount
  }, [totalItems]); // no index here so it doesn't reset interval each time

  return (
    <>
        <h2>Best Seller</h2>
        <div className="bestSeller-container">
          <button className="nav-button left" onClick={handlePrev}>&lt;</button>

          <div className="bestSeller-track">
              {getVisibleItems().map((item) => (
                <div className="bestSeller-item" key={item.name}>
                    <img src={item.image} alt={item.name} />
                    <h4>{item.name}</h4>
                    <p>Rating</p>
                    <button className='sm-btn'>Add to Cart</button>
                </div>
              ))}
          </div>

          <button className="nav-button right" onClick={handleNext}>&gt;</button>

          <div className="dots-container">{renderDots()}</div>
        </div>
    </>
  );
}
