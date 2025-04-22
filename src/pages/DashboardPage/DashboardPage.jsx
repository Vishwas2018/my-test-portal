import './DashboardPage.css';

import ExamSelection from '../ExamSelection/ExamSelection';
import React from 'react';
import styled from 'styled-components';
import { useAuth } from '../../contexts/AuthContext';

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
`;

const HighlightedName = styled.span`
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 0;
    width: 100%;
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

const SelectionContainer = styled.div`
  margin-bottom: 3rem;
  background-color: var(--light);
  border-radius: var(--radius-xl);
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
`;

/**
 * Dashboard page that displays exam selection interface
 * 
 * @returns {JSX.Element} Dashboard component
 */
const DashboardPage = () => {
  const { currentUser } = useAuth();
  const firstName = currentUser?.fullName?.split(' ')[0] || 'Student';

  return (
    <div className="dashboard-page">
      <DashboardContainer>
        <DashboardHeader>
          <Title>
            Welcome to your Dashboard, <HighlightedName>{firstName}</HighlightedName>
          </Title>
          <Subtitle>
            Continue your learning journey by selecting an exam below.
          </Subtitle>
        </DashboardHeader>
        
        <SelectionContainer>
          <ExamSelection />
        </SelectionContainer>
        
        {/* Subject categories have been moved to Activities page */}
      </DashboardContainer>
    </div>
  );
};

export default DashboardPage;