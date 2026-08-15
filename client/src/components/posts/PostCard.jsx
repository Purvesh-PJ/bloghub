import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import styled from 'styled-components';
import { display, text, clamp, media, interactive } from '../../styles/theme/mixins';
import { excerpt, readingTime, initial } from '../../utils/text';
import { Chip } from '../ui/Chip';

/**
 * PostCard — the feed's unit.
 *
 * One component, two layouts: `row` for the main feed and `compact` for sidebars and
 * related lists. Everything else in the application should use this rather than rebuilding
 * a post row.
 */

const Card = styled(Link)`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: ${({ theme }) => theme.spacing['2xl']};
  align-items: start;

  padding: ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.radii.xl};
  background: transparent;
  ${interactive}

  &:hover {
    background: ${({ theme }) => theme.colors.surfaceContainerLow};
  }

  ${media.down('sm')`
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing.lg};
  `}
`;

const Body = styled.div`
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const Meta = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  ${text('xs')}
  color: ${({ theme }) => theme.colors.textMuted};
`;

const AuthorDot = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: ${({ theme }) => theme.radii.full};
  background: ${({ theme }) => theme.colors.accentContainer};
  color: ${({ theme }) => theme.colors.accentText};
  font-size: 10px;
  font-weight: ${({ theme }) => theme.weights.semibold};
`;

const Dot = styled.span`
  color: ${({ theme }) => theme.colors.lineStrong};
`;

const Title = styled.h3`
  ${display('xs')}
  color: ${({ theme }) => theme.colors.textPrimary};
  ${clamp(2)}
`;

const Excerpt = styled.p`
  ${text('md')}
  color: ${({ theme }) => theme.colors.textSecondary};
  ${clamp(2)}
`;

const Footer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

const Stat = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  ${text('xs')}
  color: ${({ theme }) => theme.colors.textMuted};

  svg {
    width: 14px;
    height: 14px;
  }
`;

const Thumb = styled.div`
  width: 200px;
  aspect-ratio: 4 / 3;
  border-radius: ${({ theme }) => theme.radii.lg};
  overflow: hidden;
  background: ${({ theme }) => theme.colors.surfaceContainer};
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  ${media.down('sm')`
    width: 100%;
    aspect-ratio: 16 / 9;
    order: -1;
  `}
`;

export function PostCard({ post }) {
  /* A cover image that 404s should collapse the column, not leave an empty grey box. */
  const [imageFailed, setImageFailed] = useState(false);

  if (!post) return null;

  const category = post.categories?.[0]?.name ?? post.categories?.[0];
  const author = post.user?.username ?? 'Anonymous';
  const created = post.createdAt ? new Date(post.createdAt) : null;
  const showThumb = Boolean(post.imageURL) && !imageFailed;

  return (
    <Card to={`/post/${post._id}`}>
      <Body>
        <Meta>
          <AuthorDot>{initial(author)}</AuthorDot>
          <span>{author}</span>
          <Dot>·</Dot>
          {created && <span>{formatDistanceToNow(created, { addSuffix: true })}</span>}
          <Dot>·</Dot>
          <span>{readingTime(post.content)} min read</span>
        </Meta>

        <Title>{post.title}</Title>
        <Excerpt>{excerpt(post.content)}</Excerpt>

        <Footer>
          {category && (
            <Chip size="sm" interactive={false} as="span">
              {category}
            </Chip>
          )}
          <Stat>
            <Heart /> {post.likes?.length ?? 0}
          </Stat>
          <Stat>
            <MessageCircle /> {post.comments?.length ?? 0}
          </Stat>
        </Footer>
      </Body>

      {showThumb && (
        <Thumb>
          <img src={post.imageURL} alt="" loading="lazy" onError={() => setImageFailed(true)} />
        </Thumb>
      )}
    </Card>
  );
}

/* ── Compact variant, for sidebars ──────────────────────────────────────────── */

const CompactCard = styled(Link)`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: baseline;
  padding: ${({ theme }) => theme.spacing.md};
  margin: 0 calc(-1 * ${({ theme }) => theme.spacing.md});
  border-radius: ${({ theme }) => theme.radii.md};
  ${interactive}

  &:hover {
    background: ${({ theme }) => theme.colors.surfaceContainer};
  }
`;

const Rank = styled.span`
  ${text('sm', 'semibold')}
  color: ${({ theme }) => theme.colors.lineStrong};
  font-variant-numeric: tabular-nums;
  flex-shrink: 0;
`;

const CompactTitle = styled.p`
  ${text('sm', 'medium')}
  color: ${({ theme }) => theme.colors.textPrimary};
  ${clamp(2)}
`;

const CompactMeta = styled.p`
  ${text('xs')}
  color: ${({ theme }) => theme.colors.textMuted};
  margin-top: 2px;
`;

export function PostCardCompact({ post, rank }) {
  if (!post) return null;

  return (
    <CompactCard to={`/post/${post._id}`}>
      {rank != null && <Rank>{String(rank).padStart(2, '0')}</Rank>}
      <div>
        <CompactTitle>{post.title}</CompactTitle>
        <CompactMeta>
          {post.user?.username ?? 'Anonymous'} · {post.likes?.length ?? 0} likes
        </CompactMeta>
      </div>
    </CompactCard>
  );
}
