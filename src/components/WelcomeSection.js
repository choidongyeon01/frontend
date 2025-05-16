import React from 'react';
import '../styles/components/WelcomeSection.css';

const WelcomeSection = () => {
  return (
    <div className="welcome-section">
      <h1>
        Welcome, Jiyeon <span className="wave-emoji">🖐️</span>
      </h1>
      <p>Continue Watching where you left off</p>
    </div>
  );
};

export default WelcomeSection;
