// src/components/ExamInterface/FeedbackMessage/FeedbackMessage.jsx
import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const fadeOut = keyframes`
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-10px);
  }
`;

const MessageContainer = styled.div`
  padding: 0.75rem 1.25rem;
  border-radius: var(--radius-lg);
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  animation: ${props => props.$isExiting ? fadeOut : fadeIn} 0.3s ease forwards;
  background-color: ${props => {
    switch (props.$type) {
      case 'success': return 'rgba(var(--accent-rgb), 0.15)';
      case 'info': return 'rgba(var(--primary-rgb), 0.15)';
      case 'warning': return 'rgba(var(--secondary-rgb), 0.15)';
      case 'tip': return 'rgba(var(--highlight-rgb), 0.15)';
      default: return 'rgba(var(--primary-rgb), 0.15)';
    }
  }};
  border-left: 4px solid ${props => {
    switch (props.$type) {
      case 'success': return 'var(--accent)';
      case 'info': return 'var(--primary)';
      case 'warning': return 'var(--secondary)';
      case 'tip': return 'var(--highlight)';
      default: return 'var(--primary)';
    }
  }};
`;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => {
    switch (props.$type) {
      case 'success': return 'var(--accent)';
      case 'info': return 'var(--primary)';
      case 'warning': return 'var(--secondary)';
      case 'tip': return 'var(--highlight)';
      default: return 'var(--primary)';
    }
  }};
`;

const MessageContent = styled.div`
  flex: 1;
`;

const MessageTitle = styled.div`
  font-weight: 600;
  color: ${props => {
    switch (props.$type) {
      case 'success': return 'var(--accent-dark)';
      case 'info': return 'var(--primary-dark)';
      case 'warning': return 'var(--secondary-dark)';
      case 'tip': return 'var(--highlight-dark)';
      default: return 'var(--primary-dark)';
    }
  }};
  margin-bottom: 0.2rem;
`;

const MessageText = styled.div`
  color: var(--dark);
  font-size: 0.95rem;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  color: var(--dark-gray);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  
  &:hover {
    color: var(--dark);
    background-color: rgba(0, 0, 0, 0.05);
  }
`;

/**
 * FeedbackMessage provides contextual feedback messages to students during exams
 * 
 * @param {string} type - Message type ('success', 'info', 'warning', 'tip')
 * @param {string} title - Optional title for the message
 * @param {string} message - The message content
 * @param {number} duration - Auto-dismiss duration in ms (0 for persistent)
 * @param {Function} onDismiss - Function to call when message is dismissed
 */
const FeedbackMessage = ({ 
  type = 'info', 
  title, 
  message, 
  duration = 0, 
  onDismiss 
}) => {
  const [isExiting, setIsExiting] = useState(false);
  
  // Handle auto-dismiss
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsExiting(true);
        
        // Allow time for exit animation before calling dismiss
        const exitTimer = setTimeout(() => {
          if (onDismiss) onDismiss();
        }, 300);
        
        return () => clearTimeout(exitTimer);
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [duration, onDismiss]);
  
  // Handle manual dismiss
  const handleDismiss = () => {
    setIsExiting(true);
    
    // Allow time for exit animation
    setTimeout(() => {
      if (onDismiss) onDismiss();
    }, 300);
  };
  
  // Render appropriate icon based on message type
  const renderIcon = () => {
    switch (type) {
      case 'success':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        );
      case 'warning':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        );
      case 'tip':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
        );
      case 'info':
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M12 16v-4"></path>
            <path d="M12 8h.01"></path>
          </svg>
        );
    }
  };
  
  return (
    <MessageContainer $type={type} $isExiting={isExiting}>
      <IconContainer $type={type}>
        {renderIcon()}
      </IconContainer>
      
      <MessageContent>
        {title && <MessageTitle $type={type}>{title}</MessageTitle>}
        <MessageText>{message}</MessageText>
      </MessageContent>
      
      <CloseButton onClick={handleDismiss} aria-label="Dismiss message">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </CloseButton>
    </MessageContainer>
  );
};

export default FeedbackMessage;