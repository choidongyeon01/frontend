import React, { useRef } from 'react';
import './Carousel_2.css';

const Carousel_2 = ({ children }) => {
  const scrollRef = useRef(null);

  // 한 번에 2개씩 스크롤 (부모 width의 50%씩)
  const scroll = (direction) => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      const card = container.querySelector('.carousel2-card');
      if (card) {
        const cardWidth = card.offsetWidth;
        const gap = parseInt(getComputedStyle(container).gap) || 0;
        const offset = (cardWidth + gap) * 2;
        container.scrollBy({ left: direction * offset, behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="carousel2-outer">
      <button
        className="carousel2-arrow left"
        onClick={() => scroll(-1)}
        aria-label="이전"
      >
        &#60;
      </button>
      <div className="carousel2-inner no-scrollbar" ref={scrollRef}>
        {children}
      </div>
      <button
        className="carousel2-arrow right"
        onClick={() => scroll(1)}
        aria-label="다음"
      >
        &#62;
      </button>
    </div>
  );
};

export default Carousel_2;
