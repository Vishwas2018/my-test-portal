// src/hooks/useDarkMode.js
import { useEffect, useState } from 'react';

/**
 * Custom hook to handle dark mode state
 * @param {boolean} initialState - Initial dark mode state
 * @returns {[boolean, function]} Dark mode state and toggle function
 */
const useDarkMode = (initialState = false) => {
  // Initialize state from localStorage or system preference
  const [darkMode, setDarkMode] = useState(() => {
    // Check for saved preference
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode !== null) {
      return savedMode === 'true';
    }
    
    // Check for system preference if no saved preference
    if (initialState === undefined && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    
    return initialState;
  });
  
  // Update localStorage when state changes
  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
    
    // Apply or remove dark mode class to document
    if (darkMode) {
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
    }
  }, [darkMode]);
  
  // Toggle function
  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
  };
  
  return [darkMode, toggleDarkMode];
};

export default useDarkMode;