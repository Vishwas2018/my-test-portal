import React, { useEffect, useState } from 'react';
import styled, { css, keyframes } from 'styled-components';

import PropTypes from 'prop-types';

// Icons
const SuccessIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

const ErrorIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="15" y1="9" x2="9" y2="15"></line>
    <line x1="9" y1="9" x2="15" y2="15"></line>
  </svg>
);

const InfoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="16" x2="12" y2="12"></line>
    <line x1="12" y1="8" x2="12.01" y2="8"></line>
  </svg>
);

const WarningIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
    <line x1="12" y1="9" x2="12" y2="13"></line>
    <line x1="12" y1="17" x2="12.01" y2="17"></line>
  </svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

// Animation keyframes
const slideIn = keyframes`
  from {
    transform: translateX(120%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const slideOut = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(120%);
    opacity: 0;
  }
`;

const progressAnimation = keyframes`
  from {
    width: 100%;
  }
  to {
    width: 0%;
  }
`;

// Colored border for different types
const getBorderColor = (type, dark) => {
  switch (type) {
    case 'success':
      return dark ? 'var(--green-500)' : 'var(--green-400)';
    case 'error':
      return 'var(--error)';
    case 'warning':
      return dark ? 'var(--yellow-500)' : 'var(--yellow-400)';
    case 'info':
    default:
      return dark ? 'var(--sky-blue-500)' : 'var(--sky-blue-400)';
  }
};

// Background color for different types
const getBackgroundColor = (type, dark) => {
  switch (type) {
    case 'success':
      return dark ? 'rgba(43, 138, 62, 0.2)' : 'rgba(72, 187, 120, 0.1)';
    case 'error':
      return dark ? 'rgba(167, 29, 42, 0.2)' : 'rgba(229, 62, 62, 0.1)';
    case 'warning':
      return dark ? 'rgba(195, 144, 11, 0.2)' : 'rgba(255, 222, 89, 0.1)';
    case 'info':
    default:
      return dark ? 'rgba(49, 130, 206, 0.2)' : 'rgba(110, 207, 255, 0.1)';
  }
};

// Icon color for different types
const getIconColor = (type, dark) => {
  switch (type) {
    case 'success':
      return dark ? 'var(--green-300)' : 'var(--green-500)';
    case 'error':
      return dark ? 'var(--coral-300)' : 'var(--error)';
    case 'warning':
      return dark ? 'var(--yellow-300)' : 'var(--yellow-500)';
    case 'info':
    default:
      return dark ? 'var(--sky-blue-300)' : 'var(--sky-blue-500)';
  }
};

// Toast container
const ToastContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: var(--radius-lg);
  box-shadow: ${props => props.dark ? 'var(--shadow-lg)' : 'var(--shadow-md)'};
  background-color: ${props => props.dark ? 'var(--gray-800)' : 'var(--white)'};
  color: ${props => props.dark ? 'var(--gray-100)' : 'var(--gray-800)'};
  width: 100%;
  max-width: 400px;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-left: 4px solid ${props => getBorderColor(props.type, props.dark)};
  animation: ${props => props.closing ? slideOut : slideIn} 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
  overflow: hidden;
  z-index: var(--z-toast);

  ${props => props.hasProgress && css`
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      height: 4px;
      background-color: ${getBorderColor(props.type, props.dark)};
      animation: ${progressAnimation} ${props.duration}ms linear forwards;
    }
  `}
  
  ${props => props.hasBackground && css`
    background-color: ${getBackgroundColor(props.type, props.dark)};
  `}
`;

// Icon container
const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  margin-right: 0.875rem;
  color: ${props => getIconColor(props.type, props.dark)};
`;

// Content container
const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

// Title
const Title = styled.h4`
  margin: 0;
  font-weight: 600;
  font-size: var(--text-md);
  color: ${props => props.dark ? 'var(--gray-100)' : 'var(--gray-900)'};
`;

// Message
const Message = styled.p`
  margin: ${props => props.hasTitle ? '0.25rem 0 0 0' : '0'};
  font-size: var(--text-sm);
  color: ${props => props.dark ? 'var(--gray-300)' : 'var(--gray-700)'};
`;

// Close button
const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem;
  margin-left: 0.5rem;
  background: transparent;
  border: none;
  border-radius: var(--radius-full);
  cursor: pointer;
  color: ${props => props.dark ? 'var(--gray-400)' : 'var(--gray-500)'};
  transition: var(--transition-normal);
  opacity: 0.7;

  &:hover {
    opacity: 1;
    color: ${props => props.dark ? 'var(--gray-200)' : 'var(--gray-700)'};
    background-color: ${props => props.dark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'};
  }
`;

/**
 * Toast notification component with different types and customization options
 */
const Toast = ({
  id,
  type = 'info',
  title,
  message,
  duration = 5000,
  onClose,
  hasProgress = true,
  hasBackground = false,
  dark = false,
  ...props
}) => {
  const [closing, setClosing] = useState(false);

  // Handle auto-close after duration
  useEffect(() => {
    let timer;
    if (duration && duration > 0) {
      timer = setTimeout(() => {
        handleClose();
      }, duration);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [duration]);

  // Handle close with animation
  const handleClose = () => {
    setClosing(true);
    
    // Wait for animation to finish before actual removal
    setTimeout(() => {
      if (onClose) onClose(id);
    }, 300);
  };

  // Get the appropriate icon based on type
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <SuccessIcon />;
      case 'error':
        return <ErrorIcon />;
      case 'warning':
        return <WarningIcon />;
      case 'info':
      default:
        return <InfoIcon />;
    }
  };

  return (
    <ToastContainer
      type={type}
      hasProgress={hasProgress}
      duration={duration}
      closing={closing}
      dark={dark}
      hasBackground={hasBackground}
      role="alert"
      aria-live="assertive"
      {...props}
    >
      <IconContainer type={type} dark={dark}>
        {getIcon()}
      </IconContainer>
      
      <Content>
        {title && <Title dark={dark}>{title}</Title>}
        <Message hasTitle={!!title} dark={dark}>{message}</Message>
      </Content>
      
      <CloseButton 
        onClick={handleClose} 
        aria-label="Close notification"
        dark={dark}
      >
        <CloseIcon />
      </CloseButton>
    </ToastContainer>
  );
};

Toast.propTypes = {
  /** Toast ID */
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  /** Toast type (info, success, warning, error) */
  type: PropTypes.oneOf(['info', 'success', 'warning', 'error']),
  /** Toast title */
  title: PropTypes.string,
  /** Toast message */
  message: PropTypes.string.isRequired,
  /** Duration in ms (0 for no auto-close) */
  duration: PropTypes.number,
  /** On close callback */
  onClose: PropTypes.func,
  /** Show progress bar */
  hasProgress: PropTypes.bool,
  /** Use colored background */
  hasBackground: PropTypes.bool,
  /** Use dark theme */
  dark: PropTypes.bool,
};

export default Toast;