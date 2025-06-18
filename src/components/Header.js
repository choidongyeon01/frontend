import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../styles/components/Header.css';

const Header = ({ onLogout, onSwitchProfile, currentProfile }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
      setSearchOpen(false);
      setSearchTerm('');
    }
  };

  return (
    <aside className="sidebar-header">
      <Link to="/" className="sidebar-logo" style={{ cursor: 'pointer' }}>
        IFITV
      </Link>
      <nav className="sidebar-nav">
        <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link>
        <Link to="/live" className={location.pathname === '/live' ? 'active' : ''}>Live</Link>
        <Link to="/vod" className={location.pathname === '/vod' ? 'active' : ''}>VOD</Link>
        <Link to="/genres" className={location.pathname === '/genres' ? 'active' : ''}>Genres</Link>
        <Link to="/mylist" className={location.pathname === '/mylist' ? 'active' : ''}>My List</Link>
      </nav>
      <div className="sidebar-search">
        <span
          className="search-icon"
          onClick={() => setSearchOpen(v => !v)}
          style={{ cursor: 'pointer' }}
        >🔍</span>
        {searchOpen && (
          <form className="search-form" onSubmit={handleSearchSubmit} style={{ position: 'relative' }}>
            <input
              type="text"
              className="search-input"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="영화, TV 검색"
              autoFocus
            />
            <button
              type="button"
              className="search-close-btn"
              onClick={() => setSearchOpen(false)}
              aria-label="검색창 닫기"
            >✖️</button>
          </form>
        )}
      </div>
      <div className="sidebar-profile">
        {currentProfile && (
          <>
            <div className="profile-avatar">{currentProfile.avatar}</div>
            <div className="profile-name">{currentProfile.name}</div>
          </>
        )}
        <button className="switch-button" onClick={onSwitchProfile}>Switch</button>
        <button className="logout-button" onClick={onLogout}>Logout</button>
      </div>
    </aside>
  );
};

export default Header;
