// src/components/ExamInterface/ThemeToggler/ThemeToggler.jsx
import React, { useEffect, useState } from 'react';

import styled from 'styled-components';

const TogglerContainer = styled.div`
  position: fixed;
  top: 6rem;
  right: 1rem;
  z-index: 999;
`;

const TogglerButton = styled.button`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background-color: ${props => props.$isDarkMode ? 'var(--dark)' : 'var(--light)'};
  color: ${props => props.$isDarkMode ? 'var(--light)' : 'var(--dark)'};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: none;
  box-shadow: var(--shadow-md);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
  }
  
  svg {
    width: 24px;
    height: 24px;
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(var(--primary-rgb), 0.4), var(--shadow-md);
  }
`;

/**
 * ThemeToggler component provides a button to toggle between light and dark modes
 * 
 * @param {boolean} initialDarkMode - Initial theme state
 * @param {Function} onChange - Callback when theme changes
 */
const ThemeToggler = ({ initialDarkMode = false, onChange }) => {
  const [isDarkMode, setIsDarkMode] = useState(initialDarkMode);
  
  // Apply theme to document
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);
  
  // Handle theme toggle
  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    
    if (onChange) {
      onChange(newMode);
    }
  };
  
  return (
    <TogglerContainer>
      <TogglerButton 
        $isDarkMode={isDarkMode} 
        onClick={toggleTheme}
        aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
        title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
      >
        {isDarkMode ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
        )}
      </TogglerButton>
    </TogglerContainer>
  );
};

export default ThemeToggler;