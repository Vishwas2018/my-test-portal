import './ActivitiesPage.css';

import React, { useEffect, useState } from 'react';

import { getSubjects } from '../../utils/examUtils';
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
`;

const PremiumTitle = styled.h3`
  font-size: 1.4rem;
  color: var(--dark);
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
  color: var(--accent);
  margin-right: 0.75rem;
  font-weight: bold;
`;

// Components for free exams section
const FreeExamsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
`;

const FreeExamCard = styled.div`
  background-color: var(--white);
  border-radius: var(--radius-xl);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  height: 100%;
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
  }
`;

const ExamCardHeader = styled.div`
  background: linear-gradient(45deg, var(--primary), var(--accent));
  padding: 1.5rem;
  color: white;
  display: flex;
  align-items: center;
`;

const ExamCardIcon = styled.div`
  font-size: 2rem;
  width: 50px;
  height: 50px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
`;

const ExamCardTitle = styled.h3`
  margin: 0;
  font-size: 1.3rem;
`;

const ExamCardContent = styled.div`
  padding: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const ExamCardDescription = styled.p`
  color: var(--dark-gray);
  margin-bottom: 1.5rem;
  flex: 1;
`;

const ExamCardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--light-gray);
  padding: 1rem 1.5rem;
  font-size: 0.9rem;
  color: var(--dark-gray);
`;

const ExamCardBadge = styled.span`
  background-color: var(--white);
  padding: 0.3rem 0.8rem;
  border-radius: var(--radius-full);
  color: var(--primary);
  font-weight: 600;
  font-size: 0.8rem;
`;

const StartExamButton = styled.button`
  background-color: var(--primary);
  color: white;
  border: none;
  border-radius: var(--radius-full);
  padding: 0.8rem 1.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: auto;
  
  &:hover {
    background-color: var(--primary-dark);
    transform: translateY(-3px);
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
  }
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

/**
 * Activities page that displays available subject categories and exam types
 * 
 * @returns {JSX.Element} Activities component
 */
const ActivitiesPage = () => {
  // Get available subjects for display
  const [subjects, setSubjects] = useState([]);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    try {
      const allSubjects = getSubjects();
      console.log("Loaded subjects:", allSubjects);
      setSubjects(allSubjects);
    } catch (error) {
      console.error("Error loading subjects:", error);
    }
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

  // Sample exam subjects with 5 questions and no time limit
  const sampleExamSubjects = [
    {
      id: 'mathematics',
      name: 'Mathematics',
      questionCount: 5,
      icon: '🔢',
      description: 'Practice solving mathematical problems and equations, including arithmetic, algebra, and geometry.'
    },
    {
      id: 'science',
      name: 'Science',
      questionCount: 5,
      icon: '🧪',
      description: 'Test your knowledge of scientific concepts, principles, and theories in biology, chemistry, and physics.'
    },
    {
      id: 'digital',
      name: 'Digital Technologies',
      questionCount: 5,
      icon: '💻',
      description: 'Explore digital concepts, computational thinking, and problem-solving in technology contexts.'
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
          <Title>Exam Selection</Title>
          <Subtitle>
            Choose from our comprehensive collection of practice exams designed to help you excel
          </Subtitle>
        </ActivitiesHeader>
        
        {/* Free Exams Section (redesigned) */}
        <SectionTitle>Free Sample Exams</SectionTitle>
        <p>Try these sample exams with 5 questions each and no time limit - no account required</p>
        
        <FreeExamsGrid>
          {sampleExamSubjects.map(subject => (
            <FreeExamCard 
              key={subject.id}
              onClick={() => navigate(`/exam/${subject.id}`)}
            >
              <ExamCardHeader>
                <ExamCardIcon>{subject.icon}</ExamCardIcon>
                <ExamCardTitle>{subject.name}</ExamCardTitle>
              </ExamCardHeader>
              <ExamCardContent>
                <ExamCardDescription>
                  {subject.description}
                </ExamCardDescription>
                <StartExamButton>Start Exam</StartExamButton>
              </ExamCardContent>
              <ExamCardFooter>
                <span>5 questions</span>
                <ExamCardBadge>No time limit</ExamCardBadge>
              </ExamCardFooter>
            </FreeExamCard>
          ))}
        </FreeExamsGrid>
        
        {/* Exam Types Section */}
        <SectionTitle>Exam Types</SectionTitle>
        <p>Choose from our comprehensive collection of standard exam formats</p>
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
        
        {/* Full Exams Section - with redesigned premium features container */}
        <SectionTitle>Full Practice Exams</SectionTitle>
        <p>Access our complete collection with a premium account</p>
        
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
              Personalized study plans based on your performance
            </PremiumFeatureItem>
            <PremiumFeatureItem>
              <FeatureIcon>✓</FeatureIcon>
              Timed exams that mirror real test conditions
            </PremiumFeatureItem>
          </PremiumFeaturesList>
          
          {isAuthenticated ? (
            <div className="year-buttons-grid">
              {['Year 2', 'Year 3', 'Year 4', 'Year 5', 'Year 6'].map(year => (
                <div 
                  className="year-button" 
                  key={year} 
                  onClick={() => handleYearButtonClick(year.split(' ')[1])}
                >
                  <div className="year-button-content">
                    <span className="year-text">{year}</span>
                    <span className="year-arrow">→</span>
                  </div>
                </div>
              ))}
            </div>
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