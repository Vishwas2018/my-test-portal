import './CallToAction.css';

import { Button } from '../../../common';
// src/components/sections/home/CallToAction/CallToAction.jsx
import React from 'react';

const CallToAction = () => {
  return (
    <section className="cta-section">
      <div className="container cta-container">
        <div className="cta-content">
          <h2>Ready to transform your workflow?</h2>
          <p>Join thousands of satisfied users today.</p>
          <Button to="/signup" variant="cta">Start Free Trial</Button>
        </div>
        <div className="cta-background"></div>
      </div>
    </section>
  );
};

export default CallToAction;