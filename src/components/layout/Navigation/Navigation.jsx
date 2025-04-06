import './Navigation.css';

import { NavLink } from 'react-router-dom';
// src/components/layout/Navigation/Navigation.jsx
import React from 'react';

const Navigation = () => {
  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/features', label: 'Features' },
    { path: '/pricing', label: 'Pricing' },
    { path: '/about', label: 'About' }
  ];

  return (
    <nav className="main-nav">
      <ul className="nav-links">
        {navItems.map((item) => (
          <li key={item.path}>
            <NavLink
              to={item.path}
              className={({ isActive }) => isActive ? "active" : ""}
              end={item.path === '/'}
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navigation;