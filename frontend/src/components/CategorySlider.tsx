import React, { useRef, useState, useEffect } from 'react';
import '../assets/categorySlider.css';
import { categories } from '../data/mockData';


export default function CategorySlider() {
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

  const totalItems = categories.length;

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
      result.push(categories[itemIndex]);
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

  return (
    <>
        <h2>Explore By Categories</h2>
        <div className="slider-container">
        <button className="nav-button left" onClick={handlePrev}>&lt;</button>

        <div className="slider-track">
            {getVisibleItems().map((item) => (
            <div className="slider-item" key={item.name}>
                <img src={item.image} alt={item.name} />
                <p>{item.name}</p>
            </div>
            ))}
        </div>

        <button className="nav-button right" onClick={handleNext}>&gt;</button>

        <div className="dots-container">{renderDots()}</div>
        </div>
    </>
  );
}
