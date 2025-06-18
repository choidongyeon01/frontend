import React, { useEffect, useState } from 'react';
import tmdbApi from '../api/tmdb';
import { useMyList } from '../pages/MyListContext';
import '../styles/components/MovieDetailModal.css';
import Carousel_2 from './Carousel/Carousel_2';

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/original';
const POSTER_BASE_URL = 'https://image.tmdb.org/t/p/w300';

const TVDetailModal = ({ tv, onClose, onRelatedSelect }) => {
  const [relatedTV, setRelatedTV] = useState([]);
  const [detail, setDetail] = useState(undefined);
  const { myList, addToMyList } = useMyList();
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    if (!tv?.id) return;
    setDetail(undefined);
    tmdbApi.getTVDetails(tv.id)
      .then(res => setDetail(res.data))
      .catch(() => setDetail(null));
    tmdbApi.getSimilarTV(tv.id)
      .then(res => setRelatedTV(res.data.results.map(t => ({ ...t, type: 'tv' }))))
      .catch(() => setRelatedTV([]));
    setFeedback('');
  }, [tv]);

  const handleAddToMyList = () => {
    const already = myList.some(i => i.id === tv.id && i.type === 'tv');
    if (already) {
      setFeedback('이미 My List에 있습니다.');
    } else {
      addToMyList({ ...tv, type: 'tv' });
      setFeedback('My List에 추가되었습니다!');
    }
    setTimeout(() => setFeedback(''), 1800);
  };

  if (detail === undefined) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <button className="modal-close" onClick={onClose} aria-label="Close">
          &times;
        </button>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
          <div style={{
            color: "#fff",
            padding: "60px",
            textAlign: "center",
            fontSize: "1.2rem"
          }}>
            불러오는 중...
          </div>
        </div>
      </div>
    );
  }

  if (detail === null) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <button className="modal-close" onClick={onClose} aria-label="Close">
          &times;
        </button>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
          <div style={{
            color: "#fff",
            padding: "60px",
            textAlign: "center",
            fontSize: "1.2rem"
          }}>
            해당 작품의 상세 정보를 찾을 수 없습니다.
          </div>
        </div>
      </div>
    );
  }

  const genreNames = detail?.genres?.map(g => g.name) || [];

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
            alt={detail?.name || ''}
          />
          <div className="modal-hero-content">
            <h1 className="modal-hero-title">{detail?.name || ''}</h1>
            <div className="modal-genre-section">
              {genreNames.length > 0 && (
                <span className="modal-genre">{genreNames.join(', ')}</span>
              )}
              <span className="modal-section">TV</span>
            </div>
            <p className="modal-hero-overview">{detail?.overview || ''}</p>
          </div>
        </div>
        <div className="modal-actions">
          <button className="play-btn">&#9654; Play</button>
          <button className="mylist-btn" onClick={handleAddToMyList}>
            + My List
          </button>
        </div>
        {feedback && (
          <div className="mylist-feedback">{feedback}</div>
        )}
        <div className="related-titles">
          <h3>Related TV Shows</h3>
          {relatedTV.length === 0 ? (
            <div className="no-related">No related TV shows found.</div>
          ) : (
            <Carousel_2>
              {relatedTV.map(rt => (
                <div
                  key={rt.id}
                  className="carousel2-card"
                  onClick={() => onRelatedSelect && onRelatedSelect({ ...rt, type: 'tv' })}
                >
                  {rt.poster_path ? (
                    <img
                      className="carousel2-poster"
                      src={`${POSTER_BASE_URL}${rt.poster_path}`}
                      alt={rt.name}
                    />
                  ) : (
                    <div className="carousel2-no-image">No Image</div>
                  )}
                  <div className="carousel2-title">{rt.name}</div>
                  <div className="carousel2-category">
                    {rt.first_air_date?.slice(0, 4) || 'No Year'}
                  </div>
                </div>
              ))}
            </Carousel_2>
          )}
        </div>
      </div>
    </div>
  );
};

export default TVDetailModal;
