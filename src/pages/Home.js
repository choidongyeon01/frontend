import React, { useState, useEffect } from 'react';
import WelcomeSection from '../components/WelcomeSection';
import LiveSection from '../components/LiveSection';
import MovieRow from '../components/MovieRow';
import TVRow from '../components/TVRow';
import MovieDetailModal from '../components/MovieDetailModal';
import TVDetailModal from '../components/TVDetailModal';
import tmdbApi from '../api/tmdb';
import '../styles/pages/Home.css';

const Home = ({ selectedProfile }) => {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedTV, setSelectedTV] = useState(null);

  const [trendingMovies, setTrendingMovies] = useState([]);
  const [personalizedMovies, setPersonalizedMovies] = useState([]);
  const [popularTV, setPopularTV] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [trendingRes, personalizedRes, popularTVRes] = await Promise.all([
          tmdbApi.trending(),
          tmdbApi.popular(),
          tmdbApi.getPopularTV()
        ]);
        setTrendingMovies(trendingRes.data.results.map(item => ({ ...item, type: 'movie' })));
        setPersonalizedMovies(personalizedRes.data.results.map(item => ({ ...item, type: 'movie' })));
        setPopularTV(popularTVRes.data.results.map(item => ({ ...item, type: 'tv' })));
      } catch (e) {
        setTrendingMovies([]);
        setPersonalizedMovies([]);
        setPopularTV([]);
      }
      setLoading(false);
    };
    fetchAll();
  }, []);

  if (loading) {
    return <div style={{ color: '#fff', padding: '40px', textAlign: 'center' }}>Loading...</div>;
  }

  return (
    <div className="home-page">
      <main className="main-content">
        <WelcomeSection selectedProfile={selectedProfile} />
        <LiveSection />
        <MovieRow
          title="Trending Now"
          items={trendingMovies}
          onMovieClick={movie => setSelectedMovie({ ...movie, type: 'movie' })}
        />
        <MovieRow
          title="Personalized for You"
          items={personalizedMovies}
          onMovieClick={movie => setSelectedMovie({ ...movie, type: 'movie' })}
        />
        <TVRow
          title="인기 TV 프로그램"
          items={popularTV}
          onTVClick={tv => setSelectedTV({ ...tv, type: 'tv' })}
          titleClassName="tv-row-title"
        />
        {selectedMovie && (
          <MovieDetailModal
            movie={selectedMovie}
            onClose={() => setSelectedMovie(null)}
            onRelatedSelect={m => setSelectedMovie({ ...m, type: 'movie' })}
          />
        )}
        {selectedTV && (
          <TVDetailModal
            tv={selectedTV}
            onClose={() => setSelectedTV(null)}
            onRelatedSelect={t => setSelectedTV({ ...t, type: 'tv' })}
          />
        )}
      </main>
    </div>
  );
};

export default Home;
