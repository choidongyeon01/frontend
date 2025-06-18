import React from 'react';
import '../styles/components/WelcomeSection.css';

const WelcomeSection = ({ selectedProfile }) => {
  return (
    <div className="welcome-section">
      <h1>
        Welcome,{' '}
        {selectedProfile ? (
          <>
            {selectedProfile.name}{' '}
            <span className="wave-emoji">{selectedProfile.avatar}</span>
          </>
        ) : (
          'Guest'
        )}
      </h1>
      <p>Continue Watching where you left off</p>
    </div>
  );
};

export default WelcomeSection;
