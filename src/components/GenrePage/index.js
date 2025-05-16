import React, { useState, useEffect } from 'react';
import tmdbApi from '../../api/tmdb';
import './GenrePage.css';
import GenreDetailModal from '../GenreDetailModal';

const categories = [
  { id: 'all', name: 'All' },
  { id: 'variety', name: 'Variety' },
  { id: 'documentary', name: 'Documentary' },
  { id: 'reality', name: 'Reality' },
  { id: 'entertainment', name: 'Entertainment' },
  { id: 'drama', name: 'Drama' }
];

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

const GENRE_IDS = {
  variety: 10764,       // TV Variety
  documentary: 99,      // Movie/TV Documentary
  reality: 10764,       // TV Reality
  entertainment: 10762, // TV Kids (예시, 실제 엔터 장르는 별도 확인 필요)
  drama: 18             // Movie/TV Drama
};

const GenrePage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [genreContents, setGenreContents] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedType, setSelectedType] = useState('movie');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchGenreContents = async () => {
      setLoading(true);
      let results = [];

      try {
        if (selectedCategory === 'all') {
          // 예시: 드라마(영화+TV), 다큐(영화+TV), 버라이어티/리얼리티/엔터(주로 TV)
          const [movieDrama, tvDrama, movieDoc, tvDoc, tvVariety, tvReality, tvEntertainment] = await Promise.all([
            tmdbApi.getMovieByGenre(GENRE_IDS.drama),
            tmdbApi.getTVByGenre(GENRE_IDS.drama),
            tmdbApi.getMovieByGenre(GENRE_IDS.documentary),
            tmdbApi.getTVByGenre(GENRE_IDS.documentary),
            tmdbApi.getTVByGenre(GENRE_IDS.variety),
            tmdbApi.getTVByGenre(GENRE_IDS.reality),
            tmdbApi.getTVByGenre(GENRE_IDS.entertainment)
          ]);
          results = [
            ...movieDrama.data.results.map(item => ({ ...item, type: 'movie' })),
            ...tvDrama.data.results.map(item => ({ ...item, type: 'tv' })),
            ...movieDoc.data.results.map(item => ({ ...item, type: 'movie' })),
            ...tvDoc.data.results.map(item => ({ ...item, type: 'tv' })),
            ...tvVariety.data.results.map(item => ({ ...item, type: 'tv' })),
            ...tvReality.data.results.map(item => ({ ...item, type: 'tv' })),
            ...tvEntertainment.data.results.map(item => ({ ...item, type: 'tv' }))
          ];
        } else if (selectedCategory === 'drama') {
          const [movieDrama, tvDrama] = await Promise.all([
            tmdbApi.getMovieByGenre(GENRE_IDS.drama),
            tmdbApi.getTVByGenre(GENRE_IDS.drama)
          ]);
          results = [
            ...movieDrama.data.results.map(item => ({ ...item, type: 'movie' })),
            ...tvDrama.data.results.map(item => ({ ...item, type: 'tv' }))
          ];
        } else if (selectedCategory === 'documentary') {
          const [movieDoc, tvDoc] = await Promise.all([
            tmdbApi.getMovieByGenre(GENRE_IDS.documentary),
            tmdbApi.getTVByGenre(GENRE_IDS.documentary)
          ]);
          results = [
            ...movieDoc.data.results.map(item => ({ ...item, type: 'movie' })),
            ...tvDoc.data.results.map(item => ({ ...item, type: 'tv' }))
          ];
        } else if (selectedCategory === 'variety') {
          const tvVariety = await tmdbApi.getTVByGenre(GENRE_IDS.variety);
          results = tvVariety.data.results.map(item => ({ ...item, type: 'tv' }));
        } else if (selectedCategory === 'reality') {
          const tvReality = await tmdbApi.getTVByGenre(GENRE_IDS.reality);
          results = tvReality.data.results.map(item => ({ ...item, type: 'tv' }));
        } else if (selectedCategory === 'entertainment') {
          const tvEntertainment = await tmdbApi.getTVByGenre(GENRE_IDS.entertainment);
          results = tvEntertainment.data.results.map(item => ({ ...item, type: 'tv' }));
        }
      } catch (e) {
        results = [];
      }

      setGenreContents(results);
      setLoading(false);
    };

    fetchGenreContents();
  }, [selectedCategory]);

  // 카드 클릭 시 모달 오픈
  const handleItemClick = (item, type) => {
    setSelectedItem(item);
    setSelectedType(type);
  };

  return (
    <div className="genre-page-container">
      <div className="genre-category-filter-bar">
        {categories.map(cat => (
          <button
            key={cat.id}
            className={`genre-category-btn${selectedCategory === cat.id ? ' active' : ''}`}
            onClick={() => setSelectedCategory(cat.id)}
          >
            {cat.name}
          </button>
        ))}
      </div>
      <div className="genre-category-divider" />
      {loading ? (
        <div style={{ color: '#fff', padding: '40px', textAlign: 'center' }}>Loading...</div>
      ) : (
        <div className="genre-content-grid">
          {genreContents.length === 0 ? (
            <div style={{ color: '#bbb', gridColumn: '1/-1', textAlign: 'center', padding: '40px 0' }}>
              No content available.
            </div>
          ) : (
            genreContents.map(item => (
              <div
                key={`${item.id}-${item.type}`}
                className="genre-card"
                onClick={() => handleItemClick(item, item.type)}
                style={{ cursor: 'pointer' }}
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
                  <div className="genre-meta">
                    {item.type === 'movie' ? '영화' : 'TV'}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* 상세 모달 */}
      {selectedItem && (
        <GenreDetailModal
          item={selectedItem}
          type={selectedType}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </div>
  );
};

export default GenrePage;
