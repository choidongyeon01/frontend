import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import tmdbApi from '../api/tmdb';
import Carousel_Search from '../components/Carousel/Carousel_Search';
import MovieDetailModal from '../components/MovieDetailModal';
import TVDetailModal from '../components/TVDetailModal';
import '../styles/pages/SearchResults.css';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w300';

const SearchResults = () => {
  const query = useQuery();
  const searchTerm = query.get('q') || '';
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // 모달 상태
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedTV, setSelectedTV] = useState(null);

  useEffect(() => {
    if (!searchTerm) return;
    setLoading(true);
    tmdbApi
      .searchMulti(searchTerm)
      .then(res => setResults(res.data.results || []))
      .finally(() => setLoading(false));
  }, [searchTerm]);

  // 영화와 TV로 분리
  const movies = results.filter(item => item.media_type === 'movie');
  const tvs = results.filter(item => item.media_type === 'tv');

  return (
    <div className="search-results-page">
      <h2 className="search-main-title">
        검색 결과: <span className="search-term">{searchTerm}</span>
      </h2>
      {loading && <div>검색 중...</div>}
      {!loading && results.length === 0 && <div>검색 결과가 없습니다.</div>}

      {/* 영화 섹션 */}
      {movies.length > 0 && (
        <section className="search-section">
          <h3 className="search-section-title">🎬 영화</h3>
          <Carousel_Search>
            {movies.map(item => (
              <div
                key={item.id}
                className="search-carousel-item"
                onClick={() => setSelectedMovie(item)}
                style={{ cursor: 'pointer' }}
              >
                {item.poster_path ? (
                  <img
                    src={IMAGE_BASE_URL + item.poster_path}
                    alt={item.title}
                    className="search-carousel-poster"
                  />
                ) : (
                  <div className="search-no-image">No Image</div>
                )}
                <div className="search-carousel-item-title">{item.title}</div>
              </div>
            ))}
          </Carousel_Search>
        </section>
      )}

      {/* TV 섹션 */}
      {tvs.length > 0 && (
        <section className="search-section">
          <h3 className="search-section-title">📺 TV 프로그램</h3>
          <Carousel_Search>
            {tvs.map(item => (
              <div
                key={item.id}
                className="search-carousel-item"
                onClick={() => setSelectedTV(item)}
                style={{ cursor: 'pointer' }}
              >
                {item.poster_path ? (
                  <img
                    src={IMAGE_BASE_URL + item.poster_path}
                    alt={item.name}
                    className="search-carousel-poster"
                  />
                ) : (
                  <div className="search-no-image">No Image</div>
                )}
                <div className="search-carousel-item-title">{item.name}</div>
              </div>
            ))}
          </Carousel_Search>
        </section>
      )}

      {/* 영화 상세 모달 */}
      {selectedMovie && (
        <MovieDetailModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}

      {/* TV 상세 모달 */}
      {selectedTV && (
        <TVDetailModal
          tv={selectedTV}
          onClose={() => setSelectedTV(null)}
        />
      )}
    </div>
  );
};

export default SearchResults;
