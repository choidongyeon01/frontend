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

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [currentProfileId, setCurrentProfileId] = useState(null);

  const [profiles, setProfiles] = useState(() => {
    const saved = localStorage.getItem('profiles');
    if (!saved) return [{ id: 1, name: 'User1', color: PROFILE_COLORS[0], avatar: PROFILE_AVATARS[0] }];
    try {
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : parsed.profiles || [];
    } catch {
      return [{ id: 1, name: 'User1', color: PROFILE_COLORS[0], avatar: PROFILE_AVATARS[0] }];
    }
  });

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    localStorage.setItem('profiles', JSON.stringify(profiles));
  }, [profiles]);

  const handleProfileSelect = (profile) => {
    setSelectedProfile(profile);
    setCurrentProfileId(profile.id);
    setIsLoggedIn(true);
    navigate('/', { replace: true });
  };

  const handleSwitchProfile = () => {
    setSelectedProfile(null);
    setCurrentProfileId(null);
    navigate('/profile/select', { replace: true });
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setSelectedProfile(null);
    setCurrentProfileId(null);
    setSelectedMovie(null);
    setSelectedTV(null);
    navigate('/login', { replace: true });
  };

  return (
    <MyListProvider currentProfileId={currentProfileId}>
      <div className="app-root-layout">
        {isLoggedIn && selectedProfile && (
          <Header
            onLogout={handleLogout}
            onSwitchProfile={handleSwitchProfile}
            currentProfile={selectedProfile}
          />
        )}
        <div className="main-content-area">
          <Routes>
            <Route path="/login" element={
              isLoggedIn
                ? <Navigate to="/profile/select" replace />
                : <LoginPage
                    onLogin={() => {
                      setIsLoggedIn(true);
                      setSelectedProfile(null);
                      setCurrentProfileId(null);
                      navigate('/profile/select', { replace: true });
                    }}
                    onGoToRegister={() => {
                      navigate('/register/step1');
                    }}
                  />
            } />
            <Route path="/register/step1" element={
              isLoggedIn
                ? <Navigate to="/profile/select" replace />
                : <RegisterPage
                    onNextStep={(formData) => {
                      navigate('/register/step2', { state: { formData } });
                    }}
                    onGoToLogin={() => {
                      navigate('/login');
                    }}
                  />
            } />
            <Route path="/register/step2" element={
              isLoggedIn
                ? <Navigate to="/profile/select" replace />
                : <AddProfilePage
                    onProfileComplete={(profileData) => {
                      navigate('/register/step3', { state: { ...location.state, profileData } });
                    }}
                    onGoToLogin={() => navigate('/login')}
                    onPrev={() => navigate('/register/step1')}
                  />
            } />
            <Route path="/register/step3" element={
              isLoggedIn
                ? <Navigate to="/profile/select" replace />
                : <SelectContentPage
                    profileData={location.state?.profileData}
                    onComplete={(selected) => {
                      const formData = location.state?.formData;
                      const profileData = location.state?.profileData;
                      const usedAvatars = profiles.map(p => p.avatar);
                      const availableAvatars = PROFILE_AVATARS.filter(emoji => !usedAvatars.includes(emoji));
                      const newAvatar = availableAvatars.length > 0 ? availableAvatars[0] : PROFILE_AVATARS[0];
                      const newId = profiles.length > 0 ? Math.max(...profiles.map(p => p.id)) + 1 : 1;
                      const newProfile = {
                        id: newId,
                        name: profileData.nickname,
                        color: PROFILE_COLORS[(newId - 1) % PROFILE_COLORS.length],
                        avatar: newAvatar,
                        age: profileData.age,
                        gender: profileData.gender,
                        genres: profileData.genres,
                        selectedContent: selected,
                        email: formData?.email,
                      };
                      const updatedProfiles = [newProfile, ...profiles];
                      setProfiles(updatedProfiles);
                      localStorage.setItem('profiles', JSON.stringify(updatedProfiles));
                      navigate('/register/complete');
                    }}
                    onPrev={() => navigate('/register/step2')}
                  />
            } />
            <Route path="/register/complete" element={
              isLoggedIn
                ? <Navigate to="/profile/select" replace />
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
                    profiles={profiles}
                    onSelect={handleProfileSelect}
                    onAddProfile={() => navigate('/profile/add')}
                    onNameChange={(id, newName) => setProfiles(profiles =>
                      profiles.map(profile =>
                        profile.id === id ? { ...profile, name: newName } : profile
                      )
                    )}
                    onDeleteProfile={(id) => {
                      if (profiles.length === 1) return;
                      setProfiles(profiles => profiles.filter(profile => profile.id !== id));
                      if (selectedProfile && selectedProfile.id === id) {
                        setSelectedProfile(null);
                        setCurrentProfileId(null);
                      }
                    }}
                    onAvatarChange={(id, emoji) => setProfiles(profiles =>
                      profiles.map(profile =>
                        profile.id === id ? { ...profile, avatar: emoji } : profile
                      )
                    )}
                  />
            } />
            <Route path="/profile/add" element={
              !isLoggedIn
                ? <Navigate to="/login" replace />
                : <AddProfilePage
                    onProfileComplete={(profileData) => {
                      navigate('/profile/content', { state: { profileData } });
                    }}
                    onGoToLogin={() => navigate('/login')}
                    onPrev={() => navigate('/profile/select')}
                  />
            } />
            <Route path="/profile/content" element={
              !isLoggedIn
                ? <Navigate to="/login" replace />
                : <SelectContentPage
                    profileData={location.state?.profileData}
                    onComplete={(selected) => {
                      const profileData = location.state?.profileData;
                      const usedAvatars = profiles.map(p => p.avatar);
                      const availableAvatars = PROFILE_AVATARS.filter(emoji => !usedAvatars.includes(emoji));
                      const newAvatar = availableAvatars.length > 0 ? availableAvatars[0] : PROFILE_AVATARS[0];
                      const newId = profiles.length > 0 ? Math.max(...profiles.map(p => p.id)) + 1 : 1;
                      setProfiles([
                        ...profiles,
                        {
                          id: newId,
                          name: profileData.nickname,
                          color: PROFILE_COLORS[(newId - 1) % PROFILE_COLORS.length],
                          avatar: newAvatar,
                          age: profileData.age,
                          gender: profileData.gender,
                          genres: profileData.genres,
                          selectedContent: selected,
                        }
                      ]);
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
