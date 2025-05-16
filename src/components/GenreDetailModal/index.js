import React, { useEffect, useState } from 'react';
import tmdbApi from '../../api/tmdb';
import { useMyList } from '../../context/MyListContext';
import '../../styles/components/MovieDetailModal.css';

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/original';

const GenreDetailModal = ({ item, type, onClose }) => {
  const [details, setDetails] = useState(null);
  const [relatedContent, setRelatedContent] = useState([]);
  const { addToMyList } = useMyList();

  useEffect(() => {
    if (!item?.id) return;

    const fetchDetails = type === 'movie' 
      ? tmdbApi.getMovieDetails(item.id)
      : tmdbApi.getTVDetails(item.id);

    const fetchRelated = type === 'movie'
      ? tmdbApi.getSimilar(item.id)
      : tmdbApi.getSimilarTV(item.id);

    Promise.all([fetchDetails, fetchRelated])
      .then(([detailRes, relatedRes]) => {
        setDetails(detailRes.data);
        setRelatedContent(relatedRes.data.results.slice(0, 4));
      })
      .catch(() => {
        setDetails(null);
        setRelatedContent([]);
      });
  }, [item, type]);

  const genreNames = details?.genres?.map(g => g.name) || [];
  const sectionLabel = type === 'movie' ? 'Movie' : 'TV Series';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <button className="modal-close" onClick={onClose} aria-label="Close">
        &times;
      </button>
      
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        {/* 헤로 섹션 */}
        <div className="modal-hero">
          <img
            className="modal-hero-bg"
            src={details?.backdrop_path 
              ? `${IMAGE_BASE_URL}${details.backdrop_path}`
              : details?.poster_path
                ? `${IMAGE_BASE_URL}${details.poster_path}`
                : ''}
            alt={details?.title || details?.name}
          />
          <div className="modal-hero-content">
            <h1 className="modal-hero-title">{details?.title || details?.name}</h1>
            <div className="modal-genre-section">
              {genreNames.length > 0 && (
                <span className="modal-genre">
                  {genreNames.join(', ')}
                </span>
              )}
              {(genreNames.length > 0 && sectionLabel) && <span className="dot">&#8226;</span>}
              <span className="modal-section">{sectionLabel}</span>
            </div>
            <p className="modal-hero-overview">{details?.overview}</p>
          </div>
        </div>

        {/* 액션 버튼 */}
        <div className="modal-actions">
          <button className="play-btn">&#9654; Play</button>
          <button className="mylist-btn" onClick={() => addToMyList({ ...item, type })}>
            + My List
          </button>
          <button className="info-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 24 24" style={{ marginRight: '7px', verticalAlign: 'middle' }} aria-hidden="true">
              <path d="M12,2A10,10 0 1,0 22,12A10,10 0 0,0 12,2M11,17H13V11H11V17M11,7H13V9H11V7Z"/>
            </svg>
            More Info
          </button>
        </div>

        {/* 관련 콘텐츠 */}
        <div className="related-titles">
          <h3>Related Content</h3>
          <div className="related-list">
            {relatedContent.length === 0 ? (
              <div className="no-related">No related content found</div>
            ) : (
              relatedContent.map(content => (
                <div key={content.id} className="related-card">
                  <div className="related-title">
                    {content.title || content.name}
                  </div>
                  <div className="related-category">
                    {type === 'movie' 
                      ? content.release_date?.slice(0, 4) 
                      : content.first_air_date?.slice(0, 4)}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenreDetailModal;
