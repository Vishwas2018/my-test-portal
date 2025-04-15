// src/components/ExamInterface/QuestionDisplay.jsx
import React, { useState } from 'react';

import styled from 'styled-components';

const QuestionContainer = styled.div`
  padding: 1.5rem;
  background-color: var(--white);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
`;

const QuestionHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const QuestionNumber = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  background-color: var(--primary);
  color: white;
  border-radius: 50%;
  font-weight: bold;
  margin-right: 1rem;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
`;

const QuestionCounter = styled.span`
  font-size: 0.9rem;
  color: var(--dark-gray);
  font-weight: 500;
`;

const QuestionText = styled.h3`
  font-size: 1.25rem;
  margin-bottom: 1.5rem;
  color: var(--dark);
  line-height: 1.5;
`;

const OptionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 2rem;
`;

const OptionCard = styled.div`
  padding: 1rem;
  border-radius: var(--radius-md);
  background-color: ${props => props.selected ? 'rgba(110, 207, 255, 0.1)' : 'var(--light-gray)'};
  border: 2px solid ${props => props.selected ? 'var(--primary)' : 'transparent'};
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
    background-color: ${props => props.selected ? 'rgba(110, 207, 255, 0.1)' : 'rgba(228, 240, 247, 0.8)'};
  }
`;

const OptionText = styled.span`
  flex: 1;
  font-size: 1.1rem;
  color: var(--dark);
  font-weight: ${props => props.selected ? 'bold' : 'normal'};
`;

const RadioButton = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid ${props => props.selected ? 'var(--primary)' : 'var(--dark-gray)'};
  margin-right: 12px;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: var(--primary);
    opacity: ${props => props.selected ? 1 : 0};
    transition: opacity 0.2s ease;
  }
`;

const TrueFalseContainer = styled.div`
  display: flex;
  gap: 2rem;
  justify-content: center;
  margin-top: 2rem;
`;

const TrueFalseOption = styled.div`
  padding: 1.5rem 2rem;
  border-radius: var(--radius-lg);
  background-color: ${props => {
    if (props.selected && props.value === 'true') return 'rgba(126, 217, 87, 0.1)';
    if (props.selected && props.value === 'false') return 'rgba(255, 87, 34, 0.1)';
    return 'var(--light-gray)';
  }};
  border: 2px solid ${props => {
    if (props.selected && props.value === 'true') return 'var(--accent)';
    if (props.selected && props.value === 'false') return 'var(--error)';
    return 'transparent';
  }};
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
  width: 150px;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.08);
  }
`;

const TrueFalseText = styled.span`
  font-size: 1.3rem;
  font-weight: bold;
  color: ${props => {
    if (props.selected && props.value === 'true') return 'var(--accent)';
    if (props.selected && props.value === 'false') return 'var(--error)';
    return 'var(--dark)';
  }};
`;

const TextInput = styled.input`
  width: 100%;
  padding: 1rem;
  border: 2px solid var(--light-gray);
  border-radius: var(--radius-md);
  font-size: 1.1rem;
  margin-top: 2rem;
  transition: all 0.2s ease;
  font-family: 'Nunito', sans-serif;
  
  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(110, 207, 255, 0.2);
  }
`;

const QuestionImage = styled.img`
  max-width: 100%;
  border-radius: var(--radius-md);
  margin: 1rem 0;
  max-height: 300px;
  object-fit: contain;
`;

const QuestionDisplay = ({ question, userAnswer, onAnswerChange, index, total }) => {
  const [hoverOption, setHoverOption] = useState(null);
  
  const handleMultipleChoiceSelect = (optionId) => {
    onAnswerChange(optionId);
  };
  
  const handleTrueFalseSelect = (value) => {
    onAnswerChange(value);
  };
  
  const handleTextChange = (e) => {
    onAnswerChange(e.target.value);
  };
  
  const renderQuestionContent = () => {
    switch (question.type) {
      case 'multipleChoice':
        return (
          <OptionsList>
            {question.options.map((option) => (
              <OptionCard
                key={option.id}
                selected={userAnswer === option.id}
                onClick={() => handleMultipleChoiceSelect(option.id)}
                onMouseEnter={() => setHoverOption(option.id)}
                onMouseLeave={() => setHoverOption(null)}
              >
                <RadioButton selected={userAnswer === option.id} />
                <OptionText selected={userAnswer === option.id}>
                  {option.text}
                </OptionText>
              </OptionCard>
            ))}
          </OptionsList>
        );
        
      case 'trueFalse':
        return (
          <TrueFalseContainer>
            <TrueFalseOption
              selected={userAnswer === 'true'}
              onClick={() => handleTrueFalseSelect('true')}
              value="true"
            >
              <TrueFalseText selected={userAnswer === 'true'} value="true">
                TRUE
              </TrueFalseText>
            </TrueFalseOption>
            
            <TrueFalseOption
              selected={userAnswer === 'false'}
              onClick={() => handleTrueFalseSelect('false')}
              value="false"
            >
              <TrueFalseText selected={userAnswer === 'false'} value="false">
                FALSE
              </TrueFalseText>
            </TrueFalseOption>
          </TrueFalseContainer>
        );
        
      case 'fillInBlank':
        return (
          <TextInput
            type="text"
            placeholder="Enter your answer"
            value={userAnswer || ''}
            onChange={handleTextChange}
          />
        );
        
      default:
        return <p>Unknown question type</p>;
    }
  };
  
  return (
    <QuestionContainer>
      <QuestionHeader>
        <QuestionNumber>{index + 1}</QuestionNumber>
        <QuestionCounter>Question {index + 1} of {total}</QuestionCounter>
      </QuestionHeader>
      
      <QuestionText>{question.text}</QuestionText>
      
      {question.imageUrl && (
        <QuestionImage 
          src={question.imageUrl} 
          alt={`Visual for question ${index + 1}`}
        />
      )}
      
      {renderQuestionContent()}
    </QuestionContainer>
  );
};

export default QuestionDisplay;