import React, { useState, useRef, useEffect } from 'react';
import { navBar, navBarSubcategories, NavBar } from '../data/mockData';
import '../assets/dropdown.css';
import { Link } from 'react-router-dom';

interface DropdownMenuProps {
  navBar: string[];
  navBarSubcategories: Record<string, string[]>;
}

const ITEMS_PER_COLUMN = 8;

const DropdownMenu: React.FC = () => {
  const [hoveredCategory, setHoveredCategory] = useState<NavBar | null>(null);
  const [menuLeft, setMenuLeft] = useState<number>(0);
  const hoverRef = useRef<HTMLDivElement | null>(null);

  // Adjust dropdown position based on parent menu width
  useEffect(() => {
    if (hoverRef.current && hoveredCategory) {
      const rect = hoverRef.current.getBoundingClientRect();
      // dropdown opens just to the right
      setMenuLeft(rect.left - 100);
    }
  }, [hoveredCategory]);

  const chunkArray = (array: string[], size: number) => {
    const result: string[][] = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  };

  return (
    <div className="dropdown-menu-group">
      {navBar.map((category) => {
        const isHovered = hoveredCategory === category;
        const subcategories = navBarSubcategories[category] || [];
        const chunked = chunkArray(subcategories, ITEMS_PER_COLUMN);

        return (
          <div
            key={category}
            className="dropdown-menu-items"
            onMouseEnter={() => setHoveredCategory(category)}
            onMouseLeave={() => setHoveredCategory(null)}
            ref={isHovered ? hoverRef : null}
          >
            <Link to="/product-list">{category}</Link>
            {subcategories.length > 0 && <span className="arrow" />}
            
            {isHovered && subcategories.length > 0 && (
              <div
                className="dropdown-sub-menu"
                style={{ left: `${menuLeft}px` }}
              >
                {chunked.map((column, colIndex) => (
                  <ul key={colIndex} className="dropdown-sub-menu-item">
                    {column.map((sub, idx) => (
                      <li
                        key={idx}
                        onClick={() => alert(`${sub} clicked under ${category}`)}
                      >
                        <a href={sub}>{sub}</a>
                      </li>
                    ))}
                  </ul>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default DropdownMenu;
