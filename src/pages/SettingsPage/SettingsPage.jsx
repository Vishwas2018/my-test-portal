import './SettingsPage.css';

import React, { useEffect, useState } from 'react';

import { Button } from '../../components/common';
import { useAuth } from '../../contexts/AuthContext';

const SettingsPage = () => {
  const { currentUser } = useAuth();
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

  // Load user data when component mounts or currentUser changes
  useEffect(() => {
    if (currentUser) {
      setIsLoading(true);

      // Simulate API call to fetch user settings
      setTimeout(() => {
        const names = currentUser.fullName?.split(' ') || ['', ''];

        // Use functional update pattern to avoid dependency on formData
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

  // Handle URL hash for direct tab access - runs only once on mount
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

  // Get user initials for avatar
  const getInitials = () => {
    if (!currentUser?.fullName) return '?';

    const names = currentUser.fullName.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return currentUser.fullName[0].toUpperCase();
  };

  return (
    <div className="settings-page">
      <div className="settings-container">
        <div className="settings-header">
          <h1 className="title">Settings</h1>
          <p className="subtitle">
            Manage your account preferences, profile information, and notification settings
          </p>

          {saveMessage.text && (
            <div className={`alert-message ${saveMessage.type}`}>
              {saveMessage.text}
            </div>
          )}
        </div>

        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '3rem 0' }}>
            <p>Loading your settings...</p>
          </div>
        ) : (
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
                        <div className="avatar-container">
                          <div className="avatar">{getInitials()}</div>
                          <Button variant="secondary" size="small" type="button">Change Photo</Button>
                        </div>

                        <div>
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
                    <Button variant="secondary" type="button" onClick={() => setActiveTab('account')}>Next: Account Settings</Button>
                    <Button variant="primary" type="submit" disabled={isSaving}>
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                </div>
              </form>
            </div>
            
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
                      <h3 className="section-title">Two-Factor Authentication</h3>

                      <div className="switch-container">
                        <div className="switch-label">
                          <label className="form-label" style={{ margin: 0 }}>Enable 2FA</label>
                          <p className="help-text">Add an extra layer of security to your account</p>
                        </div>
                        <label className="toggle-switch">
                          <input type="checkbox" />
                          <span></span>
                        </label>
                      </div>
                    </div>

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
                  </div>
                  <div className="card-footer">
                    <Button variant="primary" type="submit" disabled={isSaving}>
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                </div>
              </form>
            </div>

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
                    </div>
                  </div>
                  <div className="card-footer">
                    <Button variant="secondary" type="button" onClick={() => setActiveTab('account')}>Back to Account</Button>
                    <Button variant="primary" type="submit" disabled={isSaving}>
                      {isSaving ? 'Saving...' : 'Save Preferences'}
                    </Button>
                  </div>
                </div>
              </form>
            </div>

            {/* Subscription tab */}
            <div className={`tab-content ${activeTab === 'subscription' ? 'active' : ''}`}>
              <div className="card">
                <div className="card-header">
                  <h2 className="card-title">Subscription Plan</h2>
                  <p className="card-description">Manage your subscription and billing information</p>
                </div>
                <div className="card-content">
                  <div className="form-section">
                    <h3 className="section-title">Current Plan</h3>

                    <div style={{
                      padding: '1.5rem',
                      borderRadius: 'var(--radius-lg)',
                      backgroundColor: 'rgba(var(--primary-rgb), 0.1)',
                      border: '1px solid rgba(var(--primary-rgb), 0.2)',
                      marginBottom: '1.5rem'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <h4 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '0.5rem' }}>Pro Plan</h4>
                          <p style={{ color: 'var(--dark-gray)' }}>Billed monthly · Renews on May 15, 2025</p>
                        </div>
                        <div style={{
                          backgroundColor: 'var(--primary)',
                          color: 'white',
                          padding: '0.25rem 0.75rem',
                          borderRadius: 'var(--radius-full)',
                          fontSize: '0.875rem',
                          fontWeight: '600'
                        }}>
                          Active
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                      <Button variant="secondary" size="small">Change Plan</Button>
                      <Button variant="secondary" size="small">Billing History</Button>
                      <Button variant="secondary" size="small">Update Payment</Button>
                    </div>
                  </div>

                  <hr className="separator" />

                  <div className="form-section">
                    <h3 className="section-title">Available Plans</h3>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                      <div style={{
                        padding: '1.5rem',
                        borderRadius: 'var(--radius-lg)',
                        border: '1px solid var(--light-gray)',
                        cursor: 'pointer',
                        transition: 'var(--transition-standard)'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <h4 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '0.5rem' }}>Basic Plan</h4>
                            <p style={{ color: 'var(--dark-gray)', marginBottom: '0.5rem' }}>For individual learners</p>
                            <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
                              <li>Access to basic courses</li>
                              <li>Standard support</li>
                              <li>1 device</li>
                            </ul>
                            <p style={{ fontWeight: '600' }}>$9.99/month</p>
                          </div>
                          <div>
                            <input type="radio" name="plan" id="basic" />
                          </div>
                        </div>
                      </div>

                      <div style={{
                        padding: '1.5rem',
                        borderRadius: 'var(--radius-lg)',
                        border: '2px solid var(--primary)',
                        background: 'rgba(var(--primary-rgb), 0.05)',
                        cursor: 'pointer',
                        transition: 'var(--transition-standard)'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <div style={{
                              display: 'inline-block',
                              backgroundColor: 'var(--primary)',
                              color: 'white',
                              padding: '0.25rem 0.75rem',
                              borderRadius: 'var(--radius-full)',
                              fontSize: '0.75rem',
                              fontWeight: '600',
                              marginBottom: '0.5rem'
                            }}>
                              MOST POPULAR
                            </div>
                            <h4 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '0.5rem' }}>Pro Plan</h4>
                            <p style={{ color: 'var(--dark-gray)', marginBottom: '0.5rem' }}>For serious learners</p>
                            <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
                              <li>Access to all courses</li>
                              <li>Priority support</li>
                              <li>Up to 3 devices</li>
                              <li>Offline downloads</li>
                            </ul>
                            <p style={{ fontWeight: '600' }}>$19.99/month</p>
                          </div>
                          <div>
                            <input type="radio" name="plan" id="pro" checked={true} />
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

            {/* Privacy tab */}
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
                        <input type="checkbox" checked={true} />
                        <span></span>
                      </label>
                    </div>

                    <div className="switch-container">
                      <div className="switch-label">
                        <label className="form-label" style={{ margin: 0 }}>Show Learning Activity</label>
                        <p className="help-text">Share your learning activity on your profile</p>
                      </div>
                      <label className="toggle-switch">
                        <input type="checkbox" checked={true} />
                        <span></span>
                      </label>
                    </div>

                    <div className="switch-container">
                      <div className="switch-label">
                        <label className="form-label" style={{ margin: 0 }}>Show Achievements</label>
                        <p className="help-text">Display your badges and certificates on your profile</p>
                      </div>
                      <label className="toggle-switch">
                        <input type="checkbox" checked={true} />
                        <span></span>
                      </label>
                    </div>
                  </div>

                  <hr className="separator" />

                  <div className="form-section">
                    <h3 className="section-title">Data Usage</h3>

                    <div className="switch-container">
                      <div className="switch-label">
                        <label className="form-label" style={{ margin: 0 }}>Learning Analytics</label>
                        <p className="help-text">Allow us to analyze your learning patterns to improve recommendations</p>
                      </div>
                      <label className="toggle-switch">
                        <input type="checkbox" checked={true} />
                        <span></span>
                      </label>
                    </div>

                    <div className="switch-container">
                      <div className="switch-label">
                        <label className="form-label" style={{ margin: 0 }}>Personalized Content</label>
                        <p className="help-text">Receive content recommendations based on your learning history</p>
                      </div>
                      <label className="toggle-switch">
                        <input type="checkbox" checked={true} />
                        <span></span>
                      </label>
                    </div>
                  </div>

                  <hr className="separator" />

                  <div className="form-section">
                    <h3 className="section-title">Data Management</h3>

                    <Button variant="secondary" size="small" style={{ marginBottom: '1rem' }}>Download My Data</Button>

                    <div style={{
                      padding: '1.5rem',
                      borderRadius: 'var(--radius-lg)',
                      backgroundColor: 'rgba(var(--error-rgb), 0.1)',
                      border: '1px solid rgba(var(--error-rgb), 0.3)'
                    }}>
                      <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--error)' }}>Danger Zone</h4>
                      <p style={{ marginBottom: '1rem' }}>Once you delete your account, there is no going back. Please be certain.</p>
                      <Button variant="danger" size="small">Delete My Account</Button>
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
        )}
      </div>
    </div>
  );
};

export default SettingsPage;