import './Header.css';

// src/components/layout/Header/Header.jsx
import React, { useState } from 'react';

import Button from '../../common/Button';
import { Link } from 'react-router-dom';
import Navigation from '../Navigation';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="header">
      <div className="container header-container">
        <Link to="/" className="logo">
          <span className="logo-text">Portal</span>
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
          <Navigation />

          <div className="auth-buttons">
            <Button to="/login" variant="text">Log In</Button>
            <Button to="/signup">Sign Up</Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;