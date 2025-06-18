import React, { useState } from 'react';
import './ProfileSelect.css';

const AVATAR_EMOJIS = [
  { key: 'rock', emoji: '✊', label: '바위' },
  { key: 'scissors', emoji: '✌️', label: '가위' },
  { key: 'paper', emoji: '✋', label: '보' },
  { key: 'victory', emoji: '🤚', label: '브이' },
];

const ProfileSelect = ({
  profiles,
  onSelect,
  onAddProfile,
  onNameChange,
  onDeleteProfile,
  onAvatarChange,
}) => {
  const canAdd = profiles.length < 4;
  const [editId, setEditId] = useState(null);

  // 현재 다른 프로필에서 사용 중인 아바타(이모지) 집합
  const usedAvatars = profiles
    .filter((p) => p.id !== editId)
    .map((p) => p.avatar);

  return (
    <div className="profile-select-bg">
      <div className="profile-select-container">
        <div className="profile-select-title">프로필을 선택하세요</div>
        <div className="profile-list">
          {profiles.map((profile) => (
            <div key={profile.id} className="profile-card">
              <button
                className="profile-avatar-btn"
                onClick={() => {
                  if (editId === profile.id) return;
                  onSelect(profile);
                }}
                aria-label={`프로필 ${profile.name} 선택`}
                tabIndex={editId === profile.id ? -1 : 0}
              >
                <div className="profile-avatar">
                  {profile.avatar || '✊'}
                </div>
              </button>
              <input
                type="text"
                className="profile-name-input"
                value={profile.name}
                onChange={(e) => onNameChange(profile.id, e.target.value)}
                maxLength={6}
                aria-label={`프로필 ${profile.name} 이름 변경`}
                placeholder="프로필 이름"
                disabled={editId !== profile.id}
              />
              <div className="profile-edit-actions">
                {editId === profile.id ? (
                  <>
                    <div className="avatar-emoji-list">
                      {AVATAR_EMOJIS.map((av) => {
                        const isUsed = usedAvatars.includes(av.emoji);
                        const isSelected = profile.avatar === av.emoji;
                        return (
                          <button
                            key={av.key}
                            type="button"
                            className={`avatar-emoji-btn${isSelected ? ' selected' : ''}`}
                            onClick={() => !isUsed && onAvatarChange(profile.id, av.emoji)}
                            aria-label={av.label}
                            disabled={isUsed && !isSelected}
                            title={isUsed && !isSelected ? '다른 프로필에서 사용 중' : av.label}
                          >
                            {av.emoji}
                          </button>
                        );
                      })}
                    </div>
                    <button
                      className="profile-delete-btn"
                      onClick={() => onDeleteProfile(profile.id)}
                      disabled={profiles.length === 1}
                      aria-label="프로필 삭제"
                    >
                      🗑
                    </button>
                    <button
                      className="profile-edit-btn"
                      onClick={() => setEditId(null)}
                      aria-label="편집 종료"
                    >
                      ✔
                    </button>
                  </>
                ) : (
                  <button
                    className="profile-edit-btn"
                    onClick={() => setEditId(profile.id)}
                    aria-label="프로필 편집"
                  >
                    ✏️
                  </button>
                )}
              </div>
            </div>
          ))}
          {canAdd && (
            <button className="profile-card add-profile-btn" onClick={onAddProfile} aria-label="프로필 추가">
              <div className="profile-avatar add-avatar">+</div>
              <div className="profile-name">프로필 추가</div>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileSelect;
