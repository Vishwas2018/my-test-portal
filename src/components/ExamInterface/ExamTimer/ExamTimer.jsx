// src/components/ExamInterface/ExamTimer.jsx
import React, { useEffect, useState } from 'react';

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

const ExamTimer = ({ duration, onTimeUp, isPaused = false }) => {
  const [timeLeft, setTimeLeft] = useState(duration * 60); // convert to seconds
  const [showWarning, setShowWarning] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');
  const [isBlinking, setIsBlinking] = useState(false);
  
  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }
    
    if (isPaused) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prevTime => prevTime - 1);
    }, 1000);
    
    // Show warnings at specific times
    if (timeLeft === 300) { // 5 minutes
      setWarningMessage('5 minutes left!');
      setShowWarning(true);
      setIsBlinking(true);
      setTimeout(() => {
        setShowWarning(false);
        setIsBlinking(false);
      }, 6000);
    } else if (timeLeft === 120) { // 2 minutes
      setWarningMessage('2 minutes left!');
      setShowWarning(true);
      setIsBlinking(true);
      setTimeout(() => {
        setShowWarning(false);
        setIsBlinking(false);
      }, 6000);
    } else if (timeLeft === 60) { // 1 minute
      setWarningMessage('1 minute left!');
      setShowWarning(true);
      setIsBlinking(true);
      setTimeout(() => {
        setShowWarning(false);
      }, 6000);
    } else if (timeLeft <= 30) { // Last 30 seconds
      setIsBlinking(true);
    }
    
    return () => clearInterval(timer);
  }, [timeLeft, onTimeUp, isPaused]);
  
  // Calculate progress percentage
  const progressPercentage = (timeLeft / (duration * 60)) * 100;
  
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

export default ExamTimer;