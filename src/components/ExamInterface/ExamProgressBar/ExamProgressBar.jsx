// src/components/ExamInterface/ExamProgressBar/ExamProgressBar.jsx
import React from 'react';
import styled from 'styled-components';

const ProgressContainer = styled.div`
  margin: 1rem 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const ProgressHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ProgressLabel = styled.span`
  font-weight: 500;
  color: var(--dark);
`;

const ProgressCount = styled.span`
  background-color: rgba(255, 255, 255, 0.4);
  color: var(--dark);
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: var(--radius-full);
  font-size: 0.9rem;
`;

const ProgressBarContainer = styled.div`
  width: 100%;
  height: 12px;
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: var(--radius-full);
  overflow: hidden;
  position: relative;
`;

const ProgressFill = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: ${props => props.percentage >= 100 
    ? 'var(--success)' 
    : props.percentage >= 75 
      ? 'var(--accent)' 
      : props.percentage >= 40 
        ? 'var(--primary)' 
        : 'var(--primary-light)'};
  width: ${props => props.percentage}%;
  border-radius: var(--radius-full);
  transition: width 0.3s ease;
`;

const Milestones = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 0.25rem;
  padding: 0 5px;
`;

const Milestone = styled.div`
  width: 2px;
  height: 8px;
  background-color: ${props => props.achieved ? 'var(--dark)' : 'var(--light-gray)'};
  position: relative;
  
  &::after {
    content: '${props => props.label}';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    font-size: 0.7rem;
    color: ${props => props.achieved ? 'var(--dark)' : 'var(--dark-gray)'};
    margin-top: 4px;
    white-space: nowrap;
  }
`;

/**
 * ExamProgressBar - Displays user progress through the exam
 * 
 * @param {number} answeredCount - Number of questions answered
 * @param {number} totalQuestions - Total number of questions in the exam
 * @param {boolean} showMilestones - Whether to show milestone markers on the progress bar
 */
const ExamProgressBar = ({ answeredCount = 0, totalQuestions = 0, showMilestones = false }) => {
  // Calculate progress percentage
  const progressPercentage = totalQuestions > 0 
    ? Math.min(100, Math.round((answeredCount / totalQuestions) * 100)) 
    : 0;
  
  const milestones = [
    { value: 25, label: '25%' },
    { value: 50, label: '50%' },
    { value: 75, label: '75%' },
    { value: 100, label: '100%' }
  ];
  
  return (
    <ProgressContainer>
      <ProgressHeader>
        <ProgressLabel>Progress</ProgressLabel>
        <ProgressCount>{answeredCount}/{totalQuestions}</ProgressCount>
      </ProgressHeader>
      
      <ProgressBarContainer>
        <ProgressFill percentage={progressPercentage} />
      </ProgressBarContainer>
      
      {showMilestones && (
        <Milestones>
          {milestones.map(milestone => (
            <Milestone 
              key={milestone.value}
              achieved={progressPercentage >= milestone.value}
              label={milestone.label}
              style={{ left: `calc(${milestone.value}% - 1px)` }}
            />
          ))}
        </Milestones>
      )}
    </ProgressContainer>
  );
};

export default ExamProgressBar;