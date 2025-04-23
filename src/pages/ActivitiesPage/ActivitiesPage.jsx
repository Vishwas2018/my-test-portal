import './ActivitiesPage.css';

import { Link, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

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

const SectionTitle = styled.h2`
  font-size: 1.8rem;
  color: var(--primary);
  margin: 2.5rem 0 1.5rem 0;
  position: relative;
  display: inline-block;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 40px;
    height: 3px;
    background: var(--gradient-fun);
    border-radius: var(--radius-full);
  }
`;

const ExamTypeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
`;

const ExamTypeCard = styled.div`
  background-color: var(--white);
  border-radius: var(--radius-xl);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  transition: all 0.3s ease;
  cursor: pointer;
  text-align: center;
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  }
`;

const ExamTypeIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  width: 80px;
  height: 80px;
  background: linear-gradient(to right bottom, var(--accent-light), var(--primary-light));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
`;

const QuickAccessGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1.5rem;
`;

const SubjectItem = styled(Link)`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background-color: var(--light-gray);
  border-radius: var(--radius-lg);
  text-decoration: none;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-md);
  }
`;

const SubjectIcon = styled.div`
  width: 45px;
  height: 45px;
  background-color: var(--white);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  box-shadow: var(--shadow-sm);
  flex-shrink: 0;
`;

const SubjectInfo = styled.div`
  flex: 1;
`;

const SubjectName = styled.div`
  font-weight: 700;
  color: var(--dark);
  margin-bottom: 0.25rem;
`;

const SubjectDetails = styled.div`
  font-size: 0.8rem;
  color: var(--dark-gray);
`;

/**
 * Activities page that displays available subject categories and exam types
 * 
 * @returns {JSX.Element} Activities component
 */
const ActivitiesPage = () => {
  // Get available subjects for display
  const [subjects, setSubjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const allSubjects = getSubjects();
    setSubjects(allSubjects);
  }, []);

  // Define exam types
  const examTypes = [
    { 
      id: 'naplan', 
      name: 'NAPLAN',
      description: 'Australian National Assessment Program',
      icon: '🏫'
    },
    { 
      id: 'icas', 
      name: 'ICAS',
      description: 'International Competitions and Assessments for Schools',
      icon: '🎓'
    },
    { 
      id: 'icas_all_stars', 
      name: 'ICAS All Stars',
      description: 'Advanced ICAS with comprehensive topics',
      icon: '⭐'
    }
  ];

  return (
    <div className="activities-page">
      <ActivitiesContainer>
        <ActivitiesHeader>
          <Title>Exam Selection</Title>
          <Subtitle>
            Choose from our comprehensive collection of practice exams designed to help you excel
          </Subtitle>
        </ActivitiesHeader>
        
        {/* Exam Types Section */}
        <SectionTitle>Exam Types</SectionTitle>
        <ExamTypeGrid>
          {examTypes.map(examType => (
            <ExamTypeCard 
              key={examType.id}
              onClick={() => navigate(`/exam-selection?type=${examType.id}`)}
            >
              <ExamTypeIcon>{examType.icon}</ExamTypeIcon>
              <h3>{examType.name}</h3>
              <p>{examType.description}</p>
            </ExamTypeCard>
          ))}
        </ExamTypeGrid>
        
        {/* Quick Access Section */}
        <SectionTitle>Quick Exam Access</SectionTitle>
        <p>Start practicing immediately with these subjects</p>
        <QuickAccessGrid>
          {subjects.map(subject => (
            <SubjectItem 
              to={`/exam/${subject.id}`} 
              key={subject.id}
            >
              <SubjectIcon>{subject.icon}</SubjectIcon>
              <SubjectInfo>
                <SubjectName>{subject.name}</SubjectName>
                <SubjectDetails>
                  {subject.questionCount} questions • {subject.timeLimit} min
                </SubjectDetails>
              </SubjectInfo>
            </SubjectItem>
          ))}
        </QuickAccessGrid>
        
        {/* Sample Tests Section */}
        <SectionTitle>Free Sample Tests</SectionTitle>
        <p>Try these free sample tests to get familiar with our platform</p>
        <ExamTypeGrid>
          {examTypes.map(examType => (
            <ExamTypeCard 
              key={`sample-${examType.id}`}
              onClick={() => navigate(`/sample-test/${examType.id}`)}
            >
              <ExamTypeIcon>{examType.icon}</ExamTypeIcon>
              <h3>{examType.name} Sample</h3>
              <p>Free practice test - no account required</p>
              <div className="free-badge">Free</div>
            </ExamTypeCard>
          ))}
        </ExamTypeGrid>
      </ActivitiesContainer>
    </div>
  );
};

export default ActivitiesPage;