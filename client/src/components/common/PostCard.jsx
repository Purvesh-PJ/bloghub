import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Bookmark } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import styled from 'styled-components';

const Card = styled.article`
  display: flex;
  gap: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.bgPrimary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.xl};
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.borderHover};
    box-shadow: ${({ theme }) => theme.shadows.card};
  }
`;

const ContentWrapper = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
`;

const AuthorRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const AuthorAvatar = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.accentSubtle};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.accent};
`;

const AuthorName = styled(Link)`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.textPrimary};
  
  &:hover {
    color: ${({ theme }) => theme.colors.accent};
  }
`;

const Dot = styled.span`
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.textMuted};
`;

const TimeStamp = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const Title = styled(Link)`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  
  &:hover {
    color: ${({ theme }) => theme.colors.accent};
  }
`;

const Excerpt = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const MetaRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
`;

const CategoryBadge = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.badgeText};
  background: ${({ theme }) => theme.colors.badgeBg};
  padding: 4px 10px;
  border-radius: ${({ theme }) => theme.radii.full};
`;

const Stats = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.fontSizes.sm};

  svg {
    width: 16px;
    height: 16px;
  }
`;

const ImageWrapper = styled(Link)`
  flex-shrink: 0;
  width: 160px;
  height: 120px;
  border-radius: ${({ theme }) => theme.radii.lg};
  overflow: hidden;
  background: ${({ theme }) => theme.colors.bgTertiary};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform ${({ theme }) => theme.transitions.normal};
  }
  
  &:hover img {
    transform: scale(1.05);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    width: 100px;
    height: 80px;
  }
`;

export function PostCard({ post }) {
  const stripHtml = (html) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  };

  const category = post.categories?.[0];

  return (
    <Card>
      <ContentWrapper>
        <AuthorRow>
          <AuthorAvatar>{post.user?.username?.[0]?.toUpperCase() || 'U'}</AuthorAvatar>
          <AuthorName to={post.user?._id ? `/user/${post.user._id}` : '#'}>
            {post.user?.username || 'Anonymous'}
          </AuthorName>
          <Dot />
          <TimeStamp>
            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
          </TimeStamp>
        </AuthorRow>

        <Title to={`/post/${post._id}`}>{post.title}</Title>
        <Excerpt>{stripHtml(post.content)}</Excerpt>

        <MetaRow>
          {category ? (
            <CategoryBadge>{category.name || category}</CategoryBadge>
          ) : (
            <span />
          )}
          <Stats>
            <StatItem>
              <Heart />
              {post.likes?.length || 0}
            </StatItem>
            <StatItem>
              <MessageCircle />
              {post.comments?.length || 0}
            </StatItem>
          </Stats>
        </MetaRow>
      </ContentWrapper>

      {post.imageURL && (
        <ImageWrapper to={`/post/${post._id}`}>
          <img
            src={post.imageURL}
            alt={post.title}
            onError={(e) => (e.target.style.display = 'none')}
          />
        </ImageWrapper>
      )}
    </Card>
  );
}
