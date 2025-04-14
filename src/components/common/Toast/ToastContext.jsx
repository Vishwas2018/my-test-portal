import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

import PropTypes from 'prop-types';
import ToastContainer from './ToastContainer';

// Create context
const ToastContext = createContext({
  addToast: () => {},
  removeToast: () => {},
  removeAllToasts: () => {},
});

/**
 * Toast provider component to manage toasts globally
 */
export const ToastProvider = ({ 
  children, 
  position = 'bottom-right',
  maxToasts = 5,
  dark = false,
  hasProgress = true,
  hasBackground = false,
}) => {
  const [toasts, setToasts] = useState([]);
  const [darkMode, setDarkMode] = useState(dark);
  
  // Remove a toast by ID
  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);
  
  // Remove all toasts
  const removeAllToasts = useCallback(() => {
    setToasts([]);
  }, []);
  
  // Add a new toast
  const addToast = useCallback(({ 
    type = 'info',
    title = '',
    message,
    duration = 5000,
  }) => {
    // Generate a unique ID
    const id = `toast-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    // Create new toast
    const newToast = {
      id,
      type,
      title,
      message,
      duration,
    };
    
    // Add toast to state (limit to maxToasts)
    setToasts(prev => {
      // If we already have the maximum toasts, remove the oldest one
      if (prev.length >= maxToasts) {
        return [...prev.slice(1), newToast];
      }
      return [...prev, newToast];
    });
    
    // Return the ID for potential manual removal
    return id;
  }, [maxToasts]);
  
  // Update darkMode when the dark prop changes
  useEffect(() => {
    setDarkMode(dark);
  }, [dark]);
  
  // Check if dark mode preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e) => {
      // Don't override explicit dark prop
      if (dark === undefined) {
        setDarkMode(e.matches);
      }
    };
    
    // Add listener for system preference changes
    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      // Older browsers
      mediaQuery.addListener(handleChange);
    }
    
    return () => {
      if (typeof mediaQuery.removeEventListener === 'function') {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, [dark]);
  
  // Context value
  const value = {
    addToast,
    removeToast,
    removeAllToasts,
  };
  
  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer
        toasts={toasts}
        position={position}
        onClose={removeToast}
        dark={darkMode}
        hasProgress={hasProgress}
        hasBackground={hasBackground}
      />
    </ToastContext.Provider>
  );
};

ToastProvider.propTypes = {
  /** React children */
  children: PropTypes.node.isRequired,
  /** Position on screen */
  position: PropTypes.oneOf([
    'top-left',
    'top-right',
    'bottom-left',
    'bottom-right',
    'top-center',
    'bottom-center'
  ]),
  /** Maximum number of toasts to show at once */
  maxToasts: PropTypes.number,
  /** Use dark theme */
  dark: PropTypes.bool,
  /** Show progress bar */
  hasProgress: PropTypes.bool,
  /** Use colored background */
  hasBackground: PropTypes.bool,
};

/**
 * Custom hook to use toast functionality
 */
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export default ToastContext;