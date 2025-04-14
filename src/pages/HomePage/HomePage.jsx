import './HomePage.css';

import { Link } from 'react-router-dom';
import React from 'react';
import Testimonials from '../../components/sections/home/Testimonials';
import { useAuth } from '../../contexts/AuthContext';

const HomePage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section id="hero" className="hero">
        <div className="star"></div>
        <div className="star"></div>
        <div className="star"></div>
        <div className="container hero-container">
          <div className="hero-content">
            <h1 className="hero-title">
              Discover the <span className="highlight">Joy of Learning</span> with WonderLearn!
            </h1>
            <p className="hero-subtitle">
              Unleash your child's potential through interactive, engaging, and fun educational adventures!
            </p>
            <div className="hero-buttons">
              {isAuthenticated ? (
                <Link to="/dashboard" className="hero-btn primary">
                  <i className="fas fa-rocket"></i> Go to Dashboard
                </Link>
              ) : (
                <Link to="/signup" className="hero-btn primary">
                  <i className="fas fa-star"></i> JOIN THE FUN!
                </Link>
              )}
              <Link to="/demo" className="hero-btn secondary">
                <i className="fas fa-play-circle"></i> WATCH DEMO
              </Link>
            </div>
          </div>
          <div className="hero-image">
            <div className="abstract-shape shape-1"></div>
            <div className="abstract-shape shape-2"></div>
            <div className="abstract-shape shape-3"></div>
            <div className="placeholder-image">
              <div className="dashboard-preview">
                <div className="preview-header">
                  <div className="preview-circle"></div>
                  <div className="preview-circle"></div>
                  <div className="preview-circle"></div>
                </div>
                <div className="preview-content">
                  <div className="preview-item"></div>
                  <div className="preview-item"></div>
                  <div className="preview-item"></div>
                </div>
                <div className="preview-label">Fun Dashboard Preview!</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features">
        <div className="container features-container">
          <h2 className="section-title">Why Choose WonderLearn?</h2>
          <p className="section-subtitle">Our platform is designed to make learning an exciting adventure</p>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon lightning">
                <i className="fas fa-bolt"></i>
              </div>
              <h3>Lightning Fast</h3>
              <p>Experience unparalleled speed with our optimized learning platform that responds instantly to your child's needs</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon secure">
                <i className="fas fa-shield-alt"></i>
              </div>
              <h3>Highly Secure</h3>
              <p>Kid-friendly security systems protect young learners' data with enterprise-grade protection</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon customize">
                <i className="fas fa-sliders-h"></i>
              </div>
              <h3>Customizable</h3>
              <p>Tailor the learning experience to match your child's specific needs, interests, and learning pace</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon tracking">
                <i className="fas fa-chart-line"></i>
              </div>
              <h3>Progress Tracking</h3>
              <p>Gain valuable insights with comprehensive learning reports that highlight strengths and growth areas</p>
            </div>
          </div>
        </div>
      </section>

      {/* Learning Categories Section */}
      <section id="categories" className="categories-section">
        <div className="container">
          <h2 className="section-title">Learning Categories</h2>
          <p className="section-subtitle">Explore our range of subject areas tailored for comprehensive education</p>
          
          <div className="categories-grid">
            <div className="category-card math">
              <div className="category-icon">
                <i className="fas fa-calculator"></i>
              </div>
              <h3>Mathematics</h3>
              <p>Develop problem-solving skills and numerical fluency through engaging math activities</p>
              <Link to="/categories/math" className="btn-outline">Explore Math</Link>
            </div>
            
            <div className="category-card science">
              <div className="category-icon">
                <i className="fas fa-flask"></i>
              </div>
              <h3>Science</h3>
              <p>Discover scientific concepts through interactive experiments and engaging content</p>
              <Link to="/categories/science" className="btn-outline">Explore Science</Link>
            </div>
            
            <div className="category-card english">
              <div className="category-icon">
                <i className="fas fa-book"></i>
              </div>
              <h3>English</h3>
              <p>Build reading comprehension, writing, and communication skills through language activities</p>
              <Link to="/categories/english" className="btn-outline">Explore English</Link>
            </div>
            
            <div className="category-card reasoning">
              <div className="category-icon">
                <i className="fas fa-brain"></i>
              </div>
              <h3>Reasoning</h3>
              <p>Enhance critical thinking and logical reasoning abilities with stimulating challenges</p>
              <Link to="/categories/reasoning" className="btn-outline">Explore Reasoning</Link>
            </div>
            
            <div className="category-card digital">
              <div className="category-icon">
                <i className="fas fa-laptop-code"></i>
              </div>
              <h3>Digital Technologies</h3>
              <p>Master digital literacy and computational thinking skills essential for the future</p>
              <Link to="/categories/digital" className="btn-outline">Explore Digital</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <Testimonials />

      {/* Sample Activity Section */}
      <section id="sample-activity" className="sample-activity">
        <div className="container">
          <h2 className="section-title">Try a Free Activity</h2>
          <p className="section-description">Experience the magic of WonderLearn with a free sample activity. No sign-up required!</p>
          <div className="sample-activity-container">
            <div className="sample-activity-info">
              <h3>Sample Activity Features:</h3>
              <ul className="feature-list">
                <li><i className="fas fa-check"></i> Interactive learning modules</li>
                <li><i className="fas fa-check"></i> Fun animated characters</li>
                <li><i className="fas fa-check"></i> Instant feedback and rewards</li>
                <li><i className="fas fa-check"></i> Full access to learning tools</li>
              </ul>
              <Link to="/sample-activity" className="hero-btn primary">Try Free Activity</Link>
            </div>
            <div className="sample-activity-image">
              <div className="placeholder-image activity-preview">
                Activity Preview
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section id="newsletter" className="newsletter-section">
        <div className="container">
          <div className="newsletter-content">
            <h2>Stay Updated</h2>
            <p>Subscribe to our newsletter for the latest updates and learning tips</p>
            <form className="newsletter-form">
              <input type="email" placeholder="Enter your email" required />
              <button type="submit" className="hero-btn primary">Subscribe</button>
            </form>
          </div>
        </div>
      </section>

      {/* CTA - Free Trial Section */}
      <section id="free-trial" className="cta-section">
        <div className="container cta-container">
          <div className="cta-content">
            <h2>Try WonderLearn Free for 7 Days!</h2>
            <p>Get full access to all our learning adventures.</p>
            <ul className="cta-features">
              <li><i className="fas fa-check"></i> Full access to all learning modules</li>
              <li><i className="fas fa-check"></i> Progress tracking for parents</li>
              <li><i className="fas fa-check"></i> Unlimited activities and games</li>
              <li><i className="fas fa-check"></i> No credit card required</li>
            </ul>
            <Link to="/trial-signup" className="hero-btn cta">Start Your Free Trial!</Link>
            <p className="cta-note">No payment details needed. Trial automatically ends after 7 days.</p>
          </div>
          <div className="cta-background">
            <div className="balloon balloon1"></div>
            <div className="balloon balloon2"></div>
            <div className="balloon balloon3"></div>
            <div className="balloon balloon4"></div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;