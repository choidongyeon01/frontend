import React, { useEffect, useState } from 'react';
import tmdbApi from '../../api/tmdb';
import { useMyList } from '../../context/MyListContext';
import '../../styles/components/MovieDetailModal.css';

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/original';
const POSTER_BASE_URL = 'https://image.tmdb.org/t/p/w300';

const VODDetailModal = ({ item, onClose, onRelatedSelect }) => {
  const [details, setDetails] = useState(undefined);
  const [relatedContent, setRelatedContent] = useState([]);
  const { addToMyList } = useMyList();

  useEffect(() => {
    if (!item?.id) return;
    setDetails(undefined);
    const fetchDetails = item.type === 'movie'
      ? tmdbApi.getMovieDetails(item.id)
      : tmdbApi.getTVDetails(item.id);

    const fetchRelated = item.type === 'movie'
      ? tmdbApi.getSimilar(item.id)
      : tmdbApi.getSimilarTV(item.id);

    Promise.all([fetchDetails, fetchRelated])
      .then(([detailRes, relatedRes]) => {
        setDetails(detailRes.data);
        setRelatedContent(relatedRes.data.results.slice(0, 8));
      })
      .catch(() => {
        setDetails(null);
        setRelatedContent([]);
      });
  }, [item]);

  // type이 명확한 것만 노출
  const filteredRelated = relatedContent.filter(c => c.type);

  // 로딩 중
  if (details === undefined) {
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

  // 상세 정보 없음
  if (details === null) {
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

  const genreNames = details?.genres?.map(g => g.name) || [];
  const sectionLabel = item.type === 'movie' ? 'Movie' : 'TV Series';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <button className="modal-close" onClick={onClose} aria-label="Close">
        &times;
      </button>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
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

        <div className="modal-actions">
          <button className="play-btn">&#9654; Play</button>
          <button className="mylist-btn" onClick={() => addToMyList({ ...item, type: item.type })}>
            + My List
          </button>
        </div>

        <div className="related-titles">
          <h3>Related Content</h3>
          <div className="related-list">
            {filteredRelated.length === 0 ? (
              <div className="no-related">No related content found</div>
            ) : (
              filteredRelated.map(content => (
                <div
                  key={content.id}
                  className="related-card"
                  style={{ cursor: 'pointer' }}
                  onClick={() => onRelatedSelect({ ...content, type: content.type })}
                >
                  {content.poster_path ? (
                    <img
                      className="related-poster"
                      src={`${POSTER_BASE_URL}${content.poster_path}`}
                      alt={content.title || content.name}
                    />
                  ) : (
                    <div className="related-no-image">No Image</div>
                  )}
                  <div className="related-title">
                    {content.title || content.name}
                  </div>
                  <div className="related-meta">
                    {content.type === 'movie' ? '영화' : 'TV'}
                  </div>
                  <div className="related-category">
                    {content.type === 'movie'
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

export default VODDetailModal;
