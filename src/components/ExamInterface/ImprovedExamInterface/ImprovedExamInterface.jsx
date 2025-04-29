// src/components/ExamInterface/ImprovedExamInterface.jsx
import React, { useCallback, useEffect, useMemo, useState } from 'react';

// Import sub-components
import ExamProgressBar from '../ExamProgressBar/ExamProgressBar';
import ExamTimer from '../ExamTimer/ExamTimer';
import FeedbackMessage from '../FeedbackMessage/FeedbackMessage';
import QuestionDisplay from '../QuestionDisplay/QuestionDisplay';
import QuestionNavigator from '../QuestionNavigator/QuestionNavigator';
import styled from 'styled-components';

// Styled components
const ExamContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 1.5rem;
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
  line-height: 1.5;
`;

const TimerAndProgressContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ExamControls = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  margin-bottom: 1.5rem;
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

  svg {
    width: 18px;
    height: 18px;
  }
`;

const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: var(--white);
  border-radius: var(--radius-lg);
  padding: 2rem;
  max-width: 550px;
  width: 90%;
  text-align: center;
  box-shadow: var(--shadow-lg);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 6px;
    background: var(--gradient-primary);
    border-top-left-radius: var(--radius-lg);
    border-top-right-radius: var(--radius-lg);
  }
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: var(--dark);
`;

const ModalDescription = styled.div`
  margin-bottom: 1.5rem;
  color: var(--dark);
  text-align: left;
  
  p {
    margin-bottom: 1rem;
    line-height: 1.6;
  }
  
  ul {
    list-style-type: none;
    padding-left: 0;
    margin: 1.5rem 0;
  }
  
  li {
    margin-bottom: 0.75rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    
    svg {
      color: var(--primary);
      flex-shrink: 0;
    }
  }
`;

const ModalButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const SectionSeparator = styled.div`
  border-top: 1px solid var(--light-gray);
  margin: 2rem 0;
`;

const ButtonsContainer = styled.div`
  display: flex;
  gap: 1rem;
