import './UserProfilePage.css';

import React, { useEffect, useState } from 'react';

import { Button } from '../../components/common';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const UserProfilePage = () => {
  const { currentUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    bio: '',
    location: '',
    language: 'English',
    notifications: {
      examReminders: true,
      weeklySummary: true,
      newContent: false,
      accountUpdates: true,
      trialStatus: true,
      promotional: false
    }
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState({ type: '', text: '' });
  const [trialInfo, setTrialInfo] = useState(null);

  // Load user data and trial info when component mounts
  useEffect(() => {
    if (currentUser) {
      setIsLoading(true);

      // Get trial information
      const storedTrialInfo = localStorage.getItem('trial_info');
      if (storedTrialInfo) {
        try {
          const { startDate, trialDays } = JSON.parse(storedTrialInfo);
          const trialStartDate = new Date(startDate);
          const currentDate = new Date();
          const daysPassed = Math.floor((currentDate - trialStartDate) / (1000 * 60 * 60 * 24));
          const daysRemaining = trialDays - daysPassed;
          
          setTrialInfo({
            isActive: daysRemaining > 0,
            daysRemaining: Math.max(0, daysRemaining),
            startDate: formatDate(startDate),
            endDate: formatDate(new Date(trialStartDate.getTime() + trialDays * 24 * 60 * 60 * 1000))
          });
        } catch (error) {
          console.error('Error parsing trial info:', error);
        }
      }

      // Simulate API call to fetch user settings
      setTimeout(() => {
        const names = currentUser.fullName?.split(' ') || ['', ''];

        setFormData(prevData => ({
          ...prevData,
          firstName: names[0] || '',
          lastName: names.slice(1).join(' ') || '',
          email: currentUser.email || '',
          username: currentUser.username || '',
          bio: currentUser.bio || '',
          location: currentUser.location || ''
        }));

        setIsLoading(false);
      }, 500);
    }
  }, [currentUser]);

  // Reset save message after timeout
  useEffect(() => {
    if (saveMessage.text) {
      const timer = setTimeout(() => {
        setSaveMessage({ type: '', text: '' });
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [saveMessage]);

  // Handle URL hash for direct tab access
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    const validTabs = ['profile', 'account', 'notifications', 'subscription', 'privacy'];

    if (hash && validTabs.includes(hash)) {
      setActiveTab(hash);
    }
  }, []);

  // Update URL when tab changes
  useEffect(() => {
    window.history.replaceState(
      null,
      document.title,
      `${window.location.pathname}#${activeTab}`
    );
  }, [activeTab]);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get user initials for avatar
  const getInitials = () => {
    if (!currentUser?.fullName) return '?';

    const names = currentUser.fullName.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return currentUser.fullName[0].toUpperCase();
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { id, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  // Handle toggle switch changes
  const handleToggleChange = (setting) => {
    setFormData(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [setting]: !prev.notifications[setting]
      }
    }));
  };

  // Handle form submission
  const handleSaveChanges = (e) => {
    e.preventDefault();
    setIsSaving(true);

    // Simulate API call to save settings
    setTimeout(() => {
      setIsSaving(false);
      setSaveMessage({
        type: 'success',
        text: 'Your settings have been saved successfully!'
      });

      console.log('Saving settings:', formData);
    }, 800);
  };

  // Handle logout with confirmation
  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      logout();
    }
  };

  // Profile summary component
  const ProfileSummaryCard = () => (
    <div className="profile-card">
      <div className="profile-header">
        <div className="avatar">{getInitials()}</div>
        <div className="profile-info">
          <h1 className="profile-name">{currentUser?.fullName || 'User'}</h1>
          <p className="profile-username">@{currentUser?.username}</p>
          <p className="profile-email">{currentUser?.email}</p>
          
          {trialInfo && trialInfo.isActive && (
            <div className="trial-status">
              <i className="fas fa-clock"></i>
              <span>{trialInfo.daysRemaining} days left in trial</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="page-container">
        <div className="content-wrapper">
          <div style={{ textAlign: 'center', padding: '3rem 0' }}>
            <p>Loading user information...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="user-profile-page">
      <div className="page-container">
        <div className="content-wrapper">
          {/* Header with Save Message */}
          <div className="page-header">
            <h1 className="page-title">User Profile & Settings</h1>
            {saveMessage.text && (
              <div className={`alert-message ${saveMessage.type}`}>
                {saveMessage.text}
              </div>
            )}
          </div>

          {/* Profile Summary Card - Always visible */}
          <ProfileSummaryCard />

          {/* Tabs Navigation */}
          <div className="tabs-container">
            <div className="tabs-list">
              <button
                className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => setActiveTab('profile')}
              >
                <span className="tab-icon">👤</span> Profile
              </button>
              <button
                className={`tab-button ${activeTab === 'account' ? 'active' : ''}`}
                onClick={() => setActiveTab('account')}
              >
                <span className="tab-icon">🔒</span> Account
              </button>
              <button
                className={`tab-button ${activeTab === 'notifications' ? 'active' : ''}`}
                onClick={() => setActiveTab('notifications')}
              >
                <span className="tab-icon">🔔</span> Notifications
              </button>
              <button
                className={`tab-button ${activeTab === 'subscription' ? 'active' : ''}`}
                onClick={() => setActiveTab('subscription')}
              >
                <span className="tab-icon">💳</span> Subscription
              </button>
              <button
                className={`tab-button ${activeTab === 'privacy' ? 'active' : ''}`}
                onClick={() => setActiveTab('privacy')}
              >
                <span className="tab-icon">🛡️</span> Privacy
              </button>
            </div>

            {/* Profile Tab Content */}
            <div className={`tab-content ${activeTab === 'profile' ? 'active' : ''}`}>
              <form onSubmit={handleSaveChanges}>
                <div className="card">
                  <div className="card-header">
                    <h2 className="card-title">Profile Information</h2>
                    <p className="card-description">Update your personal details and profile picture</p>
                  </div>
                  <div className="card-content">
                    <div className="form-section">
                      <div className="form-row">
                        <div className="form-group">
                          <label className="form-label" htmlFor="firstName">First Name</label>
                          <input
                            className="form-input"
                            id="firstName"
                            type="text"
                            value={formData.firstName}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label" htmlFor="lastName">Last Name</label>
                          <input
                            className="form-input"
                            id="lastName"
                            type="text"
                            value={formData.lastName}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="form-label" htmlFor="email">Email Address</label>
                        <input
                          className="form-input"
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label" htmlFor="username">Username</label>
                        <input
                          className="form-input"
                          id="username"
                          type="text"
                          value={formData.username}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <hr className="separator" />

                    <div className="form-section">
                      <h3 className="section-title">Additional Information</h3>

                      <div className="form-group">
                        <label className="form-label" htmlFor="bio">Bio</label>
                        <textarea
                          className="form-textarea"
                          id="bio"
                          placeholder="Tell us a bit about yourself..."
                          value={formData.bio}
                          onChange={handleInputChange}
                        ></textarea>
                        <p className="help-text">This will be displayed on your public profile.</p>
                      </div>

                      <div className="form-group">
                        <label className="form-label" htmlFor="location">Location</label>
                        <input
                          className="form-input"
                          id="location"
                          type="text"
                          placeholder="City, Country"
                          value={formData.location}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="card-footer">
                    <Button variant="primary" type="submit" disabled={isSaving}>
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                </div>
              </form>
            </div>
            
            {/* Account Tab Content */}
            <div className={`tab-content ${activeTab === 'account' ? 'active' : ''}`}>
              <form onSubmit={handleSaveChanges}>
                <div className="card">
                  <div className="card-header">
                    <h2 className="card-title">Account Settings</h2>
                    <p className="card-description">Manage your account security and preferences</p>
                  </div>
                  <div className="card-content">
                    <div className="form-section">
                      <h3 className="section-title">Password</h3>

                      <div className="form-group">
                        <label className="form-label" htmlFor="currentPassword">Current Password</label>
                        <input
                          className="form-input"
                          id="currentPassword"
                          type="password"
                          placeholder="Enter your current password"
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label" htmlFor="newPassword">New Password</label>
                        <input
                          className="form-input"
                          id="newPassword"
                          type="password"
                          placeholder="Enter new password"
                        />
                        <p className="help-text">Password must be at least 8 characters long</p>
                      </div>

                      <div className="form-group">
                        <label className="form-label" htmlFor="confirmPassword">Confirm Password</label>
                        <input
                          className="form-input"
                          id="confirmPassword"
                          type="password"
                          placeholder="Confirm new password"
                        />
                      </div>
                    </div>

                    <hr className="separator" />

                    <div className="form-section">
                      <h3 className="section-title">Account Information</h3>
                      <div className="info-card">
                        <div className="info-item">
                          <div className="info-label">Username:</div>
                          <div className="info-value">{currentUser?.username}</div>
                        </div>
                        <div className="info-item">
                          <div className="info-label">Email:</div>
                          <div className="info-value">{currentUser?.email}</div>
                        </div>
                        <div className="info-item">
                          <div className="info-label">Account Created:</div>
                          <div className="info-value">
                            {formatDate(currentUser?.createdAt)}
                          </div>
                        </div>
                      </div>
                    </div>

                    {trialInfo && (
                      <>
                        <hr className="separator" />
                        <div className="form-section">
                          <h3 className="section-title">Trial Status</h3>
                          <div className="info-card">
                            <div className="info-item">
                              <div className="info-label">Status:</div>
                              <div className="info-value">
                                {trialInfo.isActive
                                  ? <span className="status-active">Active</span>
                                  : <span className="status-expired">Expired</span>}
                              </div>
                            </div>
                            {trialInfo.isActive && (
                              <div className="info-item">
                                <div className="info-label">Days Remaining:</div>
                                <div className="info-value">
                                  <strong>{trialInfo.daysRemaining}</strong> days
                                </div>
                              </div>
                            )}
                            <div className="info-item">
                              <div className="info-label">Start Date:</div>
                              <div className="info-value">{trialInfo.startDate}</div>
                            </div>
                            <div className="info-item">
                              <div className="info-label">End Date:</div>
                              <div className="info-value">{trialInfo.endDate}</div>
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    <hr className="separator" />

                    <div className="form-section">
                      <h3 className="section-title">Language Preference</h3>

                      <div className="form-group">
                        <label className="form-label" htmlFor="language">Language</label>
                        <select className="form-input" id="language" value={formData.language} onChange={handleInputChange}>
                          <option value="English">English</option>
                          <option value="Spanish">Spanish</option>
                          <option value="French">French</option>
                          <option value="German">German</option>
                          <option value="Japanese">Japanese</option>
                        </select>
                      </div>
                    </div>

                    <hr className="separator" />

                    <div className="button-group">
                      <Button variant="secondary" size="medium" onClick={() => alert('Functionality coming soon!')}>
                        Change Email
                      </Button>
                      <Button variant="secondary" size="medium" onClick={handleLogout}>
                        Logout
                      </Button>
                    </div>
                  </div>
                  <div className="card-footer">
                    <Button variant="primary" type="submit" disabled={isSaving}>
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                </div>
              </form>
            </div>

            {/* Notifications Tab Content */}
            <div className={`tab-content ${activeTab === 'notifications' ? 'active' : ''}`}>
              <form onSubmit={handleSaveChanges}>
                <div className="card">
                  <div className="card-header">
                    <h2 className="card-title">Notification Preferences</h2>
                    <p className="card-description">Control how and when you receive notifications</p>
                  </div>
                  <div className="card-content">
                    <div className="form-section">
                      <h3 className="section-title">Email Notifications</h3>

                      <div className="switch-container">
                        <div className="switch-label">
                          <label className="form-label" style={{ margin: 0 }}>Exam Reminders</label>
                          <p className="help-text">Receive reminders about upcoming exams</p>
                        </div>
                        <label className="toggle-switch">
                          <input
                            type="checkbox"
                            checked={formData.notifications.examReminders}
                            onChange={() => handleToggleChange('examReminders')}
                          />
                          <span></span>
                        </label>
                      </div>

                      <div className="switch-container">
                        <div className="switch-label">
                          <label className="form-label" style={{ margin: 0 }}>Weekly Progress Summary</label>
                          <p className="help-text">Get a weekly summary of your learning progress</p>
                        </div>
                        <label className="toggle-switch">
                          <input
                            type="checkbox"
                            checked={formData.notifications.weeklySummary}
                            onChange={() => handleToggleChange('weeklySummary')}
                          />
                          <span></span>
                        </label>
                      </div>

                      <div className="switch-container">
                        <div className="switch-label">
                          <label className="form-label" style={{ margin: 0 }}>New Content Alerts</label>
                          <p className="help-text">Get notified when new courses or materials are added</p>
                        </div>
                        <label className="toggle-switch">
                          <input
                            type="checkbox"
                            checked={formData.notifications.newContent}
                            onChange={() => handleToggleChange('newContent')}
                          />
                          <span></span>
                        </label>
                      </div>

                      <div className="switch-container">
                        <div className="switch-label">
                          <label className="form-label" style={{ margin: 0 }}>Account Updates</label>
                          <p className="help-text">Receive notifications about account changes</p>
                        </div>
                        <label className="toggle-switch">
                          <input
                            type="checkbox"
                            checked={formData.notifications.accountUpdates}
                            onChange={() => handleToggleChange('accountUpdates')}
                          />
                          <span></span>
                        </label>
                      </div>

                      <div className="switch-container">
                        <div className="switch-label">
                          <label className="form-label" style={{ margin: 0 }}>Trial Status Updates</label>
                          <p className="help-text">Get reminders about your trial expiration</p>
                        </div>
                        <label className="toggle-switch">
                          <input
                            type="checkbox"
                            checked={formData.notifications.trialStatus}
                            onChange={() => handleToggleChange('trialStatus')}
                          />
                          <span></span>
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="card-footer">
                    <Button variant="primary" type="submit" disabled={isSaving}>
                      {isSaving ? 'Saving...' : 'Save Preferences'}
                    </Button>
                  </div>
                </div>
              </form>
            </div>

            {/* Subscription tab content - kept same as original */}
            <div className={`tab-content ${activeTab === 'subscription' ? 'active' : ''}`}>
              <div className="card">
                <div className="card-header">
                  <h2 className="card-title">Subscription Plan</h2>
                  <p className="card-description">Manage your subscription and billing information</p>
                </div>
                <div className="card-content">
                  <div className="form-section">
                    <h3 className="section-title">Current Plan</h3>

                    <div className="plan-card active-plan">
                      <div className="plan-header">
                        <div>
                          <h4 className="plan-title">Pro Plan</h4>
                          <p className="plan-subtitle">Billed monthly · Renews on May 15, 2025</p>
                        </div>
                        <div className="plan-badge">Active</div>
                      </div>
                    </div>

                    <div className="button-group">
                      <Button variant="secondary" size="small">Change Plan</Button>
                      <Button variant="secondary" size="small">Billing History</Button>
                      <Button variant="secondary" size="small">Update Payment</Button>
                    </div>
                  </div>

                  <hr className="separator" />

                  <div className="form-section">
                    <h3 className="section-title">Available Plans</h3>

                    <div className="plans-container">
                      <div className="plan-option">
                        <div className="plan-option-content">
                          <div>
                            <h4 className="plan-title">Basic Plan</h4>
                            <p className="plan-subtitle">For individual learners</p>
                            <ul className="plan-features">
                              <li>Access to basic courses</li>
                              <li>Standard support</li>
                              <li>1 device</li>
                            </ul>
                            <p className="plan-price">$9.99/month</p>
                          </div>
                          <div>
                            <input type="radio" name="plan" id="basic" />
                          </div>
                        </div>
                      </div>

                      <div className="plan-option recommended">
                        <div className="plan-option-content">
                          <div>
                            <div className="plan-tag">MOST POPULAR</div>
                            <h4 className="plan-title">Pro Plan</h4>
                            <p className="plan-subtitle">For serious learners</p>
                            <ul className="plan-features">
                              <li>Access to all courses</li>
                              <li>Priority support</li>
                              <li>Up to 3 devices</li>
                              <li>Offline downloads</li>
                            </ul>
                            <p className="plan-price">$19.99/month</p>
                          </div>
                          <div>
                            <input type="radio" name="plan" id="pro" checked={true} readOnly />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-footer">
                  <Button variant="primary" disabled={isSaving}>
                    {isSaving ? 'Updating...' : 'Update Subscription'}
                  </Button>
                </div>
              </div>
            </div>

            {/* Privacy tab content - kept same as original */}
            <div className={`tab-content ${activeTab === 'privacy' ? 'active' : ''}`}>
              <div className="card">
                <div className="card-header">
                  <h2 className="card-title">Privacy Settings</h2>
                  <p className="card-description">Control your data and privacy preferences</p>
                </div>
                <div className="card-content">
                  <div className="form-section">
                    <h3 className="section-title">Profile Visibility</h3>

                    <div className="switch-container">
                      <div className="switch-label">
                        <label className="form-label" style={{ margin: 0 }}>Public Profile</label>
                        <p className="help-text">Allow other users to see your profile and progress</p>
                      </div>
                      <label className="toggle-switch">
                        <input type="checkbox" checked={true} readOnly />
                        <span></span>
                      </label>
                    </div>

                    <div className="switch-container">
                      <div className="switch-label">
                        <label className="form-label" style={{ margin: 0 }}>Show Learning Activity</label>
                        <p className="help-text">Share your learning activity on your profile</p>
                      </div>
                      <label className="toggle-switch">
                        <input type="checkbox" checked={true} readOnly />
                        <span></span>
                      </label>
                    </div>

                    <div className="switch-container">
                      <div className="switch-label">
                        <label className="form-label" style={{ margin: 0 }}>Show Achievements</label>
                        <p className="help-text">Display your badges and certificates on your profile</p>
                      </div>
                      <label className="toggle-switch">
                        <input type="checkbox" checked={true} readOnly />
                        <span></span>
                      </label>
                    </div>
                  </div>

                  <hr className="separator" />

                  <div className="form-section">
                    <h3 className="section-title">Data Management</h3>

                    <Button variant="secondary" size="small" style={{ marginBottom: '1rem' }}>Download My Data</Button>

                    <div className="danger-zone">
                      <h4 className="danger-title">Danger Zone</h4>
                      <p>Once you delete your account, there is no going back. Please be certain.</p>
                      <Button 
                        variant="secondary" 
                        size="small" 
                        style={{ backgroundColor: 'rgba(var(--error-rgb), 0.1)', color: 'var(--error)', borderColor: 'var(--error)' }}
                      >
                        Delete My Account
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="card-footer">
                  <Button variant="primary" type="submit" disabled={isSaving}>
                    {isSaving ? 'Saving...' : 'Save Privacy Settings'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;