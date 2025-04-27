// src/components/ExamInterface/QuestionDisplay/QuestionDisplay.jsx
import React from 'react';
import styled from 'styled-components';

const QuestionContainer = styled.div`
  background-color: var(--white);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: var(--shadow-sm);
`;

const QuestionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const QuestionNumberIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const QuestionNumber = styled.div`
  background-color: var(--primary);
  color: white;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
`;

const QuestionProgress = styled.span`
  color: var(--dark-gray);
  font-size: 0.95rem;
`;

const QuestionText = styled.h2`
  font-size: 1.25rem;
  color: var(--dark);
  margin-bottom: 2rem;
  line-height: 1.5;
`;

const OptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Option = styled.div`
  padding: 1rem;
  border: 2px solid ${props => props.$selected ? 'var(--primary)' : 'var(--light-gray)'};
  border-radius: var(--radius-md);
  cursor: pointer;
  background-color: ${props => props.$selected ? 'var(--primary-lightest)' : 'transparent'};
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 1rem;

  &:hover {
    border-color: ${props => props.$selected ? 'var(--primary)' : 'var(--primary-light)'};
    background-color: ${props => props.$selected ? 'var(--primary-lightest)' : 'var(--light-gray)'};
  }
`;

const RadioButton = styled.div`
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid ${props => props.$selected ? 'var(--primary)' : 'var(--dark-gray)'};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  &::after {
    content: '';
    width: 0.7rem;
    height: 0.7rem;
    border-radius: 50%;
    background-color: var(--primary);
    opacity: ${props => props.$selected ? 1 : 0};
    transition: opacity 0.2s ease;
  }
`;

const OptionText = styled.span`
  color: var(--dark);
`;

const TrueFalseContainer = styled.div`
  display: flex;
  gap: 2rem;
  justify-content: center;
  margin: 2rem 0;
`;

const TrueFalseOption = styled.div`
  width: 10rem;
  padding: 1.5rem 1rem;
  border: 3px solid ${props => {
    if (props.$selected && props.$value === 'true') return 'var(--accent)';
    if (props.$selected && props.$value === 'false') return 'var(--secondary)';
    return 'var(--light-gray)';
  }};
  background-color: ${props => {
    if (props.$selected && props.$value === 'true') return 'var(--accent-lightest)';
    if (props.$selected && props.$value === 'false') return 'var(--secondary-lightest)';
    return 'transparent';
  }};
  border-radius: var(--radius-md);
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: var(--shadow-md);
  }
`;

const TrueFalseText = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => {
    if (props.$selected && props.$value === 'true') return 'var(--accent)';
    if (props.$selected && props.$value === 'false') return 'var(--secondary)';
    return 'var(--dark)';
  }};
`;

const TextInputContainer = styled.div`
  margin: 2rem 0;
`;

const TextInput = styled.input`
  width: 100%;
  padding: 1rem;
  border: 2px solid var(--light-gray);
  border-radius: var(--radius-md);
  font-size: 1rem;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(var(--primary-rgb), 0.2);
  }
`;

/**
 * QuestionDisplay component renders a question with appropriate answer options
 * 
 * @param {Object} question - The question object to display
 * @param {any} userAnswer - The user's current answer for this question
 * @param {Function} onAnswerChange - Callback function when answer changes
 * @param {number} index - Current question index
 * @param {number} total - Total questions count
 */
const QuestionDisplay = ({ 
  question, 
  userAnswer, 
  onAnswerChange,
  index, 
  total
}) => {
  if (!question) return null;

  // Render different question types
  const renderQuestionType = () => {
    switch (question.type) {
      case 'multipleChoice':
        return (
          <OptionsContainer>
            {question.options.map(option => (
              <Option
                key={option.id}
                $selected={userAnswer === option.id}
                onClick={() => onAnswerChange(option.id)}
              >
                <RadioButton $selected={userAnswer === option.id} />
                <OptionText>{option.text}</OptionText>
              </Option>
            ))}
          </OptionsContainer>
        );
        
      case 'trueFalse':
        return (
          <TrueFalseContainer>
            <TrueFalseOption
              $selected={userAnswer === 'true'}
              $value="true"
              onClick={() => onAnswerChange('true')}
            >
              <TrueFalseText $selected={userAnswer === 'true'} $value="true">
                TRUE
              </TrueFalseText>
            </TrueFalseOption>
            
            <TrueFalseOption
              $selected={userAnswer === 'false'}
              $value="false"
              onClick={() => onAnswerChange('false')}
            >
              <TrueFalseText $selected={userAnswer === 'false'} $value="false">
                FALSE
              </TrueFalseText>
            </TrueFalseOption>
          </TrueFalseContainer>
        );
        
      case 'fillInBlank':
        return (
          <TextInputContainer>
            <TextInput
              type="text"
              value={userAnswer || ''}
              onChange={(e) => onAnswerChange(e.target.value)}
              placeholder="Type your answer here..."
              aria-label="Fill in the blank answer"
            />
          </TextInputContainer>
        );
        
      default:
        return <p>Unsupported question type</p>;
    }
  };

  return (
    <QuestionContainer>
      <QuestionHeader>
        <QuestionNumberIndicator>
          <QuestionNumber>{index + 1}</QuestionNumber>
          <QuestionProgress>Question {index + 1} of {total}</QuestionProgress>
        </QuestionNumberIndicator>
      </QuestionHeader>
      
      <QuestionText>{question.text}</QuestionText>
      
      {renderQuestionType()}
    </QuestionContainer>
  );
};

export default QuestionDisplay;