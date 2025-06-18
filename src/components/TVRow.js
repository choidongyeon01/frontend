import React, { useState, useEffect } from 'react';
import './MovieRow/MovieRow.css';
import './MovieRow/TVRow.css';

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const ITEMS_PER_PAGE = 4;

const TVRow = ({
  title,
  items = [],
  onTVClick,
  titleClassName = '',    // ← 추가: 타이틀 클래스 prop
}) => {
  const [startIdx, setStartIdx] = useState(0);

  useEffect(() => {
    setStartIdx(0);
  }, [items]);

  const visibleTVs = items.slice(startIdx, startIdx + ITEMS_PER_PAGE);
  const maxStartIdx = Math.max(0, items.length - ITEMS_PER_PAGE);

  const handlePrev = () => setStartIdx(idx => Math.max(0, idx - 1));
  const handleNext = () => setStartIdx(idx => Math.min(maxStartIdx, idx + 1));

  return (
    <section className="movie-row-section">
      <h2 className={titleClassName}>{title}</h2> {/* ← 수정: props로 받은 클래스 적용 */}
      <div className="movie-row-carousel-wrap" style={{ position: 'relative' }}>
        {/* 왼쪽 캐러셀 버튼 (SVG) */}
        {items.length > ITEMS_PER_PAGE && (
          <button
            className="carousel-btn left"
            onClick={handlePrev}
            disabled={startIdx === 0}
            aria-label="이전"
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M15 18l-6-6 6-6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            </svg>
          </button>
        )}
        <div className="movie-row">
          {visibleTVs.map(tv => (
            <div
              key={tv.id}
              className="movie-card"
              onClick={() => onTVClick(tv)}
            >
              {tv.poster_path ? (
                <img
                  src={IMAGE_BASE_URL + tv.poster_path}
                  alt={tv.name}
                  className="movie-poster"
                />
              ) : (
                <div className="movie-no-image">No Image</div>
              )}
              <div className="movie-card-content">
                <h3 className="movie-title">{tv.name}</h3>
                <p className="movie-category">TV</p>
              </div>
            </div>
          ))}
        </div>
        {/* 오른쪽 캐러셀 버튼 (SVG) */}
        {items.length > ITEMS_PER_PAGE && (
          <button
            className="carousel-btn right"
            onClick={handleNext}
            disabled={startIdx >= maxStartIdx}
            aria-label="다음"
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 6l6 6-6 6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            </svg>
          </button>
        )}
      </div>
    </section>
  );
};

export default TVRow;
