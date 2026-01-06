import { Link } from 'react-router-dom';
import { Avatar } from '@radix-ui/themes';
import { Heart, MessageCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import styled from 'styled-components';

const Card = styled.article`
  background: ${({ theme }) => theme.colors.cardBg};
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: ${({ theme }) => theme.spacing.md};
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.borderHover};
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`;

const CardContent = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
`;

const ImageWrapper = styled(Link)`
  flex-shrink: 0;
  width: 120px;
  height: 80px;
  border-radius: ${({ theme }) => theme.radii.sm};
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
`;

const ContentWrapper = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const BadgeContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
  flex-wrap: wrap;
`;

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 2px ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.textSecondary};
  background: ${({ theme }) => theme.colors.bgTertiary};
  border-radius: ${({ theme }) => theme.radii.sm};
`;

const Title = styled(Link)`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.textPrimary};
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  transition: color ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    color: ${({ theme }) => theme.colors.textLink};
  }
`;

const Excerpt = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.base};
  color: ${({ theme }) => theme.colors.textMuted};
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const MetaRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

const AuthorInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const AuthorLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  
  &:hover span {
    color: ${({ theme }) => theme.colors.textLink};
  }
`;

const AuthorName = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textMuted};
  transition: color ${({ theme }) => theme.transitions.fast};
`;

const Separator = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textMuted};
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
          <BadgeContainer>
            {post.categories?.slice(0, 2).map((cat) => (
              <Badge key={cat._id || cat}>{cat.name || cat}</Badge>
            ))}
          </BadgeContainer>

          <Title to={`/post/${post._id}`}>{post.title}</Title>

          <Excerpt>{stripHtml(post.content)}</Excerpt>

          <MetaRow>
            <AuthorInfo>
              <AuthorLink to={post.user?._id ? `/user/${post.user._id}` : '#'}>
                <Avatar
                  size="1"
                  fallback={post.user?.username?.[0]?.toUpperCase() || 'U'}
                  radius="full"
                  color="gray"
                />
                <AuthorName>{post.user?.username || 'Anonymous'}</AuthorName>
              </AuthorLink>
              <Separator>·</Separator>
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
