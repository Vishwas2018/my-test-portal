import './HomePage.css';

import { Link } from 'react-router-dom';
import React from 'react';
import Testimonials from '../../components/sections/home/Testimonials';
import { useAuth } from '../../contexts/AuthContext';

/**
 * HomePage - Main landing page component
 * Features a modern, engaging layout with blue shades theme
 */
const HomePage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section id="hero" className="hero">
        <div className="star"></div>
        <div className="star"></div>
        <div className="star"></div>
        <div className="abstract-shape shape-1"></div>
        <div className="abstract-shape shape-2"></div>
        <div className="abstract-shape shape-3"></div>
        <div className="container hero-container">
          <div className="hero-content">
            <h1 className="hero-title">
              Prepare for success with <span className="highlight">Complete Exam Practice</span>
            </h1>
            <p className="hero-subtitle">
              Comprehensive practice tests for NAPLAN, ICAS, and ICAS All Stars to help your child excel
            </p>
            <div className="hero-buttons">
              {isAuthenticated ? (
                <Link to="/dashboard" className="hero-btn primary">
                  <i className="fas fa-rocket"></i> Go to Dashboard
                </Link>
              ) : (
                <Link to="/signup" className="hero-btn primary">
                  <i className="fas fa-star"></i> START PRACTICING NOW
                </Link>
              )}
              <Link to="/exams" className="hero-btn secondary">
                <i className="fas fa-file-alt"></i> EXPLORE EXAMS
              </Link>
              <Link to="/features" className="hero-btn secondary">
                <i className="fas fa-list-check"></i> EXPLORE FEATURES
              </Link>
            </div>
          </div>
          <div className="hero-image">
            <div className="placeholder-image">
              <div className="dashboard-preview">
                <div className="preview-header">
                  <div className="preview-circle"></div>
                  <div className="preview-circle"></div>
                  <div className="preview-circle"></div>
                </div>
                <div className="preview-content">
                  {/* Subject cards */}
                  <div className="preview-subject-row">
                    <div className="preview-subject-card">
                      <div className="preview-subject-icon">📝</div>
                      <div className="preview-subject-text">NAPLAN</div>
                    </div>
                    <div className="preview-subject-card">
                      <div className="preview-subject-icon">🎓</div>
                      <div className="preview-subject-text">ICAS</div>
                    </div>
                    <div className="preview-subject-card">
                      <div className="preview-subject-icon">⭐</div>
                      <div className="preview-subject-text">All Stars</div>
                    </div>
                  </div>

                  {/* Progress bar section */}
                  <div className="preview-progress-section">
                    <div className="preview-section-title">Your Progress</div>
                    <div className="preview-progress-bar">
                      <div className="preview-progress-fill"></div>
                    </div>
                    <div className="preview-progress-stats">
                      <div className="preview-stat">
                        <div className="preview-stat-number">12</div>
                        <div className="preview-stat-label">Exams</div>
                      </div>
                      <div className="preview-stat">
                        <div className="preview-stat-number">85%</div>
                        <div className="preview-stat-label">Avg. Score</div>
                      </div>
                      <div className="preview-stat">
                        <div className="preview-stat-number">4</div>
                        <div className="preview-stat-label">Day Streak</div>
                      </div>
                    </div>
                  </div>

                  {/* Recent activity section */}
                  <div className="preview-recent-section">
                    <div className="preview-section-title">Recent Exams</div>
                    <div className="preview-activity-item">
                      <div className="preview-activity-icon">🧪</div>
                      <div className="preview-activity-info">
                        <div className="preview-activity-name">Science Quiz</div>
                        <div className="preview-activity-score">Score: 92%</div>
                      </div>
                    </div>
                    <div className="preview-activity-item">
                      <div className="preview-activity-icon">📝</div>
                      <div className="preview-activity-info">
                        <div className="preview-activity-name">Math Test</div>
                        <div className="preview-activity-score">Score: 88%</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="preview-label">Your Exam Dashboard</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features">
        <div className="container features-container">
          <h2 className="section-title">Why Choose Our Platform?</h2>
          <p className="section-subtitle">Our exam preparation platform is designed to ensure student success</p>

          <div className="features-grid">
            <div className="feature-card animate-fade-in-up delay-100">
              <div className="feature-icon lightning">
                <i className="fas fa-bolt"></i>
              </div>
              <h3>Authentic Exams</h3>
              <p>Practice with tests that mirror the format, content, and difficulty of actual NAPLAN and ICAS exams</p>
            </div>

            <div className="feature-card animate-fade-in-up delay-200">
              <div className="feature-icon secure">
                <i className="fas fa-chart-line"></i>
              </div>
              <h3>Detailed Analysis</h3>
              <p>Receive comprehensive feedback and performance analytics to identify strengths and areas for improvement</p>
            </div>

            <div className="feature-card animate-fade-in-up delay-300">
              <div className="feature-icon customize">
                <i className="fas fa-sliders-h"></i>
              </div>
              <h3>Flexible Practice</h3>
              <p>Study at your own pace with exams for different year levels, subjects, and difficulty levels</p>
            </div>

            <div className="feature-card animate-fade-in-up delay-400">
              <div className="feature-icon tracking">
                <i className="fas fa-check-circle"></i>
              </div>
              <h3>Progress Tracking</h3>
              <p>Monitor improvement over time with our intuitive dashboard and progress reports</p>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <Link to="/features" className="btn-outline">
              Explore All Features <i className="fas fa-arrow-right ml-2"></i>
            </Link>
          </div>
        </div>
      </section>

      {/* Exam Section */}
      <section id="exam-section" className="exam-section">
        <div className="container">
          <h2 className="section-title">Prepare for Success</h2>
          <p className="section-subtitle">Comprehensive exam practice to help students excel</p>
          
          <div className="exam-overview">
            <div className="exam-info-card">
              <div className="exam-icon">📋</div>
              <h3>How Exams Work</h3>
              <p>Our online exams simulate real testing conditions with timed sessions, varied question formats, and instant feedback to help you improve.</p>
            </div>
            
            <div className="exam-info-card">
              <div className="exam-icon">📚</div>
              <h3>Study Tips</h3>
              <p>Practice regularly, focus on understanding concepts rather than memorizing, and review your mistakes to learn from them.</p>
              <div className="tip-subjects">
                <span className="tip-subject">Math</span>
                <span className="tip-subject">Science</span>
                <span className="tip-subject">English</span>
                <span className="tip-subject">Digital</span>
              </div>
            </div>
            
            <div className="exam-info-card">
              <div className="exam-icon">🔒</div>
              <h3>Academic Integrity</h3>
              <p>Our platform monitors for tab switching and other behaviors that may compromise exam integrity. Focus on honest practice for genuine improvement.</p>
            </div>
          </div>
          
          <div className="exam-cta">
            <Link to="/exams" className="hero-btn primary">
              <i className="fas fa-file-alt"></i> Explore Exams
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <Testimonials />

      {/* Sample Exam Section */}
      <section id="sample-activity" className="sample-activity">
        <div className="container">
          <h2 className="section-title">Try Free Sample Exams</h2>
          <p className="section-subtitle">Experience the quality of our practice exams with no registration required</p>
          
          <div className="sample-activity-container">
            <div className="sample-activity-info">
              <h3>Sample Exam Features:</h3>
              <ul className="feature-list">
                <li><i className="fas fa-check"></i> Authentic exam format and questions</li>
                <li><i className="fas fa-check"></i> Immediate results and feedback</li>
                <li><i className="fas fa-check"></i> Science, Math and Digital Technologies</li>
                <li><i className="fas fa-check"></i> No time limit - practice at your own pace</li>
                <li><i className="fas fa-check"></i> No registration required</li>
              </ul>
              <Link to="/exams" className="hero-btn primary">Try Free Samples</Link>
            </div>
            
            <div className="sample-activity-image">
              <div className="placeholder-image">
                <div className="dashboard-preview">
                  <div className="preview-header">
                    <div className="preview-circle"></div>
                    <div className="preview-circle"></div>
                    <div className="preview-circle"></div>
                  </div>
                  <div className="preview-content">
                    {/* Sample exam preview content */}
                    <div className="preview-section-title">Sample Science Exam</div>
                    
                    <div className="preview-activity-item" style={{background: 'rgba(110, 207, 255, 0.1)', padding: '12px', borderRadius: '8px', marginBottom: '12px'}}>
                      <div className="preview-activity-info">
                        <div className="preview-activity-name" style={{fontSize: '14px', fontWeight: '600'}}>
                          Which of these is a living thing?
                        </div>
                        <div style={{marginTop: '8px'}}>
                          <div style={{display: 'flex', alignItems: 'center', marginBottom: '6px'}}>
                            <div style={{width: '16px', height: '16px', borderRadius: '50%', border: '2px solid #ddd', marginRight: '8px'}}></div>
                            <span>Rock</span>
                          </div>
                          <div style={{display: 'flex', alignItems: 'center', marginBottom: '6px'}}>
                            <div style={{width: '16px', height: '16px', borderRadius: '50%', border: '2px solid #ddd', marginRight: '8px'}}></div>
                            <span>Water</span>
                          </div>
                          <div style={{display: 'flex', alignItems: 'center', marginBottom: '6px'}}>
                            <div style={{width: '16px', height: '16px', borderRadius: '50%', border: '2px solid var(--primary)', backgroundColor: 'var(--primary-light)', marginRight: '8px'}}></div>
                            <span style={{fontWeight: '600'}}>Tree</span>
                          </div>
                          <div style={{display: 'flex', alignItems: 'center'}}>
                            <div style={{width: '16px', height: '16px', borderRadius: '50%', border: '2px solid #ddd', marginRight: '8px'}}></div>
                            <span>Sun</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="preview-section-title" style={{marginTop: '15px'}}>Navigation</div>
                    <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '8px'}}>
                      <div style={{padding: '8px 16px', backgroundColor: '#eee', borderRadius: '5px', fontSize: '14px'}}>Previous</div>
                      <div style={{padding: '8px 16px', backgroundColor: 'var(--primary)', color: 'white', borderRadius: '5px', fontSize: '14px'}}>Next</div>
                    </div>
                  </div>
                  <div className="preview-label">Sample Exam Preview</div>
                </div>
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
            <p>Subscribe to our newsletter for exam tips and updates</p>
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
            <h2>Start Preparing for Success Today!</h2>
            <p>Get full access to our comprehensive exam preparation platform.</p>
            <ul className="cta-features">
              <li><i className="fas fa-check"></i> Complete library of NAPLAN, ICAS, and ICAS All Stars exams</li>
              <li><i className="fas fa-check"></i> Detailed analytics and progress tracking</li>
              <li><i className="fas fa-check"></i> Custom study plans based on performance</li>
              <li><i className="fas fa-check"></i> 7-day free trial available</li>
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