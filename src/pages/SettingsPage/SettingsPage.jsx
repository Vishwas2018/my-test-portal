import React, { useEffect, useState } from 'react';

import { Button } from '../../components/common';
import styled from 'styled-components';
import { useAuth } from '../../contexts/AuthContext';

// Styled components for Settings layout
const SettingsContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
`;

const SettingsHeader = styled.div`
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2.2rem;
  margin-bottom: 1rem;
  color: var(--dark);
  position: relative;
  display: inline-block;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 0;
    width: 60px;
    height: 3px;
    background: var(--gradient-fun);
    border-radius: var(--radius-full);
  }
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  color: var(--dark-gray);
  max-width: 700px;
`;

const TabsContainer = styled.div`
  display: flex;
  flex-direction: column;
  
  @media (min-width: 768px) {
    flex-direction: row;
    gap: 2rem;
  }
`;

const TabsList = styled.div`
  display: flex;
  overflow-x: auto;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid var(--light-gray);
  
  @media (min-width: 768px) {
    flex-direction: column;
    min-width: 200px;
    border-bottom: none;
    border-right: 1px solid var(--light-gray);
    margin-bottom: 0;
    padding-right: 1rem;
  }
`;

const TabButton = styled.button`
  background: none;
  border: none;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  color: var(--dark-gray);
  cursor: pointer;
  position: relative;
  transition: var(--transition-standard);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  white-space: nowrap;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: ${props => props.active ? '100%' : '0'};
    height: 3px;
    background: var(--gradient-fun);
    transition: var(--transition-standard);
  }
  
  &:hover {
    color: var(--dark);
  }
  
  ${props => props.active && `
    color: var(--dark);
    font-weight: 600;
  `}
  
  @media (min-width: 768px) {
    width: 100%;
    justify-content: flex-start;
    padding: 0.75rem 0;
    
    &::after {
      bottom: auto;
      top: 0;
      left: auto;
      right: -1rem;
      width: 3px;
      height: ${props => props.active ? '100%' : '0'};
    }
  }
`;

const TabIcon = styled.span`
  font-size: 1.2rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

const TabContent = styled.div`
  flex: 1;
  display: ${props => props.active ? 'block' : 'none'};
  animation: fadeIn 0.3s ease-in-out;
  
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const Card = styled.div`
  background-color: var(--white);
  border-radius: var(--radius-xl);
  box-shadow: 0 15px 0 -8px var(--light-gray), 0 20px 30px rgba(0, 0, 0, 0.1);
  border: 6px solid var(--white);
  overflow: hidden;
  transition: var(--transition-bounce);
  margin-bottom: 2rem;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const CardHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid var(--light-gray);
`;

const CardTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: var(--dark);
`;

const CardDescription = styled.p`
  font-size: 1rem;
  color: var(--dark-gray);
`;

const CardContent = styled.div`
  padding: 1.5rem;
`;

const CardFooter = styled.div`
  padding: 1.5rem;
  border-top: 1px solid var(--light-gray);
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
`;

const FormSection = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--dark);
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  
  @media (min-width: 640px) {
    grid-template-columns: ${props => props.columns || '1fr 1fr'};
  }
`;

const FormLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--dark);
`;

const FormInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid var(--light-gray);
  border-radius: var(--radius-lg);
  font-size: 1rem;
  transition: var(--transition-standard);
  
  &:focus {
    border-color: var(--primary);
    outline: none;
    box-shadow: 0 0 0 3px rgba(var(--primary-rgb), 0.2);
  }
`;

const FormTextarea = styled.textarea`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid var(--light-gray);
  border-radius: var(--radius-lg);
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
  transition: var(--transition-standard);
  
  &:focus {
    border-color: var(--primary);
    outline: none;
    box-shadow: 0 0 0 3px rgba(var(--primary-rgb), 0.2);
  }
`;

const HelpText = styled.p`
  font-size: 0.875rem;
  color: var(--dark-gray);
  margin-top: 0.5rem;
`;

const Avatar = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: var(--gradient-fun);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--white);
  font-size: 3rem;
  font-weight: 700;
  box-shadow: var(--shadow-md);
`;

const AvatarContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

const Separator = styled.hr`
  border: none;
  height: 1px;
  background-color: var(--light-gray);
  margin: 2rem 0;
`;

const SwitchContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const SwitchLabel = styled.div`
  flex: 1;
`;

const ToggleSwitch = styled.label`
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
  
  input {
    opacity: 0;
    width: 0;
    height: 0;
  }
  
  span {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: var(--light-gray);
    transition: .4s;
    border-radius: 34px;
  }
  
  span:before {
    position: absolute;
    content: "";
    height: 16px;
    width: 16px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    transition: .4s;
    border-radius: 50%;
  }
  
  input:checked + span {
    background: var(--gradient-fun);
  }
  
  input:checked + span:before {
    transform: translateX(26px);
  }
`;

const DangerZone = styled.div`
  background-color: rgba(var(--error-rgb), 0.1);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  border: 1px solid rgba(var(--error-rgb), 0.3);
`;


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
        
        setFormData({
          ...formData,
          firstName: names[0] || '',
          lastName: names.slice(1).join(' ') || '',
          email: currentUser.email || '',
          username: currentUser.username || '',
          // In a real app, these would come from an API
          bio: currentUser.bio || '',
          location: currentUser.location || ''
        });
        
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
    
    // Update URL when tab changes without full page reload
    const updateHash = () => {
      window.history.replaceState(
        null, 
        document.title, 
        `${window.location.pathname}#${activeTab}`
      );
    };
    
    updateHash();
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
      
      // In a real app, you would update user data in your backend here
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
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="settings-page">
      <SettingsContainer>
        <SettingsHeader>
          <Title>Settings</Title>
          <Subtitle>
            Manage your account preferences, profile information, and notification settings
          </Subtitle>
          
          {saveMessage.text && (
            <div style={{ 
              marginTop: '1rem', 
              padding: '0.75rem 1rem', 
              backgroundColor: saveMessage.type === 'success' ? 'rgba(0, 200, 83, 0.1)' : 'rgba(255, 0, 0, 0.1)',
              borderLeft: `4px solid ${saveMessage.type === 'success' ? 'var(--accent)' : 'var(--error)'}`,
              borderRadius: 'var(--radius-sm)',
              color: saveMessage.type === 'success' ? 'var(--accent)' : 'var(--error)'
            }}>
              {saveMessage.text}
            </div>
          )}
        </SettingsHeader>
        
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '3rem 0' }}>
            <p>Loading your settings...</p>
          </div>
        ) : (
          <TabsContainer>
            <TabsList>
              <TabButton 
                active={activeTab === 'profile'} 
                onClick={() => setActiveTab('profile')}
              >
                <TabIcon>👤</TabIcon> Profile
              </TabButton>
              <TabButton 
                active={activeTab === 'account'} 
                onClick={() => setActiveTab('account')}
              >
                <TabIcon>🔒</TabIcon> Account
              </TabButton>
              <TabButton 
                active={activeTab === 'notifications'} 
                onClick={() => setActiveTab('notifications')}
              >
                <TabIcon>🔔</TabIcon> Notifications
              </TabButton>
              <TabButton 
                active={activeTab === 'subscription'} 
                onClick={() => setActiveTab('subscription')}
              >
                <TabIcon>💳</TabIcon> Subscription
              </TabButton>
              <TabButton 
                active={activeTab === 'privacy'} 
                onClick={() => setActiveTab('privacy')}
              >
                <TabIcon>🛡️</TabIcon> Privacy
              </TabButton>
            </TabsList>
            
            <TabContent active={activeTab === 'profile'}>
              <form onSubmit={handleSaveChanges}>
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>Update your personal details and profile picture</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <FormSection>
                      <FormRow>
                        <AvatarContainer>
                          <Avatar>{getInitials()}</Avatar>
                          <Button variant="secondary" size="small" type="button">Change Photo</Button>
                        </AvatarContainer>
                        
                        <div>
                          <FormRow>
                            <FormGroup>
                              <FormLabel htmlFor="firstName">First Name</FormLabel>
                              <FormInput 
                                id="firstName" 
                                type="text"
                                value={formData.firstName}
                                onChange={handleInputChange}
                              />
                            </FormGroup>
                            <FormGroup>
                              <FormLabel htmlFor="lastName">Last Name</FormLabel>
                              <FormInput 
                                id="lastName" 
                                type="text"
                                value={formData.lastName}
                                onChange={handleInputChange}
                              />
                            </FormGroup>
                          </FormRow>
                          
                          <FormGroup>
                            <FormLabel htmlFor="email">Email Address</FormLabel>
                            <FormInput 
                              id="email" 
                              type="email"
                              value={formData.email}
                              onChange={handleInputChange}
                            />
                          </FormGroup>
                          
                          <FormGroup>
                            <FormLabel htmlFor="username">Username</FormLabel>
                            <FormInput 
                              id="username" 
                              type="text"
                              value={formData.username}
                              onChange={handleInputChange}
                            />
                          </FormGroup>
                        </div>
                      </FormRow>
                    </FormSection>
                    
                    <Separator />
                    
                    <FormSection>
                      <SectionTitle>Additional Information</SectionTitle>
                      
                      <FormGroup>
                        <FormLabel htmlFor="bio">Bio</FormLabel>
                        <FormTextarea 
                          id="bio" 
                          placeholder="Tell us a bit about yourself..."
                          value={formData.bio}
                          onChange={handleInputChange}
                        />
                        <HelpText>This will be displayed on your public profile.</HelpText>
                      </FormGroup>
                      
                      <FormGroup>
                        <FormLabel htmlFor="location">Location</FormLabel>
                        <FormInput 
                          id="location" 
                          type="text"
                          placeholder="City, Country"
                          value={formData.location}
                          onChange={handleInputChange}
                        />
                      </FormGroup>
                    </FormSection>
                  </CardContent>
                  <CardFooter>
                    <Button variant="secondary" type="button" onClick={() => setActiveTab('account')}>Next: Account Settings</Button>
                    <Button variant="primary" type="submit" disabled={isSaving}>
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </CardFooter>
                </Card>
              </form>
            </TabContent>
            
            {/* Other tab contents with form submission handling... */}
            
            <TabContent active={activeTab === 'notifications'}>
              <form onSubmit={handleSaveChanges}>
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>Control how and when you receive notifications</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <FormSection>
                      <SectionTitle>Email Notifications</SectionTitle>
                      
                      <SwitchContainer>
                        <SwitchLabel>
                          <FormLabel style={{ margin: 0 }}>Exam Reminders</FormLabel>
                          <HelpText>Receive reminders about upcoming exams</HelpText>
                        </SwitchLabel>
                        <ToggleSwitch>
                          <input 
                            type="checkbox" 
                            checked={formData.notifications.examReminders}
                            onChange={() => handleToggleChange('examReminders')}
                          />
                          <span></span>
                        </ToggleSwitch>
                      </SwitchContainer>
                      
                      <SwitchContainer>
                        <SwitchLabel>
                          <FormLabel style={{ margin: 0 }}>Weekly Progress Summary</FormLabel>
                          <HelpText>Get a weekly summary of your learning progress</HelpText>
                        </SwitchLabel>
                        <ToggleSwitch>
                          <input 
                            type="checkbox" 
                            checked={formData.notifications.weeklySummary}
                            onChange={() => handleToggleChange('weeklySummary')}
                          />
                          <span></span>
                        </ToggleSwitch>
                      </SwitchContainer>
                      
                      {/* Other notification toggles with similar onChange handlers */}
                    </FormSection>
                  </CardContent>
                  <CardFooter>
                    <Button variant="secondary" type="button" onClick={() => setActiveTab('account')}>Back to Account</Button>
                    <Button variant="primary" type="submit" disabled={isSaving}>
                      {isSaving ? 'Saving...' : 'Save Preferences'}
                    </Button>
                  </CardFooter>
                </Card>
              </form>
            </TabContent>
          
          </TabsContainer>
        )}
      </SettingsContainer>
    </div>
  );
};

export default SettingsPage;