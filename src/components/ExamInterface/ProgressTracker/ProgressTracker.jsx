// src/components/ExamInterface/ProgressTracker.jsx
import React from 'react';
import styled from 'styled-components';

const ProgressContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 1rem;
  background-color: var(--white);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  margin-bottom: 1.5rem;
`;

const QuestionIndicator = styled.button`
  width: 2.2rem;
  height: 2.2rem;
  border-radius: 50%;
  border: 2px solid;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  
  /* Status-based styling */
  background-color: ${props => {
    if (props.$isCurrent) return 'var(--primary)';
    if (props.$isAnswered && props.$isFlagged) return 'var(--secondary)';
    if (props.$isAnswered) return 'var(--accent)';
    if (props.$isFlagged) return 'var(--highlight)';
    return 'var(--light-gray)';
  }};
  
  color: ${props => {
    if (props.$isCurrent || props.$isAnswered || props.$isFlagged) return 'white';
    return 'var(--dark)';
  }};
  
  border-color: ${props => {
    if (props.$isCurrent) return 'var(--primary-dark)';
    if (props.$isAnswered && props.$isFlagged) return 'var(--secondary-dark)';
    if (props.$isAnswered) return 'var(--accent-dark)';
    if (props.$isFlagged) return 'var(--highlight-dark)';
    return 'transparent';
  }};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
  }
  
  &::after {
    content: ${props => (props.$isFlagged && !props.$isCurrent) ? "'⚑'" : "none"};
    position: absolute;
    top: -5px;
    right: -5px;
    font-size: 10px;
    background: ${props => props.$isAnswered ? 'var(--accent)' : 'var(--highlight)'};
    color: white;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  &::before {
    content: ${props => (props.$isAnswered && !props.$isCurrent && !props.$isFlagged) ? "'✓'" : "none"};
    position: absolute;
    top: -5px;
    right: -5px;
    font-size: 10px;
    background: var(--accent);
    color: white;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const ProgressTracker = ({ 
  totalQuestions, 
  currentQuestion, 
  answeredQuestions = [], 
  flaggedQuestions = [],
  onQuestionClick
}) => {
  // Create an array of question indices (0 to totalQuestions-1)
  const questions = Array.from({ length: totalQuestions }, (_, i) => i);
  
  return (
    <ProgressContainer>
      {questions.map(questionIndex => {
        const isAnswered = answeredQuestions.includes(questionIndex);
        const isFlagged = flaggedQuestions.includes(questionIndex);
        const isCurrent = currentQuestion === questionIndex;
        
        return (
          <QuestionIndicator
            key={questionIndex}
            $isAnswered={isAnswered}
            $isFlagged={isFlagged}
            $isCurrent={isCurrent}
            onClick={() => onQuestionClick(questionIndex)}
            aria-label={`Question ${questionIndex + 1}${isAnswered ? ', answered' : ''}${isFlagged ? ', flagged for review' : ''}`}
          >
            {questionIndex + 1}
          </QuestionIndicator>
        );
      })}
    </ProgressContainer>
  );
};

export default ProgressTracker;