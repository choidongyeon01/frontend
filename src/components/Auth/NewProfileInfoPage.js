import React, { useState } from 'react';
import './NewProfileInfoPage.css';

const PROFILE_AVATARS = ['✊', '✌️', '✋', '🤚'];

const NewProfileInfoPage = ({
  onNext,
  onGoToLogin,
  onPrev,
  usedAvatars = []
}) => {
  const [nickname, setNickname] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  // 아바타 선택 상태
  const availableAvatars = PROFILE_AVATARS.filter(a => !usedAvatars.includes(a));
  const [selectedAvatar, setSelectedAvatar] = useState(availableAvatars[0] || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nickname || !age || !gender || !selectedAvatar) {
      alert('닉네임, 나이, 성별, 프로필 아이콘을 모두 선택하세요.');
      return;
    }
    // nickname 대신 name 필드로 통일
    onNext({ name: nickname, age, gender, avatar: selectedAvatar });
  };

  return (
    <div className="new-profile-bg">
      <div className="new-profile-container">
        <h2 className="new-profile-title">+ 새 프로필 만들기</h2>
        {/* 아바타 선택 영역 */}
        <div className="avatar-select-row">
          {PROFILE_AVATARS.map(avatar => {
            const isUsed = usedAvatars.includes(avatar);
            const isSelected = selectedAvatar === avatar;
            return (
              <button
                key={avatar}
                type="button"
                className={`avatar-btn${isSelected ? ' selected' : ''}`}
                onClick={() => !isUsed && setSelectedAvatar(avatar)}
                disabled={isUsed}
                aria-label={avatar + (isUsed ? ' (사용중)' : '')}
              >
                <span className="avatar-emoji">{avatar}</span>
              </button>
            );
          })}
        </div>
        <form className="new-profile-form" onSubmit={handleSubmit}>
          <div className="new-profile-row">
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
              <option value="">성별</option>
              <option value="남">남</option>
              <option value="여">여</option>
              <option value="기타">기타</option>
            </select>
          </div>
          <div className="new-profile-btn-row">
            <button
              className="new-profile-prev-btn"
              type="button"
              onClick={onPrev}
              tabIndex={0}
            >
              이전
            </button>
            <button className="new-profile-next-btn" type="submit">
              다음
            </button>
          </div>
        </form>
        <div className="new-profile-bottom">
          <span>이미 계정이 있으신가요?</span>
          <button className="new-profile-login-link" type="button" onClick={onGoToLogin}>로그인</button>
        </div>
      </div>
    </div>
  );
};

export default NewProfileInfoPage;
