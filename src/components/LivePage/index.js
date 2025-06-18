import React, { useState } from 'react';
import './LivePage.css';

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

const LivePage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

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

  const filteredContent = selectedCategory === 'all'
    ? liveContents
    : liveContents.filter(item => item.category === selectedCategory);

  return (
    <div className="live-page-container">
      {/* 카테고리 필터 바 */}
      <div className="category-filter-bar">
        {categories.map(category => (
          <button
            key={category.id}
            className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>
      {/* 구분선 추가 */}
      <div className="category-divider" />
      {/* 라이브 콘텐츠 그리드 */}
      <div className="live-content-grid">
        {filteredContent.map(item => (
          <div key={item.id} className="live-card">
            {/* 포스터가 있으면 이미지, 없으면 No Image */}
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
    </div>
  );
};

export default LivePage;
