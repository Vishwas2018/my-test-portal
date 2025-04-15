import { Navigate, useLocation } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

import { useAuth } from '../../contexts/AuthContext';

/**
 * A wrapper for routes that should only be accessible to authenticated users
 * Redirects to login if not authenticated
 * Improved to prevent redirect loops
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  const [shouldRedirect, setShouldRedirect] = useState(false);

  // Only redirect after the loading state is complete to prevent redirect loops
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      setShouldRedirect(true);
    }
  }, [loading, isAuthenticated]);

  // Show loading state if auth is being checked
  if (loading) {
    return (
      <div className="container page-content">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  // Redirect to login if not authenticated and loading is complete
  if (shouldRedirect) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // If authenticated, render the children components
  return children;
};

export default ProtectedRoute;