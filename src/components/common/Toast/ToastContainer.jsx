import PropTypes from 'prop-types';
import React from 'react';
import Toast from './Toast';
import styled from 'styled-components';

// Container for positioning toasts
const Container = styled.div`
  position: fixed;
  z-index: var(--z-toast);
  
  /* Positioning based on props */
  ${props => {
    if (props.position === 'top-left') {
      return `
        top: 1rem;
        left: 1rem;
      `;
    } else if (props.position === 'top-right') {
      return `
        top: 1rem;
        right: 1rem;
      `;
    } else if (props.position === 'bottom-left') {
      return `
        bottom: 1rem;
        left: 1rem;
      `;
    } else if (props.position === 'bottom-right') {
      return `
        bottom: 1rem;
        right: 1rem;
      `;
    } else if (props.position === 'top-center') {
      return `
        top: 1rem;
        left: 50%;
        transform: translateX(-50%);
      `;
    } else if (props.position === 'bottom-center') {
      return `
        bottom: 1rem;
        left: 50%;
        transform: translateX(-50%);
      `;
    }
  }}
  
  display: flex;
  flex-direction: column;
  pointer-events: none;
  
  /* Reverse order for bottom positions */
  ${props => props.position.startsWith('bottom') && `
    flex-direction: column-reverse;
  `}
  
  /* Space between toasts */
  > * {
    margin-bottom: 0.75rem;
    pointer-events: auto;
  }
  
  > *:last-child {
    margin-bottom: 0;
  }
`;

/**
 * Container component for displaying multiple toasts
 */
const ToastContainer = ({
  toasts = [],
  position = 'bottom-right',
  onClose,
  dark = false,
  hasProgress = true,
  hasBackground = false,
}) => {
  // If no toasts, don't render anything
  if (!toasts.length) return null;
  
  return (
    <Container position={position} role="region" aria-live="polite">
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          id={toast.id}
          type={toast.type}
          title={toast.title}
          message={toast.message}
          duration={toast.duration}
          onClose={onClose}
          hasProgress={hasProgress}
          hasBackground={hasBackground}
          dark={dark}
        />
      ))}
    </Container>
  );
};

ToastContainer.propTypes = {
  /** Array of toast objects */
  toasts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      type: PropTypes.oneOf(['info', 'success', 'warning', 'error']),
      title: PropTypes.string,
      message: PropTypes.string.isRequired,
      duration: PropTypes.number,
    })
  ).isRequired,
  /** Position on screen (top-left, top-right, bottom-left, bottom-right, top-center, bottom-center) */
  position: PropTypes.oneOf([
    'top-left',
    'top-right',
    'bottom-left',
    'bottom-right',
    'top-center',
    'bottom-center'
  ]),
  /** On close callback */
  onClose: PropTypes.func.isRequired,
  /** Use dark theme */
  dark: PropTypes.bool,
  /** Show progress bar */
  hasProgress: PropTypes.bool,
  /** Use colored background */
  hasBackground: PropTypes.bool,
};

export default ToastContainer;