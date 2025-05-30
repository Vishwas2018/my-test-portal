// src/components/common/ErrorBoundary/ErrorBoundary.jsx
import React, { Component } from 'react';

import PropTypes from 'prop-types';
import styled from 'styled-components';

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2rem;
  margin: 2rem auto;
  max-width: 600px;
  background-color: var(--white);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  border-left: 5px solid var(--error);
`;

const ErrorIcon = styled.div`
  font-size: 3rem;
  color: var(--error);
  margin-bottom: 1rem;
`;

const ErrorTitle = styled.h2`
  font-size: 1.5rem;
  color: var(--dark);
  margin-bottom: 1rem;
`;

const ErrorMessage = styled.div`
  margin-bottom: 1.5rem;
  color: var(--dark-gray);
`;

const ErrorStack = styled.pre`
  background-color: var(--light-gray);
  padding: 1rem;
  border-radius: var(--radius-md);
  max-width: 100%;
  overflow-x: auto;
  margin-bottom: 1.5rem;
  font-size: 0.875rem;
  text-align: left;
`;

const RetryButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: var(--primary);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: var(--primary-dark);
    transform: translateY(-2px);
  }
`;

/**
 * Error boundary component that catches JavaScript errors in child components
 * and displays a fallback UI instead of crashing the entire app
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to an error reporting service
    console.error('ErrorBoundary caught an error', error, errorInfo);
    this.setState({ errorInfo });
    
    // Send to analytics service if available
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  resetErrorBoundary = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
    
    // Call onReset callback if provided
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    const { hasError, error, errorInfo } = this.state;
    const { fallback, children, showStack } = this.props;
    
    if (!hasError) {
      return children;
    }
    
    // If a custom fallback UI is provided, use it
    if (fallback) {
      return typeof fallback === 'function'
        ? fallback({
            error,
            errorInfo,
            resetErrorBoundary: this.resetErrorBoundary
          })
        : fallback;
    }

    // Default error UI
    return (
      <ErrorContainer>
        <ErrorIcon>⚠️</ErrorIcon>
        <ErrorTitle>Something went wrong</ErrorTitle>
        <ErrorMessage>
          <p>We're sorry, but an error occurred while processing your request.</p>
          {error && <p>{error.toString()}</p>}
        </ErrorMessage>
        
        {showStack && errorInfo && (
          <ErrorStack>
            {errorInfo.componentStack}
          </ErrorStack>
        )}
        
        <RetryButton onClick={this.resetErrorBoundary}>
          Try again
        </RetryButton>
      </ErrorContainer>
    );
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  fallback: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  onReset: PropTypes.func,
  onError: PropTypes.func,
  showStack: PropTypes.bool
};

ErrorBoundary.defaultProps = {
  fallback: null,
  onReset: null,
  onError: null,
  showStack: process.env.NODE_ENV !== 'production'
};

export default ErrorBoundary;