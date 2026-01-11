import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Settings, FileText, Heart, MessageCircle, Users, UserPlus } from 'lucide-react';
import styled from 'styled-components';
import { userService } from '../services/userService';
import { useAuth } from '../context/AuthContext';
import { PostCard } from '../components/common/PostCard';
import { Loading } from '../components/common/Loading';

const PageWrapper = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.lg};
`;

const ProfileCard = styled.div`
  background: ${({ theme }) => theme.colors.cardBg};
  border-radius: ${({ theme }) => theme.radii.xl};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  padding: ${({ theme }) => theme.spacing.xl};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const ProfileHeader = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xl};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
`;

const Avatar = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.bgTertiary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.textSecondary};
  flex-shrink: 0;
`;

const ProfileInfo = styled.div`
  flex: 1;
`;

const ProfileTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${({ theme }) => theme.spacing.md};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.md};
  }
`;

const Username = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['3xl']};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  letter-spacing: ${({ theme }) => theme.letterSpacing.tight};
  margin-bottom: 4px;
`;

const Email = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const EditButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: ${({ theme }) => theme.colors.buttonSecondaryBg};
  color: ${({ theme }) => theme.colors.buttonSecondaryText};
  border: 1px solid ${({ theme }) => theme.colors.buttonSecondaryBorder};
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.buttonSecondaryHover};
    color: ${({ theme }) => theme.colors.buttonSecondaryText};
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const Bio = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: ${({ theme }) => theme.lineHeights.relaxed};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const RoleBadge = styled.span`
  display: inline-flex;
  padding: 4px 12px;
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.textSecondary};
  background: ${({ theme }) => theme.colors.bgTertiary};
  border-radius: ${({ theme }) => theme.radii.full};
  text-transform: capitalize;
`;

const StatsRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xl};
  padding-top: ${({ theme }) => theme.spacing.lg};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  margin-top: ${({ theme }) => theme.spacing.lg};
  flex-wrap: wrap;
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSizes.sm};

  svg {
    width: 16px;
    height: 16px;
  }

  strong {
    color: ${({ theme }) => theme.colors.textPrimary};
    font-weight: ${({ theme }) => theme.fontWeights.semibold};
  }
`;

const FollowStats = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xl};
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

const FollowItem = styled.div`
  text-align: center;
`;

const FollowCount = styled.div`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const FollowLabel = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.xl};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const StatCard = styled.div`
  background: ${({ theme }) => theme.colors.cardBg};
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: ${({ theme }) => theme.shadows.card};
  padding: ${({ theme }) => theme.spacing.lg};
  text-align: center;
`;

const StatValue = styled.div`
  font-size: ${({ theme }) => theme.fontSizes['3xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 4px;
`;

const StatLabel = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const TabsContainer = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const TabList = styled.div`
  display: flex;
  gap: 4px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const Tab = styled.button`
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ $active, theme }) => ($active ? theme.colors.textPrimary : theme.colors.textMuted)};
  background: transparent;
  border: none;
  border-bottom: 2px solid
    ${({ $active, theme }) => ($active ? theme.colors.textPrimary : 'transparent')};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  margin-bottom: -1px;

  &:hover {
    color: ${({ theme }) => theme.colors.textPrimary};
  }
`;

const PostsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing.md};
`;

const EmptyState = styled.div`
  background: ${({ theme }) => theme.colors.cardBg};
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: ${({ theme }) => theme.shadows.card};
  padding: ${({ theme }) => theme.spacing.xxl};
  text-align: center;
`;

const EmptyText = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.textMuted};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const PrimaryButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: ${({ theme }) => theme.colors.buttonPrimaryBg};
  color: ${({ theme }) => theme.colors.buttonPrimaryText};
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.buttonPrimaryHover};
    color: ${({ theme }) => theme.colors.buttonPrimaryText};
  }
