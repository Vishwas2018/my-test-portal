import './CallToAction.css';

import { Button } from '../../../common';
import React from 'react';

const CallToAction = () => {
  return (
    <section className="cta-section">
      <div className="container cta-container">
        <div className="cta-content">
          <h2>Ready to start your adventure?</h2>
          <p>Join hundreds of happy explorers today!</p>
          <Button to="/signup" variant="cta" size="large">Start Your Journey!</Button>
        </div>
        <div className="cta-background">
          <div className="balloon balloon1"></div>
          <div className="balloon balloon2"></div>
          <div className="balloon balloon3"></div>
          <div className="balloon balloon4"></div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;