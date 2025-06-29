import React, { useState, useEffect } from 'react';
import './MovieRow.css';

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const ITEMS_PER_PAGE = 4;

const MovieRow = ({ title, items = [], onMovieClick }) => {
  const [startIdx, setStartIdx] = useState(0);

  useEffect(() => {
    setStartIdx(0);
  }, [items]);

  const visibleMovies = items.slice(startIdx, startIdx + ITEMS_PER_PAGE);
  const maxStartIdx = Math.max(0, items.length - ITEMS_PER_PAGE);

  const handlePrev = () => setStartIdx(idx => Math.max(0, idx - 1));
  const handleNext = () => setStartIdx(idx => Math.min(maxStartIdx, idx + 1));

  return (
    <section className="movie-row-section">
      <h2 className="movie-row-title">{title}</h2>
      <div className="movie-row-carousel-wrap">
        {items.length > ITEMS_PER_PAGE && (
          <button
            className="movie-row-carousel-btn left"
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
          {visibleMovies.map(movie => (
            <div
              key={movie.id}
              className="movie-card"
              onClick={() => onMovieClick(movie)}
            >
              {movie.poster_path ? (
                <img
                  src={IMAGE_BASE_URL + movie.poster_path}
                  alt={movie.title}
                  className="movie-poster"
                />
              ) : (
                <div className="movie-no-image">No Image</div>
              )}
              <div className="movie-card-content">
                <h3 className="movie-title">{movie.title}</h3>
                <p className="movie-category">영화</p>
              </div>
            </div>
          ))}
        </div>
        {items.length > ITEMS_PER_PAGE && (
          <button
            className="movie-row-carousel-btn right"
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

export default MovieRow;
