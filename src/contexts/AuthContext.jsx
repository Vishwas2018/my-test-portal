import React, { createContext, useContext, useEffect, useState } from 'react';

import authService from '../services/authService';

// Create context
const AuthContext = createContext();

// Create provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [trialInfo, setTrialInfo] = useState(null);

  // Check if user is logged in on initial load
  useEffect(() => {
    const user = authService.getCurrentUser();
    setCurrentUser(user);
    
    // Get trial info if exists
    const storedTrialInfo = localStorage.getItem('trial_info');
    if (storedTrialInfo) {
      setTrialInfo(JSON.parse(storedTrialInfo));
    }
    
    setLoading(false);
  }, []);

  // Register user
  const register = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const result = authService.register(userData);
      if (result.success) {
        setCurrentUser(result.user);
        
        // If registration is for a trial, set up trial info
        if (userData.isTrial) {
          const newTrialInfo = {
            startDate: new Date().toISOString(),
            trialDays: 7
          };
          
          localStorage.setItem('trial_info', JSON.stringify(newTrialInfo));
          setTrialInfo(newTrialInfo);
        }
        
        return { success: true };
      } else {
        setError(result.message);
        return { success: false, message: result.message };
      }
    } catch (error) {
      setError('An unexpected error occurred.');
      return { success: false, message: 'An unexpected error occurred.' };
    } finally {
      setLoading(false);
    }
  };

  // Login user
  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const result = authService.login(credentials);
      if (result.success) {
        setCurrentUser(result.user);
        
        // Get trial info if exists
        const storedTrialInfo = localStorage.getItem('trial_info');
        if (storedTrialInfo) {
          setTrialInfo(JSON.parse(storedTrialInfo));
        }
        
        return { success: true };
      } else {
        setError(result.message);
        return { success: false, message: result.message };
      }
    } catch (error) {
      setError('An unexpected error occurred.');
      return { success: false, message: 'An unexpected error occurred.' };
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = () => {
    authService.logout();
    setCurrentUser(null);
  };

  // Check if trial is active
  const isTrialActive = () => {
    if (!trialInfo) return false;
    
    const { startDate, trialDays } = trialInfo;
    const trialStartDate = new Date(startDate);
    const currentDate = new Date();
    
    // Calculate days elapsed since trial start
    const daysPassed = Math.floor((currentDate - trialStartDate) / (1000 * 60 * 60 * 24));
    
    // Trial is active if days passed is less than trial days
    return daysPassed < trialDays;
  };

  // Get days remaining in trial
  const getTrialDaysRemaining = () => {
    if (!trialInfo) return 0;
    
    const { startDate, trialDays } = trialInfo;
    const trialStartDate = new Date(startDate);
    const currentDate = new Date();
    
    // Calculate days elapsed since trial start
    const daysPassed = Math.floor((currentDate - trialStartDate) / (1000 * 60 * 60 * 24));
    
    // Calculate days remaining
    const daysRemaining = trialDays - daysPassed;
    
    // Return days remaining (minimum 0)
    return daysRemaining > 0 ? daysRemaining : 0;
  };

  // Start a free trial
  const startFreeTrial = () => {
    const newTrialInfo = {
      startDate: new Date().toISOString(),
      trialDays: 7
    };
    
    localStorage.setItem('trial_info', JSON.stringify(newTrialInfo));
    setTrialInfo(newTrialInfo);
    
    return { success: true };
  };

  const value = {
    currentUser,
    loading,
    error,
    register,
    login,
    logout,
    isAuthenticated: !!currentUser,
    isTrialActive,
    getTrialDaysRemaining,
    startFreeTrial,
    trialInfo
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;