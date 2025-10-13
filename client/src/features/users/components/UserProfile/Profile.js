import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import defaultProfile from '../../../../resources/images/default_Images/defaultProfileImage.jpg';
import {
  FaUser,
  FaChartBar,
  FaTag,
  FaEnvelope,
  FaMapMarkerAlt,
  FaGlobe,
  FaCalendarAlt,
  FaUserTag,
  FaFileAlt,
  FaUsers,
  FaUserFriends,
  FaThumbsUp,
  FaPen,
  FaComment,
  FaHeart,
} from 'react-icons/fa';
import {
  ProfilePage,
  ProfileCard,
  ProfileHeader,
  ProfileImageWrapper,
  ProfileImage,
  ProfileMain,
  ProfileName,
  ProfileStatus,
  ProfileBio,
  ProfileContent,
  SectionTitle,
  StatsGrid,
  StatCard,
  StatIcon,
  StatValue,
  StatLabel,
  ProfileGrid,
  DetailItem,
  DetailIcon,
  DetailInfo,
  DetailLabel,
  DetailValue,
  InterestsGrid,
  InterestTag,
  ActivityList,
  ActivityItem,
  ActivityIcon,
  ActivityContent,
  ActivityTitle,
  ActivityDescription,
  ActivityDate,
} from './Profile.styles';
import { Skeleton, Stack, Card } from '../../../../components/ui/primitives';

