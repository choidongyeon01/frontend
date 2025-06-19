import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import tmdbApi from '../../api/tmdb';
import MovieDetailModal from '../MovieDetailModal';
import TVDetailModal from '../TVDetailModal';
import './GenrePage.css';

const categories = [
  { id: 'all', name: 'All' },
  { id: 'variety', name: 'Variety' },
  { id: 'documentary', name: 'Documentary' },
  { id: 'reality', name: 'Reality' },
  { id: 'entertainment', name: 'Entertainment' },
  { id: 'drama', name: 'Drama' }
];

const GENRE_IDS = {
  variety: 10764,
  documentary: 99,
  reality: 10764,
  entertainment: 10762,
  drama: 18
};

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const ITEMS_PER_PAGE = 4;

const GenrePage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // 쿼리스트링에서 category 파라미터 읽기
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
    const fetchGenreContents = async () => {
      setLoading(true);
      let movieResults = [];
      let tvResults = [];

      try {
        if (selectedCategory === 'all') {
          const [movieDrama, movieDoc, tvDrama, tvDoc, tvVariety, tvReality, tvEntertainment] = await Promise.all([
            tmdbApi.getMovieByGenre(GENRE_IDS.drama),
            tmdbApi.getMovieByGenre(GENRE_IDS.documentary),
            tmdbApi.getTVByGenre(GENRE_IDS.drama),
            tmdbApi.getTVByGenre(GENRE_IDS.documentary),
            tmdbApi.getTVByGenre(GENRE_IDS.variety),
            tmdbApi.getTVByGenre(GENRE_IDS.reality),
            tmdbApi.getTVByGenre(GENRE_IDS.entertainment)
          ]);
          movieResults = [
            ...movieDrama.data.results.map(item => ({ ...item, type: 'movie' })),
            ...movieDoc.data.results.map(item => ({ ...item, type: 'movie' })),
          ];
          tvResults = [
            ...tvDrama.data.results.map(item => ({ ...item, type: 'tv' })),
            ...tvDoc.data.results.map(item => ({ ...item, type: 'tv' })),
            ...tvVariety.data.results.map(item => ({ ...item, type: 'tv' })),
            ...tvReality.data.results.map(item => ({ ...item, type: 'tv' })),
            ...tvEntertainment.data.results.map(item => ({ ...item, type: 'tv' })),
          ];
        } else if (selectedCategory === 'drama' || selectedCategory === 'documentary') {
          const [movieRes, tvRes] = await Promise.all([
            tmdbApi.getMovieByGenre(GENRE_IDS[selectedCategory]),
            tmdbApi.getTVByGenre(GENRE_IDS[selectedCategory])
          ]);
          movieResults = movieRes.data.results.map(item => ({ ...item, type: 'movie' }));
          tvResults = tvRes.data.results.map(item => ({ ...item, type: 'tv' }));
        } else {
          const tvRes = await tmdbApi.getTVByGenre(GENRE_IDS[selectedCategory]);
          movieResults = [];
          tvResults = tvRes.data.results.map(item => ({ ...item, type: 'tv' }));
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

    fetchGenreContents();
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
    <div className="genre-page-container">
      {/* 상단에 현재 카테고리명만 보여줌 */}
      <h2 className="genre-category-title">{categoryName}</h2>
      <div className="genre-category-divider" />
      {loading ? (
        <div style={{ color: '#fff', padding: '40px', textAlign: 'center' }}>Loading...</div>
      ) : (
        <>
          {/* 영화 섹션 */}
          <div className="genre-content-section">
            <h2 className="genre-section-title">이 장르의 영화</h2>
            <div style={{ position: 'relative' }}>
              <button
                className="genre-carousel-btn left"
                onClick={handleMoviePrev}
                disabled={movieStartIdx === 0}
                aria-label="이전"
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M15 18l-6-6 6-6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                </svg>
              </button>
              <div className="genre-content-grid">
                {visibleMovies.map(item => (
                  <div
                    key={item.id}
                    className="genre-card"
                    onClick={() => setSelectedMovie({ ...item, type: 'movie' })}
                  >
                    {item.poster_path ? (
                      <img
                        src={IMAGE_BASE_URL + item.poster_path}
                        alt={item.title || item.name}
                        className="genre-poster"
                      />
                    ) : (
                      <div className="genre-no-image">No Image</div>
                    )}
                    <div className="genre-card-content">
                      <div className="genre-title">{item.title || item.name}</div>
                      <div className="genre-meta">영화</div>
                    </div>
                  </div>
                ))}
                {emptyMovieSlots.map((_, idx) => (
                  <div key={`empty-movie-${idx}`} className="genre-card empty-card" />
                ))}
              </div>
              <button
                className="genre-carousel-btn right"
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
          <div className="genre-content-section">
            <h2 className="genre-section-title">이 장르의 TV 프로그램</h2>
            <div style={{ position: 'relative' }}>
              <button
                className="genre-carousel-btn left"
                onClick={handleTVPrev}
                disabled={tvStartIdx === 0}
                aria-label="이전"
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M15 18l-6-6 6-6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                </svg>
              </button>
              <div className="genre-content-grid">
                {visibleTVs.map(item => (
                  <div
                    key={item.id}
                    className="genre-card"
                    onClick={() => setSelectedTV({ ...item, type: 'tv' })}
                  >
                    {item.poster_path ? (
                      <img
                        src={IMAGE_BASE_URL + item.poster_path}
                        alt={item.title || item.name}
                        className="genre-poster"
                      />
                    ) : (
                      <div className="genre-no-image">No Image</div>
                    )}
                    <div className="genre-card-content">
                      <div className="genre-title">{item.title || item.name}</div>
                      <div className="genre-meta">TV</div>
                    </div>
                  </div>
                ))}
                {emptyTVSlots.map((_, idx) => (
                  <div key={`empty-tv-${idx}`} className="genre-card empty-card" />
                ))}
              </div>
              <button
                className="genre-carousel-btn right"
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

export default GenrePage;
