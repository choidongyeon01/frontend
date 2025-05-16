import React, { useState, useEffect } from 'react';
import tmdbApi, { GENRE_IDS } from '../../api/tmdb';
import './VODPage.css';
import VODDetailModal from '../VODDetailModal';

const categories = [
  { id: 'all', name: 'All' },
  { id: 'news', name: 'News' },
  { id: 'drama', name: 'Drama' },
  { id: 'sports', name: 'Sports' },
  { id: 'talkshow', name: 'Talk Show' }
];

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

const VODPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [vodList, setVodList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedVod, setSelectedVod] = useState(null);

  useEffect(() => {
    const fetchVod = async () => {
      setLoading(true);
      let results = [];

      try {
        if (selectedCategory === 'all') {
          const movieDrama = await tmdbApi.getDramaMovie();
          const tvDrama = await tmdbApi.getDramaTV();
          const tvNews = await tmdbApi.getNewsTV();
          const tvTalk = await tmdbApi.getTalkshowTV();
          results = [
            ...movieDrama.data.results.map(item => ({ ...item, type: 'movie' })),
            ...tvDrama.data.results.map(item => ({ ...item, type: 'tv' })),
            ...tvNews.data.results.map(item => ({ ...item, type: 'tv' })),
            ...tvTalk.data.results.map(item => ({ ...item, type: 'tv' })),
          ];
        } else if (selectedCategory === 'news') {
          const tvNews = await tmdbApi.getNewsTV();
          results = tvNews.data.results.map(item => ({ ...item, type: 'tv' }));
        } else if (selectedCategory === 'drama') {
          const movieDrama = await tmdbApi.getDramaMovie();
          const tvDrama = await tmdbApi.getDramaTV();
          results = [
            ...movieDrama.data.results.map(item => ({ ...item, type: 'movie' })),
            ...tvDrama.data.results.map(item => ({ ...item, type: 'tv' })),
          ];
        } else if (selectedCategory === 'talkshow') {
          const tvTalk = await tmdbApi.getTalkshowTV();
          results = tvTalk.data.results.map(item => ({ ...item, type: 'tv' }));
        } else if (selectedCategory === 'sports') {
          results = [];
        }
      } catch (e) {
        results = [];
      }

      setVodList(results);
      setLoading(false);
    };

    fetchVod();
  }, [selectedCategory]);

  return (
    <div className="vod-page-container">
      <div className="vod-category-filter-bar">
        {categories.map(cat => (
          <button
            key={cat.id}
            className={`vod-category-btn${selectedCategory === cat.id ? ' active' : ''}`}
            onClick={() => setSelectedCategory(cat.id)}
          >
            {cat.name}
          </button>
        ))}
      </div>
      <div className="vod-category-divider" />
      
      {loading ? (
        <div className="vod-loading">Loading...</div>
      ) : (
        <div className="vod-content-grid">
          {vodList.length === 0 ? (
            <div className="vod-empty">No content available.</div>
          ) : (
            vodList.map(item => (
              <div
                key={`${item.id}-${item.type}`}
                className="vod-card"
                onClick={() => setSelectedVod(item)}
              >
                {item.poster_path ? (
                  <img
                    src={`${IMAGE_BASE_URL}${item.poster_path}`}
                    alt={item.title || item.name}
                    className="vod-poster"
                  />
                ) : (
                  <div className="vod-no-image">No Image</div>
                )}
                <div className="vod-card-content">
                  <div className="vod-title">{item.title || item.name}</div>
                  <div className="vod-meta">
                    {item.type === 'movie' ? '영화' : 'TV'}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* 상세 모달 */}
      {selectedVod && (
        <VODDetailModal
          item={selectedVod}
          type={selectedVod.type}
          onClose={() => setSelectedVod(null)}
        />
      )}
    </div>
  );
};

export default VODPage;
