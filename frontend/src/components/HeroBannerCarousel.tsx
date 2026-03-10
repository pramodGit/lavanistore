import React, { useCallback, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import "../assets/HeroBannerCarousel.css";

interface Banner {
  id: number;
  image: string;
  link?: string;
  alt?: string;
}

interface HeroBannerCarouselProps {
  banners: Banner[];
  autoplayDelay?: number; // ms
}

const HeroBannerCarousel: React.FC<HeroBannerCarouselProps> = ({
  banners,
  autoplayDelay = 1000,
}) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  // Auto swipe
  useEffect(() => {
    if (!emblaApi) return;
    let autoplayTimer: number;

    const play = () => {
      autoplayTimer = window.setInterval(() => {
        emblaApi.scrollNext();
      }, autoplayDelay);
    };

    const stop = () => window.clearInterval(autoplayTimer);

    play();
    const node = emblaApi.rootNode();
    node.addEventListener("mouseenter", stop);
    node.addEventListener("mouseleave", play);

    return () => {
      stop();
      node.removeEventListener("mouseenter", stop);
      node.removeEventListener("mouseleave", play);
    };
  }, [emblaApi, autoplayDelay]);

  return (
    <div className="hero-banner-carousel">
        <div className="embla" ref={emblaRef}>
            <div className="embla__container">
            {banners.map((banner) => (
                <div className="embla__slide" key={banner.id}>
                <img src={banner.image} alt={banner.alt || "Banner"} loading="lazy" />
                </div>
            ))}
            </div>
        </div>

        <button onClick={scrollPrev}>‹</button>
        <button onClick={scrollNext}>›</button>
        </div>
  );
};

export default HeroBannerCarousel;