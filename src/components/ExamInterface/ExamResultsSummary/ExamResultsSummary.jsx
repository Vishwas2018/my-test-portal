// src/components/ExamInterface/ExamResultsSummary/ExamResultsSummary.jsx
import React from 'react';
import styled from 'styled-components';

const ResultsContainer = styled.div`
  width: 100%;
  background-color: white;
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: var(--shadow-md);
`;

const ScoreHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const ScoreCircle = styled.div`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background: ${props => {
    if (props.$score >= 80) return 'linear-gradient(135deg, var(--accent), var(--accent-dark))';
    if (props.$score >= 50) return 'linear-gradient(135deg, var(--primary), var(--primary-dark))';
    return 'linear-gradient(135deg, var(--secondary), var(--secondary-dark))';
  }};
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
`;

const ScoreValue = styled.div`
  font-size: 3rem;
  font-weight: 700;
  line-height: 1;
`;

const ScoreLabel = styled.div`
  font-size: 1rem;
  opacity: 0.9;
`;

const ScoreCaption = styled.div`
  font-size: 1.3rem;
  font-weight: 600;
  color: ${props => {
    if (props.$score >= 80) return 'var(--accent)';
    if (props.$score >= 50) return 'var(--primary)';
    return 'var(--secondary)';
  }};
`;

const ResultsDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const DetailCard = styled.div`
  background-color: var(--light-gray);
  border-radius: var(--radius-md);
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const DetailValue = styled.div`
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--primary);
  margin-bottom: 0.5rem;
`;

const DetailLabel = styled.div`
  font-size: 0.9rem;
  color: var(--dark-gray);
`;

const PerformanceSection = styled.div`
  margin-top: 1.5rem;
`;

const SectionHeading = styled.h3`
  font-size: 1.1rem;
  color: var(--dark);
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  svg {
    color: var(--primary);
  }
`;

/**
 * ExamResultsSummary component displays a comprehensive summary of exam results
 * 
 * @param {Object} result - The exam result object
 */
const ExamResultSummary = ({ result }) => {
  if (!result) return null;
  
  // Calculate performance level based on score
  const getPerformanceLevel = (score) => {
    if (score >= 90) return 'Outstanding';
    if (score >= 80) return 'Excellent';
    if (score >= 70) return 'Very Good';
    if (score >= 60) return 'Good';
    if (score >= 50) return 'Satisfactory';
    return 'Needs Improvement';
  };
  
  // Format time taken (in seconds) to minutes and seconds
  const formatTimeTaken = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };
  
  return (
    <ResultsContainer>
      <ScoreHeader>
        <ScoreCircle $score={result.score}>
          <ScoreValue>{result.score}%</ScoreValue>
          <ScoreLabel>Score</ScoreLabel>
        </ScoreCircle>
        <ScoreCaption $score={result.score}>
          {getPerformanceLevel(result.score)}
        </ScoreCaption>
      </ScoreHeader>
      
      <ResultsDetails>
        <DetailCard>
          <DetailValue>{result.correctCount}</DetailValue>
          <DetailLabel>Correct Answers</DetailLabel>
        </DetailCard>
        
        <DetailCard>
          <DetailValue>{result.totalQuestions}</DetailValue>
          <DetailLabel>Total Questions</DetailLabel>
        </DetailCard>
        
        <DetailCard>
          <DetailValue>{formatTimeTaken(result.timeTaken)}</DetailValue>
          <DetailLabel>Time Taken</DetailLabel>
        </DetailCard>
      </ResultsDetails>
      
      <PerformanceSection>
        <SectionHeading>
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20v-6M6 20V10M18 20V4"/>
          </svg>
          Performance Summary
        </SectionHeading>
        
        <p>
          You scored {result.score}% on this {result.subjectName} exam, correctly answering {result.correctCount} out of {result.totalQuestions} questions. 
          {result.score >= 70 
            ? " Great job! Your preparation has paid off."
            : result.score >= 50 
              ? " Good effort. With some more practice, you'll improve even more."
              : " Keep practicing to strengthen your understanding of this subject."}
        </p>
      </PerformanceSection>
    </ResultsContainer>
  );
};

export default ExamResultSummary;