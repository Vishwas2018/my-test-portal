import './ActivitiesPage.css';

import React from 'react';
import styled from 'styled-components';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

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

// Components for the premium features section
const PremiumFeaturesContainer = styled.div`
  background: linear-gradient(145deg, var(--white) 0%, var(--light-gray) 100%);
  border-radius: var(--radius-lg);
  padding: 2rem;
  margin-top: 2rem;
  box-shadow: var(--shadow-md);
  border-left: 4px solid var(--primary);
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    width: 150px;
    height: 150px;
    background: radial-gradient(circle, rgba(110, 207, 255, 0.2), transparent 70%);
    z-index: 0;
    border-radius: 50%;
    transform: translate(30%, -30%);
  }
`;

const PremiumTitle = styled.h3`
  font-size: 1.4rem;
  color: var(--primary-dark);
  margin-bottom: 1rem;
  position: relative;
  display: inline-block;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 30px;
    height: 3px;
    background: var(--gradient-fun);
    border-radius: var(--radius-full);
  }
`;

const PremiumFeaturesList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
`;

const PremiumFeatureItem = styled.li`
  display: flex;
  align-items: center;
  margin-bottom: 0.75rem;
  color: var(--dark-gray);
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const FeatureIcon = styled.span`
  color: var(--primary);
  margin-right: 0.75rem;
  font-weight: bold;
`;

const LoginButton = styled.button`
  background-color: var(--primary);
  color: white;
  border: none;
  border-radius: var(--radius-full);
  padding: 0.8rem 1.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-right: 1rem;
  
  &:hover {
    background-color: var(--primary-dark);
    transform: translateY(-3px);
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
  }
`;

const SignupButton = styled.button`
  background-color: var(--white);
  color: var(--primary);
  border: 2px solid var(--primary);
  border-radius: var(--radius-full);
  padding: 0.8rem 1.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: var(--primary-light);
    transform: translateY(-3px);
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
  }
`;

const AuthButtons = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1.5rem;
`;

const YearButtonsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 1rem;
  margin-top: 1.5rem;
`;

const YearButton = styled.div`
  background: linear-gradient(145deg, var(--white), var(--light-gray));
  border-radius: var(--radius-lg);
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;
  border: 1px solid var(--light-gray);
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
    border-color: var(--primary-light);
  }
  
  &:hover::before {
    opacity: 0.2;
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(45deg, var(--primary-light), var(--accent-light));
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: 0;
  }
`;

const YearText = styled.span`
  font-weight: 700;
  color: var(--primary-dark);
  font-size: 1.1rem;
  position: relative;
  z-index: 1;
`;

const YearArrow = styled.span`
  color: var(--accent);
  font-weight: 900;
  opacity: 0;
  transform: translateX(-10px);
  transition: all 0.3s ease;
  position: relative;
  z-index: 1;
  
  ${YearButton}:hover & {
    opacity: 1;
    transform: translateX(0);
  }
`;

/**
 * Activities page that displays available exam types and premium features
 */
const ActivitiesPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Define exam types
  const examTypes = [
    { 
      id: 'naplan', 
      name: 'NAPLAN',
      description: 'Australian National Assessment Program - Literacy and Numeracy tests for Years 3, 5, 7, and 9',
      icon: '🏫'
    },
    { 
      id: 'icas', 
      name: 'ICAS',
      description: 'International Competitions and Assessments for Schools - comprehensive subject-specific assessment',
      icon: '🎓'
    },
    { 
      id: 'icas_all_stars', 
      name: 'ICAS All Stars',
      description: 'Advanced ICAS with comprehensive topics for high-achieving students',
      icon: '⭐'
    }
  ];

  // Handle exam types selection
  const handleExamTypeSelect = (examTypeId) => {
    navigate(`/exam-selection?type=${examTypeId}`);
  };

  // Handle year button click based on authentication
  const handleYearButtonClick = (year) => {
    if (isAuthenticated) {
      navigate(`/exam-selection?year=${year}`);
    } else {
      navigate('/signup');
    }
  };

  return (
    <div className="activities-page">
      <ActivitiesContainer>
        <ActivitiesHeader>
          <Title>Practice Exams</Title>
          <Subtitle>
            Choose from our comprehensive collection of practice exams designed to help your child excel
          </Subtitle>
        </ActivitiesHeader>
        
        {/* Exam Types Section */}
        <SectionTitle>Exam Types</SectionTitle>
        <p>Select an exam format that best suits your preparation needs</p>
        <ExamTypeGrid>
          {examTypes.map(examType => (
            <ExamTypeCard 
              key={examType.id}
              onClick={() => handleExamTypeSelect(examType.id)}
            >
              <ExamTypeIcon>{examType.icon}</ExamTypeIcon>
              <h3>{examType.name}</h3>
              <p>{examType.description}</p>
            </ExamTypeCard>
          ))}
        </ExamTypeGrid>
        
        {/* Premium Features Section - with redesigned container */}
        <SectionTitle>Full Practice Exams</SectionTitle>
        <p>Access our complete collection of premium practice materials</p>
        
        <PremiumFeaturesContainer>
          <PremiumTitle>Premium Features</PremiumTitle>
          <PremiumFeaturesList>
            <PremiumFeatureItem>
              <FeatureIcon>✓</FeatureIcon>
              Access over 1000+ practice questions across all subjects
            </PremiumFeatureItem>
            <PremiumFeatureItem>
              <FeatureIcon>✓</FeatureIcon>
              Detailed performance analytics and progress tracking
            </PremiumFeatureItem>
            <PremiumFeatureItem>
              <FeatureIcon>✓</FeatureIcon>
              Personalized study plans based on performance
            </PremiumFeatureItem>
            <PremiumFeatureItem>
              <FeatureIcon>✓</FeatureIcon>
              Timed exams that mirror real test conditions
            </PremiumFeatureItem>
            <PremiumFeatureItem>
              <FeatureIcon>✓</FeatureIcon>
              Detailed explanations for each question
            </PremiumFeatureItem>
            <PremiumFeatureItem>
              <FeatureIcon>✓</FeatureIcon>
              Adaptive learning to target weak areas
            </PremiumFeatureItem>
          </PremiumFeaturesList>
          
          {isAuthenticated ? (
            <>
              <h3 style={{ marginTop: '1.5rem' }}>Select Year Level</h3>
              <YearButtonsGrid>
                {['Year 2', 'Year 3', 'Year 4', 'Year 5', 'Year 6'].map(year => (
                  <YearButton 
                    key={year} 
                    onClick={() => handleYearButtonClick(year.split(' ')[1])}
                  >
                    <YearText>{year}</YearText>
                    <YearArrow>→</YearArrow>
                  </YearButton>
                ))}
              </YearButtonsGrid>
            </>
          ) : (
            <>
              <p style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                Please log in or sign up to access premium exams
              </p>
              <AuthButtons>
                <LoginButton onClick={() => navigate('/login')}>
                  Log In
                </LoginButton>
                <SignupButton onClick={() => navigate('/signup')}>
                  Sign Up
                </SignupButton>
              </AuthButtons>
            </>
          )}
        </PremiumFeaturesContainer>
      </ActivitiesContainer>
    </div>
  );
};

export default ActivitiesPage;