const Profile = () => {
  const { user } = useAuth();
  const [profileImage, setProfileImage] = useState(defaultProfile);
  const [joinedDate, setJoinedDate] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user && user._id) {
      try {
        const timestamp = parseInt(user._id.substring(0, 8), 16) * 1000;
        const date = new Date(timestamp);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        setJoinedDate(`${date.toLocaleDateString('en-US', options)}`);
      } catch (error) {
        console.error('Error formatting joined date:', error);
        setJoinedDate('January 2023');
      }
    }
  }, [user]);

  useEffect(() => {
    if (user?.profile?.image?.data && user.profile.image.data !== null) {
      setProfileImage(user.profile.image.data);
    }
    if (user) {
      setIsLoading(false);
    }
  }, [user]);

  const handleImageError = () => {
    setProfileImage(defaultProfile);
  };

  if (isLoading || !user) {
    return (
      <ProfilePage>
        <Card $p={6}>
          <Stack $gap={4}>
            <Skeleton.Text $lines={1} style={{ height: '3rem', width: '60%' }} />
            <Skeleton.Card style={{ height: '150px' }} />
            <Skeleton.Text $lines={3} />
            <Skeleton.Card style={{ height: '200px' }} />
          </Stack>
        </Card>
      </ProfilePage>
    );
  }

  const userStats = {
    posts: user?.posts?.length || 0,
    followers: user?.profile?.followersCount || 0,
    following: user?.profile?.followingsCount || 0,
    likes: user?.profile?.likesCount || 0,
  };

  const userInterests = user?.profile?.interests || [
    'Technology',
    'Writing',
    'Web Development',
    'Travel',
    'Photography',
  ];

  const recentActivities = [
    {
      type: 'post',
      date: '2 days ago',
      title: 'Published a new post',
      description: 'How to Build a Blog with MERN Stack',
    },
    {
      type: 'comment',
      date: '1 week ago',
      title: 'Commented on a post',
      description: 'Great article! I learned a lot from this.',
    },
    {
      type: 'like',
      date: '2 weeks ago',
      title: 'Liked a post',
      description: '10 Tips for Better React Code',
    },
  ];

  // Helper function to get the appropriate icon for each activity type
  const getActivityIcon = (type) => {
    switch (type) {
      case 'post':
        return <FaPen />;
      case 'comment':
        return <FaComment />;
      case 'like':
        return <FaHeart />;
      default:
        return <FaUser />;
    }
  };

  return (
    <ProfilePage>
      <ProfileCard>
        {/* Profile Header with Image and Basic Info */}
        <ProfileHeader>
          <ProfileImageWrapper>
            <ProfileImage
              src={profileImage}
              alt={`${user.username || 'User'}'s profile`}
              onError={handleImageError}
            />
          </ProfileImageWrapper>
          <ProfileMain>
            <ProfileName>{user?.username || 'User'}</ProfileName>
            <ProfileStatus>
              {/* <FaCalendarAlt /> */}
              Joined {joinedDate || 'recently'}
            </ProfileStatus>
            {user?.profile?.bio && <ProfileBio>"{user.profile.bio}"</ProfileBio>}
          </ProfileMain>
        </ProfileHeader>

        <ProfileContent>
          {/* Statistics Section */}
          <SectionTitle>
            <FaChartBar color="oklch(0.446 0.043 257.281)" />
            Statistics
          </SectionTitle>
          <StatsGrid>
            <StatCard>
              <StatIcon color="oklch(0.446 0.043 257.281)">
                <FaFileAlt />
              </StatIcon>
              <StatValue>{userStats.posts}</StatValue>
              <StatLabel>Posts</StatLabel>
            </StatCard>
            <StatCard>
              <StatIcon color="oklch(0.446 0.043 257.281)">
                <FaUsers />
              </StatIcon>
              <StatValue>{userStats.followers}</StatValue>
              <StatLabel>Followers</StatLabel>
            </StatCard>
            <StatCard>
              <StatIcon color="oklch(0.446 0.043 257.281)">
                <FaUserFriends />
              </StatIcon>
              <StatValue>{userStats.following}</StatValue>
              <StatLabel>Following</StatLabel>
            </StatCard>
            <StatCard>
              <StatIcon color="oklch(0.446 0.043 257.281)">
                <FaThumbsUp />
              </StatIcon>
              <StatValue>{userStats.likes}</StatValue>
              <StatLabel>Likes</StatLabel>
            </StatCard>
          </StatsGrid>

          {/* Contact Details */}
          <SectionTitle>
            <FaUser color="oklch(0.446 0.043 257.281)" />
            Profile Information
          </SectionTitle>
          <ProfileGrid>
            <DetailItem>
              <DetailIcon>
                <FaEnvelope />
              </DetailIcon>
              <DetailInfo>
                <DetailLabel>Email</DetailLabel>
                <DetailValue>{user?.email || 'No email available'}</DetailValue>
              </DetailInfo>
            </DetailItem>
            <DetailItem>
              <DetailIcon>
                <FaUserTag />
              </DetailIcon>
              <DetailInfo>
                <DetailLabel>Role</DetailLabel>
                <DetailValue>
                  {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'User'}
                </DetailValue>
              </DetailInfo>
            </DetailItem>
            {user?.profile?.location && (
              <DetailItem>
                <DetailIcon>
                  <FaMapMarkerAlt />
                </DetailIcon>
                <DetailInfo>
                  <DetailLabel>Location</DetailLabel>
                  <DetailValue>{user.profile.location}</DetailValue>
                </DetailInfo>
              </DetailItem>
            )}
            {user?.profile?.website && (
              <DetailItem>
                <DetailIcon>
                  <FaGlobe />
                </DetailIcon>
                <DetailInfo>
                  <DetailLabel>Website</DetailLabel>
                  <DetailValue>{user.profile.website}</DetailValue>
                </DetailInfo>
              </DetailItem>
            )}
          </ProfileGrid>

          {/* Interests Section */}
          <SectionTitle>
            <FaTag color="oklch(0.446 0.043 257.281)" />
            Interests
          </SectionTitle>
          <InterestsGrid>
            {userInterests.map((interest, index) => (
              <InterestTag key={index}>{interest}</InterestTag>
            ))}
          </InterestsGrid>

          {/* Recent Activity Section */}
          <SectionTitle>
            <FaCalendarAlt color="oklch(0.446 0.043 257.281)" />
            Recent Activity
          </SectionTitle>
          <ActivityList>
            {recentActivities.map((activity, index) => (
              <ActivityItem key={index}>
                <ActivityIcon>{getActivityIcon(activity.type)}</ActivityIcon>
                <ActivityContent>
                  <ActivityTitle>{activity.title}</ActivityTitle>
                  <ActivityDescription>{activity.description}</ActivityDescription>
                  <ActivityDate>{activity.date}</ActivityDate>
                </ActivityContent>
              </ActivityItem>
            ))}
          </ActivityList>
        </ProfileContent>
      </ProfileCard>
    </ProfilePage>
  );
};

export default Profile;
