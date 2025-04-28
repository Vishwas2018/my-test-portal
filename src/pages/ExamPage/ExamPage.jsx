// src/pages/ExamPage/ExamPage.jsx
import './ExamPage.css';

import React, { useCallback, useEffect, useState } from 'react';
import { getQuestions, saveExamResult } from '../../utils/examUtils';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

// Import components and services
import AccessibilityControls from '../../components/ExamInterface/AccessibilityControls/AccessibilityControls';
import AnimatedCelebration from '../../components/ExamInterface/AnimatedCelebration/AnimatedCelebration';
import { Button } from '../../components/common';
import ConfettiEffect from '../../components/ExamInterface/ConfettiEffect/ConfettiEffect';
import ConfirmationDialog from '../../components/ExamInterface/ConfirmationDialog/ConfirmationDialog';
import { EXAM } from '../../utils/constants';
import ExamResultSummary from '../../components/ExamInterface/ExamResultsSummary/ExamResultsSummary';
import ImprovedExamInterface from '../../components/ExamInterface/ImprovedExamInterface/ImprovedExamInterface';
import StudyTips from '../../components/ExamInterface/StudyTips/StudyTips';
import ThemeToggler from '../../components/ExamInterface/ThemeToggler/ThemeToggler';
import examService from '../../services/examService';
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
  
  // Anti-cheating state
  const [showTabWarning, setShowTabWarning] = useState(false);
  const [attemptedNavigations, setAttemptedNavigations] = useState(0);

  // Handle back/forward browser navigation
  useEffect(() => {
    if (!examStarted) return;

    // Modern approach using beforeunload for tab/browser closing
    const handleBeforeUnload = (event) => {
      const message = "You're in the middle of an exam. Are you sure you want to leave?";
      event.preventDefault();
      event.returnValue = message; // Required for Chrome
      return message; // Required for older browsers
    };
    
    // Function to handle attempts to navigate away
    const handlePopState = (event) => {
      if (examStarted) {
        // Record navigation attempt
        setAttemptedNavigations(prev => prev + 1);
        setShowTabWarning(true);
        
        // Auto-hide warning after 3 seconds
        setTimeout(() => setShowTabWarning(false), 3000);
        
        // Push state back to prevent navigation
        window.history.pushState({examPage: true}, "", window.location.pathname + window.location.search);
        
        return false;
      }
    };

    // Push initial state to ensure we can capture back button
    window.history.pushState({examPage: true}, "", window.location.pathname + window.location.search);
    
    // Set up event listeners - using multiple approaches for broader browser support
    window.addEventListener('beforeunload', handleBeforeUnload, true);
    window.addEventListener('popstate', handlePopState, true);
    
    // Clean up event listeners
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload, true);
      window.removeEventListener('popstate', handlePopState, true);
    };
  }, [examStarted, setAttemptedNavigations, setShowTabWarning]);
  
  // PRIMARY ANTI-CHEATING DETECTION
  useEffect(() => {
    if (!examStarted) return;

    let blurCount = 0;
    let visibilityCount = 0;
    
    // Handle tab visibility changes (hidden = changed tabs)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && examStarted) {
        visibilityCount++;
        console.log('Tab visibility changed - navigation attempt detected');
        setAttemptedNavigations(prev => prev + 1);
        setShowTabWarning(true);
        
        // Force the browser to execute JS even when tab is not visible
        const startTime = Date.now();
        while (Date.now() - startTime < 100) {
          // Small delay to ensure the event gets processed
        }
      }
    };
    
    // Handle window blur (clicking outside the window)
    const handleBlur = () => {
      if (examStarted) {
        blurCount++;
        console.log('Window blur - navigation attempt detected');
        setAttemptedNavigations(prev => prev + 1);
        setShowTabWarning(true);
      }
    };
    
    // Handle window focus returning
    const handleFocus = () => {
      // Keep warning visible for 5 seconds when user returns
      if (examStarted && (blurCount > 0 || visibilityCount > 0)) {
        setTimeout(() => {
          setShowTabWarning(false);
        }, 5000);
      }
    };
    
    // Set up event listeners with capture phase to catch events early
    document.addEventListener('visibilitychange', handleVisibilityChange, true);
    window.addEventListener('blur', handleBlur, true);
    window.addEventListener('focus', handleFocus, true);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange, true);
      window.removeEventListener('blur', handleBlur, true);
      window.removeEventListener('focus', handleFocus, true);
    };
  }, [examStarted, setAttemptedNavigations, setShowTabWarning]);

  // SECONDARY ANTI-NAVIGATION DETECTION using Broadcast Channel API
  // This creates a synchronized state across tabs/windows
  useEffect(() => {
    if (!examStarted) return;
    
    // Create a unique channel for this exam
    const channelId = `exam_${examInfo?.id || 'current'}_${startTime.getTime()}`;
    let navChannel;
    
    try {
      // Use Broadcast Channel API if available
      navChannel = new BroadcastChannel(channelId);
      
      // Listen for navigation events
      navChannel.onmessage = (event) => {
        if (event.data.type === 'navigation_attempt') {
          setAttemptedNavigations(prev => prev + 1);
          setShowTabWarning(true);
          
          // Auto-hide warning after 5 seconds
          setTimeout(() => setShowTabWarning(false), 5000);
        }
      };
      
      // Set up navigation detection
      const detectNavigation = () => {
        if (examStarted) {
          try {
            // Notify other instances about navigation attempt
            navChannel.postMessage({ type: 'navigation_attempt', timestamp: Date.now() });
          } catch (err) {
            console.error('Error posting navigation message:', err);
          }
        }
      };
      
      // Monitor navigation events
      window.addEventListener('beforeunload', detectNavigation, true);
      
      return () => {
        window.removeEventListener('beforeunload', detectNavigation, true);
        navChannel.close();
      };
    } catch (err) {
      console.warn('BroadcastChannel not supported, using fallback method');
      
      // Fallback method using localStorage monitoring
      const storageKey = `exam_navigation_${examInfo?.id || 'current'}`;
      
      // Set up interval to check localStorage
      const intervalId = setInterval(() => {
        try {
          const lastCheck = parseInt(localStorage.getItem(storageKey) || '0');
          const now = Date.now();
          
          // Update timestamp
          localStorage.setItem(storageKey, now.toString());
          
          // If timestamp didn't change for a while, it means user navigated away
          if (lastCheck > 0 && now - lastCheck > 2000) {
            setAttemptedNavigations(prev => prev + 1);
            setShowTabWarning(true);
            
            // Auto-hide warning after 5 seconds
            setTimeout(() => setShowTabWarning(false), 5000);
          }
        } catch (err) {
          console.error('Error checking localStorage:', err);
        }
      }, 1000);
      
      return () => {
        clearInterval(intervalId);
        localStorage.removeItem(storageKey);
      };
    }
  }, [examStarted, examInfo, startTime, setAttemptedNavigations, setShowTabWarning]);

  // TERTIARY KEYBOARD SHORTCUT PREVENTION
  useEffect(() => {
    if (!examStarted) return;
    
    // Prevent keyboard shortcuts that might be used to navigate or cheat
    const handleKeyDown = (event) => {
      // Detect Alt+Tab, Alt+Left/Right, Ctrl+Tab, Cmd+Tab, etc.
      if (
        (event.altKey && (event.key === 'Tab' || event.key === 'ArrowLeft' || event.key === 'ArrowRight')) ||
        (event.ctrlKey && (event.key === 'Tab' || event.key === 'w' || event.key === 't' || 
                          event.key === 'h' || event.key === 'n' || event.key === 'j' ||
                          event.key === 'r')) ||
        (event.metaKey && (event.key === 'Tab' || event.key === 'w' || event.key === 't'))
      ) {
        // Prevent default behavior
        event.preventDefault();
        event.stopPropagation();
        
        // Log attempt
        setAttemptedNavigations(prev => prev + 1);
        setShowTabWarning(true);
        
        // Auto-hide warning after 3 seconds
        setTimeout(() => setShowTabWarning(false), 3000);
        return false;
      }
      
      // Block browser refresh and navigation keys
      if (event.key === 'F5' || (event.ctrlKey && event.key === 'r') || 
          (event.altKey && event.key === 'Home')) {
        event.preventDefault();
        event.stopPropagation();
        setShowTabWarning(true);
        setTimeout(() => setShowTabWarning(false), 3000);
        return false;
      }
    };
    
    // Use capture phase to intercept events before they bubble up
    window.addEventListener('keydown', handleKeyDown, true);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [examStarted, setAttemptedNavigations, setShowTabWarning]);
  
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

    // Create result object
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
      date: new Date().toISOString()
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

  // Load exam data on component mount
  useEffect(() => {
    const loadExamData = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log("Loading exam data for subject:", subjectId);
  
        // Get subjects for this exam type
        let subjectData;
        try {
          // Try to get the subject from the exam service first
          const subjects = examService.getSubjects(examType);
          subjectData = subjects.find(s => s.id === subjectId);
        } catch (err) {
          console.error('Error loading from exam service, falling back to utils:', err);
        }
  
        // If that didn't work, fall back to the old method
        if (!subjectData) {
          const subjects = getQuestions(subjectId, examType, year, examId);
          subjectData = subjects.find(s => s.id === subjectId);
        }
  
        // If we still don't have data, create something generic
        if (!subjectData) {
          subjectData = {
            id: subjectId,
            name: subjectId.charAt(0).toUpperCase() + subjectId.slice(1).replace(/_/g, ' '),
            questionCount: 0,
            timeLimit: EXAM.DEFAULT_TIME_LIMIT,
            icon: '📝',
            description: 'Practice exam'
          };
        }
  
        // Set exam info
        setExamInfo({
          id: subjectData.id || '',
          name: subjectData.name || 'Exam',
          timeLimit: subjectData.timeLimit || EXAM.DEFAULT_TIME_LIMIT,
          icon: subjectData.icon || '📝',
          type: examType || 'practice',
          year: year || 'N/A',
          examId: examId || 'sample',
          questionCount: subjectData.questionCount || 0
        });
  
        // Load questions
        const examQuestions = getQuestions(subjectId, examType, year, examId);
        
        if (!Array.isArray(examQuestions) || examQuestions.length === 0) {
          setError('No questions available for this exam');
          setLoading(false);
          return;
        }
        
        setQuestions(examQuestions);
        
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
            {!showCompletionDialog && !showAnimatedCelebration && (
              <ImprovedExamInterface 
                examInfo={examInfo}
                questions={questions}
                onSubmitExam={handleSubmitExam}
              />
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
                <ExamResultSummary result={examResult} />
                
                <div className="modal-buttons">
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