import './NotFoundPage.css';

import { Button } from '../../components/common';
import { Link } from 'react-router-dom';
import React from 'react';

const NotFoundPage = () => {
  return (
    <div className="not-found">
      <div className="container not-found-container">
        <div className="not-found-content">
          <h1 className="not-found-title">404</h1>
          <h2 className="not-found-subtitle">Oops! Page Not Found</h2>
          <p className="not-found-text">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="not-found-actions">
            <Button to="/" variant="primary" size="large">
              Go Home
            </Button>
          </div>
        </div>
        <div className="not-found-decoration">
          <div className="lost-character">
            <div className="character-face">
              <div className="character-eyes">
                <div className="eye left"></div>
                <div className="eye right"></div>
              </div>
              <div className="character-mouth"></div>
            </div>
            <div className="character-body"></div>
            <div className="character-shadow"></div>
          </div>
          <div className="map">
            <div className="map-x"></div>
          </div>
          <div className="star star1"></div>
          <div className="star star2"></div>
          <div className="star star3"></div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;