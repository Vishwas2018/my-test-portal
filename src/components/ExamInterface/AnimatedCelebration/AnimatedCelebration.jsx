// src/components/ExamInterface/AnimatedCelebration/AnimatedCelebration.jsx
import React, { useEffect, useRef, useState } from 'react';
import styled, { keyframes } from 'styled-components';

// Animations
const floatUp = keyframes`
  0% {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
  100% {
    transform: translateY(-100px) scale(0.5);
    opacity: 0;
  }
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
`;

const bounce = keyframes`
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-30px); }
  60% { transform: translateY(-15px); }
`;

// Styled components
const CelebrationContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 9990;
  overflow: hidden;
`;

const Emoji = styled.div`
  position: absolute;
  font-size: ${props => props.$size || '3rem'};
  user-select: none;
  animation: ${props => props.$float ? floatUp : null} 3s forwards, 
             ${props => props.$spin ? spin : null} ${props => props.$spinDuration || '2s'} infinite linear,
             ${props => props.$pulse ? pulse : null} 1s infinite ease-in-out,
             ${props => props.$bounce ? bounce : null} 2s infinite;
  z-index: 9991;
`;

const MessageContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 9992;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: var(--radius-xl);
  padding: 2rem;
  max-width: 90%;
  width: 500px;
  text-align: center;
  box-shadow: var(--shadow-lg);
  animation: ${pulse} 2s infinite ease-in-out;
  pointer-events: auto;
`;

const MessageTitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 1rem;
  color: var(--primary-dark);
`;

const MessageText = styled.p`
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
  color: var(--dark);
  line-height: 1.6;
`;

const EmojiCircle = styled.div`
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin: 1.5rem 0;
  font-size: 2.5rem;
`;

/**
 * AnimatedCelebration displays a fun celebration animation when a student completes an exam
 * Features emoji animations, congratulatory messages, and a confetti effect
 * 
 * @param {boolean} show - Whether to show the celebration
 * @param {number} score - The exam score (0-100)
 * @param {string} subject - The exam subject
 * @param {Function} onComplete - Callback when the celebration animation completes
 */
const AnimatedCelebration = ({ 
  show = false, 
  score = 0,
  subject = 'exam',
  onComplete 
}) => {
  const [emojis, setEmojis] = useState([]);
  const containerRef = useRef(null);
  const animationTimeout = useRef(null);
  
  // Generate celebration emojis based on subject
  const getSubjectEmojis = () => {
    const defaultEmojis = ['🎉', '🎊', '🎈', '🏆', '⭐', '✨', '👏', '🥳'];
    
    switch (subject.toLowerCase()) {
      case 'mathematics':
      case 'math':
      case 'maths':
        return ['🔢', '📊', '📏', '📐', '🧮', '➗', '➕', '✖️', ...defaultEmojis];
      case 'science':
        return ['🔬', '🧪', '🧫', '🔭', '🌡️', '⚗️', '🧬', '🌍', ...defaultEmojis];
      case 'english':
      case 'reading':
      case 'writing':
        return ['📚', '📝', '✏️', '📖', '✍️', '🖋️', '📜', '🔤', ...defaultEmojis];
      case 'digital':
      case 'digital technologies':
        return ['💻', '🖥️', '📱', '🖱️', '⌨️', '🔌', '💾', '🖨️', ...defaultEmojis];
      default:
        return defaultEmojis;
    }
  };
  
  // Get congratulatory message based on score
  const getCongratulationMessage = () => {
    if (score >= 90) {
      return {
        title: "Outstanding!",
        message: "You've achieved an exceptional score! Your hard work and preparation have truly paid off!",
        emoji: "🌟🏆🌟"
      };
    } else if (score >= 80) {
      return {
        title: "Excellent!",
        message: "Great job on completing your exam with an impressive score! You should be proud of your achievement!",
        emoji: "🎉🎊🎉"
      };
    } else if (score >= 70) {
      return {
        title: "Well Done!",
        message: "You've completed your exam with a good score. Your effort and focus have produced solid results!",
        emoji: "👏⭐👏"
      };
    } else if (score >= 60) {
      return {
        title: "Good Job!",
        message: "Congratulations on completing your exam! You've shown good understanding of the material.",
        emoji: "🎈🎊🎈"
      };
    } else {
      return {
        title: "Exam Complete!",
        message: "You've finished your exam! Every attempt helps you learn and improve for next time.",
        emoji: "✨🌈✨"
      };
    }
  };
  
  // Create and animate emojis
  useEffect(() => {
    if (!show || !containerRef.current) return;
    
    // Clear previous timeout
    if (animationTimeout.current) {
      clearTimeout(animationTimeout.current);
    }
    
    const subjectEmojis = getSubjectEmojis();
    const newEmojis = [];
    const containerWidth = containerRef.current.offsetWidth;
    const containerHeight = containerRef.current.offsetHeight;
    
    // Create random emoji elements
    for (let i = 0; i < 30; i++) {
      const emoji = subjectEmojis[Math.floor(Math.random() * subjectEmojis.length)];
      const size = `${Math.random() * 2 + 2}rem`;
      const left = `${Math.random() * containerWidth}px`;
      const top = `${Math.random() * containerHeight * 0.6 + containerHeight * 0.4}px`;
      const float = Math.random() > 0.5;
      const spin = Math.random() > 0.7;
      const spinDuration = `${Math.random() * 3 + 2}s`;
      const pulse = Math.random() > 0.7;
      const bounce = Math.random() > 0.8;
      const delay = `${Math.random() * 5}s`;
      
      newEmojis.push({
        id: i,
        emoji,
        style: { left, top, animationDelay: delay },
        size,
        float,
        spin,
        spinDuration,
        pulse,
        bounce
      });
    }
    
    setEmojis(newEmojis);
    
    // Clean up after animation
    animationTimeout.current = setTimeout(() => {
      if (onComplete) {
        onComplete();
      }
    }, 10000); // Animation runs for 10 seconds
    
    return () => {
      if (animationTimeout.current) {
        clearTimeout(animationTimeout.current);
      }
    };
  }, [show, onComplete, subject]);
  
  if (!show) return null;
  
  const congratsMessage = getCongratulationMessage();
  
  return (
    <CelebrationContainer ref={containerRef}>
      {/* Floating emojis */}
      {emojis.map(emoji => (
        <Emoji
          key={emoji.id}
          style={emoji.style}
          $size={emoji.size}
          $float={emoji.float}
          $spin={emoji.spin}
          $spinDuration={emoji.spinDuration}
          $pulse={emoji.pulse}
          $bounce={emoji.bounce}
        >
          {emoji.emoji}
        </Emoji>
      ))}
      
      {/* Congratulation message */}
      <MessageContainer>
        <MessageTitle>{congratsMessage.title}</MessageTitle>
        <EmojiCircle>{congratsMessage.emoji}</EmojiCircle>
        <MessageText>{congratsMessage.message}</MessageText>
        <div>Score: <strong>{score}%</strong></div>
      </MessageContainer>
    </CelebrationContainer>
  );
};

export default AnimatedCelebration;