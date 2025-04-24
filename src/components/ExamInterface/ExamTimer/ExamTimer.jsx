import React, { useCallback, useEffect, useRef, useState } from 'react';

import PropTypes from 'prop-types';
import styled from 'styled-components';

const TimerContainer = styled.div`
  width: 100%;
  margin-bottom: 1.5rem;
`;

const TimerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const TimerText = styled.span`
  font-size: 1.2rem;
  font-weight: ${props => props.$warning ? '700' : '600'};
  color: ${props => {
    if (props.$warning) return 'var(--error)';
    return 'var(--dark)';
  }};
  animation: ${props => props.$blinking ? 'blink 1s infinite' : 'none'};
  
  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
`;

const WarningMessage = styled.div`
  padding: 0.5rem 1rem;
  border-radius: var(--radius-md);
  background-color: rgba(255, 87, 34, 0.1);
  color: var(--error);
  font-weight: 600;
  animation: pulse 1s infinite;
  
  @keyframes pulse {
    0%, 100% { opacity: 0.8; }
    50% { opacity: 1; }
  }
`;

const ProgressBarContainer = styled.div`
  width: 100%;
  height: 10px;
  background-color: var(--light-gray);
  border-radius: var(--radius-full);
  overflow: hidden;
`;

const ProgressBar = styled.div`
  height: 100%;
  width: ${props => props.percentage}%;
  background: ${props => {
    if (props.percentage < 20) return 'var(--error)';
    if (props.percentage < 50) return 'var(--secondary)';
    return 'var(--primary)';
  }};
  border-radius: var(--radius-full);
  transition: width 1s linear, background-color 1s ease;
`;

/**
 * ExamTimer component that displays the remaining time for an exam
 * Optimized with useCallback and useRef to prevent unnecessary re-renders
 * 
 * @param {number} duration - Duration in minutes
 * @param {Function} onTimeUp - Callback when time is up
 * @param {boolean} isPaused - Whether the timer is paused
 */
const ExamTimer = ({ duration, onTimeUp, isPaused = false }) => {
  const [timeLeft, setTimeLeft] = useState(duration * 60); // convert to seconds
  const [showWarning, setShowWarning] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');
  const [isBlinking, setIsBlinking] = useState(false);
  
  // Use refs to track warning timeouts for cleanup
  const warningTimeoutRef = useRef(null);
  
  // Memoize the onTimeUp callback to prevent unnecessary effect runs
  const handleTimeUp = useCallback(() => {
    if (timeLeft <= 0) {
      console.log("Time up callback fired");
      onTimeUp();
    }
  }, [onTimeUp, timeLeft]);
  
  // Handle time progression with useCallback to stabilize the effect dependencies
  const decrementTime = useCallback(() => {
    setTimeLeft(prevTime => {
      const newTime = prevTime - 1;
      return newTime >= 0 ? newTime : 0;
    });
  }, []);
  
  // Handle warnings for specific time thresholds
  const showTimeWarning = useCallback((seconds, message) => {
    setWarningMessage(message);
    setShowWarning(true);
    setIsBlinking(true);
    
    // Clear any existing timeout
    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current);
    }
    
    // Auto-hide warning after 6 seconds
    warningTimeoutRef.current = setTimeout(() => {
      setShowWarning(false);
      
      // Keep blinking in the last 30 seconds
      if (seconds > 30) {
        setIsBlinking(false);
      }
    }, 6000);
  }, []);
  
  // Main timer effect
  useEffect(() => {
    // Time's up - Only trigger once when we reach zero
    if (timeLeft === 0) {
      handleTimeUp();
      return;
    }
    
    // Don't run the timer when paused
    if (isPaused) return;
    
    // Timer interval
    const timer = setInterval(decrementTime, 1000);
    
    // Cleanup on unmount or when dependencies change
    return () => clearInterval(timer);
  }, [timeLeft, isPaused, handleTimeUp, decrementTime]);
  
  // Warning effect - separated from the main timer effect
  useEffect(() => {
    // Show warnings at specific times
    if (timeLeft === 300) { // 5 minutes
      showTimeWarning(300, '5 minutes left!');
    } else if (timeLeft === 120) { // 2 minutes
      showTimeWarning(120, '2 minutes left!');
    } else if (timeLeft === 60) { // 1 minute
      showTimeWarning(60, '1 minute left!');
    } else if (timeLeft === 30) { // 30 seconds
      showTimeWarning(30, '30 seconds left!');
      setIsBlinking(true); // Keep blinking for last 30 seconds
    }
    
    // Cleanup function
    return () => {
      if (warningTimeoutRef.current) {
        clearTimeout(warningTimeoutRef.current);
      }
    };
  }, [timeLeft, showTimeWarning]);
  
  // Calculate progress percentage - Fix NaN issue
  const progressPercentage = duration > 0 
    ? Math.min(100, Math.max(0, (timeLeft / (duration * 60)) * 100)) 
    : 0;
  
  // Format time as MM:SS
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  
  return (
    <TimerContainer>
      <TimerHeader>
        <TimerText $warning={timeLeft < 60} $blinking={isBlinking}>
          Time Remaining: {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
        </TimerText>
        
        {showWarning && (
          <WarningMessage>
            {warningMessage}
          </WarningMessage>
        )}
      </TimerHeader>
      
      <ProgressBarContainer>
        <ProgressBar percentage={progressPercentage} />
      </ProgressBarContainer>
    </TimerContainer>
  );
};

ExamTimer.propTypes = {
  duration: PropTypes.number.isRequired,
  onTimeUp: PropTypes.func.isRequired,
  isPaused: PropTypes.bool
};

export default React.memo(ExamTimer);