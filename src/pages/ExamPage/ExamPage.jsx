// src/pages/ExamPage.jsx
import React, { useEffect, useState } from 'react';
import { getQuestions, getSubjects, saveExamResult } from '../../utils/examUtils';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import ConfettiEffect from '../../components/ExamInterface/ConfettiEffect/ConfettiEffect';
import ExamTimer from '../../components/ExamInterface/ExamTimer/ExamTimer';
import ProgressTracker from '../../components/ExamInterface/ProgressTracker';
import QuestionDisplay from '../../components/ExamInterface/QuestionDisplay/QuestionDisplay';
import styled from 'styled-components';

// Styled components
const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
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

const ExamBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const NavigationBar = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1.5rem;
`;

const NavButton = styled.button`
  padding: 0.8rem 1.5rem;
  background-color: ${props => props.primary ? 'var(--primary)' : 'var(--white)'};
  color: ${props => props.primary ? 'white' : 'var(--primary)'};
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
    if (props.success) return 'var(--accent)';
    if (props.warning) return 'var(--secondary)';
    return 'var(--primary)';
  }};
  color: white;
  border-color: ${props => {
    if (props.success) return 'var(--accent-dark)';
    if (props.warning) return 'var(--secondary-dark)';
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

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  text-align: center;
`;

const LoadingSpinner = styled.div`
  width: 50px;
  height: 50px;
  border: 5px solid var(--light-gray);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const ErrorContainer = styled.div`
  text-align: center;
  padding: 3rem;
  background-color: var(--white);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
`;

const ErrorText = styled.p`
  color: var(--error);
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
`;

const CompletionEmoji = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
`;

const ExamPage = () => {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Extract query parameters
  const queryParams = new URLSearchParams(location.search);
  const examType = queryParams.get('type');
  const year = queryParams.get('year');
  const examId = queryParams.get('examId');
  
  // State for exam info
  const [examInfo, setExamInfo] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [flaggedQuestions, setFlaggedQuestions] = useState([]);
  const [startTime] = useState(new Date());
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const [showCompletionDialog, setShowCompletionDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const loadExamData = async () => {
      try {
        setLoading(true);
        
        // Load subject information
        const subjects = getSubjects();
        const subject = subjects.find(s => s.id === subjectId);
        
        if (!subject) {
          setError('Subject not found');
          setLoading(false);
          return;
        }
        
        // Set exam info with additional metadata
        setExamInfo({
          id: subject.id,
          name: subject.name,
          timeLimit: subject.timeLimit,
          icon: subject.icon,
          type: examType,
          year: year,
          examId: examId
        });
        
        // Load questions for this subject with all metadata
        const subjectQuestions = getQuestions(subjectId, examType, year, examId);
        setQuestions(subjectQuestions);
        
      } catch (err) {
        console.error('Error loading exam:', err);
        setError('Failed to load exam data');
      } finally {
        setLoading(false);
      }
    };
    
    loadExamData();
    
    // Cleanup function
    return () => {
      // Any cleanup needed
    };
  }, [subjectId, examType, year, examId]);
  
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
    
    // Calculate score
    let correctCount = 0;
    const totalQuestions = questions.length;
    
    questions.forEach((question, index) => {
      const userAnswer = userAnswers[index];
      if (userAnswer !== undefined) {
        if (question.type === 'trueFalse') {
          if ((userAnswer === 'true' && question.correctAnswer === true) ||
              (userAnswer === 'false' && question.correctAnswer === false)) {
            correctCount++;
          }
        } else if (userAnswer === question.correctAnswer) {
          correctCount++;
        }
      }
    });
    
    const score = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
    const timeTaken = Math.floor((new Date() - startTime) / 1000);
    
    // Show completion dialog with confetti
    setShowCompletionDialog(true);
    
    // Save result with metadata
    saveExamResult({
      subject: examInfo.id,
      subjectName: examInfo.name,
      examType: examInfo.type,
      year: examInfo.year,
      examId: examInfo.examId,
      score,
      correctCount,
      totalQuestions,
      timeTaken,
      answers: userAnswers
    });
  };
  
  const handleViewResults = () => {
    // Navigate to results page
    navigate(`/results/${examInfo.id}/${new Date().getTime()}`);
  };
  
  const handleNavigateQuestion = (direction) => {
    if (direction === 'next' && currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else if (direction === 'prev' && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };
  
  if (loading) {
    return (
      <PageContainer>
        <LoadingContainer>
          <LoadingSpinner />
          <h2>Loading exam...</h2>
          <p>Please wait while we prepare your questions.</p>
        </LoadingContainer>
      </PageContainer>
    );
  }
  
  if (error) {
    return (
      <PageContainer>
        <ErrorContainer>
          <ErrorText>{error}</ErrorText>
          <NavButton onClick={() => navigate('/')}>
            Return to Dashboard
          </NavButton>
        </ErrorContainer>
      </PageContainer>
    );
  }
  
  if (!examInfo || questions.length === 0) {
    return (
      <PageContainer>
        <ErrorContainer>
          <ErrorText>No questions available for this exam.</ErrorText>
          <NavButton onClick={() => navigate('/')}>
            Return to Dashboard
          </NavButton>
        </ErrorContainer>
      </PageContainer>
    );
  }
  
  const currentQuestion = questions[currentIndex];
  const answeredCount = Object.keys(userAnswers).length;
  const isQuestionFlagged = flaggedQuestions.includes(currentIndex);
  
  // Display exam metadata
  const examMetadata = examType && year ? (
    <span>
      {examType.toUpperCase()} - Year {year}
    </span>
  ) : null;
  
  return (
    <PageContainer>
      {/* Exam Header */}
      <ExamHeader>
        <ExamTitle>
          <span>{examInfo.icon}</span> {examInfo.name} Exam
        </ExamTitle>
        <ExamDescription>
          {examMetadata}
          {examMetadata && <br />}
          Answer all questions to complete the exam. You can flag questions to review later.
        </ExamDescription>
        
        <ExamTimer 
          duration={examInfo.timeLimit} 
          onTimeUp={handleTimeUp}
        />
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
      <ExamBody>
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
      </ExamBody>
      
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
            <p>
              You have answered <strong>{answeredCount}</strong> of <strong>{questions.length}</strong> questions.
              {answeredCount < questions.length && (
                <p style={{ color: 'var(--secondary)', fontWeight: 'bold', marginTop: '0.5rem' }}>
                  There are {questions.length - answeredCount} unanswered questions.
                </p>
              )}
            </p>
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
      
      {/* Completion Dialog with Confetti */}
      {showCompletionDialog && (
        <>
          <ConfettiEffect />
          <ModalBackdrop>
            <ModalContent>
              <CompletionEmoji>🎉</CompletionEmoji>
              <ModalTitle>Congratulations!</ModalTitle>
              <p>
                You've completed the {examInfo.name} exam!
              </p>
              <ModalButtons>
                <ActionButton 
                  $success
                  onClick={handleViewResults}
                >
                  See My Results
                </ActionButton>
              </ModalButtons>
            </ModalContent>
          </ModalBackdrop>
        </>
      )}
    </PageContainer>
  );
};

export default ExamPage;