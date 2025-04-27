// src/components/ExamInterface/StudyTips/StudyTips.jsx
import React, { useState } from 'react';

import styled from 'styled-components';

const TipsContainer = styled.div`
  margin-bottom: 2rem;
  background-color: var(--white);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  overflow: hidden;
  border: 1px solid var(--light-gray);
`;

const TipsHeader = styled.div`
  padding: 1rem 1.5rem;
  background: linear-gradient(to right, var(--primary-light), var(--accent-light));
  color: var(--dark);
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
`;

const TipsTitle = styled.h3`
  margin: 0;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  
  svg {
    color: var(--primary);
  }
`;

const TipsToggle = styled.div`
  color: var(--primary-dark);
  font-weight: 600;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  svg {
    transition: transform 0.3s ease;
    transform: ${props => props.$isOpen ? 'rotate(180deg)' : 'rotate(0deg)'};
  }
`;

const TipsContent = styled.div`
  max-height: ${props => props.$isOpen ? '500px' : '0'};
  overflow: hidden;
  transition: max-height 0.4s ease;
`;

const TipsList = styled.ul`
  padding: 1.5rem 2rem;
  margin: 0;
  list-style-type: none;
`;

const TipItem = styled.li`
  margin-bottom: 1rem;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  line-height: 1.5;
  color: var(--dark);
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const TipIcon = styled.div`
  color: var(--primary);
  flex-shrink: 0;
  padding-top: 0.25rem;
`;

const TipText = styled.div``;

/**
 * StudyTips component provides helpful exam tips for students
 * 
 * @param {string} subject - The subject of the exam
 * @param {boolean} defaultOpen - Whether tips are open by default
 */
const StudyTips = ({ subject = 'general', defaultOpen = true }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  // Get subject-specific tips
  const getTips = () => {
    switch (subject.toLowerCase()) {
      case 'mathematics':
      case 'math':
      case 'maths':
        return [
          "Read each question carefully and identify exactly what is being asked.",
          "Show all your work for calculations - you might get partial credit even if your final answer is wrong.",
          "Double-check your calculations, especially when transferring numbers.",
          "For word problems, draw a diagram or picture to help visualize the situation.",
          "If you're stuck on a question, mark it and move on. Return to it later if you have time."
        ];
        
      case 'science':
        return [
          "Pay attention to units of measurement in calculations.",
          "For experiment-based questions, identify variables (dependent, independent, controlled).",
          "When analyzing data, look for patterns and relationships between variables.",
          "Use diagrams to help explain scientific processes when applicable.",
          "Remember to relate your answers to scientific principles and theories."
        ];
        
      case 'english':
      case 'reading':
        return [
          "Read passages carefully before attempting to answer questions.",
          "Pay attention to specific details that support main ideas.",
          "Look for context clues to help understand unfamiliar vocabulary.",
          "For inferential questions, use evidence from the text to support your answer.",
          "Review your answers to ensure they directly address what the question is asking."
        ];
        
      case 'writing':
        return [
          "Plan your response before writing - create a quick outline.",
          "Include a clear introduction, body paragraphs, and conclusion.",
          "Use specific examples and evidence to support your ideas.",
          "Vary your sentence structure and vocabulary.",
          "Save time to proofread for spelling, grammar, and punctuation errors."
        ];
        
      case 'digital':
      case 'digital technologies':
        return [
          "Read each scenario carefully to understand the digital context.",
          "Pay attention to technical terminology in the questions.",
          "For coding questions, follow the logic step by step.",
          "Consider security and privacy aspects in your answers when relevant.",
          "Remember to think about ethical considerations in technology use."
        ];
        
      default:
        return [
          "Read all instructions and questions carefully before answering.",
          "Manage your time - don't spend too long on any one question.",
          "If you're unsure about an answer, mark the question and return to it later.",
          "Use process of elimination for multiple-choice questions.",
          "Review your answers if time permits."
        ];
    }
  };
  
  const tips = getTips();
  
  return (
    <TipsContainer>
      <TipsHeader onClick={() => setIsOpen(!isOpen)}>
        <TipsTitle>
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
          Study Tips for {subject.charAt(0).toUpperCase() + subject.slice(1)}
        </TipsTitle>
        
        <TipsToggle $isOpen={isOpen}>
          {isOpen ? 'Hide Tips' : 'Show Tips'}
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" $isOpen={isOpen}>
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </TipsToggle>
      </TipsHeader>
      
      <TipsContent $isOpen={isOpen}>
        <TipsList>
          {tips.map((tip, index) => (
            <TipItem key={index}>
              <TipIcon>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 11 12 14 22 4"></polyline>
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                </svg>
              </TipIcon>
              <TipText>{tip}</TipText>
            </TipItem>
          ))}
        </TipsList>
      </TipsContent>
    </TipsContainer>
  );
};

export default StudyTips;