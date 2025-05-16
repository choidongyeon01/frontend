// src/pages/Home.js
import React from 'react';
import Header from '../components/Header';
import WelcomeSection from '../components/WelcomeSection';
import FeaturedContent from '../components/FeaturedContent';
import LiveSection from '../components/LiveSection';
import MovieRow from '../components/MovieRow';
import tmdbApi from '../api/tmdb';
import '../styles/pages/Home.css';

const Home = () => {
  return (
    <div className="home-page">
      <Header />
      <main className="main-content">
        <WelcomeSection username="Jiyeon" />
        <div className="section-gap" />

        <FeaturedContent />
        <div className="section-gap" />

        <LiveSection />
        <div className="section-gap" />

        <section className="content-section">
          <h2>Trending Now</h2>
          <div className="movie-grid">
            <MovieRow 
              title="" 
              fetchFunction={tmdbApi.getTrending} 
              category="Drama, Romance" 
            />
          </div>
        </section>
        <div className="section-gap" />

        <section className="content-section">
          <h2>Popular Among Your Demographic</h2>
          <div className="movie-grid">
            <MovieRow 
              title="Political Power" 
              fetchFunction={() => tmdbApi.getMoviesByGenre(18)} 
              category="Drama" 
            />
            <MovieRow 
              title="Urban Lifestyle" 
              fetchFunction={() => tmdbApi.getMoviesByGenre(9648)} 
              category="Mystery" 
            />
            <MovieRow 
              title="Gentle War" 
              fetchFunction={() => tmdbApi.getMoviesByGenre(53)} 
              category="Spy Thriller" 
            />
          </div>
        </section>
        <div className="section-gap" />

        <section className="content-section">
          <h2>New Releases / Coming Soon</h2>
          <div className="movie-grid">
            <MovieRow 
              title="" 
              fetchFunction={tmdbApi.getUpcoming} 
              category="Coming Soon" 
            />
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
