import React from 'react';
import { useMyList } from '../context/MyListContext';
import Carousel from '../components/Carousel/Carousel';
import '../styles/pages/MyList.css';

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

// 예시 추천 데이터
const recommended = [
  // 실제 추천 데이터로 교체
];

const MyList = () => {
  const { myList, removeFromMyList } = useMyList();

  return (
    <div className="mylist-page">
      <h1 className="mylist-header">My List</h1>
      <div className="mylist-carousel">
        <Carousel>
          {myList.length === 0 ? (
            <div className="mylist-empty">찜한 콘텐츠가 없습니다.</div>
          ) : (
            myList.map(item => (
              <div key={`${item.id}-${item.type}`} className="mylist-card">
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
                      onClick={() => removeFromMyList(item.id, item.type)}
                    >
                      삭제
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </Carousel>
      </div>

      <h2 className="mylist-header" style={{marginTop: "48px"}}>Recommended for You</h2>
      <div className="mylist-carousel">
        <Carousel>
          {recommended.length === 0 ? (
            <div className="mylist-empty">추천 콘텐츠가 없습니다.</div>
          ) : (
            recommended.map(item => (
              <div key={item.id} className="mylist-card">
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
                  <div className="mylist-meta">{item.type === 'movie' ? '영화' : 'TV'}</div>
                </div>
              </div>
            ))
          )}
        </Carousel>
      </div>
    </div>
  );
};

export default MyList;
