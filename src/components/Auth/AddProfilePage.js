import React, { useState } from 'react';
import './AddProfilePage.css';

const GENRE_CATEGORIES = [
  {
    label: '드라마',
    genres: ['무협', '미국드라마', '법정 스릴러/수사극', '법정', '복수', '사극/시대극', '영국드라마', '오피스드라마', '필름/소설 원작', '의학', '일본드라마', '정치/권력', '중국드라마', '청춘(성장)', '코미디', '타임슬립', '해외드라마', '휴먼']
  },
  { label: '보도', genres: ['보도'] },
  { label: '애니', genres: ['키즈'] },
  {
    label: '영화',
    genres: ['SF', '공포', '다큐멘터리', '드라마', '로맨스', '모험', '미스터리', '스릴러', '애니메이션', '여성', '코미디', '판타지']
  },
  {
    label: '예능',
    genres: ['가족예능', '게임', '관찰리얼리티', '교양', '교육예능', '버라이어티', '뷰티', '서바이벌', '스포츠예능', '아이돌', '애니오', '여행', '연예리얼리티', '음악서바이벌', '음악예능', '코미디', '특집/명랑', '토크쇼', '힐링예능']
  }
];

const MAX_SELECT = 3;

const AddProfilePage = ({ onProfileComplete, onGoToLogin }) => {
  const [nickname, setNickname] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [selectedGenres, setSelectedGenres] = useState([]);

  const toggleGenre = (genre) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter(g => g !== genre));
    } else if (selectedGenres.length < MAX_SELECT) {
      setSelectedGenres([...selectedGenres, genre]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nickname || !age || !gender) {
      alert('닉네임, 나이, 성별을 모두 입력하세요.');
      return;
    }
    onProfileComplete({ nickname, age, gender, genres: selectedGenres });
  };

  return (
    <div className="add-profile-bg">
      <div className="add-profile-container">
        <h2 className="add-profile-title">+ 새 프로필 만들기</h2>
        <form className="add-profile-form" onSubmit={handleSubmit}>
          <div className="add-profile-row">
            <input
              type="text"
              placeholder="닉네임"
              value={nickname}
              onChange={e => setNickname(e.target.value)}
              maxLength={12}
              required
            />
            <input
              type="number"
              placeholder="나이"
              value={age}
              onChange={e => setAge(e.target.value)}
              min={0}
              required
            />
            <select value={gender} onChange={e => setGender(e.target.value)} required>
              <option value="">성별 선택</option>
              <option value="남">남</option>
              <option value="여">여</option>
              <option value="기타">기타</option>
            </select>
          </div>
          <div className="add-profile-genres">
            <div className="genres-title">선호 서브장르 선택</div>
            {GENRE_CATEGORIES.map(cat => (
              <div key={cat.label}>
                <div className="genre-category-label">{cat.label}</div>
                <div className="genre-btn-list">
                  {cat.genres.map(genre => (
                    <button
                      type="button"
                      key={genre}
                      className={`genre-btn${selectedGenres.includes(genre) ? ' selected' : ''}`}
                      onClick={() => toggleGenre(genre)}
                      disabled={
                        !selectedGenres.includes(genre) && selectedGenres.length >= MAX_SELECT
                      }
                    >
                      #{genre}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <button className="add-profile-next-btn" type="submit" disabled={selectedGenres.length === 0}>
            다음
          </button>
        </form>
        <div className="register-bottom">
          <span>이미 계정이 있으신가요?</span>
          <button className="login-link" type="button" onClick={onGoToLogin}>로그인</button>
        </div>
      </div>
    </div>
  );
};

export default AddProfilePage;
