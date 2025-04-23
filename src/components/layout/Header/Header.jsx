import './Header.css';

import { Link, useLocation } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

import { useAuth } from '../../../contexts/AuthContext';

const Header = ({ darkMode, toggleDarkMode }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { currentUser, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  
  // Add trial functionality
  const [isTrialActive, setIsTrialActive] = useState(false);
  const [trialDaysRemaining, setTrialDaysRemaining] = useState(0);
  
  useEffect(() => {
    // Check if user is in trial period
    if (isAuthenticated && currentUser) {
      const trialInfo = localStorage.getItem('trial_info');
      if (trialInfo) {
        try {
          const { startDate, trialDays } = JSON.parse(trialInfo);
          const trialStartDate = new Date(startDate);
          const currentDate = new Date();
          const daysPassed = Math.floor((currentDate - trialStartDate) / (1000 * 60 * 60 * 24));
          const daysRemaining = trialDays - daysPassed;
          
          setIsTrialActive(daysRemaining > 0);
          setTrialDaysRemaining(Math.max(0, daysRemaining));
        } catch (error) {
          console.error('Error parsing trial info:', error);
        }
      }
    }
  }, [isAuthenticated, currentUser]);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Close mobile menu when location changes
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);
  
  const toggleMenu = () => {
    setMenuOpen(prevState => !prevState);
  };
  
  const handleLogout = () => {
    logout();
    setMenuOpen(false);
  };
  
  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div className="container header-container">
        <Link to="/" className="logo">
          <span className="logo-text">WonderLearn</span>
        </Link>
        
        {/* Mobile menu button */}
        <button
          className={`mobile-menu-btn ${menuOpen ? 'open' : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span className="menu-icon"></span>
        </button>
        
        {/* Navigation and auth buttons */}
        <div className={`header-content ${menuOpen ? 'open' : ''}`}>
          <nav className="main-nav">
            <ul className="nav-links">
              <li><Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link></li>
              <li><Link to="/features" className={location.pathname === '/features' ? 'active' : ''}>Features</Link></li>
              <li><Link to="/activities" className={location.pathname === '/activities' ? 'active' : ''}>Activities</Link></li>
              <li><Link to="/about" className={location.pathname === '/about' ? 'active' : ''}>About</Link></li>
              {isAuthenticated && (
                <>
                  <li><Link to="/dashboard" className={location.pathname === '/dashboard' ? 'active' : ''}>Dashboard</Link></li>
                  <li><Link to="/profile" className={location.pathname === '/profile' ? 'active' : ''}>Profile</Link></li>
                  </>
              )}
            </ul>
          </nav>

          <div className="header-controls">
            {/* Dark Mode Toggle button */}
            <div className="theme-toggle-wrapper">
              <button 
                onClick={toggleDarkMode}
                className="theme-toggle-btn"
                aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
              >
                {darkMode ? "☀️" : "🌙"}
              </button>
            </div>
            
            <div className="auth-buttons">
              {isAuthenticated ? (
                <>
                  {isTrialActive && (
                    <div className="trial-status">
                      <i className="fas fa-clock"></i>
                      <span>{trialDaysRemaining} days left</span>
                    </div>
                  )}
                  <span className="welcome-text">Welcome, {currentUser?.username || 'Friend'}</span>
                  <Link to="/" onClick={handleLogout} className="btn-text">Log Out</Link>
                </>
              ) : (
                <>
                  <Link to="/login" className="btn-text">Log In</Link>
                  <Link to="/trial-signup" className="btn-primary">
                    <i className="fas fa-star"></i> Free 7-Day Trial
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;