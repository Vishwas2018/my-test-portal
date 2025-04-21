// src/contexts/ToastContext.jsx
import React, { createContext, useCallback, useContext, useEffect, useReducer } from 'react';

import PropTypes from 'prop-types';
import ToastContainer from './ToastContainer';

// Initial state
const initialState = {
  toasts: [],
  darkMode: false
};

// Action types
const ADD_TOAST = 'ADD_TOAST';
const REMOVE_TOAST = 'REMOVE_TOAST';
const REMOVE_ALL_TOASTS = 'REMOVE_ALL_TOASTS';
const SET_DARK_MODE = 'SET_DARK_MODE';

// Reducer
const toastReducer = (state, action) => {
  switch (action.type) {
    case ADD_TOAST:
      // If we already have the maximum toasts, remove the oldest one
      const newToasts = [...state.toasts];
      if (newToasts.length >= action.payload.maxToasts) {
        newToasts.shift();
      }
      return {
        ...state,
        toasts: [...newToasts, action.payload.toast]
      };
    
    case REMOVE_TOAST:
      return {
        ...state,
        toasts: state.toasts.filter(toast => toast.id !== action.payload.id)
      };
    
    case REMOVE_ALL_TOASTS:
      return {
        ...state,
        toasts: []
      };
    
    case SET_DARK_MODE:
      return {
        ...state,
        darkMode: action.payload.darkMode
      };
    
    default:
      return state;
  }
};

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
  const [state, dispatch] = useReducer(toastReducer, {
    ...initialState,
    darkMode: dark
  });
  
  // Remove a toast by ID
  const removeToast = useCallback((id) => {
    dispatch({
      type: REMOVE_TOAST,
      payload: { id }
    });
  }, []);
  
  // Remove all toasts
  const removeAllToasts = useCallback(() => {
    dispatch({ type: REMOVE_ALL_TOASTS });
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
    const toast = {
      id,
      type,
      title,
      message,
      duration,
    };
    
    // Add toast to state
    dispatch({
      type: ADD_TOAST,
      payload: { toast, maxToasts }
    });
    
    // Return the ID for potential manual removal
    return id;
  }, [maxToasts]);
  
  // Update darkMode when the dark prop changes
  useEffect(() => {
    dispatch({
      type: SET_DARK_MODE,
      payload: { darkMode: dark }
    });
  }, [dark]);
  
  // Check if dark mode preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e) => {
      // Don't override explicit dark prop
      if (dark === undefined) {
        dispatch({
          type: SET_DARK_MODE,
          payload: { darkMode: e.matches }
        });
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
        toasts={state.toasts}
        position={position}
        onClose={removeToast}
        dark={state.darkMode}
        hasProgress={hasProgress}
        hasBackground={hasBackground}
      />
    </ToastContext.Provider>
  );
};

ToastProvider.propTypes = {
  children: PropTypes.node.isRequired,
  position: PropTypes.oneOf([
    'top-left',
    'top-right',
    'bottom-left',
    'bottom-right',
    'top-center',
    'bottom-center'
  ]),
  maxToasts: PropTypes.number,
  dark: PropTypes.bool,
  hasProgress: PropTypes.bool,
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