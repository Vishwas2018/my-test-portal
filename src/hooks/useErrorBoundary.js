// src/hooks/useErrorBoundary.js
import React, { useCallback, useState } from 'react';

/**
 * Custom hook for creating error boundaries in functional components
 * 
 * @returns {Object} Error boundary state and handlers
 */
export const useErrorBoundary = () => {
  const [error, setError] = useState(null);
  const [errorInfo, setErrorInfo] = useState(null);
  
  const handleCatch = useCallback((error, errorInfo) => {
    setError(error);
    setErrorInfo(errorInfo);
    
    // Log error
    console.error('Error caught by error boundary:', error, errorInfo);
  }, []);
  
  const resetError = useCallback(() => {
    setError(null);
    setErrorInfo(null);
  }, []);
  
  return {
    error,
    errorInfo,
    handleCatch,
    resetError
  };
};

/**
 * Functional Error Boundary wrapper component
 * 
 * Note: This still uses a class component under the hood because
 * React's error boundary functionality requires componentDidCatch,
 * which is only available in class components.
 */
export const ErrorBoundary = ({ 
  children, 
  fallback, 
  onReset, 
  onError, 
  showStack = process.env.NODE_ENV !== 'production' 
}) => {
  // Use the error boundary hook
  const { error, errorInfo, handleCatch, resetError } = useErrorBoundary();
  
  // No error, render children
  if (!error) {
    return (
      <ClassErrorBoundary onError={handleCatch}>
        {children}
      </ClassErrorBoundary>
    );
  }
  
  // If custom fallback is provided, use it
  if (fallback) {
    if (typeof fallback === 'function') {
      return fallback({ error, errorInfo, resetError });
    }
    return fallback;
  }
  
  // Default error UI
  return (
    <ErrorDisplay 
      error={error}
      errorInfo={errorInfo}
      resetError={() => {
        resetError();
        if (onReset) onReset();
      }}
      showStack={showStack}
    />
  );
};

// Class component for error catching
class ClassErrorBoundary extends React.Component {
  componentDidCatch(error, errorInfo) {
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }
  
  render() {
    return this.props.children;
  }
}

// Styled error display component
const ErrorDisplay = ({ error, errorInfo, resetError, showStack }) => {
  return (
    <div className="error-container">
      <div className="error-icon">⚠️</div>
      <h2 className="error-title">Something went wrong</h2>
      <div className="error-message">
        <p>We're sorry, but an error occurred while processing your request.</p>
        {error && <p>{error.toString()}</p>}
      </div>
      
      {showStack && errorInfo && (
        <pre className="error-stack">
          {errorInfo.componentStack}
        </pre>
      )}
      
      <button className="retry-button" onClick={resetError}>
        Try again
      </button>
    </div>
  );
};

export default ErrorBoundary;