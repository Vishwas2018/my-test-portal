// Create a new file src/components/sections/home/ExamTips.jsx

import React, { useState } from 'react';

import { Link } from 'react-router-dom';
import StudyTips from '../../ExamInterface/StudyTips/StudyTips';
import styled from 'styled-components';

const ExamTipsSection = styled.section`
  padding: 6rem 0;
  background-color: var(--white);
  position: relative;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 1rem;
  color: var(--dark);
  position: relative;
`;

const SectionSubtitle = styled.p`
  text-align: center;
  font-size: 1.1rem;
  color: var(--dark-gray);
  max-width: 800px;
  margin: 0 auto 3rem;
`;

const TabContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
  border-bottom: 1px solid var(--light-gray);
`;

const Tab = styled.button`
  padding: 1rem 1.5rem;
  background: transparent;
  border: none;
  border-bottom: 3px solid ${props => props.active ? 'var(--primary)' : 'transparent'};
  color: ${props => props.active ? 'var(--primary)' : 'var(--dark-gray)'};
  font-weight: ${props => props.active ? '700' : '500'};
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    color: var(--primary);
  }
`;

const ContentContainer = styled.div`
  margin-bottom: 2rem;
`;

const AntiCheatingSection = styled.div`
  margin-top: 3rem;
  background-color: var(--light-gray);
  border-radius: var(--radius-lg);
  padding: 2rem;
`;

const AntiCheatingTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: var(--dark);
  display: flex;
  align-items: center;
  gap: 0.75rem;
  
  svg {
    color: var(--primary);
  }
`;

const ExamTips = () => {
  const [activeTab, setActiveTab] = useState('mathematics');
  
  const subjects = [
    { id: 'mathematics', name: 'Mathematics' },
    { id: 'science', name: 'Science' },
    { id: 'english', name: 'English' },
    { id: 'digital', name: 'Digital Technologies' }
  ];
  
  return (
    <ExamTipsSection id="exam-tips">
      <Container>
        <SectionTitle>Exam Preparation Tips</SectionTitle>
        <SectionSubtitle>
          Maximize your performance with these subject-specific study strategies
        </SectionSubtitle>
        
        <TabContainer>
          {subjects.map(subject => (
            <Tab 
              key={subject.id}
              active={activeTab === subject.id}
              onClick={() => setActiveTab(subject.id)}
            >
              {subject.name}
            </Tab>
          ))}
        </TabContainer>
        
        <ContentContainer>
          <StudyTips subject={activeTab} defaultOpen={true} />
        </ContentContainer>
        
        <AntiCheatingSection>
          <AntiCheatingTitle>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
            Academic Integrity
          </AntiCheatingTitle>
          <p>
            Our platform is designed to help you learn and improve genuinely. While taking exams, please:
          </p>
          <ul>
            <li>Focus on understanding concepts rather than just memorizing answers</li>
            <li>Avoid using external resources during timed exams</li>
            <li>Don't switch tabs or applications during an exam</li>
            <li>Complete the exams independently to get an accurate assessment of your skills</li>
          </ul>
          <p>
            Remember, the goal is to identify your strengths and areas for improvement, 
            which is only possible through honest practice.
          </p>
          <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
            <Link to="/exams" className="btn-outline">
              Explore All Exams
            </Link>
          </div>
        </AntiCheatingSection>
      </Container>
    </ExamTipsSection>
  );
};

export default ExamTips;