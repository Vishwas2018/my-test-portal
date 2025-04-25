// src/pages/ExamPage/ExamPage.jsx
import React, { useEffect, useRef, useState } from 'react';
import { getQuestions, getSubjects, saveExamResult } from '../../utils/examUtils';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import ConfettiEffect from '../../components/ExamInterface/ConfettiEffect/ConfettiEffect';
import ExamInterface from '../../components/ExamInterface/ExamInterface';
import styled from 'styled-components';

// Styled components
const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
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

const Button = styled.button`
  padding: 0.8rem 1.5rem;
  background-color: var(--primary);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const SecondaryButton = styled(Button)`
  background-color: var(--white);
  color: var(--primary);
  border: 2px solid var(--primary);
  
  &:hover {
    background-color: var(--primary-light);
  }
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

const CompletionEmoji = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
`;

const ExamInfoList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 1.5rem 0;
  text-align: left;
  background-color: var(--light-gray);
  padding: 1rem;
  border-radius: var(--radius-md);
`;

const ExamInfoItem = styled.li`
  margin-bottom: 0.5rem;
  display: flex;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const InfoLabel = styled.span`
  font-weight: 600;
  width: 140px;
  flex-shrink: 0;
`;

const InfoValue = styled.span`
  flex: 1;
`;

const WarningBanner = styled.div`
  background-color: rgba(255, 87, 34, 0.1);
  border-left: 4px solid var(--error);
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: var(--radius-md);
  color: var(--error);
  font-weight: 500;
