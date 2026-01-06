import { Link } from 'react-router-dom';
import { Heart, MessageCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import styled from 'styled-components';

const Card = styled.article`
  background: ${({ theme }) => theme.colors.cardBg};
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: ${({ theme }) => theme.shadows.card};
  padding: ${({ theme }) => theme.spacing.lg};
  transition: all ${({ theme }) => theme.transitions.normal};

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.cardHover};
    transform: translateY(-1px);
  }
`;

const CardContent = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const ImageWrapper = styled(Link)`
  flex-shrink: 0;
  width: 140px;
  height: 100px;
  border-radius: ${({ theme }) => theme.radii.md};
  overflow: hidden;

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

const ContentWrapper = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
`;

const BadgeContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
  flex-wrap: wrap;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 2px 10px;
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.badgeText};
  background: ${({ theme }) => theme.colors.badgeBg};
  border-radius: ${({ theme }) => theme.radii.full};
`;

const Title = styled(Link)`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  line-height: ${({ theme }) => theme.lineHeights.snug};
  letter-spacing: ${({ theme }) => theme.letterSpacing.tight};
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  transition: color ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`;

const Excerpt = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textMuted};
  line-height: ${({ theme }) => theme.lineHeights.normal};
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  flex: 1;
`;

const MetaRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
`;

const AuthorInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const AuthorAvatar = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.bgTertiary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const AuthorLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};

  &:hover span {
    color: ${({ theme }) => theme.colors.textPrimary};
  }
`;

const AuthorName = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textMuted};
  transition: color ${({ theme }) => theme.transitions.fast};
`;

const MetaDot = styled.span`
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.textMuted};
`;

const TimeStamp = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const Stats = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.textMuted};

  svg {
    width: 14px;
    height: 14px;
  }

  span {
    font-size: ${({ theme }) => theme.fontSizes.sm};
  }
`;

export function PostCard({ post }) {
  const stripHtml = (html) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  };

  return (
    <Card>
      <CardContent>
        {post.imageURL && (
          <ImageWrapper to={`/post/${post._id}`}>
            <img
              src={post.imageURL}
              alt={post.title}
              onError={(e) => (e.target.style.display = 'none')}
            />
          </ImageWrapper>
        )}

        <ContentWrapper>
          {post.categories?.length > 0 && (
            <BadgeContainer>
              {post.categories.slice(0, 2).map((cat) => (
                <Badge key={cat._id || cat}>{cat.name || cat}</Badge>
              ))}
            </BadgeContainer>
          )}

          <Title to={`/post/${post._id}`}>{post.title}</Title>
          <Excerpt>{stripHtml(post.content)}</Excerpt>

          <MetaRow>
            <AuthorInfo>
              <AuthorLink to={post.user?._id ? `/user/${post.user._id}` : '#'}>
                <AuthorAvatar>
                  {post.user?.username?.[0]?.toUpperCase() || 'U'}
                </AuthorAvatar>
                <AuthorName>{post.user?.username || 'Anonymous'}</AuthorName>
              </AuthorLink>
              <MetaDot />
              <TimeStamp>
                {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
              </TimeStamp>
            </AuthorInfo>

            <Stats>
              <StatItem>
                <Heart />
                <span>{post.likes?.length || 0}</span>
              </StatItem>
              <StatItem>
                <MessageCircle />
                <span>{post.comments?.length || 0}</span>
              </StatItem>
            </Stats>
          </MetaRow>
        </ContentWrapper>
      </CardContent>
    </Card>
  );
}
