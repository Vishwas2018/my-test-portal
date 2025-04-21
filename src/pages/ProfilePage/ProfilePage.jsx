import { Button } from '../../components/common';
import React from 'react';
import styled from 'styled-components';
import { useAuth } from '../../contexts/AuthContext';

// Styled components
const ProfileContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
`;

const ProfileCard = styled.div`
  background-color: var(--white);
  border-radius: var(--radius-xl);
  padding: 2.5rem;
  box-shadow: 
    0 15px 0 -8px var(--light-gray),
    0 20px 30px rgba(0, 0, 0, 0.1);
  border: 6px solid var(--white);
  transition: var(--transition-bounce);
  position: relative;
  overflow: hidden;
  margin-bottom: 2rem;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
  gap: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const ProfileAvatar = styled.div`
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
  flex-shrink: 0;
`;

const ProfileInfo = styled.div`
  flex: 1;
`;

const ProfileName = styled.h1`
  font-size: 2.2rem;
  margin-bottom: 0.5rem;
  color: var(--dark);
`;

const ProfileUsername = styled.p`
  font-size: 1.2rem;
  color: var(--dark-gray);
  margin-bottom: 0.5rem;
`;

const ProfileEmail = styled.p`
  font-size: 1.1rem;
  color: var(--dark-gray);
`;

const ProfileSection = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
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

const InfoCard = styled.div`
  background-color: var(--light-gray);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
`;

const InfoItem = styled.div`
  display: flex;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px dashed rgba(0, 0, 0, 0.1);
  
  &:last-child {
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: none;
  }
`;

const InfoLabel = styled.div`
  font-weight: 700;
  width: 150px;
  color: var(--dark);
`;

const InfoValue = styled.div`
  flex: 1;
  color: var(--dark-gray);
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  
  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

/**
 * User profile page that displays account information
 * 
 * @returns {JSX.Element} Profile component
 */
const ProfilePage = () => {
  const { currentUser, logout } = useAuth();

  // Get user initials for avatar
  const getInitials = () => {
    if (!currentUser?.fullName) return '?';

    const names = currentUser.fullName.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return currentUser.fullName[0].toUpperCase();
  };

  // Handle logout with confirmation
  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      logout();
      // The router will automatically redirect to login page due to your auth protection
    }
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

  // Get trial status
  const getTrialInfo = () => {
    const trialInfo = localStorage.getItem('trial_info');
    if (!trialInfo) return null;

    try {
      const { startDate, trialDays } = JSON.parse(trialInfo);
      const trialStartDate = new Date(startDate);
      const currentDate = new Date();
      const daysPassed = Math.floor((currentDate - trialStartDate) / (1000 * 60 * 60 * 24));
      const daysRemaining = trialDays - daysPassed;

      return {
        isActive: daysRemaining > 0,
        daysRemaining: Math.max(0, daysRemaining),
        startDate: formatDate(startDate),
        endDate: formatDate(new Date(trialStartDate.getTime() + trialDays * 24 * 60 * 60 * 1000))
      };
    } catch (error) {
      console.error('Error parsing trial info:', error);
      return null;
    }
  };

  const trialInfo = getTrialInfo();

  return (
    <div className="profile-page">
      <ProfileContainer>
        <ProfileCard>
          <ProfileHeader>
            <ProfileAvatar>{getInitials()}</ProfileAvatar>
            <ProfileInfo>
              <ProfileName>{currentUser?.fullName || 'User'}</ProfileName>
              <ProfileUsername>@{currentUser?.username}</ProfileUsername>
              <ProfileEmail>{currentUser?.email}</ProfileEmail>
            </ProfileInfo>
          </ProfileHeader>

          <ProfileSection>
            <SectionTitle>Account Information</SectionTitle>
            <InfoCard>
              <InfoItem>
                <InfoLabel>Username:</InfoLabel>
                <InfoValue>{currentUser?.username}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Email:</InfoLabel>
                <InfoValue>{currentUser?.email}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Account Created:</InfoLabel>
                <InfoValue>
                  {formatDate(currentUser?.createdAt)}
                </InfoValue>
              </InfoItem>
            </InfoCard>
          </ProfileSection>

          {trialInfo && (
            <ProfileSection>
              <SectionTitle>Trial Status</SectionTitle>
              <InfoCard>
                <InfoItem>
                  <InfoLabel>Status:</InfoLabel>
                  <InfoValue>
                    {trialInfo.isActive
                      ? <span style={{ color: 'var(--accent)' }}>Active</span>
                      : <span style={{ color: 'var(--error)' }}>Expired</span>}
                  </InfoValue>
                </InfoItem>
                {trialInfo.isActive && (
                  <InfoItem>
                    <InfoLabel>Days Remaining:</InfoLabel>
                    <InfoValue>
                      <strong>{trialInfo.daysRemaining}</strong> days
                    </InfoValue>
                  </InfoItem>
                )}
                <InfoItem>
                  <InfoLabel>Start Date:</InfoLabel>
                  <InfoValue>{trialInfo.startDate}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>End Date:</InfoLabel>
                  <InfoValue>{trialInfo.endDate}</InfoValue>
                </InfoItem>
              </InfoCard>
            </ProfileSection>
          )}

          <ButtonContainer>
            <Button variant="secondary" size="medium" onClick={() => alert('Edit profile functionality coming soon!')}>
              Edit Profile
            </Button>
            <Button variant="primary" size="medium" onClick={() => alert('Change password functionality coming soon!')}>
              Change Password
            </Button>
            <Button
              variant="secondary"
              size="medium"
              onClick={handleLogout}
              style={{ backgroundColor: 'var(--light-gray)', color: 'var(--dark)' }}
            >
              Logout
            </Button>
          </ButtonContainer>
        </ProfileCard>
      </ProfileContainer>
    </div>
  );
};

export default ProfilePage;