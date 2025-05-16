// src/pages/MovieDetail.js
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import tmdbApi from '../api/tmdb';
import '../styles/pages/MovieDetail.css';

const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await tmdbApi.getMovieDetails(id);
        setMovie(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching movie details:', error);
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!movie) {
    return <div className="error">Movie not found</div>;
  }

  return (
    <div className="movie-detail-page">
      <Header />
      <div className="movie-backdrop" style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})` }}>
        <div className="backdrop-overlay">
          <div className="movie-detail-content">
            <div className="movie-poster">
              <img 
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                alt={movie.title} 
              />
            </div>
            <div className="movie-info">
              <h1>{movie.title}</h1>
              <div className="movie-meta">
                <span className="release-date">{new Date(movie.release_date).getFullYear()}</span>
                <span className="runtime">{movie.runtime} min</span>
                <span className="rating">{movie.vote_average.toFixed(1)}/10</span>
              </div>
              <div className="genres">
                {movie.genres.map(genre => (
                  <span key={genre.id} className="genre">{genre.name}</span>
                ))}
              </div>
              <div className="overview">
                <h3>Overview</h3>
                <p>{movie.overview}</p>
              </div>
              <div className="actions">
                <button className="watch-now">Watch Now</button>
                <button className="add-to-list">+ My List</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