`;

/**
 * ImprovedExamInterface provides a more user-friendly and engaging exam experience
 * Integrates components for better navigation, progress tracking, and feedback
 * 
 * @param {Object} examInfo - Information about the exam (name, time limit, etc.)
 * @param {Array} questions - Array of question objects for the exam
 * @param {Function} onSubmitExam - Callback function when exam is submitted
 */
const ImprovedExamInterface = ({
    examInfo,
    questions,
    onSubmitExam
}) => {
    // State for exam progress
    const [currentIndex, setCurrentIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState({});
    const [flaggedQuestions, setFlaggedQuestions] = useState([]);

    // UI state management
    const [examState, setExamState] = useState('start'); // 'start', 'in-progress', 'review', 'submitting'
    const [showFeedback, setShowFeedback] = useState(false);
    const [feedbackMessage, setFeedbackMessage] = useState({
        type: 'info',
        title: '',
        message: ''
    });    

    // Detect if exam has sections
    const examSections = useMemo(() =>
        examInfo?.sections && examInfo.sections.length > 0 ? examInfo.sections : null,
        [examInfo]
    );

    // Input validation and error handling
    useEffect(() => {
        if (!examInfo) {
            console.error('ImprovedExamInterface: Missing exam information');
        }

        if (!Array.isArray(questions) || questions.length === 0) {
            console.error('ImprovedExamInterface: Missing or empty questions array');
        }
    }, [examInfo, questions]);

    /**
     * Handles user answer changes for the current question
     * Shows encouraging feedback at certain milestones
     */
    const handleAnswerChange = useCallback((answer) => {
        setUserAnswers(prev => ({
            ...prev,
            [currentIndex]: answer
        }));

        // Show encouraging feedback for every 5th answer or at completion milestones
        const answeredCount = Object.keys(userAnswers).length;
        const isSignificantMilestone =
            (answeredCount + 1) % 5 === 0 ||
            answeredCount + 1 === Math.floor(questions.length / 2) ||
            answeredCount + 1 === questions.length;

        if (isSignificantMilestone) {
            const isComplete = answeredCount + 1 === questions.length;

            setFeedbackMessage({
                type: isComplete ? 'success' : 'info',
                title: isComplete ? 'All questions answered!' : 'Great progress!',
                message: isComplete
                    ? "You've answered all questions. Ready to review and submit?"
                    : "You're doing really well. Keep going!"
            });
            setShowFeedback(true);

            // Auto-hide feedback after 4 seconds
            setTimeout(() => {
                setShowFeedback(false);
            }, 4000);
        }
    }, [currentIndex, userAnswers, questions.length]);

    /**
     * Toggles the flagged status of the current question
     * Shows appropriate feedback based on the action
     */
    const toggleFlag = useCallback(() => {
        setFlaggedQuestions(prev => {
            const isFlagged = prev.includes(currentIndex);
            const updatedFlags = isFlagged
                ? prev.filter(i => i !== currentIndex)
                : [...prev, currentIndex];

            // Show feedback based on action
            setFeedbackMessage({
                type: isFlagged ? 'info' : 'warning',
                title: isFlagged ? 'Flag removed' : 'Question flagged',
                message: isFlagged
                    ? "You've removed the flag from this question."
                    : "You've flagged this question to review later."
            });
            setShowFeedback(true);

            // Auto-hide feedback after 3 seconds
            setTimeout(() => {
                setShowFeedback(false);
            }, 3000);

            return updatedFlags;
        });
    }, [currentIndex]);

    /**
     * Handles the timer expiry event
     * Transitions to the submission confirmation state
     */
    const handleTimeUp = useCallback(() => {
        setExamState('submitting');
    }, []);

    /**
     * Submits the exam through the provided callback
     * Validates that exam info is available first
     */
    const handleSubmit = useCallback(() => {
        if (!examInfo) {
            console.error('Cannot submit exam: Missing exam information');
            return;
        }

        if (typeof onSubmitExam === 'function') {
            onSubmitExam(userAnswers);
        } else {
            console.error('Cannot submit exam: onSubmitExam is not a function');
        }
    }, [examInfo, userAnswers, onSubmitExam]);

    /**
     * Navigates to the previous or next question
     * @param {string} direction - 'prev' or 'next'
     */
    const handleNavigateQuestion = useCallback((direction) => {
        if (direction === 'next' && currentIndex < questions.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else if (direction === 'prev' && currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    }, [currentIndex, questions.length]);

    /**
     * Begins the exam by changing state to 'in-progress'
     */
    const handleStartExam = useCallback(() => {
        setExamState('in-progress');     
    }, []);

    /**
     * Transitions to review mode before final submission
     */
    const handleReviewExam = useCallback(() => {
        // Check if there are unanswered questions
        const unansweredCount = questions.length - Object.keys(userAnswers).length;
        const flaggedCount = flaggedQuestions.length;
        
        if (unansweredCount > 0 || flaggedCount > 0) {
          // Show warning message
          setFeedbackMessage({
            type: 'warning',
            title: 'Review Needed',
            message: `You have ${unansweredCount > 0 ? `${unansweredCount} unanswered questions` : ''}
                     ${unansweredCount > 0 && flaggedCount > 0 ? ' and ' : ''}
                     ${flaggedCount > 0 ? `${flaggedCount} flagged questions` : ''}.
                     You'll be able to review them before final submission.`
          });
          setShowFeedback(true);
          
          // Auto-hide feedback after 5 seconds
          setTimeout(() => {
            setShowFeedback(false);
          }, 5000);
        }
        
        setExamState('review');
      }, [questions.length, userAnswers, flaggedQuestions]);

    /**
     * Returns to the exam from review mode
     */
    const handleResumeExam = useCallback(() => {
        setExamState('in-progress');
    }, []);

    // Guard clause for missing data
    if (!examInfo || !Array.isArray(questions) || questions.length === 0) {
        return (
            <ExamContainer>
                <p>No questions available for this exam.</p>
            </ExamContainer>
        );
    }

    // Derived values
    const currentQuestion = questions[currentIndex];
    const answeredCount = Object.keys(userAnswers).length;
    const isQuestionFlagged = flaggedQuestions.includes(currentIndex);
    const showTimer = examInfo.timeLimit > 0;
    const remainingQuestions = questions.length - answeredCount;

    // Render start screen with tips
    if (examState === 'start') {
        return (
            <ExamContainer>
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
                </ExamHeader>               

                <ModalContent>
                    <ModalTitle>Ready to Begin Your Exam?</ModalTitle>

                    <ModalDescription>
                        <p>You are about to start the {examInfo.name} exam with {questions.length} questions.</p>

                        <ul>
                            <li>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <line x1="12" y1="16" x2="12" y2="12"></line>
                                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                                </svg>
                                <span>You have {examInfo.timeLimit} minutes to complete this exam.</span>
                            </li>
                            <li>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <line x1="12" y1="16" x2="12" y2="12"></line>
                                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                                </svg>
                                <span>You can move between questions using the question navigator or next/previous buttons.</span>
                            </li>
                            <li>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <line x1="12" y1="16" x2="12" y2="12"></line>
                                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                                </svg>
                                <span>Flag any questions you want to review later by clicking "Flag for Review".</span>
                            </li>
                        </ul>

                        <p>When you're ready, click "Start Exam" to begin.</p>
                    </ModalDescription>

                    <ModalButtons>
                        <ActionButton onClick={handleStartExam}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polygon points="5 3 19 12 5 21 5 3"></polygon>
                            </svg>
                            Start Exam
                        </ActionButton>
                    </ModalButtons>
                </ModalContent>
            </ExamContainer>
        );
    }

    // Render exam review screen
    if (examState === 'review') {
        return (
            <ExamContainer>
                <ExamHeader>
                    <ExamTitle>
                        <span>{examInfo.icon}</span> {examInfo.name} Exam - Review
                    </ExamTitle>
                    <ExamDescription>
                        Review your answers before submitting your exam.
                    </ExamDescription>

                    {showTimer && (
                        <ExamTimer
                            duration={examInfo.timeLimit}
                            onTimeUp={handleTimeUp}
                            isPaused={true}
                        />
                    )}
                </ExamHeader>

                <FeedbackMessage
                    type="info"
                    title="Exam Review Mode"
                    message="You can review your answers and complete any unanswered questions before submitting your exam."
                    duration={0}
                    onDismiss={() => { }}
                />

                <QuestionNavigator
                    totalQuestions={questions.length}
                    currentQuestion={currentIndex}
                    answeredQuestions={Object.keys(userAnswers).map(Number)}
                    flaggedQuestions={flaggedQuestions}
                    onQuestionClick={setCurrentIndex}
                    sections={examSections}
                />

                <SectionSeparator />

                <ModalContent>
                    <ModalTitle>Exam Progress</ModalTitle>

                    <ExamProgressBar
                        answeredCount={answeredCount}
                        totalQuestions={questions.length}
                        showMilestones={true}
                    />

                    <ModalDescription>
                        <ul>
                            <li>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                </svg>
                                <span>Answered: {answeredCount} of {questions.length} questions</span>
                            </li>

                            {remainingQuestions > 0 && (
                                <li>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <line x1="12" y1="16" x2="12" y2="12"></line>
                                        <line x1="12" y1="8" x2="12.01" y2="8"></line>
                                    </svg>
                                    <span>Remaining: {remainingQuestions} unanswered questions</span>
                                </li>
                            )}

                            {flaggedQuestions.length > 0 && (
                                <li>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
                                        <line x1="4" y1="22" x2="4" y2="15"></line>
                                    </svg>
                                    <span>Flagged: {flaggedQuestions.length} questions marked for review</span>
                                </li>
                            )}
                        </ul>

                        {remainingQuestions > 0 && (
                            <p>You still have {remainingQuestions} unanswered questions. Would you like to continue the exam or submit it now?</p>
                        )}

                        {remainingQuestions === 0 && (
                            <p>You've answered all the questions. Ready to submit your exam?</p>
                        )}
                    </ModalDescription>

                    <ModalButtons>
                        <NavButton onClick={handleResumeExam}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polygon points="5 3 19 12 5 21 5 3"></polygon>
                            </svg>
                            Continue Exam
                        </NavButton>

                        <ActionButton
                            $success
                            onClick={handleSubmit}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                <polyline points="22 4 12 14.01 9 11.01"></polyline>
                            </svg>
                            Submit Exam
                        </ActionButton>
                    </ModalButtons>
                </ModalContent>
            </ExamContainer>
        );
    }

    // Render submitting confirmation dialog
    if (examState === 'submitting') {
        return (
            <ExamContainer>
                <ExamHeader>
                    <ExamTitle>
                        <span>{examInfo.icon}</span> {examInfo.name} Exam
                    </ExamTitle>
                    <ExamDescription>
                        Ready to submit your exam?
                    </ExamDescription>
                </ExamHeader>

                <ModalBackdrop>
                    <ModalContent>
                        <ModalTitle>Time's Up!</ModalTitle>
                        <ModalDescription>
                            <p>Your exam time has ended. It's now time to submit your answers.</p>
                            <p>You have answered <strong>{answeredCount}</strong> of <strong>{questions.length}</strong> questions.</p>
                            {answeredCount < questions.length && (
                                <p style={{ color: 'var(--secondary)', fontWeight: 'bold', marginTop: '0.5rem' }}>
                                    Note: There are {questions.length - answeredCount} unanswered questions.
                                </p>
                            )}
                        </ModalDescription>
                        <ModalButtons>
                            <ActionButton
                                $success
                                onClick={handleSubmit}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                </svg>
                                Submit Now
                            </ActionButton>
                        </ModalButtons>
                    </ModalContent>
                </ModalBackdrop>
            </ExamContainer>
        );
    }

    // Main exam interface (in-progress)
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

                <TimerAndProgressContainer>
                    {showTimer && (
                        <ExamTimer
                            duration={examInfo.timeLimit}
                            onTimeUp={handleTimeUp}
                        />
                    )}

                    <ExamProgressBar
                        answeredCount={answeredCount}
                        totalQuestions={questions.length}
                    />
                </TimerAndProgressContainer>
            </ExamHeader>

            {/* Feedback Message */}
            {showFeedback && (
                <FeedbackMessage
                    type={feedbackMessage.type}
                    title={feedbackMessage.title}
                    message={feedbackMessage.message}
                    duration={4000}
                    onDismiss={() => setShowFeedback(false)}
                />
            )}

            {/* Question Navigator */}
            <QuestionNavigator
                totalQuestions={questions.length}
                currentQuestion={currentIndex}
                answeredQuestions={Object.keys(userAnswers).map(Number)}
                flaggedQuestions={flaggedQuestions}
                onQuestionClick={setCurrentIndex}
                sections={examSections}
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
                    {isQuestionFlagged ? (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
                                <line x1="4" y1="22" x2="4" y2="15"></line>
                            </svg>
                            Unflag Question
                        </>
                    ) : (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
                                <line x1="4" y1="22" x2="4" y2="15"></line>
                            </svg>
                            Flag for Review
                        </>
                    )}
                </ActionButton>

                <ButtonsContainer>
                    <NavButton
                        onClick={() => handleNavigateQuestion('prev')}
                        disabled={currentIndex === 0}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="19" y1="12" x2="5" y2="12"></line>
                            <polyline points="12 19 5 12 12 5"></polyline>
                        </svg>
                        Previous
                    </NavButton>

                    {currentIndex === questions.length - 1 ? (
                        <ActionButton
                            $success
                            onClick={handleReviewExam}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                <polyline points="14 2 14 8 20 8"></polyline>
                                <line x1="16" y1="13" x2="8" y2="13"></line>
                                <line x1="16" y1="17" x2="8" y2="17"></line>
                                <polyline points="10 9 9 9 8 9"></polyline>
                            </svg>
                            Review Exam
                        </ActionButton>
                    ) : (
                        <NavButton
                            $primary
                            onClick={() => handleNavigateQuestion('next')}
                        >
                            Next
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                                <polyline points="12 5 19 12 12 19"></polyline>
                            </svg>
                        </NavButton>
                    )}
                </ButtonsContainer>
            </NavigationBar>

            {/* Exam Submit Button */}
            <ExamControls>
                <span style={{ fontWeight: 500 }}>
                    {answeredCount} of {questions.length} questions answered
                </span>

                <ActionButton
                    $success
                    onClick={handleReviewExam}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                    Review & Submit
                </ActionButton>
            </ExamControls>
        </ExamContainer>
    );
};

export default ImprovedExamInterface;