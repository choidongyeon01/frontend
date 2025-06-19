import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import './LivePage.css';

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

const categories = [
  { id: 'all', name: 'All' },
  { id: 'news', name: 'News' },
  { id: 'drama', name: 'Drama' },
  { id: 'sports', name: 'Sports' },
  { id: 'music', name: 'Music' },
  { id: 'talkshow', name: 'Talk Show' }
];

const liveContents = [
  {
    id: 1,
    title: 'Breaking News Live',
    channel: 'KBC News',
    category: 'news',
    isLive: true,
    poster_path: '/sample1.jpg'
  },
  {
    id: 2,
    title: 'Hit Drama Finale',
    channel: 'Drama World',
    category: 'drama',
    isLive: true,
    poster_path: '/sample2.jpg'
  },
  {
    id: 3,
    title: 'Champions League',
    channel: 'Sports Plus',
    category: 'sports',
    isLive: true,
    poster_path: '/sample3.jpg'
  },
  {
    id: 4,
    title: 'Music Concert',
    channel: 'M-Net',
    category: 'music',
    isLive: true,
    poster_path: '/sample4.jpg'
  },
  {
    id: 5,
    title: 'Night Talk',
    channel: 'TBC',
    category: 'talkshow',
    isLive: true
    // 포스터 없음
  },
  {
    id: 6,
    title: 'Morning News',
    channel: 'YTN',
    category: 'news',
    isLive: true,
    poster_path: '/sample6.jpg'
  },
  {
    id: 7,
    title: 'Baseball Championship',
    channel: 'Sports Plus',
    category: 'sports',
    isLive: true,
    poster_path: '/sample7.jpg'
  },
  {
    id: 8,
    title: 'Drama Special',
    channel: 'KBC',
    category: 'drama',
    isLive: true,
    poster_path: '/sample8.jpg'
  }
];

const ITEMS_PER_PAGE = 4;

const LivePage = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  // 항상 소문자로 변환
  const selectedCategory = (params.get('category') || 'all').toLowerCase();

  // item.category도 소문자로 변환해서 비교 (오타, 공백, 대소문자 문제 방지)
  const filteredContent = selectedCategory === 'all'
    ? liveContents
    : liveContents.filter(item =>
        (item.category || '').toLowerCase().replace(/\s/g, '') === selectedCategory.replace(/\s/g, '')
      );

  // 캐러셀 인덱스 관리
  const [startIdx, setStartIdx] = useState(0);
  const maxStartIdx = Math.max(0, filteredContent.length - ITEMS_PER_PAGE);

  const handlePrev = () => setStartIdx(idx => Math.max(0, idx - 1));
  const handleNext = () => setStartIdx(idx => Math.min(maxStartIdx, idx + 1));

  // 현재 보여줄 아이템
  const visibleItems = filteredContent.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  // 선택된 카테고리 이름 찾기
  const categoryName = categories.find(cat => cat.id === selectedCategory)?.name || 'All';

  return (
    <div className="live-page-container">
      <h2 className="live-category-title">{categoryName}</h2>
      <div className="live-category-divider" />
      <div className="live-carousel-container" style={{ position: 'relative' }}>
        {filteredContent.length > ITEMS_PER_PAGE && (
          <button
            className="livepage-carousel-btn left"
            onClick={handlePrev}
            disabled={startIdx === 0}
            aria-label="이전"
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M15 18l-6-6 6-6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            </svg>
          </button>
        )}
        <div className="live-content-grid">
          {visibleItems.map(item => (
            <div key={item.id} className="live-card">
              {item.poster_path ? (
                <img
                  src={IMAGE_BASE_URL + item.poster_path}
                  alt={item.title}
                  className="live-poster"
                />
              ) : (
                <div className="live-no-image">No Image</div>
              )}
              {item.isLive && <div className="live-badge">LIVE</div>}
              <div className="card-content">
                <h3 className="card-title">{item.title}</h3>
                <div className="card-meta">
                  <span className="channel">{item.channel}</span>
                  <span className="dot">•</span>
                  <span className="category">{item.category}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        {filteredContent.length > ITEMS_PER_PAGE && (
          <button
            className="livepage-carousel-btn right"
            onClick={handleNext}
            disabled={startIdx >= maxStartIdx}
            aria-label="다음"
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 6l6 6-6 6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default LivePage;
