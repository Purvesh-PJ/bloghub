import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, BookOpenCheck, Sparkles } from 'lucide-react';
import styled, { css } from 'styled-components';

import { display, text, clamp, media, interactive } from '../../styles/theme/mixins';
import { excerpt, readingTime } from '../../utils/text';
import { Chip } from '../ui';
import { AuthorByline } from './AuthorByline';

/**
 * PostCard — elevated editorial story card.
 *
 * Supports `row` for main feed / search and `stacked` for grids / profile views.
 */

const Card = styled(Link)`
  position: relative;
  display: grid;
  gap: ${({ theme }) => theme.spacing.xl};
  align-items: start;
  padding: ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.radii.xl};
  background: ${({ theme }) => theme.colors.surfaceElevated};
  border: 1px solid ${({ theme }) => theme.colors.lineDefault};
  box-shadow: 0 2px 8px -2px rgba(15, 23, 42, 0.04);
  transition: all ${({ theme }) => theme.transitions.normal};
  text-decoration: none;
  overflow: hidden;
  ${interactive}

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: ${({ theme }) => theme.gradients.brandBar};
    opacity: 0;
    transition: opacity ${({ theme }) => theme.transitions.fast};
  }

  &:hover {
    border-color: ${({ theme }) => theme.colors.accentLine};
    box-shadow:
      0 14px 32px -8px rgba(15, 23, 42, 0.09),
      0 0 20px -4px rgba(14, 165, 233, 0.16);
    transform: translateY(-3px);

    &::before {
      opacity: 1;
    }
  }

  ${({ $layout }) =>
    $layout === 'stacked'
      ? css`
          grid-template-columns: 1fr;
          gap: ${({ theme }) => theme.spacing.lg};
        `
      : css`
          grid-template-columns: 1fr 220px;

          ${media.down('md')`
            grid-template-columns: 1fr 180px;
          `}

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
  height: 100%;
  justify-content: space-between;
`;

const ContentWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Title = styled.h3`
  ${display('xs')}
  font-weight: 700;
  line-height: 1.35;
  color: ${({ theme }) => theme.colors.textPrimary};
  ${clamp(2)}
  transition: color ${({ theme }) => theme.transitions.fast};

  ${Card}:hover & {
    color: ${({ theme }) => theme.colors.accentText};
  }
`;

const Excerpt = styled.p`
  ${text('sm')}
  line-height: 1.65;
  color: ${({ theme }) => theme.colors.textSecondary};
  ${clamp(2)}
`;

const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.xs};
  padding-top: ${({ theme }) => theme.spacing.sm};
  border-top: 1px solid ${({ theme }) => theme.colors.lineSubtle};
  flex-wrap: wrap;
`;

const FooterLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-wrap: wrap;
`;

const StatsRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const StatBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 8px;
  border-radius: ${({ theme }) => theme.radii.full};
  background: ${({ theme }) => theme.colors.surfaceContainer};
  color: ${({ theme }) => theme.colors.textSecondary};
  ${text('xs', 'medium')}
  transition: all ${({ theme }) => theme.transitions.fast};

  svg {
    width: 13px;
    height: 13px;
  }

  ${({ $tone, theme }) =>
    $tone === 'accent' &&
    css`
      background: ${theme.colors.accentContainer};
      color: ${theme.colors.accentText};
      font-weight: 600;
      border: 1px solid ${theme.colors.accentLine};

      svg {
        color: ${theme.colors.accentSolid};
      }
    `}

  ${({ $tone }) =>
    $tone === 'love' &&
    css`
      svg {
        color: #ef4444;
        fill: #ef4444;
      }
    `}
`;

const Thumb = styled.div`
  position: relative;
  border-radius: ${({ theme }) => theme.radii.lg};
  overflow: hidden;
  background: ${({ theme }) => theme.colors.surfaceContainer};
  border: 1px solid ${({ theme }) => theme.colors.lineSubtle};
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform ${({ theme }) => theme.transitions.normal};
  }

  ${Card}:hover & img {
    transform: scale(1.05);
  }

  ${({ $layout }) =>
    $layout === 'stacked'
      ? css`
          width: 100%;
          aspect-ratio: 16 / 9;
          order: -1;
        `
      : css`
          width: 220px;
          aspect-ratio: 16 / 10;

          ${media.down('md')`
            width: 180px;
          `}

          ${media.down('sm')`
            width: 100%;
            aspect-ratio: 16 / 9;
            order: -1;
          `}
        `}
`;

export function PostCard({ post, layout = 'row' }) {
  const [imageFailed, setImageFailed] = useState(false);

  if (!post) return null;

  const category = post.categories?.[0]?.name ?? post.categories?.[0];
  const author = post.author?.name || post.author?.username || post.user?.username || 'Anonymous';
  const created = post.createdAt ? new Date(post.createdAt) : null;
  const isValidDate = created && !Number.isNaN(created.getTime());
  const showThumb = Boolean(post.imageURL) && !imageFailed;
  const likesCount = post.likesCount ?? post.likes?.length ?? 0;
  const readRate =
    post.trending?.views > 0 && typeof post.trending?.readRate === 'number'
      ? post.trending.readRate
      : null;
  const commentsCount = post.commentsCount ?? post.comments?.length ?? 0;

  return (
    <Card to={`/post/${post._id}`} $layout={layout}>
      <Body>
        <ContentWrap>
          <AuthorByline
            name={author}
            at={isValidDate ? created : undefined}
            readingMinutes={readingTime(post.content)}
          />

          <Title>{post.title}</Title>
          <Excerpt>{excerpt(post.content)}</Excerpt>
        </ContentWrap>

        <Footer>
          <FooterLeft>
            {category && (
              <Chip size="sm" interactive={false} as="span">
                {category}
              </Chip>
            )}

            {readRate !== null && (
              <StatBadge $tone="accent" title={`${readRate}% of readers reached the end`}>
                <BookOpenCheck /> {readRate}% finished
              </StatBadge>
            )}
          </FooterLeft>

          <StatsRow>
            <StatBadge $tone={likesCount > 0 ? 'love' : undefined} title={`${likesCount} likes`}>
              <Heart /> {likesCount}
            </StatBadge>

            <StatBadge title={`${commentsCount} comments`}>
              <MessageCircle /> {commentsCount}
            </StatBadge>
          </StatsRow>
        </Footer>
      </Body>

      {showThumb && (
        <Thumb $layout={layout}>
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
  text-decoration: none;
  transition: all ${({ theme }) => theme.transitions.fast};
  ${interactive}

  &:hover {
    background: ${({ theme }) => theme.colors.surfaceContainer};
    transform: translateX(2px);
  }
`;

const Rank = styled.span`
  ${text('sm', 'semibold')}
  color: ${({ theme }) => theme.colors.accentText};
  font-variant-numeric: tabular-nums;
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: ${({ theme }) => theme.radii.full};
  background: ${({ theme }) => theme.colors.accentContainer};
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
