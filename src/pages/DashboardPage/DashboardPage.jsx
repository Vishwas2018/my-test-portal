import './DashboardPage.css';

import Button from '../../components/common/Button';
import React from 'react';
import { SubjectCard } from '../../components/ExamInterface';
import { getSubjects } from '../../utils/examUtils';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const subjects = getSubjects();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="dashboard-page">
      <div className="container dashboard-container">
        <div className="dashboard-welcome">
          <div className="welcome-card">
            <h1>Welcome to your Dashboard, <span className="highlight">{currentUser?.username}</span>!</h1>
            <p className="welcome-message">
              You've successfully logged into your Portal account. This is your personal dashboard where you can manage your account and access all the features of Portal.
            </p>
            
            <div className="user-info-box">
              <h3>Your Account Information</h3>
              <div className="user-info-item">
                <span className="label">Username:</span>
                <span className="value">{currentUser?.username}</span>
              </div>
              <div className="user-info-item">
                <span className="label">Email:</span>
                <span className="value">{currentUser?.email}</span>
              </div>
              <div className="user-info-item">
                <span className="label">Account Created:</span>
                <span className="value">
                  {currentUser?.createdAt 
                    ? new Date(currentUser.createdAt).toLocaleDateString() 
                    : 'Unknown'}
                </span>
              </div>
            </div>
            
            <div className="dashboard-actions">
              <Button variant="secondary" size="medium" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
        
        <div className="dashboard-features">
          <h2>Available Exams</h2>
          <div className="features-grid exam-grid">
            {subjects.map(subject => (
              <SubjectCard key={subject.id} subject={subject} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;