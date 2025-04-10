import './Header.css';

import { Link, useLocation } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

import { Button } from '../../common';
import { useAuth } from '../../../contexts/AuthContext';

const Header = () => {
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
        const { startDate, trialDays } = JSON.parse(trialInfo);
        const trialStartDate = new Date(startDate);
        const currentDate = new Date();
        const daysPassed = Math.floor((currentDate - trialStartDate) / (1000 * 60 * 60 * 24));
        const daysRemaining = trialDays - daysPassed;
        
        if (daysRemaining > 0) {
          setIsTrialActive(true);
          setTrialDaysRemaining(daysRemaining);
        } else {
          setIsTrialActive(false);
          // Trial expired, could implement additional logic here
        }
      }
    }
  }, [isAuthenticated, currentUser]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when location changes
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
  };

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div className="container header-container">
        <Link to="/" className="logo">
          <span className="logo-text">Wonderlearn</span>
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
                <li><Link to="/dashboard" className={location.pathname === '/dashboard' ? 'active' : ''}>Dashboard</Link></li>
              )}
            </ul>
          </nav>

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
                <Button onClick={handleLogout} variant="text">Log Out</Button>
              </>
            ) : (
              <>
                <Button to="/login" variant="text">Log In</Button>
                <Button to="/trial-signup" variant="primary">
                  <i className="fas fa-star"></i> Free 7-Day Trial
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;