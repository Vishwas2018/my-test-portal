import { Link } from 'react-router-dom';
// src/components/ExamInterface/SubjectCard.jsx
import React from 'react';
import styled from 'styled-components';

const CardContainer = styled(Link)`
  display: flex;
  flex-direction: column;
  background-color: var(--white);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  padding: 1.5rem;
  transition: all 0.3s ease;
  text-decoration: none;
  color: var(--dark);
  position: relative;
  overflow: hidden;
  border: 3px solid transparent;
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: var(--shadow-lg);
    border-color: var(--primary-light);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 6px;
    background: var(--gradient-primary);
  }
`;

const SubjectIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  background-color: var(--light-gray);
  border-radius: 50%;
  margin: 0 auto 1rem;
  transition: transform 0.3s ease;
  
  ${CardContainer}:hover & {
    transform: scale(1.1) rotate(5deg);
  }
`;

const SubjectTitle = styled.h3`
  font-size: 1.3rem;
  margin-bottom: 0.5rem;
  text-align: center;
  color: var(--dark);
`;

const SubjectDetails = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--light-gray);
`;

const DetailItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const DetailLabel = styled.span`
  font-size: 0.8rem;
  color: var(--dark-gray);
  margin-bottom: 0.25rem;
`;

const DetailValue = styled.span`
  font-weight: 700;
  color: var(--primary);
`;

const SubjectCard = ({ subject }) => {
  return (
    <CardContainer to={`/exam/${subject.id}`}>
      <SubjectIcon>{subject.icon}</SubjectIcon>
      <SubjectTitle>{subject.name}</SubjectTitle>
      
      <SubjectDetails>
        <DetailItem>
          <DetailLabel>Questions</DetailLabel>
          <DetailValue>{subject.questionCount}</DetailValue>
        </DetailItem>
        
        <DetailItem>
          <DetailLabel>Time</DetailLabel>
          <DetailValue>{subject.timeLimit} min</DetailValue>
        </DetailItem>
      </SubjectDetails>
    </CardContainer>
  );
};

export default SubjectCard;