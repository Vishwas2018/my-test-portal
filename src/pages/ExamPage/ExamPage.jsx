// src/pages/ExamPage/ExamPage.jsx
import './ExamPage.css';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { getQuestions, getSubjects, saveExamResult } from '../../utils/examUtils';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { Button } from '../../components/common';
import ConfettiEffect from '../../components/ExamInterface/ConfettiEffect/ConfettiEffect';
import ExamInterface from '../../components/ExamInterface/ExamInterface';

/**
 * ExamPage component handles the exam-taking experience
 * It manages loading exam data, anti-cheating measures, and result submission
 */
const ExamPage = () => {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Refs for anti-cheating mechanisms
  const historyRef = useRef(window.history);
  const navigateRef = useRef(navigate);

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
  
  // Dialog state
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showCompletionDialog, setShowCompletionDialog] = useState(false);
  const [examStarted, setExamStarted] = useState(false);
  
  // Anti-cheating state
  const [showTabWarning, setShowTabWarning] = useState(false);
  const [attemptedNavigations, setAttemptedNavigations] = useState(0);

  // Handle back/forward browser navigation
  useEffect(() => {
    const handlePopState = (event) => {
      if (examStarted) {
        // Prevent navigation during exam
        event.preventDefault();
        window.history.pushState(null, "", window.location.pathname + window.location.search);
        
        // Record navigation attempt
        setAttemptedNavigations(prev => prev + 1);
        setShowTabWarning(true);
        
        // Auto-hide warning after 3 seconds
        setTimeout(() => setShowTabWarning(false), 3000);
        
        return false;
      }
    };

    // Push initial state to ensure we can capture back button
    window.history.pushState(null, "", window.location.pathname + window.location.search);
    
    // Set up event listeners
    window.addEventListener('popstate', handlePopState);
    
    // Clean up event listeners
    return () => window.removeEventListener('popstate', handlePopState);
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
    
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [examStarted]);
  
  // Disable links within the page once exam started
  useEffect(() => {
    if (!examStarted) return;
    
    const handleClick = (e) => {
      // Check if the clicked element is a link or inside a link
      const link = e.target.closest('a');
      if (link && !link.hasAttribute('data-exam-link')) {
        e.preventDefault();
        e.stopPropagation();
        
        setAttemptedNavigations(prev => prev + 1);
        setShowTabWarning(true);
        
        setTimeout(() => setShowTabWarning(false), 3000);
        
        return false;
      }
    };
    
    document.addEventListener('click', handleClick, true);
    
    return () => document.removeEventListener('click', handleClick, true);
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
    
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [examStarted, showCompletionDialog]);

  // Load exam data on component mount
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
  }, [examInfo, questions, startTime, attemptedNavigations]);

  // Event handlers
  const handleStartExam = useCallback(() => {
    setExamStarted(true);
    setShowConfirmation(false);
  }, []);
  
  const handleCancelExam = useCallback(() => {
    navigate(-1); // Go back to previous page
  }, [navigate]);

  const handleViewResults = useCallback(() => {
    // Navigate to results page
    navigate(`/results/${examInfo.id}/${new Date().getTime()}`);
  }, [navigate, examInfo]);

  // Loading state
  if (loading) {
    return (
      <div className="exam-page">
        <div className="exam-page-container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <h2>Loading exam...</h2>
            <p>Please wait while we prepare your questions.</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="exam-page">
        <div className="exam-page-container">
          <div className="error-container">
            <p className="error-text">{error}</p>
            <Button onClick={() => navigate('/')}>
              Return to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // No questions available
  if (!examInfo || questions.length === 0) {
    return (
      <div className="exam-page">
        <div className="exam-page-container">
          <div className="error-container">
            <p className="error-text">No questions available for this exam.</p>
            <Button onClick={() => navigate('/')}>
              Return to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Main render - exam interface with dialogs
  return (
    <div className="exam-page">
      <div className="exam-page-container">
        {/* Start Exam Confirmation Dialog */}
        {showConfirmation && (
          <div className="modal-backdrop">
            <div className="modal-content">
              <h2 className="modal-title">Start Exam</h2>
              <p>You are about to start the following exam:</p>
              
              <ul className="exam-info-list">
                <li className="exam-info-item">
                  <span className="info-label">Subject:</span>
                  <span className="info-value">{examInfo.name}</span>
                </li>
                {examInfo.type && (
                  <li className="exam-info-item">
                    <span className="info-label">Exam Type:</span>
                    <span className="info-value">{examInfo.type.toUpperCase()}</span>
                  </li>
                )}
                {examInfo.year && (
                  <li className="exam-info-item">
                    <span className="info-label">Year Level:</span>
                    <span className="info-value">Year {examInfo.year}</span>
                  </li>
                )}
                <li className="exam-info-item">
                  <span className="info-label">Questions:</span>
                  <span className="info-value">{questions.length}</span>
                </li>
                <li className="exam-info-item">
                  <span className="info-label">Time Limit:</span>
                  <span className="info-value">
                    {examInfo.timeLimit ? `${examInfo.timeLimit} minutes` : 'No time limit'}
                  </span>
                </li>
              </ul>
              
              <p>
                <strong>Important:</strong> Once you start, you cannot leave this page until 
                you submit the exam. Attempting to switch tabs, use the back button, or close 
                the window will be recorded.
              </p>
              
              <p>Are you ready to begin?</p>
              
              <div className="modal-buttons">
                <Button 
                  variant="secondary" 
                  onClick={handleCancelExam}
                >
                  Cancel
                </Button>
                <Button onClick={handleStartExam}>
                  Start Exam
                </Button>
              </div>
            </div>
          </div>
        )}
        
        {/* Navigation warning banner */}
        {showTabWarning && (
          <div className="warning-banner">
            ⚠️ Navigation detected! Please stay on this page until you complete the exam. 
            This attempt has been recorded.
          </div>
        )}
        
        {/* Exam interface - only shown after confirmation */}
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
            <div className="modal-backdrop">
              <div className="modal-content">
                <div className="completion-emoji">🎉</div>
                <h2 className="modal-title">Congratulations!</h2>
                <p>You've completed the {examInfo.name} exam!</p>
                <div className="modal-buttons">
                  <Button 
                    onClick={handleViewResults} 
                    data-exam-link="true"
                  >
                    See My Results
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ExamPage;