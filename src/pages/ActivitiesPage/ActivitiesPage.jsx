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
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
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

// New styled component for featured sample exams
const SampleExamSection = styled.div`
  margin-top: 3rem;
  padding: 2rem;
  background-color: var(--white);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  border: 2px dashed var(--accent-light);
`;

const SampleExamHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const FreeBadge = styled.span`
  background-color: var(--accent);
  color: white;
  font-size: 0.8rem;
  font-weight: bold;
  padding: 0.25rem 0.75rem;
  border-radius: var(--radius-full);
`;

// Components for the premium features section
const PremiumFeaturesContainer = styled.div`
  background-color: var(--white);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  margin-top: 2rem;
  box-shadow: var(--shadow-md);
  border-left: 4px solid var(--primary);
`;

const PremiumTitle = styled.h3`
  font-size: 1.4rem;
  color: var(--dark);
  margin-bottom: 1rem;
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

const YearButtonsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 1.5rem;
`;

const YearButton = styled.button`
  background-color: var(--white);
  border: 2px solid var(--primary-light);
  border-radius: var(--radius-lg);
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  color: var(--primary);
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: var(--primary-light);
    color: var(--primary-dark);
    transform: translateY(-3px);
    box-shadow: var(--shadow-sm);
  }
  
  &:active {
    transform: translateY(-1px);
  }
`;

/**
 * Activities page that displays available subject categories and exam types
 * 
 * @returns {JSX.Element} Activities component
 */
const ActivitiesPage = () => {
  console.log("This is a test comment")
  // Get available subjects for display
  const [subjects, setSubjects] = useState([]);
  const navigate = useNavigate();

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
      description: 'testing',
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
      description: 'Practice solving mathematical problems and equations'
    },
    {
      id: 'science',
      name: 'Science',
      questionCount: 5,
      icon: '🧪',
      description: 'Test your knowledge of scientific concepts and theories'
    },
    {
      id: 'digital',
      name: 'Digital Technologies',
      questionCount: 5,
      icon: '💻',
      description: 'Explore digital concepts and computational thinking'
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
        
        {/* Separate Sample Exams Section */}
        <SampleExamSection>
          <SampleExamHeader>
            <SectionTitle style={{ margin: 0 }}>Sample Exams</SectionTitle>
            <FreeBadge>FREE</FreeBadge>
          </SampleExamHeader>
          <p>Try these free sample exams with 5 questions each and no time limit - no account required</p>
          
          <QuickAccessGrid>
            {sampleExamSubjects.map(subject => (
              <SubjectItem 
                to={`/exam/${subject.id}`} 
                key={subject.id}
              >
                <SubjectIcon>{subject.icon}</SubjectIcon>
                <SubjectInfo>
                  <SubjectName>{subject.name}</SubjectName>
                  <SubjectDetails>
                    {subject.questionCount} questions • No time limit
                  </SubjectDetails>
                </SubjectInfo>
              </SubjectItem>
            ))}
          </QuickAccessGrid>
        </SampleExamSection>
        
        {/* Exam Types Section */}
        <SectionTitle>Exam Types</SectionTitle>
        <p>Choose from our comprehensive collection of standard exam formats</p>
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
        
        {/* Full Exams Section */}
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
          
          <YearButtonsContainer>
            <YearButton onClick={() => navigate('/signup')}>Year 2</YearButton>
            <YearButton onClick={() => navigate('/signup')}>Year 3</YearButton>
            <YearButton onClick={() => navigate('/signup')}>Year 4</YearButton>
            <YearButton onClick={() => navigate('/signup')}>Year 5</YearButton>
            <YearButton onClick={() => navigate('/signup')}>Year 6</YearButton>
          </YearButtonsContainer>
        </PremiumFeaturesContainer>
      </ActivitiesContainer>
    </div>
  );
};

export default ActivitiesPage;