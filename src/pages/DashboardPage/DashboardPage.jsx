import './DashboardPage.css';

import { Link, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { getExamResults, getSubjects } from '../../utils/examUtils';

import { Button } from '../../components/common';
import styled from 'styled-components';
import { useAuth } from '../../contexts/AuthContext';

// Styled components
const DashboardContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
`;

const DashboardHeader = styled.div`
  margin-bottom: 2.5rem;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: var(--dark);
  margin-bottom: 1rem;
`;

const HighlightedName = styled.span`
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 0;
    width: 100%;
    height: 4px;
    background: var(--gradient-fun);
    border-radius: var(--radius-full);
  }
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: var(--dark-gray);
  max-width: 700px;
  margin: 1.5rem auto 0;
`;

/**
 * Enhanced Dashboard page with detailed statistics and progress tracking
 */
const DashboardPage = () => {
  const { currentUser } = useAuth();
  const firstName = currentUser?.fullName?.split(' ')[0] || 'Student';
  const [examResults, setExamResults] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [streakData, setStreakData] = useState({
    currentStreak: 0,
    longestStreak: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [userStats, setUserStats] = useState({
    totalExams: 0,
    avgScore: 0,
    completedSubjects: 0,
    totalQuestions: 0,
    correctAnswers: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Load exam results and calculate statistics
    const loadUserData = () => {
      // Get all exam results
      const results = getExamResults();
      setExamResults(results);

      // Get all subjects
      const allSubjects = getSubjects();
      setSubjects(allSubjects);

      // Process recent activity (last 5 exams)
      const sortedResults = [...results].sort((a, b) =>
        new Date(b.date) - new Date(a.date)
      );
      setRecentActivity(sortedResults.slice(0, 5));

      // Calculate user statistics
      if (results.length > 0) {
        // Calculate average score
        const totalScore = results.reduce((sum, result) => sum + result.score, 0);
        const avgScore = totalScore / results.length;

        // Calculate total questions and correct answers
        const totalQuestions = results.reduce((sum, result) => sum + result.totalQuestions, 0);
        const correctAnswers = results.reduce((sum, result) => sum + result.correctCount, 0);

        // Count unique subjects completed
        const uniqueSubjects = new Set(results.map(result => result.subject)).size;

        setUserStats({
          totalExams: results.length,
          avgScore: avgScore.toFixed(1),
          completedSubjects: uniqueSubjects,
          totalQuestions,
          correctAnswers
        });
      }

      // Get streak data from localStorage
      try {
        const streakDataStr = localStorage.getItem('streak_data');
        if (streakDataStr) {
          const data = JSON.parse(streakDataStr);
          setStreakData({
            currentStreak: data.currentStreak || 0,
            longestStreak: data.longestStreak || 0
          });
        }
      } catch (error) {
        console.error('Error loading streak data:', error);
      }
    };

    loadUserData();
  }, []);

  // Calculate progress percentage for overall completion
  const calculateProgress = () => {
    if (subjects.length === 0) return 0;

    // Define what "progress" means - here we'll use percentage of subjects tried
    const subjectsTried = new Set(examResults.map(result => result.subject)).size;
    return Math.min(Math.round((subjectsTried / subjects.length) * 100), 100);
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Get icon for subject
  const getSubjectIcon = (subjectId) => {
    const subject = subjects.find(s => s.id === subjectId);
    return subject?.icon || '📝';
  };

  return (
    <div className="dashboard-page">
      <DashboardContainer>
        <DashboardHeader>
          <Title>
            Welcome to your Dashboard, <HighlightedName>{firstName}</HighlightedName>
          </Title>
          <Subtitle>
            Track your exam performance and continue your preparation journey
          </Subtitle>
        </DashboardHeader>

        {/* Main Dashboard Content */}
        <div className="dashboard-grid">
          {/* Progress Overview Card */}
          <div className="dashboard-card progress-card">
            <div className="card-header">
              <h2>Your Progress</h2>
            </div>
            <div className="card-content">
              <div className="progress-circle">
                <svg viewBox="0 0 36 36" className="progress-circle-svg">
                  {/* Add SVG gradient definition here */}
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="var(--primary)" />
                      <stop offset="100%" stopColor="var(--accent)" />
                    </linearGradient>
                  </defs>
                  <path
                    className="progress-circle-bg"
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="progress-circle-fill"
                    strokeDasharray={`${calculateProgress()}, 100`}
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <text x="18" y="20.35" className="progress-circle-text">
                    {calculateProgress()}%
                  </text>
                </svg>
              </div>
              <div className="stats-grid">
                <div className="stat-item">
                  <div className="stat-value">{userStats.totalExams}</div>
                  <div className="stat-label">Exams Completed</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">{userStats.avgScore}%</div>
                  <div className="stat-label">Average Score</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">{userStats.completedSubjects}</div>
                  <div className="stat-label">Subjects Tried</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">{userStats.correctAnswers}</div>
                  <div className="stat-label">Correct Answers</div>
                </div>
              </div>
            </div>
          </div>

          {/* Streak Card */}
          <div className="dashboard-card streak-card">
            <div className="card-header">
              <h2>Daily Streak</h2>
            </div>
            <div className="card-content">
              <div className="streak-container">
                <div className="streak-item current-streak">
                  <div className="streak-value">
                    {streakData.currentStreak}
                    <span className="streak-icon">🔥</span>
                  </div>
                  <div className="streak-label">Current Streak</div>
                </div>
                <div className="streak-divider"></div>
                <div className="streak-item longest-streak">
                  <div className="streak-value">{streakData.longestStreak}</div>
                  <div className="streak-label">Longest Streak</div>
                </div>
              </div>
              <div className="streak-message">
                {streakData.currentStreak > 0 ? (
                  <p>Great job! You've been practicing for {streakData.currentStreak} day{streakData.currentStreak !== 1 ? 's' : ''} in a row!</p>
                ) : (
                  <p>Complete an exam today to start your practice streak!</p>
                )}
              </div>
            </div>
          </div>

          {/* Recent Activity Card */}
          <div className="dashboard-card activity-card">
            <div className="card-header">
              <h2>Recent Exams</h2>
            </div>
            <div className="card-content">
              {recentActivity.length > 0 ? (
                <div className="activity-list">
                  {recentActivity.map((activity, index) => (
                    <div className="activity-item" key={index}>
                      <div className="activity-icon">
                        {getSubjectIcon(activity.subject)}
                      </div>
                      <div className="activity-details">
                        <div className="activity-title">
                          {activity.subjectName} Exam
                        </div>
                        <div className="activity-meta">
                          {formatDate(activity.date)} • Score: {activity.score}%
                        </div>
                      </div>
                      <Link
                        to={`/results/${activity.subject}/${new Date(activity.date).getTime()}`}
                        className="activity-action"
                      >
                        View Results
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">📝</div>
                  <p>No exams completed yet. Start your preparation by taking an exam!</p>
                </div>
              )}
            </div>
          </div>
        </div>
        <PracticeSection subjects={subjects} navigate={navigate} />
      </DashboardContainer>
    </div>
  );
};

// Redesigned Practice Section Component
/// Updated Practice Section for Dashboard
// Add this component to your DashboardPage.jsx file

const PracticeSection = ({ subjects, navigate }) => {
  // Display featured subjects (up to 3)
  const featuredSubjects = subjects.slice(0, 3);
  
  return (
    <div className="practice-section">
      <h2 className="section-title">Ready to Practice?</h2>
      <p className="section-description">
        Choose a subject or browse all exams to continue your learning journey
      </p>
      
      <div className="practice-cards-container">
        {featuredSubjects.map(subject => (
          <div 
            className="practice-card" 
            key={subject.id}
            onClick={() => navigate(`/exam/${subject.id}`)}
          >
            <div className="practice-card-header">
              <div className="practice-card-icon">{subject.icon || '📝'}</div>
              <h3 className="practice-card-title">{subject.name}</h3>
            </div>
            <div className="practice-card-content">
              <p className="practice-card-description">
                {subject.description || `Practice your ${subject.name} skills with our curated questions`}
              </p>
              <button className="practice-card-button">
                Start Practice
                <span className="button-arrow">→</span>
              </button>
            </div>
          </div>
        ))}
        
        <div className="practice-card browse-card" onClick={() => navigate('/activities')}>
          <div className="browse-card-content">
            <div className="browse-icon">🔍</div>
            <h3 className="browse-title">Browse All Exams</h3>
            <p className="browse-description">
              Explore our full collection of practice exams across all subjects
            </p>
            <div className="browse-arrow">→</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;