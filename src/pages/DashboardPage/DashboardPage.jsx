import './DashboardPage.css';

import React from 'react';
import { SubjectCard } from '../../components/ExamInterface';
import { getSubjects } from '../../utils/examUtils';
import styled from 'styled-components';

// Styled components
const DashboardContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
`;

const DashboardHeader = styled.div`
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

const ExamsGrid = styled.div`
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
 * Dashboard page that displays available exams
 * 
 * @returns {JSX.Element} Dashboard component
 */
const DashboardPage = () => {
  // Get available subjects for exams
  const subjects = getSubjects();

  return (
    <div className="dashboard-page">
      <DashboardContainer>
        <DashboardHeader>
          <Title>Available Exams</Title>
          <Subtitle>
            Select an exam to begin practicing. Each subject has a different set of questions
            designed to test your knowledge and help you improve your understanding.
          </Subtitle>
        </DashboardHeader>
        
        <ExamsGrid>
          {subjects.map(subject => (
            <SubjectCard key={subject.id} subject={subject} />
          ))}
        </ExamsGrid>
      </DashboardContainer>
    </div>
  );
};

export default DashboardPage;