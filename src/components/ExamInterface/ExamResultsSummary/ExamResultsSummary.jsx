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

const QuestionBreakdown = styled.div`
  margin-top: 1.5rem;
  background-color: var(--light-gray);
  border-radius: var(--radius-md);
  padding: 1.25rem;
`;

const BreakdownTitle = styled.h4`
  font-size: 1rem;
  margin-bottom: 1rem;
  color: var(--dark);
`;

const BreakdownStats = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  
  @media (max-width: 600px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
`;

const BreakdownStat = styled.div`
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary);
`;

const StatLabel = styled.div`
  font-size: 0.8rem;
  color: var(--dark-gray);
`;

const DetailSubtext = styled.div`
  font-size: 0.75rem;
  color: var(--dark-gray);
  margin-top: 0.25rem;
`;

const ActionSection = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  
  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

const ActionButton = styled.button`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-radius: var(--radius-md);
  border: none;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  svg {
    flex-shrink: 0;
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const ReviewButton = styled(ActionButton)`
  background-color: var(--primary);
  color: white;
`;

const DashboardButton = styled(ActionButton)`
  background-color: var(--light-gray);
  color: var(--dark);
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
        
        {result.mostTimeSpent && (
          <DetailCard>
            <DetailValue>Q{result.mostTimeSpent.questionIndex + 1}</DetailValue>
            <DetailLabel>Most Time Spent</DetailLabel>
            <DetailSubtext>{result.mostTimeSpent.timeSpent}s</DetailSubtext>
          </DetailCard>
        )}
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
        
        {result.attemptedQuestions && (
          <QuestionBreakdown>
            <BreakdownTitle>Question Breakdown</BreakdownTitle>
            <BreakdownStats>
              <BreakdownStat>
                <StatValue>{result.attemptedQuestions}</StatValue>
                <StatLabel>Attempted</StatLabel>
              </BreakdownStat>
              <BreakdownStat>
                <StatValue>{result.correctCount}</StatValue>
                <StatLabel>Correct</StatLabel>
              </BreakdownStat>
              <BreakdownStat>
                <StatValue>{result.attemptedQuestions - result.correctCount}</StatValue>
                <StatLabel>Wrong</StatLabel>
              </BreakdownStat>
              <BreakdownStat>
                <StatValue>{result.totalQuestions - result.attemptedQuestions}</StatValue>
                <StatLabel>Skipped</StatLabel>
              </BreakdownStat>
            </BreakdownStats>
          </QuestionBreakdown>
        )}
      </PerformanceSection>
      
      <ActionSection>
        <ReviewButton onClick={result.onReviewQuestions}>
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
          Review Questions
        </ReviewButton>
        
        <DashboardButton onClick={result.onReturnToDashboard}>
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
          Return to Dashboard
        </DashboardButton>
      </ActionSection>
    </ResultsContainer>
  );
};

export default ExamResultSummary;