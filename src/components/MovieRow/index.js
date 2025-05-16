import React, { useState, useEffect } from 'react';
import './MovieRow.css';
import MovieDetailModal from '../MovieDetailModal';

const MOVIES_PER_PAGE = 4;
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

const MovieRow = ({ title, fetchFunction, category }) => {
  const [movies, setMovies] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [selectedMovie, setSelectedMovie] = useState(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetchFunction();
        setMovies(response.data.results.filter(m => m.poster_path));
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };
    fetchMovies();
  }, [fetchFunction]);

  const handlePrev = () => setStartIndex(idx => Math.max(idx - 1, 0));
  const handleNext = () => setStartIndex(idx => Math.min(idx + 1, movies.length - MOVIES_PER_PAGE));

  const visibleMovies = movies.slice(startIndex, startIndex + MOVIES_PER_PAGE);
  const emptySlots = Array(Math.max(0, MOVIES_PER_PAGE - visibleMovies.length)).fill(null);

  return (
    <div className="movie-row">
      <h2 className="section-title">{title}</h2>
      <div className="carousel-container">
        <button
          className="carousel-btn left"
          onClick={handlePrev}
          aria-label="이전"
          disabled={startIndex === 0}
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M15 18l-6-6 6-6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          </svg>
        </button>
        <div className="carousel-list">
          {visibleMovies.map(movie => (
            <div
              key={movie.id}
              className="movie-card"
              onClick={() => setSelectedMovie(movie)}
              style={{ cursor: 'pointer' }}
            >
              {/* 포스터 이미지 (VODPage와 동일한 구조) */}
              {movie.poster_path ? (
                <img
                  className="movie-poster"
                  src={`${IMAGE_BASE_URL}${movie.poster_path}`}
                  alt={movie.title}
                />
              ) : (
                <div className="movie-no-image">No Image</div>
              )}
              <div className="movie-card-content">
                <div className="movie-title">{movie.title}</div>
                <div className="movie-category">{category}</div>
              </div>
            </div>
          ))}
          {emptySlots.map((_, idx) => (
            <div key={`empty-${idx}`} className="movie-card empty-card"></div>
          ))}
        </div>
        <button
          className="carousel-btn right"
          onClick={handleNext}
          aria-label="다음"
          disabled={startIndex >= movies.length - MOVIES_PER_PAGE}
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M9 6l6 6-6 6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          </svg>
        </button>
      </div>
      {selectedMovie && (
        <MovieDetailModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </div>
  );
};

export default MovieRow;
