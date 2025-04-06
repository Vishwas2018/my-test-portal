import './Features.css';

import FeatureCard from './FeatureCard';
// src/components/sections/home/Features/Features.jsx
import React from 'react';

const Features = () => {
  const features = [
    {
      id: 'speed',
      icon: 'speed',
      title: 'Lightning Fast',
      description: 'Experience unparalleled speed with our optimized architecture'
    },
    {
      id: 'security',
      icon: 'security',
      title: 'Highly Secure',
      description: 'Enterprise-grade security to protect your valuable data'
    },
    {
      id: 'customize',
      icon: 'customize',
      title: 'Customizable',
      description: 'Tailor the experience to match your specific needs'
    },
    {
      id: 'analytics',
      icon: 'analytics',
      title: 'Rich Analytics',
      description: 'Gain valuable insights with comprehensive reporting tools'
    }
  ];

  return (
    <section className="features">
      <div className="container features-container">
        <h2 className="section-title">Why Choose Our Portal</h2>
        <div className="features-grid">
          {features.map(feature => (
            <FeatureCard
              key={feature.id}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;