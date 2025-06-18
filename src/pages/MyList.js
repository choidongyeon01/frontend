import React, { useState } from 'react';
import { useMyList } from './MyListContext';
import '../styles/pages/MyList.css';
import MovieDetailModal from '../components/MovieDetailModal';

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const ITEMS_PER_PAGE = 4;

const MyList = () => {
  const { myList, removeFromMyList } = useMyList();
  const [selectedItem, setSelectedItem] = useState(null);
  const [startIdx, setStartIdx] = useState(0);

  const visibleItems = myList.slice(startIdx, startIdx + ITEMS_PER_PAGE);
  const maxStartIdx = Math.max(0, myList.length - ITEMS_PER_PAGE);

  const handlePrev = () => setStartIdx(idx => Math.max(0, idx - 1));
  const handleNext = () => setStartIdx(idx => Math.min(maxStartIdx, idx + 1));

  return (
    <div className="mylist-page">
      <h1 className="mylist-header">My List</h1>
      <div className="mylist-carousel-container" style={{ position: 'relative' }}>
        {/* 캐러셀 왼쪽 버튼: 항상 보이게 */}
        <button
          className="mylist-carousel-btn left"
          onClick={handlePrev}
          disabled={startIdx === 0 || myList.length === 0}
          aria-label="이전"
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M15 18l-6-6 6-6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          </svg>
        </button>
        <div className="mylist-carousel-list">
          {myList.length === 0 ? (
            <div className="mylist-empty">찜한 콘텐츠가 없습니다.</div>
          ) : (
            visibleItems.map(item => (
              <div
                key={`${item.id}-${item.type}`}
                className="mylist-card"
                onClick={() => setSelectedItem(item)}
                style={{ cursor: 'pointer' }}
              >
                {item.poster_path ? (
                  <img
                    src={`${IMAGE_BASE_URL}${item.poster_path}`}
                    alt={item.title || item.name}
                    className="mylist-poster"
                  />
                ) : (
                  <div className="mylist-no-image">No Image</div>
                )}
                <div className="mylist-card-content">
                  <div className="mylist-title">{item.title || item.name}</div>
                  <div className="mylist-card-content-row">
                    <div className="mylist-meta">{item.type === 'movie' ? '영화' : 'TV'}</div>
                    <button
                      className="mylist-remove-btn"
                      onClick={e => {
                        e.stopPropagation();
                        removeFromMyList(item.id, item.type);
                      }}
                    >
                      삭제
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        {/* 캐러셀 오른쪽 버튼: 항상 보이게 */}
        <button
          className="mylist-carousel-btn right"
          onClick={handleNext}
          disabled={startIdx >= maxStartIdx || myList.length === 0}
          aria-label="다음"
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M9 6l6 6-6 6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          </svg>
        </button>
      </div>

      {/* 상세페이지 모달 */}
      {selectedItem && (
        <MovieDetailModal
          movie={selectedItem}
          onClose={() => setSelectedItem(null)}
          showMyListButton={false}
          onRelatedSelect={setSelectedItem}
        />
      )}
    </div>
  );
};

export default MyList;
