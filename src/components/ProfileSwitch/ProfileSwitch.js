import React from 'react';
import './ProfileSwitch.css';

const ProfileSwitch = ({ profiles, onSwitchProfile, onClose }) => {
  return (
    <div className="profile-switch-overlay">
      <div className="profile-switch-modal">
        <button className="profile-switch-close" onClick={onClose} aria-label="닫기">
          &times;
        </button>
        <div className="profile-switch-title">프로필 전환</div>
        <div className="profile-switch-image-rect">📷</div>
        <div className="profile-switch-desc">프로필 수동 전환</div>
        <div className="profile-switch-list">
          {profiles && profiles.length > 0 ? (
            profiles.map(profile => (
              <button
                key={profile.id || profile.name}
                className="profile-switch-profile-btn"
                onClick={() => {
                  onSwitchProfile(profile);
                  onClose();
                }}
              >
                <div className="profile-switch-profile-item">
                  <div className="profile-switch-avatar-circle">
                    {profile.avatar || profile.emoji || "👤"}
                  </div>
                  <div className="profile-switch-name">{profile.name}</div>
                </div>
              </button>
            ))
          ) : (
            <div style={{ color: "#888", fontSize: "1.2rem" }}>등록된 프로필이 없습니다.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileSwitch;
