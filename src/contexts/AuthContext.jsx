import React, { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from 'react';

import PropTypes from 'prop-types';
import { STORAGE_KEYS } from '../utils/constants';
import authService from '../services/authService';

// Initial auth state
const initialState = {
  currentUser: null,
  isAuthenticated: false,
  loading: true,
  error: null,
  trial: {
    isActive: false,
    daysRemaining: 0,
    startDate: null
  }
};

// Auth action types
const AUTH_ACTIONS = {
  AUTH_INIT: 'AUTH_INIT',
  AUTH_SUCCESS: 'AUTH_SUCCESS',
  AUTH_FAILURE: 'AUTH_FAILURE',
  AUTH_LOGOUT: 'AUTH_LOGOUT',
  AUTH_RESET_ERROR: 'AUTH_RESET_ERROR',
  TRIAL_UPDATE: 'TRIAL_UPDATE'
};

// Auth reducer function
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.AUTH_INIT:
      return {
        ...state,
        loading: true,
        error: null
      };
    case AUTH_ACTIONS.AUTH_SUCCESS:
      return {
        ...state,
        currentUser: action.payload,
        isAuthenticated: true,
        loading: false,
        error: null
      };
    case AUTH_ACTIONS.AUTH_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case AUTH_ACTIONS.AUTH_LOGOUT:
      return {
        ...initialState,
        loading: false
      };
    case AUTH_ACTIONS.AUTH_RESET_ERROR:
      return {
        ...state,
        error: null
      };
    case AUTH_ACTIONS.TRIAL_UPDATE:
      return {
        ...state,
        trial: {
          ...action.payload
        }
      };
    default:
      return state;
  }
};

// Create auth context
const AuthContext = createContext(null);

/**
 * Auth Provider Component
 * 
 * Provides authentication state and functions throughout the app
 */
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = () => {
      try {
        // Get current user from local storage
        const user = authService.getCurrentUser();
        
        if (user) {
          dispatch({ type: AUTH_ACTIONS.AUTH_SUCCESS, payload: user });
          
          // Check for trial info
          const storedTrialInfo = localStorage.getItem(STORAGE_KEYS.TRIAL_INFO);
          if (storedTrialInfo) {
            const trialInfo = JSON.parse(storedTrialInfo);
            const trialStartDate = new Date(trialInfo.startDate);
            const currentDate = new Date();
            const daysPassed = Math.floor((currentDate - trialStartDate) / (1000 * 60 * 60 * 24));
            const daysRemaining = trialInfo.trialDays - daysPassed;
            
            dispatch({
              type: AUTH_ACTIONS.TRIAL_UPDATE,
              payload: {
                isActive: daysRemaining > 0,
                daysRemaining: Math.max(0, daysRemaining),
                startDate: trialInfo.startDate
              }
            });
          }
        } else {
          dispatch({ type: AUTH_ACTIONS.AUTH_LOGOUT });
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        dispatch({ 
          type: AUTH_ACTIONS.AUTH_FAILURE, 
          payload: 'Failed to initialize authentication' 
        });
      }
    };

    initializeAuth();
  }, []);

  /**
   * Register a new user
   */
  const register = useCallback(async (userData) => {
    dispatch({ type: AUTH_ACTIONS.AUTH_INIT });
    try {
      const result = authService.register(userData);
      
      if (result.success) {
        dispatch({ type: AUTH_ACTIONS.AUTH_SUCCESS, payload: result.user });
        
        // Set up trial if requested
        if (userData.isTrial) {
          const trialInfo = {
            startDate: new Date().toISOString(),
            trialDays: 7
          };
          
          localStorage.setItem(STORAGE_KEYS.TRIAL_INFO, JSON.stringify(trialInfo));
          
          dispatch({
            type: AUTH_ACTIONS.TRIAL_UPDATE,
            payload: {
              isActive: true,
              daysRemaining: 7,
              startDate: trialInfo.startDate
            }
          });
        }
        
        return { success: true };
      } else {
        dispatch({ type: AUTH_ACTIONS.AUTH_FAILURE, payload: result.message });
        return { success: false, message: result.message };
      }
    } catch (error) {
      const errorMessage = error.message || 'Registration failed';
      dispatch({ type: AUTH_ACTIONS.AUTH_FAILURE, payload: errorMessage });
      return { success: false, message: errorMessage };
    }
  }, []);

  /**
   * Login user
   */
  const login = useCallback(async (credentials) => {
    dispatch({ type: AUTH_ACTIONS.AUTH_INIT });
    try {
      const result = authService.login(credentials);
      
      if (result.success) {
        dispatch({ type: AUTH_ACTIONS.AUTH_SUCCESS, payload: result.user });
        
        // Check for trial info
        const storedTrialInfo = localStorage.getItem(STORAGE_KEYS.TRIAL_INFO);
        if (storedTrialInfo) {
          const trialInfo = JSON.parse(storedTrialInfo);
          const trialStartDate = new Date(trialInfo.startDate);
          const currentDate = new Date();
          const daysPassed = Math.floor((currentDate - trialStartDate) / (1000 * 60 * 60 * 24));
          const daysRemaining = trialInfo.trialDays - daysPassed;
          
          dispatch({
            type: AUTH_ACTIONS.TRIAL_UPDATE,
            payload: {
              isActive: daysRemaining > 0,
              daysRemaining: Math.max(0, daysRemaining),
              startDate: trialInfo.startDate
            }
          });
        }
        
        return { success: true };
      } else {
        dispatch({ type: AUTH_ACTIONS.AUTH_FAILURE, payload: result.message });
        return { success: false, message: result.message };
      }
    } catch (error) {
      const errorMessage = error.message || 'Login failed';
      dispatch({ type: AUTH_ACTIONS.AUTH_FAILURE, payload: errorMessage });
      return { success: false, message: errorMessage };
    }
  }, []);

  /**
   * Logout user
   */
  const logout = useCallback(() => {
    authService.logout();
    dispatch({ type: AUTH_ACTIONS.AUTH_LOGOUT });
  }, []);

  /**
   * Reset auth error
   */
  const resetError = useCallback(() => {
    dispatch({ type: AUTH_ACTIONS.AUTH_RESET_ERROR });
  }, []);

  /**
   * Start a free trial
   */
  const startFreeTrial = useCallback(() => {
    const trialInfo = {
      startDate: new Date().toISOString(),
      trialDays: 7
    };
    
    localStorage.setItem(STORAGE_KEYS.TRIAL_INFO, JSON.stringify(trialInfo));
    
    dispatch({
      type: AUTH_ACTIONS.TRIAL_UPDATE,
      payload: {
        isActive: true,
        daysRemaining: 7,
        startDate: trialInfo.startDate
      }
    });
    
    return { success: true };
  }, []);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    ...state,
    register,
    login,
    logout,
    resetError,
    startFreeTrial
  }), [state, register, login, logout, resetError, startFreeTrial]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};

/**
 * Custom hook to use auth context
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;