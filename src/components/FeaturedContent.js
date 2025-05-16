import React from 'react';
import '../styles/components/FeaturedContent.css';

export default function FeaturedContent() {
  return (
    <section className="featured">
      <div className="featured-item">
        <span className="live-badge">LIVE</span>
        <img src="https://placehold.co/400x200?text=Live+News" alt="Evening News" />
        <div>Evening News</div>
      </div>
      <div className="featured-item">
        <span className="live-badge">LIVE</span>
        <img src="https://placehold.co/400x200?text=Live+VOD" alt="Live VOD" />
        <div>Live VOD</div>
      </div>
      <div className="featured-item">
        <img src="https://placehold.co/400x200?text=Music+Awards" alt="Music Awards" />
        <div>Music Awards</div>
      </div>
    </section>
  );
}
/* 이미지 임시로 해놨음 */
