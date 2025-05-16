// src/components/MovieCard.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/components/MovieCard.css';

const MovieCard = ({ movie, category }) => {
  return (
    <Link to={`/movie/${movie.id}`} className="movie-card">
      <div className="movie-poster">
        <img 
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
          alt={movie.title} 
        />
      </div>
      <div className="movie-info">
        <h4>{movie.title}</h4>
        <p>{category}</p>
      </div>
    </Link>
  );
};

export default MovieCard;
