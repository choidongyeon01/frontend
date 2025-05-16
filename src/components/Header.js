import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/components/Header.css';

const Header = () => {
  const location = useLocation();

  return (
    <header className="header">
      <div className="header-left">
        <div className="logo">IFITV</div>
        <nav className="navigation">
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link>
          <Link to="/live" className={location.pathname === '/live' ? 'active' : ''}>Live</Link>
          <Link to="/vod" className={location.pathname === '/vod' ? 'active' : ''}>VOD</Link>
          <Link to="/genres" className={location.pathname === '/genres' ? 'active' : ''}>Genres</Link>
          <Link to="/mylist" className={location.pathname === '/mylist' ? 'active' : ''}>My List</Link>
        </nav>
      </div>
      <div className="user-actions">
        <span className="search-icon">🔍</span>
        <span className="user-profile">J</span>
        <button className="switch-button">🖐 Switch</button>
        <button className="logout-button">Logout</button>
      </div>
    </header>
  );
};

export default Header;
