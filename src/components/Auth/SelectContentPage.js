import React, { useState } from 'react';
import CarouselSelect from '../Carousel/CarouselSelect';
import './SelectContentPage.css';

const CONTENT_DATA = [
  {
    category: '드라마(범죄 스릴러/수사극, 미국드라마)',
    items: [
      { title: '하이에로', img: 'https://via.placeholder.com/120x70?text=하이에로' },
      { title: '로어: 세상을 향한 분성', img: 'https://via.placeholder.com/120x70?text=로어' },
      { title: '아가사 크리스티: 미스 마플 시즌3', img: 'https://via.placeholder.com/120x70?text=마플3' },
      { title: '포청천 포졸장순', img: 'https://via.placeholder.com/120x70?text=포청천' },
      { title: '더 뉴 룩 - The New Look 시즌1', img: 'https://via.placeholder.com/120x70?text=뉴룩' },
      { title: '리애종 - Liaison 시즌1', img: 'https://via.placeholder.com/120x70?text=리애종' },
      { title: '깊엇', img: 'https://via.placeholder.com/120x70?text=깊엇' },
      { title: '인베이전 시즌2', img: 'https://via.placeholder.com/120x70?text=인베이전' },
      { title: '피지컬 시즌2', img: 'https://via.placeholder.com/120x70?text=피지컬' },
      { title: '드렙박 - Loot 시즌1', img: 'https://via.placeholder.com/120x70?text=드렙박' }
    ]
  },
  {
    category: '영화(드라마, 로맨스)',
    items: [
      { title: '더 스페셜슨', img: 'https://via.placeholder.com/120x70?text=스페셜슨' },
      { title: '내 아내 이야기', img: 'https://via.placeholder.com/120x70?text=내아내' },
      { title: '아내의 애인을 만나다', img: 'https://via.placeholder.com/120x70?text=아내애인' },
      { title: '빈 집', img: 'https://via.placeholder.com/120x70?text=빈집' },
      { title: '[4K] 뚝섬서 사랑을', img: 'https://via.placeholder.com/120x70?text=뚝섬서' },
      { title: '바람 불어 좋은 날', img: 'https://via.placeholder.com/120x70?text=바람날' },
      { title: '연자구', img: 'https://via.placeholder.com/120x70?text=연자구' },
      { title: '100% 여자를 만나는 열애 권하여', img: 'https://via.placeholder.com/120x70?text=100%' },
      { title: '룩앳미 터치미 키스미', img: 'https://via.placeholder.com/120x70?text=룩앳미' },
      { title: '마돈나', img: 'https://via.placeholder.com/120x70?text=마돈나' }
    ]
  },
  {
    category: '예능(버라이어티, 뷰티)',
    items: [
      { title: '주먹이 운다 시즌1', img: 'https://via.placeholder.com/120x70?text=주먹이운다' },
      { title: '[화면 해설] 여고괴담 반', img: 'https://via.placeholder.com/120x70?text=여고괴담' },
      { title: '아름다운 모르는 고딩 명백', img: 'https://via.placeholder.com/120x70?text=고딩명백' },
      { title: '마이 바디가드 3 : 마이 보디가드', img: 'https://via.placeholder.com/120x70?text=바디가드' },
      { title: '고독한 훈장씨', img: 'https://via.placeholder.com/120x70?text=훈장씨' },
      { title: '파하하', img: 'https://via.placeholder.com/120x70?text=파하하' },
      { title: '신서유기 7', img: 'https://via.placeholder.com/120x70?text=신서유기7' },
      { title: '주말 사용 설명서', img: 'https://via.placeholder.com/120x70?text=주말설명서' },
      { title: '마켓인싸 2', img: 'https://via.placeholder.com/120x70?text=마켓인싸2' },
      { title: '배우학교', img: 'https://via.placeholder.com/120x70?text=배우학교' }
    ]
  }
];

const SelectContentPage = ({ profileData, onComplete, onPrev }) => {
  const [selected, setSelected] = useState([]);

  const toggleSelect = (category, title) => {
    const key = `${category}-${title}`;
    setSelected(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  return (
    <div className="select-content-bg">
      <div className="select-content-container">
        <h2 className="select-content-title">
          {profileData?.nickname || 'ss'}님의 취향 콘텐츠를 골라주세요!
        </h2>
        {CONTENT_DATA.map(cat => (
          <div key={cat.category} className="content-category-block">
            <div className="content-category-label">{cat.category}</div>
            <CarouselSelect>
              {cat.items.map(item => {
                const key = `${cat.category}-${item.title}`;
                return (
                  <div
                    key={item.title}
                    className={`content-card${selected.includes(key) ? ' selected' : ''}`}
                    onClick={() => toggleSelect(cat.category, item.title)}
                  >
                    <img src={item.img} alt={item.title} />
                    <div className="content-card-title">{item.title}</div>
                  </div>
                );
              })}
            </CarouselSelect>
          </div>
        ))}
        <div className="select-content-btn-row">
          <button
            className="select-content-prev-btn"
            onClick={onPrev}
            type="button"
          >
            이전
          </button>
          <button
            className="select-content-next-btn"
            onClick={() => onComplete && onComplete(selected)}
            type="button"
          >
            선택 완료
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectContentPage;
