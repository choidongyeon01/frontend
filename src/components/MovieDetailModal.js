import React, { useEffect, useState } from 'react';
import tmdbApi from '../api/tmdb';
import { useMyList } from '../context/MyListContext'; // MyListContext import
import '../styles/components/MovieDetailModal.css';

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/original';

const MovieDetailModal = ({ movie, onClose }) => {
  const [relatedMovies, setRelatedMovies] = useState([]);
  const [detail, setDetail] = useState(null);
  const { addToMyList } = useMyList(); // MyListContext에서 함수 사용

  useEffect(() => {
    if (!movie?.id) return;
    // 상세정보 fetch
    tmdbApi.getMovieDetails(movie.id)
      .then(res => setDetail(res.data))
      .catch(() => setDetail(null));
    // 비슷한 영화 fetch
    tmdbApi.getSimilar(movie.id)
      .then(res => setRelatedMovies(res.data.results.slice(0, 4)))
      .catch(() => setRelatedMovies([]));
  }, [movie]);

  // 장르명 추출
  const genreNames = detail?.genres?.map(g => g.name) || [];
  const sectionLabel = 'Live Now';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <button className="modal-close" onClick={onClose} aria-label="Close">
        &times;
      </button>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-hero">
          <img
            className="modal-hero-bg"
            src={detail?.backdrop_path
              ? `${IMAGE_BASE_URL}${detail.backdrop_path}`
              : detail?.poster_path
                ? `${IMAGE_BASE_URL}${detail.poster_path}`
                : ''}
            alt={detail?.title || ''}
          />
          <div className="modal-hero-content">
            <h1 className="modal-hero-title">{detail?.title || ''}</h1>
            <div className="modal-genre-section">
              {genreNames.length > 0 && (
                <span className="modal-genre">
                  {genreNames.join(', ')}
                </span>
              )}
              {genreNames.length > 0 && sectionLabel && <span className="dot">•</span>}
              {sectionLabel && <span className="modal-section">{sectionLabel}</span>}
            </div>
            <p className="modal-hero-overview">{detail?.overview || ''}</p>
          </div>
        </div>

        <div className="modal-actions">
          <button className="play-btn">▶ Play</button>
          <button
            className="mylist-btn"
            onClick={() => addToMyList({ ...movie, type: 'movie' })}
          >
            + My List
          </button>
          <button className="info-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 24 24" style={{ marginRight: '7px', verticalAlign: 'middle' }} aria-hidden="true">
              <path d="M12,2A10,10 0 1,0 22,12A10,10 0 0,0 12,2M11,17H13V11H11V17M11,7H13V9H11V7Z"/>
            </svg>
            More Info
          </button>
        </div>
        
        <div className="related-titles">
          <h3>Related Titles</h3>
          <div className="related-list">
            {relatedMovies.length === 0 ? (
              <div className="no-related">No related movies found.</div>
            ) : (
              relatedMovies.map(rm => (
                <div key={rm.id} className="related-card">
                  <div className="related-title">{rm.title}</div>
                  <div className="related-category">
                    {rm.release_date?.slice(0, 4) || 'No Year'}
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

export default MovieDetailModal;
