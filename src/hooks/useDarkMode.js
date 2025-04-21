import { useEffect, useState } from 'react';

/**
 * Custom hook for managing dark mode with system preference detection
 * and persistent storage
 * 
 * @param {boolean} initialDarkMode - Optional override for initial state
 * @returns {[boolean, function]} - Dark mode state and toggle function
 */
const useDarkMode = (initialDarkMode) => {
  // Initialize state from localStorage or system preference
  const [darkMode, setDarkMode] = useState(() => {
    // If explicit initial value is provided, use it
    if (initialDarkMode !== undefined) {
      return initialDarkMode;
    }
    
    // Check localStorage first
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode !== null) {
      return JSON.parse(savedMode);
    }
    
    // Fall back to system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Apply dark mode class to document and store preference
  useEffect(() => {
    // Update document class
    document.documentElement.classList.toggle('dark-mode', darkMode);
    
    // Save preference to localStorage
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  // Listen for system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e) => {
      // Only change if user hasn't explicitly set a preference
      if (initialDarkMode === undefined && localStorage.getItem('darkMode') === null) {
        setDarkMode(e.matches);
      }
    };

    // Add listener for system preference changes
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [initialDarkMode]);

  // Toggle function with callback pattern for guaranteed state update
  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
  };

  return [darkMode, toggleDarkMode];
};

export default useDarkMode;