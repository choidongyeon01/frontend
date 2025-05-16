import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import tmdbApi from './api/tmdb';
import './styles/App.css';
import WelcomeSection from './components/WelcomeSection';
import LiveSection from './components/LiveSection';
import MovieRow from './components/MovieRow';
import LivePage from './components/LivePage';
import VODPage from './components/VODPage';
import GenrePage from './components/GenrePage';
import MyList from './pages/MyList'; // ✅ 올바른 경로
import { MyListProvider } from './context/MyListContext';

// 홈 페이지 컴포넌트 분리
const Home = () => (
  <main className="main-content">
    <div className="banner-section"></div>
    <WelcomeSection />
    <LiveSection />
    <MovieRow 
      title="Trending Now" 
      fetchFunction={tmdbApi.trending} 
      category="Sci-Fi • New Episode" 
    />
    <MovieRow 
      title="Personalized for You" 
      fetchFunction={tmdbApi.popular} 
      category="Fantasy • Based on your watch history" 
    />
    <MovieRow 
      title="Popular Among Your Demographic" 
      fetchFunction={tmdbApi.upcoming} 
      category="Reality • Popular in your region" 
    />
  </main>
);

function App() {
  return (
    <MyListProvider>
      <Router>
        <div className="app">
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/live" element={<LivePage />} />
            <Route path="/vod" element={<VODPage />} />
            <Route path="/genres" element={<GenrePage />} />
            <Route path="/mylist" element={<MyList />} />
          </Routes>
        </div>
      </Router>
    </MyListProvider>
  );
}

export default App;
