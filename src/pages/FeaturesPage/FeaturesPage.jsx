import './FeaturesPage.css';

import { Link } from 'react-router-dom';
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

const FeaturesPage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="features-page">
      {/* Hero Section */}
      <section className="features-hero">
        <div className="container">
          <div className="features-hero-content">
            <h1 className="page-title">
              Platform <span className="highlight">Features</span>
            </h1>
            <p className="page-subtitle">
              Explore the comprehensive tools and resources designed to enhance your exam preparation experience
            </p>
          </div>
        </div>
      </section>

      {/* Main Features Section */}
      <section className="main-features">
        <div className="container">
          <h2 className="section-title">Core Platform Features</h2>
          <p className="section-subtitle">Discover the key features that make our platform the perfect solution for exam preparation</p>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon lightning">
                <i className="fas fa-bolt"></i>
              </div>
              <h3>Authentic Exams</h3>
              <p>Practice with tests that mirror the format, content, and difficulty of actual NAPLAN and ICAS exams</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon secure">
                <i className="fas fa-chart-line"></i>
              </div>
              <h3>Detailed Analysis</h3>
              <p>Receive comprehensive feedback and performance analytics to identify strengths and areas for improvement</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon customize">
                <i className="fas fa-sliders-h"></i>
              </div>
              <h3>Flexible Practice</h3>
              <p>Study at your own pace with exams for different year levels, subjects, and difficulty levels</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon tracking">
                <i className="fas fa-check-circle"></i>
              </div>
              <h3>Progress Tracking</h3>
              <p>Monitor improvement over time with our intuitive dashboard and progress reports</p>
            </div>
          </div>
        </div>
      </section>

      {/* Advanced Features Section */}
      <section className="advanced-features">
        <div className="container">
          <h2 className="section-title">Advanced Features</h2>
          <p className="section-subtitle">Take your exam preparation to the next level with our premium features</p>

          <div className="features-expanded-grid">
            <div className="expanded-feature">
              <div className="expanded-feature-content">
                <h3>Personalized Study Plans</h3>
                <p>Our intelligent system analyzes your performance and creates customized study plans tailored to your specific needs.</p>
                <ul className="feature-list">
                  <li><i className="fas fa-check"></i> Adaptive learning paths based on your performance</li>
                  <li><i className="fas fa-check"></i> Focus on areas that need improvement</li>
                  <li><i className="fas fa-check"></i> Regular adjustment to keep you on track</li>
                  <li><i className="fas fa-check"></i> Weekly study goals and milestones</li>
                </ul>
              </div>
              <div className="expanded-feature-image">
                <div className="feature-image-container">
                  <div className="dashboard-preview study-plan">
                    <div className="preview-header">
                      <div className="preview-circle"></div>
                      <div className="preview-circle"></div>
                      <div className="preview-circle"></div>
                    </div>
                    <div className="preview-content">
                      <div className="preview-section-title">Your Study Plan</div>
                      <div className="preview-calendar">
                        <div className="preview-day-card">
                          <div className="preview-day">MON</div>
                          <div className="preview-subject">Math</div>
                        </div>
                        <div className="preview-day-card active">
                          <div className="preview-day">TUE</div>
                          <div className="preview-subject">Science</div>
                        </div>
                        <div className="preview-day-card">
                          <div className="preview-day">WED</div>
                          <div className="preview-subject">English</div>
                        </div>
                        <div className="preview-day-card">
                          <div className="preview-day">THU</div>
                          <div className="preview-subject">Math</div>
                        </div>
                        <div className="preview-day-card">
                          <div className="preview-day">FRI</div>
                          <div className="preview-subject">Digital</div>
                        </div>
                      </div>
                      <div className="preview-section-title">Today's Focus Areas</div>
                      <div className="preview-focus-item">
                        <div className="preview-focus-icon">📊</div>
                        <div className="preview-focus-text">Data Analysis</div>
                      </div>
                      <div className="preview-focus-item">
                        <div className="preview-focus-icon">🧪</div>
                        <div className="preview-focus-text">Chemical Reactions</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="expanded-feature reverse">
              <div className="expanded-feature-content">
                <h3>Comprehensive Performance Analytics</h3>
                <p>Gain deep insights into your performance with our detailed analytics dashboard.</p>
                <ul className="feature-list">
                  <li><i className="fas fa-check"></i> Track progress across all subjects and tests</li>
                  <li><i className="fas fa-check"></i> Identify patterns in your performance</li>
                  <li><i className="fas fa-check"></i> Compare your results with past performance</li>
                  <li><i className="fas fa-check"></i> Visualize strengths and weaknesses</li>
                </ul>
              </div>
              <div className="expanded-feature-image">
                <div className="feature-image-container">
                  <div className="dashboard-preview analytics">
                    <div className="preview-header">
                      <div className="preview-circle"></div>
                      <div className="preview-circle"></div>
                      <div className="preview-circle"></div>
                    </div>
                    <div className="preview-content">
                      <div className="preview-section-title">Performance Overview</div>
                      <div className="preview-chart-container">
                        <div className="preview-bar preview-bar-1"></div>
                        <div className="preview-bar preview-bar-2"></div>
                        <div className="preview-bar preview-bar-3"></div>
                        <div className="preview-bar preview-bar-4"></div>
                        <div className="preview-bar preview-bar-5"></div>
                      </div>
                      <div className="preview-chart-legend">
                        <div className="preview-legend-item">
                          <div className="preview-legend-color math"></div>
                          <div className="preview-legend-text">Math</div>
                        </div>
                        <div className="preview-legend-item">
                          <div className="preview-legend-color science"></div>
                          <div className="preview-legend-text">Science</div>
                        </div>
                        <div className="preview-legend-item">
                          <div className="preview-legend-color english"></div>
                          <div className="preview-legend-text">English</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="expanded-feature">
              <div className="expanded-feature-content">
                <h3>Interactive Practice Sessions</h3>
                <p>Engage with our interactive practice sessions designed to make learning more effective and enjoyable.</p>
                <ul className="feature-list">
                  <li><i className="fas fa-check"></i> Timed sessions to simulate exam conditions</li>
                  <li><i className="fas fa-check"></i> Immediate feedback on answers</li>
                  <li><i className="fas fa-check"></i> Step-by-step explanations for complex problems</li>
                  <li><i className="fas fa-check"></i> Adaptive difficulty based on performance</li>
                </ul>
              </div>
              <div className="expanded-feature-image">
                <div className="feature-image-container">
                  <div className="dashboard-preview interactive">
                    <div className="preview-header">
                      <div className="preview-circle"></div>
                      <div className="preview-circle"></div>
                      <div className="preview-circle"></div>
                    </div>
                    <div className="preview-content">
                      <div className="preview-section-title">Interactive Science Quiz</div>
                      <div className="preview-question">
                        <div className="preview-question-text">Which gas do plants absorb from the atmosphere?</div>
                        <div className="preview-options">
                          <div className="preview-option">Oxygen</div>
                          <div className="preview-option correct">Carbon Dioxide</div>
                          <div className="preview-option">Nitrogen</div>
                          <div className="preview-option">Hydrogen</div>
                        </div>
                        <div className="preview-explanation">
                          Plants absorb carbon dioxide during photosynthesis and release oxygen as a byproduct.
                        </div>
                      </div>
                      <div className="preview-timer">
                        <div className="preview-timer-fill"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Exam Categories Section - from HomePage */}
      <section className="categories-section">
        <div className="container">
          <h2 className="section-title">Exam Categories</h2>
          <p className="section-subtitle">Explore our comprehensive collection of practice exams</p>

          <div className="categories-grid">
            <div className="category-card math">
              <div className="category-icon">
                <i className="fas fa-landmark"></i>
              </div>
              <h3>NAPLAN</h3>
              <p>Australian National Assessment Program exams for literacy and numeracy skills</p>
              <Link to="/activities" className="btn-outline">Explore NAPLAN</Link>
            </div>

            <div className="category-card science">
              <div className="category-icon">
                <i className="fas fa-graduation-cap"></i>
              </div>
              <h3>ICAS</h3>
              <p>International Competitions and Assessments for Schools across multiple subjects</p>
              <Link to="/activities" className="btn-outline">Explore ICAS</Link>
            </div>

            <div className="category-card english">
              <div className="category-icon">
                <i className="fas fa-star"></i>
              </div>
              <h3>ICAS All Stars</h3>
              <p>Advanced ICAS exams for high-achieving students looking for an extra challenge</p>
              <Link to="/activities" className="btn-outline">Explore All Stars</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Features Section */}
      <section className="technical-features">
        <div className="container">
          <h2 className="section-title">Technical Features</h2>
          <p className="section-subtitle">Our platform is built with state-of-the-art technology to provide the best learning experience</p>

          <div className="tech-features-grid">
            <div className="tech-feature">
              <div className="tech-icon">
                <i className="fas fa-mobile-alt"></i>
              </div>
              <h3>Responsive Design</h3>
              <p>Access your study materials on any device - desktop, tablet, or mobile phone</p>
            </div>

            <div className="tech-feature">
              <div className="tech-icon">
                <i className="fas fa-shield-alt"></i>
              </div>
              <h3>Secure Platform</h3>
              <p>Your data is protected with industry-standard security measures and encryption</p>
            </div>

            <div className="tech-feature">
              <div className="tech-icon">
                <i className="fas fa-sync-alt"></i>
              </div>
              <h3>Regular Updates</h3>
              <p>Continuously updated content to reflect the latest exam formats and requirements</p>
            </div>

            <div className="tech-feature">
              <div className="tech-icon">
                <i className="fas fa-cloud"></i>
              </div>
              <h3>Cloud Sync</h3>
              <p>Your progress is automatically saved and synced across all your devices</p>
            </div>

            <div className="tech-feature">
              <div className="tech-icon">
                <i className="fas fa-user-friends"></i>
              </div>
              <h3>Multiple Profiles</h3>
              <p>Create separate profiles for multiple children in the same family account</p>
            </div>

            <div className="tech-feature">
              <div className="tech-icon">
                <i className="fas fa-download"></i>
              </div>
              <h3>Offline Access</h3>
              <p>Download exams for offline practice when internet connection is unavailable</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section features-cta">
        <div className="container cta-container">
          <div className="cta-content">
            <h2>Ready to experience these features?</h2>
            <p>Start your exam preparation journey today and unlock your full potential.</p>
            <ul className="cta-features">
              <li><i className="fas fa-check"></i> Complete access to all platform features</li>
              <li><i className="fas fa-check"></i> Comprehensive exam library for all subjects</li>
              <li><i className="fas fa-check"></i> Personalized study plans and analytics</li>
              <li><i className="fas fa-check"></i> 7-day free trial with no obligations</li>
            </ul>
            {isAuthenticated ? (
              <Link to="/dashboard" className="hero-btn cta">Go to Dashboard</Link>
            ) : (
              <Link to="/trial-signup" className="hero-btn cta">Start Your Free Trial!</Link>
            )}
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

export default FeaturesPage;