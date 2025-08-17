import React, { useEffect, useState, useCallback } from 'react';
import { ProfileContainer } from './Profile-Style';
import useStateManagement from '../../Resuable-Components/useStateManagement';
import StateWrapper, { ComponentWrapper } from '../../Resuable-Components/StateWrapper';
import styled from 'styled-components';

// Styled components for the profile content
const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 32px;
  gap: 24px;
`;

const ProfileAvatar = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background-color: #e2e8f0;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ProfileInfo = styled.div`
  flex: 1;
`;

const ProfileName = styled.h1`
  font-size: 1.8rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 8px;
`;

const ProfileUsername = styled.p`
  font-size: 1.1rem;
  color: #64748b;
  margin-bottom: 12px;
`;

const ProfileStats = styled.div`
  display: flex;
  gap: 24px;
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StatValue = styled.span`
  font-size: 1.2rem;
  font-weight: 600;
  color: #1e293b;
`;

const StatLabel = styled.span`
  font-size: 0.9rem;
  color: #64748b;
`;

const ProfileContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 24px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ProfileSection = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
`;

const SectionTitle = styled.h2`
  font-size: 1.2rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e2e8f0;
`;

const Profile = () => {
  // Use our custom state management hook
  const { 
    loading, 
    error, 
    executeWithLoading, 
    handleRetry 
  } = useStateManagement({ initialLoading: true });
  
  const [profileData, setProfileData] = useState(null);
  
  // Fetch profile data function - using useCallback to memoize the function
  const fetchProfileData = useCallback(async () => {
    await executeWithLoading(async () => {
      // Get user data from localStorage
      const userData = localStorage.getItem('userData');
      
      if (!userData) {
        throw new Error('No user data found. Please log in again.');
      }
      
      const user = JSON.parse(userData);
      const userId = user?.user?.id; // Adjust this path based on your userData structure
      
      if (!userId) {
        throw new Error('User ID not found. Please log in again.');
      }
      
      // Make API call to get profile data
      const response = await fetch(`/api/users/${userId}/profile`, {
        headers: {
          'Authorization': `Bearer ${user.token}` // Assuming you have a token in userData
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch profile: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      setProfileData(data);
      return data;
    }, {
      errorMessage: 'Failed to load profile data. Please try again.',
    });
  }, [executeWithLoading]);
  
  // Fetch data on component mount
  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData]);
  
  // Render the profile content when data is available
  const renderProfileContent = () => {
    if (!profileData) {
      return (
        <ProfileSection>
          <SectionTitle>Profile Information</SectionTitle>
          <p>No profile data available. Please update your profile.</p>
        </ProfileSection>
      );
    }
    
    return (
      <>
        <ProfileHeader>
          <ProfileAvatar>
            {profileData.avatar && <img src={profileData.avatar} alt={`${profileData.username}'s avatar`} />}
          </ProfileAvatar>
          <ProfileInfo>
            <ProfileName>{profileData.name || 'User'}</ProfileName>
            <ProfileUsername>@{profileData.username}</ProfileUsername>
            <ProfileStats>
              <StatItem>
                <StatValue>{profileData.posts || 0}</StatValue>
                <StatLabel>Posts</StatLabel>
              </StatItem>
              <StatItem>
                <StatValue>{profileData.followers || 0}</StatValue>
                <StatLabel>Followers</StatLabel>
              </StatItem>
              <StatItem>
                <StatValue>{profileData.following || 0}</StatValue>
                <StatLabel>Following</StatLabel>
              </StatItem>
            </ProfileStats>
          </ProfileInfo>
        </ProfileHeader>
        
        <ProfileContent>
          <div>
            <ProfileSection>
              <SectionTitle>About</SectionTitle>
              <p>{profileData.bio || 'No bio provided.'}</p>
            </ProfileSection>
            
            <ProfileSection>
              <SectionTitle>Contact</SectionTitle>
              <p>Email: {profileData.email || 'Not provided'}</p>
              <p>Website: {profileData.website || 'Not provided'}</p>
            </ProfileSection>
          </div>
          
          <div>
            <ProfileSection>
              <SectionTitle>Recent Activity</SectionTitle>
              {profileData.recentActivity && profileData.recentActivity.length > 0 ? (
                <ul>
                  {profileData.recentActivity.map((activity, index) => (
                    <li key={index}>{activity}</li>
                  ))}
                </ul>
              ) : (
                <p>No recent activity.</p>
              )}
            </ProfileSection>
          </div>
        </ProfileContent>
      </>
    );
  };
  
  return (
    <ComponentWrapper minWidth="320px" maxWidth="1200px" width="100%">
      <ProfileContainer>
        <StateWrapper
          loading={loading}
          error={error}
          onRetry={() => handleRetry(fetchProfileData)}
          loadingText="Loading profile data..."
          errorTitle="Error Loading Profile"
          minHeight="500px"
        >
          {renderProfileContent()}
        </StateWrapper>
      </ProfileContainer>
    </ComponentWrapper>
  );
};

export default Profile;