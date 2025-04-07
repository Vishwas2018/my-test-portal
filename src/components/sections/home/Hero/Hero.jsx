import './Hero.css';

import Button from '../../../common/Button';
import React from 'react';

const Hero = () => {
  return (
    <section className="hero">
      <div className="container hero-container">
        <div className="hero-content">
          <h1 className="hero-title">Welcome to <span className="highlight">Portal</span></h1>
          <p className="hero-subtitle">Your all-in-one web solution for modern businesses</p>
          <div className="hero-buttons">
            <Button to="/signup" variant="primary">Get Started</Button>
            <Button to="/demo" variant="secondary">Watch Demo</Button>
          </div>
        </div>
        <div className="hero-image">
          <div className="abstract-shape shape-1"></div>
          <div className="abstract-shape shape-2"></div>
          <div className="abstract-shape shape-3"></div>
          <div className="placeholder-image">Dashboard Preview</div>
        </div>
      </div>
    </section>
  );
};

export default Hero;