// src/components/ExamInterface/ExamInterface.jsx
import React, { useState } from 'react';

import ExamTimer from './ExamTimer';
import ProgressTracker from './ProgressTracker';
import QuestionDisplay from './QuestionDisplay';
import styled from 'styled-components';

// Styled components
const ExamContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 1rem;
`;

const ExamHeader = styled.div`
  background: var(--gradient-primary);
  padding: 1.5rem;
  border-radius: var(--radius-lg);
  color: white;
  margin-bottom: 1.5rem;
  box-shadow: var(--shadow-md);
`;

const ExamTitle = styled.h1`
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ExamDescription = styled.p`
  font-size: 1rem;
  opacity: 0.9;
  margin-bottom: 1rem;
`;

const NavigationBar = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1.5rem;
`;

const NavButton = styled.button`
  padding: 0.8rem 1.5rem;
  background-color: ${props => props.$primary ? 'var(--primary)' : 'var(--white)'};
  color: ${props => props.$primary ? 'white' : 'var(--primary)'};
  border: 2px solid var(--primary);
  border-radius: var(--radius-md);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const ActionButton = styled(NavButton)`
  background-color: ${props => {
    if (props.$success) return 'var(--accent)';
    if (props.$warning) return 'var(--secondary)';
    return 'var(--primary)';
  }};
  color: white;
  border-color: ${props => {
    if (props.$success) return 'var(--accent-dark)';
    if (props.$warning) return 'var(--secondary-dark)';
    return 'var(--primary-dark)';
  }};
`;

const ExamProgress = styled.div`
  background-color: var(--white);
  padding: 1rem;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const ProgressText = styled.p`
  font-size: 1rem;
  font-weight: 600;
  color: var(--dark);
`;

const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: var(--white);
  border-radius: var(--radius-lg);
  padding: 2rem;
  max-width: 500px;
  width: 90%;
  text-align: center;
  box-shadow: var(--shadow-lg);
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: var(--dark);
`;

const ModalButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1.5rem;
`;

/**
 * Unified exam interface component that handles display and interaction
 */
const ExamInterface = ({ 
  examInfo,
  questions,
  onSubmitExam
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [flaggedQuestions, setFlaggedQuestions] = useState([]);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);

  const handleAnswerChange = (answer) => {
    setUserAnswers(prev => ({
      ...prev,
      [currentIndex]: answer
    }));
  };

  const toggleFlag = () => {
    setFlaggedQuestions(prev =>
      prev.includes(currentIndex)
        ? prev.filter(i => i !== currentIndex)
        : [...prev, currentIndex]
    );
  };

  const handleTimeUp = () => {
    setShowConfirmSubmit(true);
  };

  const handleSubmit = () => {
    if (!examInfo) return;
    
    if (typeof onSubmitExam === 'function') {
      onSubmitExam(userAnswers);
    }
  };

  const handleNavigateQuestion = (direction) => {
    if (direction === 'next' && currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else if (direction === 'prev' && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  if (!examInfo || questions.length === 0) {
    return (
      <ExamContainer>
        <p>No questions available for this exam.</p>
      </ExamContainer>
    );
  }

  const currentQuestion = questions[currentIndex];
  const answeredCount = Object.keys(userAnswers).length;
  const isQuestionFlagged = flaggedQuestions.includes(currentIndex);
  const showTimer = examInfo.timeLimit > 0;

  return (
    <ExamContainer>
      {/* Exam Header */}
      <ExamHeader>
        <ExamTitle>
          <span>{examInfo.icon}</span> {examInfo.name} Exam
        </ExamTitle>
        <ExamDescription>
          {examInfo.type && examInfo.year && (
            <span>
              {examInfo.type.toUpperCase()} - Year {examInfo.year}
            </span>
          )}
          
          <br />
          Answer all questions to complete the exam. You can flag questions to review later.
        </ExamDescription>

        {showTimer && (
          <ExamTimer
            duration={examInfo.timeLimit}
            onTimeUp={handleTimeUp}
          />
        )}
      </ExamHeader>

      {/* Progress Tracker */}
      <ProgressTracker
        totalQuestions={questions.length}
        currentQuestion={currentIndex}
        answeredQuestions={Object.keys(userAnswers).map(Number)}
        flaggedQuestions={flaggedQuestions}
        onQuestionClick={setCurrentIndex}
      />

      {/* Question Display */}
      <QuestionDisplay
        question={currentQuestion}
        userAnswer={userAnswers[currentIndex]}
        onAnswerChange={handleAnswerChange}
        index={currentIndex}
        total={questions.length}
      />

      {/* Navigation Controls */}
      <NavigationBar>
        <ActionButton
          $warning={isQuestionFlagged}
          onClick={toggleFlag}
        >
          {isQuestionFlagged ? "Unflag Question" : "Flag for Review"}
        </ActionButton>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <NavButton
            onClick={() => handleNavigateQuestion('prev')}
            disabled={currentIndex === 0}
          >
            Previous
          </NavButton>

          {currentIndex === questions.length - 1 ? (
            <ActionButton
              $success
              onClick={() => setShowConfirmSubmit(true)}
            >
              Finish Exam
            </ActionButton>
          ) : (
            <NavButton
              $primary
              onClick={() => handleNavigateQuestion('next')}
            >
              Next
            </NavButton>
          )}
        </div>
      </NavigationBar>

      {/* Exam Progress Footer */}
      <ExamProgress>
        <ProgressText>
          {answeredCount} of {questions.length} questions answered
        </ProgressText>

        <ActionButton
          $success
          onClick={() => setShowConfirmSubmit(true)}
        >
          Submit Exam
        </ActionButton>
      </ExamProgress>

      {/* Confirm Submit Dialog */}
      {showConfirmSubmit && (
        <ModalBackdrop>
          <ModalContent>
            <ModalTitle>Ready to submit your exam?</ModalTitle>
            <div>
              <p>You have answered <strong>{answeredCount}</strong> of <strong>{questions.length}</strong> questions.</p>
              {answeredCount < questions.length && (
                <p style={{ color: 'var(--secondary)', fontWeight: 'bold', marginTop: '0.5rem' }}>
                  There are {questions.length - answeredCount} unanswered questions.
                </p>
              )}
            </div>
            <p style={{ marginTop: '1rem' }}>
              Are you sure you want to submit your exam?
            </p>
            <ModalButtons>
              <NavButton onClick={() => setShowConfirmSubmit(false)}>
                Continue Exam
              </NavButton>
              <ActionButton
                $success
                onClick={handleSubmit}
              >
                Submit Now
              </ActionButton>
            </ModalButtons>
          </ModalContent>
        </ModalBackdrop>
      )}
    </ExamContainer>
  );
};

export default ExamInterface;