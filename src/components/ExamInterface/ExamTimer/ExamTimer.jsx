// src/components/ExamInterface/ExamTimer/ExamTimer.jsx

import React, { useEffect, useRef, useState } from 'react';

import styled from 'styled-components';

// Format time helper function (copied from examUtils to avoid dependency)
const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
};

const TimerContainer = styled.div`
  background-color: rgba(255, 255, 255, 0.3);
  padding: 0.75rem 1rem;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  position: relative;
  overflow: hidden;
`;

const TimerProgressBar = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  top: 0;
  width: ${props => props.timePercentage}%;
  background-color: rgba(0, 0, 0, 0.1);
  z-index: 0;
  transition: width 1s linear;
`;

const TimerIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;
`;

const TimerText = styled.span`
  font-weight: 600;
  font-size: 1.2rem;
  color: ${props => props.isLow ? 'var(--error)' : 'var(--dark)'};
  animation: ${props => props.isLow ? 'pulse 1s infinite' : 'none'};
  position: relative;
  z-index: 1;
  
  @keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.7; }
    100% { opacity: 1; }
  }
`;

const WarningText = styled.span`
  font-size: 0.8rem;
  margin-left: auto;
  color: var(--error);
  font-weight: 500;
  position: relative;
  z-index: 1;
`;

/**
 * ExamTimer Component with improved visualization
 * Includes a reducing progress bar for time remaining
 * 
 * @param {number} duration - Time limit in minutes
 * @param {Function} onTimeUp - Callback when timer expires
 * @param {boolean} isPaused - Whether the timer is paused
 */
const ExamTimer = ({ duration = 30, onTimeUp, isPaused = false }) => {
  // Convert minutes to seconds
  const totalSeconds = duration * 60;
  
  // State
  const [timeLeft, setTimeLeft] = useState(totalSeconds);
  const [isLowTime, setIsLowTime] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  
  // References
  const timerRef = useRef(null);
  const endTimeRef = useRef(null);
  const lastTickRef = useRef(Date.now());
  
  // Calculate time percentage remaining
  const timePercentage = Math.max(0, (timeLeft / totalSeconds) * 100);
  
  // Set up the timer
  useEffect(() => {
    // Don't start if paused
    if (isPaused) return;
    
    // Set the end time when the component mounts
    if (!endTimeRef.current) {
      endTimeRef.current = Date.now() + (timeLeft * 1000);
    }
    
    // Timer tick function - uses the actual elapsed time for accuracy
    const tick = () => {
      const now = Date.now();
      const elapsedSinceLastTick = (now - lastTickRef.current) / 1000;
      lastTickRef.current = now;
      
      // Calculate time left based on the end time
      const remaining = Math.max(0, Math.floor((endTimeRef.current - now) / 1000));
      
      // Check if the difference is too large (indicating device sleep or tab switch)
      if (elapsedSinceLastTick > 2) {
        setShowWarning(true);
        setTimeout(() => setShowWarning(false), 5000);
      }
      
      setTimeLeft(remaining);
      
      // Check for time up
      if (remaining <= 0) {
        clearInterval(timerRef.current);
        if (typeof onTimeUp === 'function') {
          onTimeUp();
        }
      }
      
      // Set low time warning at 20% of total time
      if (remaining <= totalSeconds * 0.2 && !isLowTime) {
        setIsLowTime(true);
      }
    };
    
    // Start the timer
    timerRef.current = setInterval(tick, 1000);
    
    // Cleanup on unmount
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [totalSeconds, isPaused, onTimeUp, isLowTime, timeLeft]);
  
  // Handle visibility change (tab switching)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // When tab becomes visible again, recalculate time left
        const now = Date.now();
        if (endTimeRef.current) {
          const remaining = Math.max(0, Math.floor((endTimeRef.current - now) / 1000));
          setTimeLeft(remaining);
          lastTickRef.current = now;
        }
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);
  
  // Pause/resume handler
  useEffect(() => {
    if (isPaused) {
      // Store remaining seconds when paused
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    } else if (!timerRef.current) {
      // Reset end time based on remaining seconds
      endTimeRef.current = Date.now() + (timeLeft * 1000);
      lastTickRef.current = Date.now();
      
      // Restart timer
      timerRef.current = setInterval(() => {
        const now = Date.now();
        const remaining = Math.max(0, Math.floor((endTimeRef.current - now) / 1000));
        
        setTimeLeft(remaining);
        
        if (remaining <= 0) {
          clearInterval(timerRef.current);
          if (typeof onTimeUp === 'function') {
            onTimeUp();
          }
        }
      }, 1000);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPaused, timeLeft, onTimeUp]);
  
  return (
    <TimerContainer>
      <TimerProgressBar timePercentage={timePercentage} />
      <TimerIcon>⏱️</TimerIcon>
      <TimerText isLow={isLowTime}>
        Time Remaining: {formatTime(timeLeft)}
      </TimerText>
      
      {showWarning && (
        <WarningText>
          Timer adjusted - please keep this tab open
        </WarningText>
      )}
    </TimerContainer>
  );
};

export default ExamTimer;