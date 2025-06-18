import React, { useState } from 'react';
import '../styles/components/LiveSection.css';

const LIVE_PER_PAGE = 4;

const liveContents = [
  { id: 1, title: 'Evening News', info: 'News • Live' },
  { id: 2, title: 'Music Awards', info: 'Entertainment • Live' },
  { id: 3, title: 'Sports Events', info: 'Sports • Live' },
  { id: 4, title: 'Morning Show', info: 'Talk • Live' },
  { id: 5, title: 'Drama Special', info: 'Drama • Live' },
  { id: 6, title: 'Baseball Live', info: 'Sports • Live' },
];

const LiveSection = () => {
  const [startIndex, setStartIndex] = useState(0);

  const handlePrev = () => setStartIndex(idx => Math.max(idx - 1, 0));
  const handleNext = () => setStartIndex(idx => Math.min(idx + 1, liveContents.length - LIVE_PER_PAGE));

  const visibleLives = liveContents.slice(startIndex, startIndex + LIVE_PER_PAGE);
  const emptySlots = Array(Math.max(0, LIVE_PER_PAGE - visibleLives.length)).fill(null);

  return (
    <section className="live-section">
      <h2 className="live-section-title">Live Now</h2>
      <div className="live-carousel-container">
        <button
          className="live-carousel-btn left"
          onClick={handlePrev}
          aria-label="이전"
          disabled={startIndex === 0}
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M15 18l-6-6 6-6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          </svg>
        </button>
        <div className="live-carousel-list">
          {visibleLives.map(item => (
            <div key={item.id} className="live-item">
              <span className="live-badge">LIVE</span>
              <div className="live-card-content">
                <div className="live-title">{item.title}</div>
                <div className="live-info">{item.info}</div>
              </div>
            </div>
          ))}
          {emptySlots.map((_, idx) => (
            <div key={`empty-${idx}`} className="live-item empty-card"></div>
          ))}
        </div>
        <button
          className="live-carousel-btn right"
          onClick={handleNext}
          aria-label="다음"
          disabled={startIndex >= liveContents.length - LIVE_PER_PAGE}
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M9 6l6 6-6 6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          </svg>
        </button>
      </div>
    </section>
  );
};

export default LiveSection;
