// src/components/ExamInterface/QuestionNavigator/QuestionNavigator.jsx
import React from 'react';
import styled from 'styled-components';

const NavigatorContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding: 1.25rem;
  background-color: var(--white);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  margin-bottom: 1.5rem;
`;

const NavigatorHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const HeaderTitle = styled.h3`
  font-size: 1.1rem;
  color: var(--dark);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  & svg {
    color: var(--primary);
  }
`;

const Legend = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.85rem;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  color: var(--dark-gray);
`;

const LegendColor = styled.span`
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${props => {
    if (props.$type === 'answered') return 'var(--accent)';
    if (props.$type === 'flagged') return 'var(--secondary)';
    if (props.$type === 'current') return 'var(--primary)';
    return 'var(--light-gray)';
  }};
`;

const QuestionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(40px, 1fr));
  gap: 0.75rem;
`;

const CompactQuestionGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const QuestionButton = styled.button`
  position: relative;
  width: ${props => props.$compact ? '32px' : '40px'};
  height: ${props => props.$compact ? '32px' : '40px'};
  border-radius: ${props => props.$compact ? 'var(--radius-md)' : 'var(--radius-lg)'};
  cursor: pointer;
  font-weight: 600;
  font-size: ${props => props.$compact ? '0.9rem' : '1rem'};
  transition: all 0.2s ease;
  border: 2px solid transparent;
  
  /* Status-based styling */
  background-color: ${props => {
    if (props.$isCurrent) return 'var(--primary)';
    if (props.$isAnswered && props.$isFlagged) return 'var(--secondary)';
    if (props.$isAnswered) return 'var(--accent)';
    if (props.$isFlagged) return 'var(--secondary-light)';
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
    if (props.$isFlagged) return 'var(--secondary)';
    return 'transparent';
  }};
  
  box-shadow: ${props => props.$isCurrent ? 'var(--shadow-md)' : 'none'};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    border-color: ${props => {
      if (props.$isCurrent) return 'var(--primary-dark)';
      if (props.$isAnswered) return 'var(--accent-dark)';
      if (props.$isFlagged) return 'var(--secondary-dark)';
      return 'var(--dark-gray)';
    }};
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px ${props => {
      if (props.$isCurrent) return 'rgba(var(--primary-rgb), 0.4)';
      if (props.$isAnswered) return 'rgba(var(--accent-rgb), 0.4)';
      if (props.$isFlagged) return 'rgba(var(--secondary-rgb), 0.4)';
      return 'rgba(var(--dark-rgb), 0.1)';
    }};
  }
`;

const StatusIndicator = styled.div`
  position: absolute;
  top: -3px;
  right: -3px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${props => props.$flagged ? 'var(--secondary)' : 'var(--accent)'};
  border: 2px solid white;
  display: ${props => props.$show ? 'block' : 'none'};
`;

const SectionDivider = styled.div`
  grid-column: 1 / -1;
  margin: 0.5rem 0;
  padding-top: 0.5rem;
  border-top: 1px dashed var(--light-gray);
  font-size: 0.85rem;
  color: var(--dark-gray);
  font-weight: 500;
`;

/**
 * QuestionNavigator component provides an intuitive way to navigate exam questions
 * It shows question status (answered, flagged, current) and allows direct navigation
 * 
 * @param {number} totalQuestions - Total number of questions
 * @param {number} currentQuestion - Current question index
 * @param {Array<number>} answeredQuestions - Array of answered question indices
 * @param {Array<number>} flaggedQuestions - Array of flagged question indices
 * @param {Function} onQuestionClick - Handler for question button click
 * @param {boolean} compact - Whether to use compact layout
 * @param {Array<Object>} sections - Optional sections for organizing questions
 */
const QuestionNavigator = ({ 
  totalQuestions, 
  currentQuestion, 
  answeredQuestions = [], 
  flaggedQuestions = [],
  onQuestionClick,
  compact = false,
  sections = null
}) => {
  // Create an array of question indices (0 to totalQuestions-1)
  const questions = Array.from({ length: totalQuestions }, (_, i) => i);
  
  // If we have sections, organize questions by section
  const renderWithSections = () => {
    if (!sections || sections.length === 0) return null;
    
    let questionIndex = 0;
    
    return sections.map((section, sectionIndex) => {
      const sectionQuestions = Array.from({ length: section.questionCount }, (_, i) => {
        const currentIndex = questionIndex;
        questionIndex++;
        return currentIndex;
      });
      
      return (
        <React.Fragment key={sectionIndex}>
          {sectionIndex > 0 && (
            <SectionDivider>
              Section {sectionIndex + 1}: {section.title}
            </SectionDivider>
          )}
          
          {sectionQuestions.map(qIndex => {
            const isAnswered = answeredQuestions.includes(qIndex);
            const isFlagged = flaggedQuestions.includes(qIndex);
            const isCurrent = currentQuestion === qIndex;
            
            return (
              <QuestionButton
                key={qIndex}
                $isAnswered={isAnswered}
                $isFlagged={isFlagged}
                $isCurrent={isCurrent}
                $compact={compact}
                onClick={() => onQuestionClick(qIndex)}
                aria-label={`Question ${qIndex + 1}${isAnswered ? ', answered' : ''}${isFlagged ? ', flagged for review' : ''}`}
              >
                {qIndex + 1}
                <StatusIndicator 
                  $show={isAnswered && !isCurrent && !isFlagged} 
                  $flagged={false} 
                />
                <StatusIndicator 
                  $show={isFlagged && !isCurrent} 
                  $flagged={true} 
                />
              </QuestionButton>
            );
          })}
        </React.Fragment>
      );
    });
  };
  
  // Render all questions in a grid without sections
  const renderSimpleGrid = () => {
    return questions.map(questionIndex => {
      const isAnswered = answeredQuestions.includes(questionIndex);
      const isFlagged = flaggedQuestions.includes(questionIndex);
      const isCurrent = currentQuestion === questionIndex;
      
      return (
        <QuestionButton
          key={questionIndex}
          $isAnswered={isAnswered}
          $isFlagged={isFlagged}
          $isCurrent={isCurrent}
          $compact={compact}
          onClick={() => onQuestionClick(questionIndex)}
          aria-label={`Question ${questionIndex + 1}${isAnswered ? ', answered' : ''}${isFlagged ? ', flagged for review' : ''}`}
        >
          {questionIndex + 1}
          <StatusIndicator 
            $show={isAnswered && !isCurrent && !isFlagged} 
            $flagged={false} 
          />
          <StatusIndicator 
            $show={isFlagged && !isCurrent} 
            $flagged={true} 
          />
        </QuestionButton>
      );
    });
  };
  
  return (
    <NavigatorContainer>
      <NavigatorHeader>
        <HeaderTitle>
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
          Question Navigator
        </HeaderTitle>
        
        <Legend>
          <LegendItem>
            <LegendColor $type="current" />
            Current
          </LegendItem>
          <LegendItem>
            <LegendColor $type="answered" />
            Answered
          </LegendItem>
          <LegendItem>
            <LegendColor $type="flagged" />
            Flagged
          </LegendItem>
        </Legend>
      </NavigatorHeader>
      
      {compact ? (
        <CompactQuestionGrid>
          {sections ? renderWithSections() : renderSimpleGrid()}
        </CompactQuestionGrid>
      ) : (
        <QuestionGrid>
          {sections ? renderWithSections() : renderSimpleGrid()}
        </QuestionGrid>
      )}
    </NavigatorContainer>
  );
};

export default QuestionNavigator;