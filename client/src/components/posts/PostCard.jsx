import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import styled, { css } from 'styled-components';
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

/*
  Two arrangements of the same card.

  `row` is the feed: text on the left, a fixed 200px cover on the right. `stacked` is for
  grids of cards, where a row layout squeezes the text into whatever the column has left —
  in a 300px grid track that left the title clamped after two words.
*/
const Card = styled(Link)`
  display: grid;
  gap: ${({ theme }) => theme.spacing.xl};
  align-items: start;

  padding: ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.radii.xl};
  background: ${({ theme }) => theme.colors.surfaceElevated};
  border: 1px solid ${({ theme }) => theme.colors.lineDefault};
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.03);
  ${interactive}

  &:hover {
    background: ${({ theme }) => theme.colors.surfaceElevated};
    border-color: ${({ theme }) => theme.colors.accentLine};
    box-shadow:
      0 10px 25px -5px rgba(15, 23, 42, 0.06),
      0 0 15px -3px rgba(14, 165, 233, 0.15);
    transform: translateY(-2px);
  }

  ${({ $layout }) =>
    $layout === 'stacked'
      ? css`
          grid-template-columns: 1fr;
          gap: ${({ theme }) => theme.spacing.lg};
        `
      : css`
          grid-template-columns: 1fr auto;

          ${media.down('sm')`
            grid-template-columns: 1fr;
            gap: ${({ theme }) => theme.spacing.lg};
          `}
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
  width: 24px;
  height: 24px;
  border-radius: ${({ theme }) => theme.radii.full};
  background: linear-gradient(135deg, #0284c7 0%, #38bdf8 100%);
  color: #ffffff;
  font-size: 11px;
  font-weight: ${({ theme }) => theme.weights.bold};
  box-shadow: 0 1px 4px rgba(14, 165, 233, 0.3);
`;

const Dot = styled.span`
  color: ${({ theme }) => theme.colors.lineStrong};
`;

const Title = styled.h3`
  ${display('xs')}
  color: ${({ theme }) => theme.colors.textPrimary};
  ${clamp(2)}
  transition: color ${({ theme }) => theme.transitions.fast};

  ${Card}:hover & {
    color: ${({ theme }) => theme.colors.accentText};
  }
`;

const Excerpt = styled.p`
  ${text('sm')}
  line-height: 1.6;
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
  border-radius: ${({ theme }) => theme.radii.lg};
  overflow: hidden;
  background: ${({ theme }) => theme.colors.surfaceContainer};
  border: 1px solid ${({ theme }) => theme.colors.lineSubtle};
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform ${({ theme }) => theme.transitions.normal};
  }

  ${Card}:hover & img {
    transform: scale(1.03);
  }

  ${({ $layout }) =>
    $layout === 'stacked'
      ? css`
          width: 100%;
          aspect-ratio: 16 / 9;
          order: -1;
        `
      : css`
          width: 200px;
          aspect-ratio: 4 / 3;

          ${media.down('sm')`
            width: 100%;
            aspect-ratio: 16 / 9;
            order: -1;
          `}
        `}
`;

export function PostCard({ post, layout = 'row' }) {
  /* A cover image that 404s should collapse the column, not leave an empty grey box. */
  const [imageFailed, setImageFailed] = useState(false);

  if (!post) return null;

  const category = post.categories?.[0]?.name ?? post.categories?.[0];
  const author = post.author?.name || post.author?.username || post.user?.username || 'Anonymous';
  const created = post.createdAt ? new Date(post.createdAt) : null;
  const isValidDate = created && !isNaN(created.getTime());
  const showThumb = Boolean(post.imageURL) && !imageFailed;
  const likesCount = post.likesCount ?? post.likes?.length ?? 0;
  const commentsCount = post.commentsCount ?? post.comments?.length ?? 0;

  return (
    <Card to={`/post/${post._id}`} $layout={layout}>
      <Body>
        <Meta>
          <AuthorDot>{initial(author)}</AuthorDot>
          <span>{author}</span>
          <Dot>·</Dot>
          {isValidDate && <span>{formatDistanceToNow(created, { addSuffix: true })}</span>}
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
            <Heart /> {likesCount}
          </Stat>
          <Stat>
            <MessageCircle /> {commentsCount}
          </Stat>
        </Footer>
      </Body>

      {showThumb && (
        <Thumb $layout={layout}>
          {/*
            The card is a link whose accessible name is already the post title, so naming the
            thumbnail again would make a screen reader read the same words twice. Empty alt is
            correct here — unlike the full-size cover on the post page, which carries meaning.
          */}
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
