import { Navigate, useLocation } from 'react-router-dom';

import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

/**
 * A wrapper for routes that should only be accessible to authenticated users
 * Redirects to login if not authenticated
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Show loading state if auth is being checked
  if (loading) {
    return (
      <div className="container page-content">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  // Redirect to login if not authenticated
  // Store the current location to redirect back after login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // If authenticated, render the children components
  return children;
};

export default ProtectedRoute;