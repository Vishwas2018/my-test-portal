import './ActivitiesPage.css';

import React from 'react';
import { SubjectCard } from '../../components/ExamInterface';
import { getSubjects } from '../../utils/examUtils';
import styled from 'styled-components';

// Styled components
const ActivitiesContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
`;

const ActivitiesHeader = styled.div`
  margin-bottom: 2.5rem;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: var(--dark);
  margin-bottom: 1rem;
  position: relative;
  display: inline-block;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 4px;
    background: var(--gradient-fun);
    border-radius: var(--radius-full);
  }
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: var(--dark-gray);
  max-width: 700px;
  margin: 1.5rem auto 0;
`;

const ActivitiesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  animation: fadeInUp 0.8s ease-out;
  
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

/**
 * Activities page that displays available subject categories
 * 
 * @returns {JSX.Element} Activities component
 */
const ActivitiesPage = () => {
  // Get available subjects for display
  const subjects = getSubjects();

  return (
    <div className="activities-page">
      <ActivitiesContainer>
        <ActivitiesHeader>
          <Title>Subject Categories</Title>
          <Subtitle>
            Select a subject to begin practicing. Each subject has a different set of questions
            designed to test your knowledge and help you improve your understanding.
          </Subtitle>
        </ActivitiesHeader>
        
        <ActivitiesGrid>
          {subjects.map(subject => (
            <SubjectCard key={subject.id} subject={subject} />
          ))}
        </ActivitiesGrid>
      </ActivitiesContainer>
    </div>
  );
};

export default ActivitiesPage;