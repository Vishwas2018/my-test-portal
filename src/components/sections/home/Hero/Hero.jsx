import './Hero.css';

import Button from '../../../common/Button';
import React from 'react';

const Hero = () => {
  return (
    <section className="hero">
      <div className="star"></div>
      <div className="star"></div>
      <div className="star"></div>
      <div className="container hero-container">
        <div className="hero-content">
          <h1 className="hero-title">Welcome to <span className="highlight">Portal</span>!</h1>
          <p className="hero-subtitle">Your fun and friendly web adventure for everyone!</p>
          <div className="hero-buttons">
            <Button to="/signup" variant="primary" size="large">Join the Fun!</Button>
            <Button to="/demo" variant="secondary" size="large">Watch Demo</Button>
          </div>
        </div>
        <div className="hero-image">
          <div className="abstract-shape shape-1"></div>
          <div className="abstract-shape shape-2"></div>
          <div className="abstract-shape shape-3"></div>
          <div className="placeholder-image">
            Fun Dashboard Preview!
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;