`;

/**
 * Exam page that loads and displays exam questions
 */
const ExamPage = () => {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Refs for anti-cheating
  const historyRef = useRef(window.history);
  const navigateRef = useRef(navigate);

  // Extract query parameters
  const queryParams = new URLSearchParams(location.search);
  const examType = queryParams.get('type');
  const year = queryParams.get('year');
  const examId = queryParams.get('examId');

  // State for exam info
  const [examInfo, setExamInfo] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [startTime] = useState(new Date());
  const [showCompletionDialog, setShowCompletionDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // New state for confirmation dialog
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [examStarted, setExamStarted] = useState(false);
  
  // State for anti-cheating warnings
  const [showTabWarning, setShowTabWarning] = useState(false);
  const [attemptedNavigations, setAttemptedNavigations] = useState(0);

  // Handle back/forward navigation
  useEffect(() => {
    const handlePopState = (event) => {
      if (examStarted) {
        // Prevent navigation
        event.preventDefault();
        window.history.pushState(null, "", window.location.pathname + window.location.search);
        
        // Increment attempted navigations counter
        setAttemptedNavigations(prev => prev + 1);
        setShowTabWarning(true);
        
        // Auto-hide the warning after 3 seconds
        setTimeout(() => {
          setShowTabWarning(false);
        }, 3000);
        
        return false;
      }
    };

    // Push state to ensure we can capture back button
    window.history.pushState(null, "", window.location.pathname + window.location.search);
    
    // Set up event listeners for back/forward navigation
    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [examStarted]);
  
  // Handle tab visibility changes (tab switching)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (examStarted && document.visibilityState === 'hidden') {
        // User switched tabs or minimized window
        setAttemptedNavigations(prev => prev + 1);
        setShowTabWarning(true);
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [examStarted]);
  
  // Disable links within the page once exam started
  useEffect(() => {
    if (examStarted) {
      const handleClick = (e) => {
        // Check if the clicked element is a link or inside a link
        const link = e.target.closest('a');
        if (link && !link.hasAttribute('data-exam-link')) {
          e.preventDefault();
          e.stopPropagation();
          
          setAttemptedNavigations(prev => prev + 1);
          setShowTabWarning(true);
          
          setTimeout(() => {
            setShowTabWarning(false);
          }, 3000);
          
          return false;
        }
      };
      
      document.addEventListener('click', handleClick, true);
      
      return () => {
        document.removeEventListener('click', handleClick, true);
      };
    }
  }, [examStarted]);
  
  // Create beforeunload handler to prevent closing the window/tab
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (examStarted && !showCompletionDialog) {
        // Standard way of showing a confirmation dialog before unload
        e.preventDefault();
        e.returnValue = ''; // Chrome requires returnValue to be set
        return ''; // This text is usually ignored by browsers for security reasons
      }
    };
    
    if (examStarted) {
      window.addEventListener('beforeunload', handleBeforeUnload);
    }
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [examStarted, showCompletionDialog]);

  useEffect(() => {
    const loadExamData = async () => {
      try {
        setLoading(true);
        console.log("Loading exam data for subject:", subjectId);

        // Load subject information
        const subjects = getSubjects();
        console.log("Retrieved subjects:", subjects);
        
        const subject = subjects.find(s => s.id === subjectId);
        console.log("Found subject:", subject);

        if (!subject) {
          setError('Subject not found');
          setLoading(false);
          return;
        }

        // Set exam info with additional metadata
        setExamInfo({
          id: subject.id,
          name: subject.name,
          timeLimit: subject.timeLimit || 0, // Handle sample exams with no time limit
          icon: subject.icon,
          type: examType,
          year: year,
          examId: examId
        });

        // Load questions for this subject with all metadata
        const subjectQuestions = getQuestions(subjectId, examType, year, examId);
        console.log("Retrieved questions:", subjectQuestions.length);
        setQuestions(subjectQuestions);
        
        // Show confirmation dialog once data is loaded
        setShowConfirmation(true);

      } catch (err) {
        console.error('Error loading exam:', err);
        setError('Failed to load exam data');
      } finally {
        setLoading(false);
      }
    };

    loadExamData();
  }, [subjectId, examType, year, examId]);

  const handleSubmitExam = (userAnswers) => {
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
      examType: examInfo.type || 'sample',
      year: examInfo.year || 'n/a',
      examId: examInfo.examId || 'sample',
      score,
      correctCount,
      totalQuestions,
      timeTaken,
      answers: userAnswers,
      navigationAttempts: attemptedNavigations // Record cheating attempts
    });
  };

  const handleStartExam = () => {
    setExamStarted(true);
    setShowConfirmation(false);
  };
  
  const handleCancelExam = () => {
    navigate(-1); // Go back to previous page
  };

  const handleViewResults = () => {
    // Navigate to results page
    navigate(`/results/${examInfo.id}/${new Date().getTime()}`);
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
          <Button onClick={() => navigate('/')}>
            Return to Dashboard
          </Button>
        </ErrorContainer>
      </PageContainer>
    );
  }

  if (!examInfo || questions.length === 0) {
    return (
      <PageContainer>
        <ErrorContainer>
          <ErrorText>No questions available for this exam.</ErrorText>
          <Button onClick={() => navigate('/')}>
            Return to Dashboard
          </Button>
        </ErrorContainer>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      {/* Confirmation Dialog */}
      {showConfirmation && (
        <ModalBackdrop>
          <ModalContent>
            <ModalTitle>Start Exam</ModalTitle>
            <p>You are about to start the following exam:</p>
            
            <ExamInfoList>
              <ExamInfoItem>
                <InfoLabel>Subject:</InfoLabel>
                <InfoValue>{examInfo.name}</InfoValue>
              </ExamInfoItem>
              {examInfo.type && (
                <ExamInfoItem>
                  <InfoLabel>Exam Type:</InfoLabel>
                  <InfoValue>{examInfo.type.toUpperCase()}</InfoValue>
                </ExamInfoItem>
              )}
              {examInfo.year && (
                <ExamInfoItem>
                  <InfoLabel>Year Level:</InfoLabel>
                  <InfoValue>Year {examInfo.year}</InfoValue>
                </ExamInfoItem>
              )}
              <ExamInfoItem>
                <InfoLabel>Questions:</InfoLabel>
                <InfoValue>{questions.length}</InfoValue>
              </ExamInfoItem>
              <ExamInfoItem>
                <InfoLabel>Time Limit:</InfoLabel>
                <InfoValue>
                  {examInfo.timeLimit ? `${examInfo.timeLimit} minutes` : 'No time limit'}
                </InfoValue>
              </ExamInfoItem>
            </ExamInfoList>
            
            <p>
              <strong>Important:</strong> Once you start, you cannot leave this page until 
              you submit the exam. Attempting to switch tabs, use the back button, or close 
              the window will be recorded.
            </p>
            
            <p>
              Are you ready to begin?
            </p>
            
            <ModalButtons>
              <SecondaryButton onClick={handleCancelExam}>
                Cancel
              </SecondaryButton>
              <Button onClick={handleStartExam}>
                Start Exam
              </Button>
            </ModalButtons>
          </ModalContent>
        </ModalBackdrop>
      )}
      
      {/* Tab switching/navigation warning */}
      {showTabWarning && (
        <WarningBanner>
          ⚠️ Navigation detected! Please stay on this page until you complete the exam. 
          This attempt has been recorded.
        </WarningBanner>
      )}
      
      {/* Only show exam interface after confirming */}
      {examStarted && (
        <ExamInterface 
          examInfo={examInfo}
          questions={questions}
          onSubmitExam={handleSubmitExam}
        />
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
                <Button onClick={handleViewResults} data-exam-link="true">
                  See My Results
                </Button>
              </ModalButtons>
            </ModalContent>
          </ModalBackdrop>
        </>
      )}
    </PageContainer>
  );
};

export default ExamPage;