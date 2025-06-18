import React, { useRef } from 'react';
import './Carousel.css';

const Carousel = ({ children }) => {
  const scrollRef = useRef(null);

  const scroll = (offset) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <div className="carousel-outer">
      <button className="carousel-arrow carousel-btn left" onClick={() => scroll(-300)} aria-label="이전">
        &#60;
      </button>
      <div className="carousel-inner no-scrollbar" ref={scrollRef}>
        {children}
      </div>
      <button className="carousel-arrow carousel-btn right" onClick={() => scroll(300)} aria-label="다음">
        &#62;
      </button>
    </div>
  );
};

export default Carousel;
