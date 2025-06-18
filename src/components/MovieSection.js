import React, { useState, useEffect } from 'react';
import MovieDetailModal from './MovieDetailModal';

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

const MovieSection = ({ fetchFunction, sectionTitle }) => {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);

  useEffect(() => {
    fetchFunction()
      .then(res => setMovies(res.data.results.map(item => ({ ...item, type: 'movie' }))))
      .catch(() => setMovies([]));
  }, [fetchFunction]);

  return (
    <section className="movie-section">
      <h2>{sectionTitle}</h2>
      <div className="movie-grid">
        {movies.map(movie => (
          <div
            key={movie.id}
            className="movie-card"
            onClick={() => setSelectedMovie(movie)}
            style={{ cursor: 'pointer' }}
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
            <div className="movie-title">{movie.title}</div>
            <div className="movie-meta">영화</div>
          </div>
        ))}
      </div>
      {selectedMovie && (
        <MovieDetailModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
          onRelatedSelect={m => setSelectedMovie({ ...m, type: 'movie' })}
        />
      )}
    </section>
  );
};

export default MovieSection;
