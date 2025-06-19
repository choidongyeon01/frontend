import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import tmdbApi from '../../api/tmdb';
import MovieDetailModal from '../MovieDetailModal';
import TVDetailModal from '../TVDetailModal';
import './VODPage.css';

const categories = [
  { id: 'all', name: 'All' },
  { id: 'news', name: 'News' },
  { id: 'drama', name: 'Drama' },
  { id: 'sports', name: 'Sports' },
  { id: 'talkshow', name: 'Talk Show' }
];

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const ITEMS_PER_PAGE = 4;

const VODPage = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const selectedCategory = (params.get('category') || 'all').toLowerCase();

  const [movieList, setMovieList] = useState([]);
  const [tvList, setTVList] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedTV, setSelectedTV] = useState(null);
  const [loading, setLoading] = useState(false);

  // 캐러셀 상태 (영화/TV 각각)
  const [movieStartIdx, setMovieStartIdx] = useState(0);
  const [tvStartIdx, setTVStartIdx] = useState(0);

  useEffect(() => {
    const fetchVODContents = async () => {
      setLoading(true);
      let movieResults = [];
      let tvResults = [];
      try {
        if (selectedCategory === 'all') {
          const [movieRes, tvRes] = await Promise.all([
            tmdbApi.popular(),
            tmdbApi.getPopularTV()
          ]);
          movieResults = movieRes.data.results.map(item => ({ ...item, type: 'movie' }));
          tvResults = tvRes.data.results.map(item => ({ ...item, type: 'tv' }));
        } else if (selectedCategory === 'news') {
          const tvNews = await tmdbApi.getNewsTV();
          movieResults = [];
          tvResults = tvNews.data.results.map(item => ({ ...item, type: 'tv' }));
        } else if (selectedCategory === 'drama') {
          const [movieDrama, tvDrama] = await Promise.all([
            tmdbApi.getDramaMovie(),
            tmdbApi.getDramaTV()
          ]);
          movieResults = movieDrama.data.results.map(item => ({ ...item, type: 'movie' }));
          tvResults = tvDrama.data.results.map(item => ({ ...item, type: 'tv' }));
        } else if (selectedCategory === 'talkshow') {
          const tvTalk = await tmdbApi.getTalkshowTV();
          movieResults = [];
          tvResults = tvTalk.data.results.map(item => ({ ...item, type: 'tv' }));
        } else if (selectedCategory === 'sports') {
          movieResults = [];
          tvResults = [];
        }
      } catch (e) {
        movieResults = [];
        tvResults = [];
      }
      setMovieList(movieResults);
      setTVList(tvResults);
      setMovieStartIdx(0);
      setTVStartIdx(0);
      setLoading(false);
    };
    fetchVODContents();
  }, [selectedCategory]);

  // 카테고리명 찾기
  const categoryName = categories.find(cat => cat.id === selectedCategory)?.name || 'All';

  // 캐러셀 버튼 핸들러
  const handleMoviePrev = () => setMovieStartIdx(idx => Math.max(0, idx - 1));
  const handleMovieNext = () => setMovieStartIdx(idx => Math.min(movieList.length - ITEMS_PER_PAGE, idx + 1));
  const handleTVPrev = () => setTVStartIdx(idx => Math.max(0, idx - 1));
  const handleTVNext = () => setTVStartIdx(idx => Math.min(tvList.length - ITEMS_PER_PAGE, idx + 1));

  // 보여줄 카드 slice
  const visibleMovies = movieList.slice(movieStartIdx, movieStartIdx + ITEMS_PER_PAGE);
  const visibleTVs = tvList.slice(tvStartIdx, tvStartIdx + ITEMS_PER_PAGE);

  // 빈 칸 채우기 (4개 미만일 때)
  const emptyMovieSlots = Array(Math.max(0, ITEMS_PER_PAGE - visibleMovies.length)).fill(null);
  const emptyTVSlots = Array(Math.max(0, ITEMS_PER_PAGE - visibleTVs.length)).fill(null);

  return (
    <div className="vod-page-container">
      {/* 상단에 현재 카테고리명만 보여줌 */}
      <h2 className="vod-category-title">{categoryName}</h2>
      <div className="vod-category-divider" />
      {loading ? (
        <div style={{ color: '#fff', padding: '40px', textAlign: 'center' }}>Loading...</div>
      ) : (
        <>
          {/* 영화 섹션 */}
          <div className="vod-content-section">
            <h2 className="vod-section-title">VOD 영화</h2>
            <div style={{ position: 'relative' }}>
              <button
                className="carousel-btn left"
                onClick={handleMoviePrev}
                disabled={movieStartIdx === 0}
                aria-label="이전"
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M15 18l-6-6 6-6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                </svg>
              </button>
              <div className="vod-content-grid">
                {visibleMovies.map(item => (
                  <div
                    key={item.id}
                    className="vod-card"
                    onClick={() => setSelectedMovie({ ...item, type: 'movie' })}
                  >
                    {item.poster_path ? (
                      <img
                        src={IMAGE_BASE_URL + item.poster_path}
                        alt={item.title || item.name}
                        className="vod-poster"
                      />
                    ) : (
                      <div className="vod-no-image">No Image</div>
                    )}
                    <div className="vod-card-content">
                      <div className="vod-title">{item.title || item.name}</div>
                      <div className="vod-meta">영화</div>
                    </div>
                  </div>
                ))}
                {emptyMovieSlots.map((_, idx) => (
                  <div key={`empty-movie-${idx}`} className="vod-card empty-card" />
                ))}
              </div>
              <button
                className="carousel-btn right"
                onClick={handleMovieNext}
                disabled={movieStartIdx >= movieList.length - ITEMS_PER_PAGE}
                aria-label="다음"
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 6l6 6-6 6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                </svg>
              </button>
            </div>
          </div>
          {/* TV 섹션 */}
          <div className="vod-content-section">
            <h2 className="vod-section-title">VOD TV 프로그램</h2>
            <div style={{ position: 'relative' }}>
              <button
                className="carousel-btn left"
                onClick={handleTVPrev}
                disabled={tvStartIdx === 0}
                aria-label="이전"
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M15 18l-6-6 6-6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                </svg>
              </button>
              <div className="vod-content-grid">
                {visibleTVs.map(item => (
                  <div
                    key={item.id}
                    className="vod-card"
                    onClick={() => setSelectedTV({ ...item, type: 'tv' })}
                  >
                    {item.poster_path ? (
                      <img
                        src={IMAGE_BASE_URL + item.poster_path}
                        alt={item.title || item.name}
                        className="vod-poster"
                      />
                    ) : (
                      <div className="vod-no-image">No Image</div>
                    )}
                    <div className="vod-card-content">
                      <div className="vod-title">{item.title || item.name}</div>
                      <div className="vod-meta">TV</div>
                    </div>
                  </div>
                ))}
                {emptyTVSlots.map((_, idx) => (
                  <div key={`empty-tv-${idx}`} className="vod-card empty-card" />
                ))}
              </div>
              <button
                className="carousel-btn right"
                onClick={handleTVNext}
                disabled={tvStartIdx >= tvList.length - ITEMS_PER_PAGE}
                aria-label="다음"
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 6l6 6-6 6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                </svg>
              </button>
            </div>
          </div>
        </>
      )}

      {/* 상세 모달 */}
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
    </div>
  );
};

export default VODPage;
