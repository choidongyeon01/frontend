import React, { useState, useEffect } from 'react';
import TVDetailModal from './TVDetailModal';

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

const TVSection = ({ fetchFunction, sectionTitle }) => {
  const [tvShows, setTVShows] = useState([]);
  const [selectedTV, setSelectedTV] = useState(null);

  useEffect(() => {
    fetchFunction()
      .then(res => setTVShows(res.data.results.map(item => ({ ...item, type: 'tv' }))))
      .catch(() => setTVShows([]));
  }, [fetchFunction]);

  return (
    <section className="tv-section">
      <h2>{sectionTitle}</h2>
      <div className="tv-grid">
        {tvShows.map(tv => (
          <div
            key={tv.id}
            className="tv-card"
            onClick={() => setSelectedTV(tv)}
            style={{ cursor: 'pointer' }}
          >
            {tv.poster_path ? (
              <img
                src={IMAGE_BASE_URL + tv.poster_path}
                alt={tv.name}
                className="tv-poster"
              />
            ) : (
              <div className="tv-no-image">No Image</div>
            )}
            <div className="tv-title">{tv.name}</div>
            <div className="tv-meta">TV</div>
          </div>
        ))}
      </div>
      {selectedTV && (
        <TVDetailModal
          tv={selectedTV}
          onClose={() => setSelectedTV(null)}
          onRelatedSelect={t => setSelectedTV({ ...t, type: 'tv' })}
        />
      )}
    </section>
  );
};

export default TVSection;