`;

export function Profile() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('published');

  const { data: userData, isLoading: userLoading } = useQuery({
    queryKey: ['currentUser'],
    queryFn: userService.getUser,
  });

  const { data: userPosts, isLoading: postsLoading } = useQuery({
    queryKey: ['userPosts'],
    queryFn: userService.getUserPosts,
  });

  if (userLoading) return <Loading text="Loading profile..." />;

  const profile = userData?.User;
  const posts = userPosts || [];
  const publicPosts = posts.filter((p) => p.visibility === 'public');
  const draftPosts = posts.filter((p) => p.visibility === 'draft');
  const privatePosts = posts.filter((p) => p.visibility === 'private');
  const totalLikes = posts.reduce((acc, p) => acc + (p.likes?.length || 0), 0);
  const totalComments = posts.reduce((acc, p) => acc + (p.comments?.length || 0), 0);

  const getActivePosts = () => {
    switch (activeTab) {
      case 'published':
        return publicPosts;
      case 'drafts':
        return draftPosts;
      case 'private':
        return privatePosts;
      default:
        return publicPosts;
    }
  };

  return (
    <PageWrapper>
      <ProfileCard>
        <ProfileHeader>
          <Avatar>{profile?.username?.[0]?.toUpperCase() || 'U'}</Avatar>
          <ProfileInfo>
            <ProfileTop>
              <div>
                <Username>{profile?.username}</Username>
                <Email>{profile?.email}</Email>
              </div>
              <EditButton to="/settings">
                <Settings /> Edit Profile
              </EditButton>
            </ProfileTop>

            {profile?.profile?.bio && <Bio>{profile.profile.bio}</Bio>}

            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              {user?.roles?.map((role) => (
                <RoleBadge key={role}>{role}</RoleBadge>
              ))}
            </div>

            <StatsRow>
              <StatItem>
                <FileText /> <strong>{posts.length}</strong> Posts
              </StatItem>
              <StatItem>
                <Heart /> <strong>{totalLikes}</strong> Likes
              </StatItem>
              <StatItem>
                <MessageCircle /> <strong>{totalComments}</strong> Comments
              </StatItem>
            </StatsRow>

            <FollowStats>
              <FollowItem>
                <FollowCount>{profile?.profile?.followersCount || 0}</FollowCount>
                <FollowLabel>Followers</FollowLabel>
              </FollowItem>
              <FollowItem>
                <FollowCount>{profile?.profile?.followingsCount || 0}</FollowCount>
                <FollowLabel>Following</FollowLabel>
              </FollowItem>
            </FollowStats>
          </ProfileInfo>
        </ProfileHeader>
      </ProfileCard>

      <StatsGrid>
        <StatCard>
          <StatValue>{publicPosts.length}</StatValue>
          <StatLabel>Published</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{draftPosts.length}</StatValue>
          <StatLabel>Drafts</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{privatePosts.length}</StatValue>
          <StatLabel>Private</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{totalLikes}</StatValue>
          <StatLabel>Total Likes</StatLabel>
        </StatCard>
      </StatsGrid>

      <TabsContainer>
        <TabList>
          <Tab $active={activeTab === 'published'} onClick={() => setActiveTab('published')}>
            Published ({publicPosts.length})
          </Tab>
          <Tab $active={activeTab === 'drafts'} onClick={() => setActiveTab('drafts')}>
            Drafts ({draftPosts.length})
          </Tab>
          <Tab $active={activeTab === 'private'} onClick={() => setActiveTab('private')}>
            Private ({privatePosts.length})
          </Tab>
        </TabList>
      </TabsContainer>

      {postsLoading ? (
        <Loading text="Loading posts..." />
      ) : getActivePosts().length === 0 ? (
        <EmptyState>
          <EmptyText>
            {activeTab === 'published'
              ? 'No published posts yet'
              : activeTab === 'drafts'
                ? 'No drafts'
                : 'No private posts'}
          </EmptyText>
          {activeTab === 'published' && (
            <PrimaryButton to="/write">Write your first post</PrimaryButton>
          )}
        </EmptyState>
      ) : (
        <PostsGrid>
          {getActivePosts().map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </PostsGrid>
      )}
    </PageWrapper>
  );
}
