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
      <button className="carousel-arrow left" onClick={() => scroll(-300)}>&lt;</button>
      <div className="carousel-inner no-scrollbar" ref={scrollRef}>
        {children}
      </div>
      <button className="carousel-arrow right" onClick={() => scroll(300)}>&gt;</button>
    </div>
  );
};

export default Carousel;
