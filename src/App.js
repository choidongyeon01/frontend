import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import MyList from './pages/MyList';
import LivePage from './components/LivePage';
import VODPage from './components/VODPage';
import GenrePage from './components/GenrePage';
import LoginPage from './components/Auth/LoginPage';
import RegisterPage from './components/Auth/RegisterPage';
import AddProfilePage from './components/Auth/AddProfilePage';
import SelectContentPage from './components/Auth/SelectContentPage';
import ProfileSelect from './components/Auth/ProfileSelect';
import SearchResults from './pages/SearchResults';
import { MyListProvider } from './pages/MyListContext';
import './styles/App.css';

const PROFILE_AVATARS = ['✊', '✌️', '✋', '🤚'];
const PROFILE_COLORS = ['#ff1e80', '#1ec8ff', '#ffd21e', '#6f1eff'];

function RegisterComplete({ onGoToMain }) {
  return (
    <div className="app" style={{
      minHeight: '100vh',
      background: '#111',
      color: '#fff',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <h1 style={{ fontSize: '2.2rem', marginBottom: 24 }}>🎉 회원가입이 완료되었습니다! 🎉</h1>
      <p style={{ fontSize: '1.2rem', marginBottom: 36 }}>
        이제 다양한 콘텐츠를 즐겨보세요.
      </p>
      <button
        style={{
          background: '#ff1e80',
          color: '#fff',
          border: 'none',
          borderRadius: 8,
          padding: '13px 40px',
          fontSize: '1.1rem',
          fontWeight: 'bold',
          cursor: 'pointer',
          marginTop: 16
        }}
        onClick={onGoToMain}
      >
        메인으로 이동
      </button>
    </div>
  );
}

function App() {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedTV, setSelectedTV] = useState(null);

  const [users, setUsers] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('users')) || [];
    } catch {
      return [];
    }
  });

  const [currentUser, setCurrentUser] = useState(null);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [currentProfileId, setCurrentProfileId] = useState(null);

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
  }, [users]);

  // 로그인
  const handleLogin = (id, pw) => {
    const user = users.find(u => u.id === id && u.password === pw);
    if (user) {
      setCurrentUser(user);
      setIsLoggedIn(true);
      setSelectedProfile(null);
      setCurrentProfileId(null);
      navigate('/profile/select', { replace: true });
    }
  };

  // 회원가입 완료 시 users에 새 계정 추가 + 자동 로그인
  const handleRegisterNext = (formData) => {
    if (users.some(u => u.id === formData.id)) return;
    const newUser = {
      id: formData.id,
      password: formData.password,
      email: formData.email,
      profiles: []
    };
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    setCurrentUser(newUser);
    setIsLoggedIn(true);
    setSelectedProfile(null);
    setCurrentProfileId(null);
    navigate('/register/step2', { state: { formData } });
  };

  // 로그아웃
  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setSelectedProfile(null);
    setCurrentProfileId(null);
    setSelectedMovie(null);
    setSelectedTV(null);
    navigate('/login', { replace: true });
  };

  // 프로필 선택
  const handleProfileSelect = (profile) => {
    setSelectedProfile(profile);
    setCurrentProfileId(profile.id);
    navigate('/', { replace: true });
  };

  // 프로필 추가
  const handleAddProfile = (profile) => {
    if (!currentUser) return;
    const updatedProfiles = [...(currentUser.profiles || []), profile];
    const updatedUser = { ...currentUser, profiles: updatedProfiles };
    setCurrentUser(updatedUser);
    setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
  };

  // 프로필 삭제
  const handleDeleteProfile = (profileId) => {
    if (!currentUser) return;
    const updatedProfiles = (currentUser.profiles || []).filter(p => p.id !== profileId);
    const updatedUser = { ...currentUser, profiles: updatedProfiles };
    setCurrentUser(updatedUser);
    setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
    if (selectedProfile && selectedProfile.id === profileId) {
      setSelectedProfile(null);
      setCurrentProfileId(null);
    }
  };

  // 프로필 이름 변경
  const handleNameChange = (profileId, newName) => {
    if (!currentUser) return;
    const updatedProfiles = (currentUser.profiles || []).map(profile =>
      profile.id === profileId ? { ...profile, name: newName } : profile
    );
    const updatedUser = { ...currentUser, profiles: updatedProfiles };
    setCurrentUser(updatedUser);
    setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
  };

  // 프로필 아바타 변경
  const handleAvatarChange = (profileId, emoji) => {
    if (!currentUser) return;
    const updatedProfiles = (currentUser.profiles || []).map(profile =>
      profile.id === profileId ? { ...profile, avatar: emoji } : profile
    );
    const updatedUser = { ...currentUser, profiles: updatedProfiles };
    setCurrentUser(updatedUser);
    setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
  };

  // ----------- 수정된 부분: 안전한 로그인 상태 초기화 후 이동 -----------
  const handleLogoutAndGoToLogin = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setSelectedProfile(null);
    setCurrentProfileId(null);
    setSelectedMovie(null);
    setSelectedTV(null);
    setTimeout(() => {
      navigate('/login', { replace: true });
    }, 0);
  };

  return (
    <MyListProvider currentProfileId={currentProfileId}>
      <div className="app-root-layout">
        {isLoggedIn && selectedProfile && (
          <Header
            onLogout={handleLogout}
            onSwitchProfile={() => {
              setSelectedProfile(null);
              setCurrentProfileId(null);
              navigate('/profile/select', { replace: true });
            }}
            currentProfile={selectedProfile}
          />
        )}
        <div className="main-content-area">
          <Routes>
            <Route path="/login" element={
              isLoggedIn
                ? <Navigate to="/profile/select" replace />
                : <LoginPage
                    onLogin={handleLogin}
                    onGoToRegister={() => navigate('/register/step1')}
                  />
            } />
            <Route path="/register/step1" element={
              isLoggedIn
                ? <Navigate to="/profile/select" replace />
                : <RegisterPage
                    onNextStep={handleRegisterNext}
                    onGoToLogin={() => handleLogoutAndGoToLogin()}
                  />
            } />
            <Route path="/register/step2" element={
              !isLoggedIn
                ? <Navigate to="/login" replace />
                : <AddProfilePage
                    onProfileComplete={(profileData) => {
                      const newId = (currentUser.profiles?.length || 0) > 0
                        ? Math.max(...currentUser.profiles.map(p => p.id)) + 1
                        : 1;
                      const usedAvatars = (currentUser.profiles || []).map(p => p.avatar);
                      const availableAvatars = PROFILE_AVATARS.filter(emoji => !usedAvatars.includes(emoji));
                      const newAvatar = availableAvatars.length > 0 ? availableAvatars[0] : PROFILE_AVATARS[0];
                      const newProfile = {
                        id: newId,
                        name: profileData.nickname,
                        color: PROFILE_COLORS[(newId - 1) % PROFILE_COLORS.length],
                        avatar: newAvatar,
                        age: profileData.age,
                        gender: profileData.gender,
                        genres: profileData.genres,
                        email: currentUser.email,
                      };
                      handleAddProfile(newProfile);
                      navigate('/register/step3', { state: { profileData: newProfile } });
                    }}
                    onGoToLogin={handleLogoutAndGoToLogin}
                    onPrev={() => navigate('/register/step1')}
                  />
            } />
            <Route path="/register/step3" element={
              !isLoggedIn
                ? <Navigate to="/login" replace />
                : <SelectContentPage
                    profileData={location.state?.profileData}
                    onComplete={(selected) => {
                      const profileId = location.state?.profileData?.id;
                      if (!currentUser) return;
                      const updatedProfiles = (currentUser.profiles || []).map(profile =>
                        profile.id === profileId
                          ? { ...profile, selectedContent: selected }
                          : profile
                      );
                      const updatedUser = { ...currentUser, profiles: updatedProfiles };
                      setCurrentUser(updatedUser);
                      setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
                      navigate('/register/complete');
                    }}
                    onPrev={() => navigate('/register/step2')}
                  />
            } />
            <Route path="/register/complete" element={
              !isLoggedIn
                ? <Navigate to="/login" replace />
                : <RegisterComplete
                    onGoToMain={() => {
                      navigate('/profile/select', { replace: true });
                    }}
                  />
            } />
            <Route path="/profile/select" element={
              !isLoggedIn
                ? <Navigate to="/login" replace />
                : <ProfileSelect
                    profiles={currentUser?.profiles || []}
                    onSelect={handleProfileSelect}
                    onAddProfile={() => navigate('/profile/add')}
                    onNameChange={handleNameChange}
                    onDeleteProfile={handleDeleteProfile}
                    onAvatarChange={handleAvatarChange}
                  />
            } />
            <Route path="/profile/add" element={
              !isLoggedIn
                ? <Navigate to="/login" replace />
                : <AddProfilePage
                    onProfileComplete={(profileData) => {
                      const newId = (currentUser.profiles?.length || 0) > 0
                        ? Math.max(...currentUser.profiles.map(p => p.id)) + 1
                        : 1;
                      const usedAvatars = (currentUser.profiles || []).map(p => p.avatar);
                      const availableAvatars = PROFILE_AVATARS.filter(emoji => !usedAvatars.includes(emoji));
                      const newAvatar = availableAvatars.length > 0 ? availableAvatars[0] : PROFILE_AVATARS[0];
                      const newProfile = {
                        id: newId,
                        name: profileData.nickname,
                        color: PROFILE_COLORS[(newId - 1) % PROFILE_COLORS.length],
                        avatar: newAvatar,
                        age: profileData.age,
                        gender: profileData.gender,
                        genres: profileData.genres,
                      };
                      handleAddProfile(newProfile);
                      navigate('/profile/content', { state: { profileData: newProfile } });
                    }}
                    onGoToLogin={handleLogoutAndGoToLogin}
                    onPrev={() => navigate('/profile/select')}
                  />
            } />
            <Route path="/profile/content" element={
              !isLoggedIn
                ? <Navigate to="/login" replace />
                : <SelectContentPage
                    profileData={location.state?.profileData}
                    onComplete={(selected) => {
                      const profileId = location.state?.profileData?.id;
                      if (!currentUser) return;
                      const updatedProfiles = (currentUser.profiles || []).map(profile =>
                        profile.id === profileId
                          ? { ...profile, selectedContent: selected }
                          : profile
                      );
                      const updatedUser = { ...currentUser, profiles: updatedProfiles };
                      setCurrentUser(updatedUser);
                      setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
                      navigate('/profile/select', { replace: true });
                    }}
                    onPrev={() => navigate('/profile/add')}
                  />
            } />
            <Route path="/*" element={
              isLoggedIn && selectedProfile ? (
                <Routes>
                  <Route
                    path="/"
                    element={
                      <Home
                        selectedProfile={selectedProfile}
                        selectedMovie={selectedMovie}
                        setSelectedMovie={setSelectedMovie}
                        selectedTV={selectedTV}
                        setSelectedTV={setSelectedTV}
                      />
                    }
                  />
                  <Route path="/live" element={<LivePage />} />
                  <Route path="/vod" element={<VODPage />} />
                  <Route path="/genres" element={<GenrePage />} />
                  <Route path="/mylist" element={<MyList />} />
                  <Route path="/search" element={<SearchResults />} />
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              ) : (
                <Navigate to="/login" replace />
              )
            } />
          </Routes>
        </div>
      </div>
    </MyListProvider>
  );
}

export default App;
