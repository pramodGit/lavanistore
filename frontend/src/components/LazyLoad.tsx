import React, { useEffect, useRef, useState, useCallback, ReactNode } from 'react';

interface LazyLoadProps {
  children: ReactNode;
  height?: number;
  rootMargin?: string;
  threshold?: number;
  fallback?: ReactNode;
}

const LazyLoad: React.FC<LazyLoadProps> = ({
  children,
  height = 200,
  rootMargin = '100px',
  threshold = 0.1,
  fallback = <div style={{ height }} />,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  const observerCallback = useCallback((entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
    const [entry] = entries;
    if (entry.isIntersecting) {
      setIsVisible(true);
      observer.disconnect();
    }
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(observerCallback, {
      threshold,
      rootMargin,
    });

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [observerCallback, threshold, rootMargin]);

  return (
    <div ref={ref}>
      {isVisible ? children : fallback}
    </div>
  );
};

export default LazyLoad;
