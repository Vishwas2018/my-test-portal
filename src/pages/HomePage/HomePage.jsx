import './HomePage.css';

import CallToAction from '../../components/sections/home/CallToAction'; // Correct path
import Features from '../../components/sections/home/Features'; // Correct path
import Hero from '../../components/sections/home/Hero'; // Correct path
// src/pages/HomePage/HomePage.jsx
import React from 'react';

const HomePage = () => {
  return (
    <div className="home-page">
      <Hero />
      <Features />
      <CallToAction />
    </div>
  );
};

export default HomePage;