// src/pages/ExamPage/ExamPage.jsx

import './ExamPage.css';

import React, { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

// Import components
import AccessibilityControls from '../../components/ExamInterface/AccessibilityControls/AccessibilityControls';
import AnimatedCelebration from '../../components/ExamInterface/AnimatedCelebration/AnimatedCelebration';
import { Button } from '../../components/common';
import ConfettiEffect from '../../components/ExamInterface/ConfettiEffect/ConfettiEffect';
import ConfirmationDialog from '../../components/ExamInterface/ConfirmationDialog/ConfirmationDialog';
import ExamResultSummary from '../../components/ExamInterface/ExamResultsSummary/ExamResultsSummary';
import ImprovedExamInterface from '../../components/ExamInterface/ImprovedExamInterface/ImprovedExamInterface';
import StudyTips from '../../components/ExamInterface/StudyTips/StudyTips';
import ThemeToggler from '../../components/ExamInterface/ThemeToggler/ThemeToggler';
import dataLoader from '../../utils/dataLoader';
// Updated utilities
import { saveExamResult } from '../../utils/examUtils';
import { useTheme } from '../../contexts/ThemeContext';

/**
 * ExamPage component handles the exam-taking experience
 */
const ExamPage = () => {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Theme context integration
  const themeContextFromHook = useTheme?.();
  
  // Local state for theme if context not available
  const [localDarkMode, setLocalDarkMode] = useState(false);
  const [localAccessibility, setLocalAccessibility] = useState({});
  
  // Extract query parameters from URL
  const queryParams = new URLSearchParams(location.search);
  const examType = queryParams.get('type');
  const year = queryParams.get('year');
  const examId = queryParams.get('examId');

  // Core state
  const [examInfo, setExamInfo] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [startTime] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Result state
  const [examResult, setExamResult] = useState(null);
  
  // UI state
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showCompletionDialog, setShowCompletionDialog] = useState(false);
  const [showAnimatedCelebration, setShowAnimatedCelebration] = useState(false);
  const [examStarted, setExamStarted] = useState(false);
  const [showStudyTips, setShowStudyTips] = useState(true);
  const [showReviewMode, setShowReviewMode] = useState(false);
  
  // Anti-cheating state
  const [showTabWarning, setShowTabWarning] = useState(false);
  const [attemptedNavigations, setAttemptedNavigations] = useState(0);
  const [warningTimeout, setWarningTimeout] = useState(null);

  // Handler for exam submission
  const handleSubmitExam = useCallback((userAnswers) => {
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

    // Create result object with navigation attempts
    const result = {
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
      navigationAttempts: attemptedNavigations,
      date: new Date().toISOString(),
      attemptedQuestions: Object.keys(userAnswers).length
    };

    // Store the result
    setExamResult(result);
    
    // Show animated celebration first
    setShowAnimatedCelebration(true);
    
    // Save result to storage
    saveExamResult(result);
  }, [examInfo, questions, startTime, attemptedNavigations]);

  // Event handlers
  const handleStartExam = useCallback(() => {
    setExamStarted(true);
    setShowConfirmation(false);
    setShowStudyTips(false);
  }, []);
  
  const handleCancelExam = useCallback(() => {
    // Navigate to the exams page with appropriate parameters
    navigate(`/exams?type=${examType || ''}`);
  }, [navigate, examType]);

  const handleViewResults = useCallback(() => {
    // Navigate to results page
    navigate(`/results/${examInfo.id}/${new Date().getTime()}`);
  }, [navigate, examInfo]);
  
  const handleAnimationComplete = useCallback(() => {
    setShowAnimatedCelebration(false);
    setShowCompletionDialog(true);
  }, []);
  
  const handleAccessibilityChange = useCallback((settings) => {
    if (themeContextFromHook?.updateAccessibilitySettings) {
      themeContextFromHook.updateAccessibilitySettings(settings);
    } else {
      setLocalAccessibility(settings);
    }
  }, [themeContextFromHook]);
  
  const handleThemeChange = useCallback((isDark) => {
    if (themeContextFromHook?.toggleDarkMode) {
      themeContextFromHook.toggleDarkMode();
    } else {
      setLocalDarkMode(isDark);
    }
  }, [themeContextFromHook]);

  const handleReviewQuestions = useCallback(() => {
    setShowCompletionDialog(false);
    // Show the questions with answers
    setShowReviewMode(true);
  }, []);

  // Load exam data on component mount
  useEffect(() => {
    const loadExamData = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log("Loading exam data for subject:", subjectId);
  
        // Get subject info from manifest
        const manifest = await import('../../data/category/manifest.json');
        const subjectInfo = manifest.default.subjects[subjectId];
        
        if (!subjectInfo) {
          setError(`Subject not found: ${subjectId}`);
          setLoading(false);
          return;
        }
        
        // Set exam info from manifest
        const examTypeInfo = subjectInfo.examTypes[examType] || subjectInfo.examTypes.sample;
        let examInfo = {
          id: subjectId,
          name: subjectInfo.name,
          timeLimit: subjectInfo.defaultTimeLimit || 30,
          icon: subjectInfo.icon || '📝',
          type: examType || 'sample',
          year: year || 'N/A',
          examId: examId || 'Exam1',
          questionCount: subjectInfo.defaultQuestionCount || 0
        };
        
        // If we have a specific examId, get that exam's info
        if (examId && examTypeInfo && examTypeInfo.exams) {
          const specificExam = examTypeInfo.exams.find(e => e.id === examId);
          if (specificExam) {
            examInfo = {
              ...examInfo,
              timeLimit: specificExam.timeLimit || examInfo.timeLimit,
              questionCount: specificExam.questionCount || examInfo.questionCount,
              year: specificExam.year || examInfo.year
            };
          }
        }
        
        setExamInfo(examInfo);
        
        // Load questions using our new data loader
        const examData = await dataLoader.loadExam(subjectId, examType || 'sample', examId || 'Exam1');
        
        if (!examData || !examData.questions || examData.questions.length === 0) {
          setError('No questions available for this exam');
          setLoading(false);
          return;
        }
        
        setQuestions(examData.questions);
        
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
  
  // Anti-cheating: Listen for visibility changes
  useEffect(() => {
    if (!examStarted) return;
    
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        // User switched tabs or minimized window
        setAttemptedNavigations(prev => prev + 1);
        setShowTabWarning(true);
        
        // Clear any existing timeout
        if (warningTimeout) {
          clearTimeout(warningTimeout);
        }
        
        // Auto-hide the warning after 10 seconds
        const timeout = setTimeout(() => {
          setShowTabWarning(false);
        }, 10000);
        
        setWarningTimeout(timeout);
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (warningTimeout) {
        clearTimeout(warningTimeout);
      }
    };
  }, [examStarted, warningTimeout]);
  
  // Anti-cheating: Disable back button
  useEffect(() => {
    if (!examStarted) return;
    
    const handleBeforeUnload = (e) => {
      // Standard way to show a confirmation dialog when the user tries to leave the page
      e.preventDefault();
      e.returnValue = 'Changes you made may not be saved.';
      
      setAttemptedNavigations(prev => prev + 1);
      setShowTabWarning(true);
      
      return e.returnValue;
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [examStarted]);
  
  // Main render
  return (
    <div className={`exam-page ${examStarted ? 'exam-in-progress' : ''}`}>
      {/* Accessibility Controls */}
      <AccessibilityControls 
        settings={themeContextFromHook?.accessibilitySettings || localAccessibility}
        onChange={handleAccessibilityChange}
      />
      
      {/* Theme Toggler */}
      <ThemeToggler
        initialDarkMode={themeContextFromHook?.isDarkMode || localDarkMode}
        onChange={handleThemeChange}
      />
      
      <div className="exam-page-container">
        {/* Study Tips - shown before exam starts */}
        {!examStarted && showStudyTips && examInfo && (
          <StudyTips 
            subject={examInfo.name} 
            defaultOpen={true}
          />
        )}
      
        {/* Conditional rendering for different exam states */}
        {!examStarted ? (
          // Show confirmation dialog
          showConfirmation && (
            <ConfirmationDialog 
              examInfo={examInfo} 
              onStart={handleStartExam} 
              onCancel={handleCancelExam}
            />
          )
        ) : (
          // Exam is started
          <>
            {/* Navigation warning banner */}
            {showTabWarning && (
              <div className="warning-banner">
                ⚠️ Navigation detected! Please stay on this page until you complete the exam. 
                This attempt has been recorded.
              </div>
            )}
            
            {/* Exam interface - only shown after confirmation */}
            {!showCompletionDialog && !showAnimatedCelebration && !showReviewMode && (
              <ImprovedExamInterface 
                examInfo={examInfo}
                questions={questions}
                onSubmitExam={handleSubmitExam}
              />
            )}
            
            {/* Review mode showing questions with answers */}
            {showReviewMode && (
              <div className="review-container">
                <h2>Review Questions</h2>
                <div className="questions-review">
                  {questions.map((question, index) => (
                    <div key={index} className="question-review-item">
                      <h3>Question {index + 1}</h3>
                      <p>{question.text}</p>
                      <div className="user-answer">
                        <strong>Your answer:</strong> {examResult.answers[index] || "Not answered"}
                      </div>
                      <div className="correct-answer">
                        <strong>Correct answer:</strong> {question.correctAnswer}
                      </div>
                      <div className="explanation">
                        <strong>Explanation:</strong> {question.explanation}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="review-actions">
                  <Button onClick={() => navigate('/dashboard')}>
                    Return to Dashboard
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
        
        {/* Animated Celebration - shown after exam submission */}
        {showAnimatedCelebration && examResult && (
          <AnimatedCelebration
            show={true}
            score={examResult.score}
            subject={examInfo.name}
            onComplete={handleAnimationComplete}
          />
        )}

        {/* Completion Dialog with Result Summary */}
        {showCompletionDialog && examResult && (
          <>
            <ConfettiEffect />
            <div className="modal-backdrop">
              <div className="modal-content">
                <div className="completion-emoji">🎉</div>
                <h2 className="modal-title">Congratulations!</h2>
                <p>You've completed the {examInfo.name} exam!</p>
                
                {/* Enhanced result summary */}
                <ExamResultSummary 
                  result={{
                    ...examResult,
                    onReviewQuestions: handleReviewQuestions,
                    onReturnToDashboard: () => navigate('/dashboard')
                  }} 
                />
                
                <div className="modal-buttons">
                  <Button onClick={handleReviewQuestions}>
                    Review Questions
                  </Button>
                  <Button 
                    onClick={handleViewResults} 
                    data-exam-link="true"
                  >
                    See Detailed Results
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
        
        {/* Loading state */}
        {loading && (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <h2>Loading exam...</h2>
            <p>Please wait while we prepare your questions.</p>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="error-container">
            <p className="error-text">{error}</p>
            <Button onClick={() => navigate('/')}>
              Return to Dashboard
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamPage;