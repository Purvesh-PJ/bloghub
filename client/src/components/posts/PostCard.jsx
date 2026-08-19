import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, BookOpenCheck } from 'lucide-react';
import styled, { css } from 'styled-components';

import { display, text, clamp, media, interactive } from '../../styles/theme/mixins';
import { excerpt, readingTime } from '../../utils/text';
import { Chip } from '../ui';
import { AuthorByline } from './AuthorByline';
import { topicIcon } from '../marketing/Topics';

/**
 * PostCard — elevated editorial story card.
 *
 * Supports `row` for main feed / search and `stacked` for grids / profile views.
 */

const cardVariants = {
  /** Standard elevated surface (Default) */
  elevated: css`
    background: ${({ theme }) => theme.colors.surfaceElevated};
    border: 1px solid ${({ theme }) => theme.colors.lineSubtle};
    box-shadow: 0 2px 8px -2px rgba(15, 23, 42, 0.04);

    &:hover {
      background: ${({ theme }) => theme.colors.surfaceHover};
      border-color: ${({ theme }) => theme.colors.lineDefault};
      box-shadow:
        0 14px 28px -6px rgba(15, 23, 42, 0.08),
        0 0 16px -2px rgba(14, 165, 233, 0.08);
      transform: translateY(-2px);
    }
  `,

  /** Featured spotlight card with soft elevation */
  featured: css`
    background: ${({ theme }) => theme.colors.surfaceElevated};
    border: 1px solid ${({ theme }) => theme.colors.lineSubtle};
    box-shadow: 0 4px 16px -2px rgba(15, 23, 42, 0.06);

    &:hover {
      background: ${({ theme }) => theme.colors.surfaceHover};
      border-color: ${({ theme }) => theme.colors.lineDefault};
      box-shadow:
        0 16px 32px -6px rgba(15, 23, 42, 0.1),
        0 0 16px -2px rgba(14, 165, 233, 0.12);
      transform: translateY(-2px);
    }
  `,

  /** Ghost / Minimal seamless editorial card */
  ghost: css`
    background: transparent;
    border: 1px solid transparent;
    box-shadow: none;
    border-radius: ${({ theme }) => theme.radii.lg};

    &:hover {
      background: ${({ theme }) => theme.colors.surfaceContainerLow};
      box-shadow: none;
      transform: translateY(-2px);
    }
  `,

  /** Inset sunken well */
  inset: css`
    background: ${({ theme }) => theme.colors.surfaceContainerLow};
    border: 1px solid ${({ theme }) => theme.colors.lineSubtle};
    box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.04);

    &:hover {
      background: ${({ theme }) => theme.colors.surfaceContainer};
      transform: translateY(-2px);
    }
  `,
};

const Card = styled(Link)`
  position: relative;
  display: grid;
  gap: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.radii.xl};
  text-decoration: none;
  overflow: hidden;
  transition: all ${({ theme }) => theme.transitions.fast};
  ${interactive}

  ${({ $variant }) => cardVariants[$variant] ?? cardVariants.elevated}

  ${({ $layout }) =>
    $layout === 'stacked'
      ? css`
          grid-template-columns: 1fr;
          align-items: start;
        `
      : css`
          grid-template-columns: 190px 1fr;
          align-items: stretch;

          ${media.down('md')`
            grid-template-columns: 160px 1fr;
          `}

          ${media.down('sm')`
            grid-template-columns: 1fr;
            gap: ${({ theme }) => theme.spacing.md};
          `}
        `}
`;

const Body = styled.div`
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  height: 100%;
  justify-content: space-between;
`;

const ContentWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Title = styled.h3`
  ${({ $variant }) => ($variant === 'featured' ? display('sm') : display('xs'))}
  font-weight: 700;
  line-height: 1.35;
  letter-spacing: -0.015em;
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
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: 6px;
  border-top: none;
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
  width: 100%;
  height: 100%;
  min-height: 130px;
  aspect-ratio: 16 / 10;
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform ${({ theme }) => theme.transitions.normal};
  }

  ${Card}:hover & img {
    transform: scale(1.05);
  }

  ${({ $layout }) =>
    $layout === 'stacked' &&
    css`
      aspect-ratio: 16 / 9;
      min-height: unset;
    `}
`;

const ThumbPlaceholder = styled.div`
  position: relative;
  border-radius: ${({ theme }) => theme.radii.lg};
  overflow: hidden;
  width: 100%;
  height: 100%;
  min-height: 130px;
  aspect-ratio: 16 / 10;
  flex-shrink: 0;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.surfaceContainer} 0%,
    ${({ theme }) => theme.colors.surfaceContainerHigh} 100%
  );
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 1px solid ${({ theme }) => theme.colors.lineSubtle};
  transition: all ${({ theme }) => theme.transitions.normal};

  ${({ $layout }) =>
    $layout === 'stacked' &&
    css`
      aspect-ratio: 16 / 9;
      min-height: 140px;
    `}

  .icon-wrap {
    width: 42px;
    height: 42px;
    border-radius: ${({ theme }) => theme.radii.full};
    background: ${({ theme }) => theme.colors.accentContainer};
    color: ${({ theme }) => theme.colors.accentSolid};
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 12px -2px rgba(14, 165, 233, 0.15);
    transition: transform ${({ theme }) => theme.transitions.normal};

    svg {
      width: 20px;
      height: 20px;
    }
  }

  .topic-label {
    ${text('xs', 'semibold')}
    color: ${({ theme }) => theme.colors.textMuted};
    letter-spacing: 0.02em;
  }

  ${Card}:hover & {
    background: linear-gradient(
      135deg,
      ${({ theme }) => theme.colors.surfaceContainerHigh} 0%,
      ${({ theme }) => theme.colors.surfaceContainerHighest} 100%
    );

    .icon-wrap {
      transform: scale(1.1);
    }
  }
`;

export function PostCard({ post, layout = 'row', variant = 'elevated' }) {
  const [imageFailed, setImageFailed] = useState(false);

  if (!post) return null;

  const rawTopic = post.tags?.[0]?.name || post.tags?.[0] || '';
  const primaryTopic = rawTopic
    ? String(rawTopic).toLowerCase() === 'uiux'
      ? 'UI/UX'
      : String(rawTopic).toLowerCase() === 'ai'
        ? 'AI'
        : String(rawTopic).toLowerCase() === 'saas'
          ? 'SaaS'
          : String(rawTopic).toLowerCase() === 'nodejs'
            ? 'Node.js'
            : String(rawTopic).charAt(0).toUpperCase() + String(rawTopic).slice(1)
    : '';
  const TopicIcon = topicIcon(rawTopic);
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
    <Card to={`/post/${post._id}`} $layout={layout} $variant={variant}>
      {showThumb ? (
        <Thumb $layout={layout}>
          <img src={post.imageURL} alt="" loading="lazy" onError={() => setImageFailed(true)} />
        </Thumb>
      ) : (
        <ThumbPlaceholder $layout={layout}>
          <div className="icon-wrap">
            <TopicIcon />
          </div>
          {primaryTopic && <span className="topic-label">{primaryTopic}</span>}
        </ThumbPlaceholder>
      )}

      <Body>
        <ContentWrap>
          <AuthorByline
            name={author}
            at={isValidDate ? created : undefined}
            readingMinutes={readingTime(post.content)}
          />

          <Title $variant={variant}>{post.title}</Title>
          <Excerpt>{excerpt(post.content)}</Excerpt>
        </ContentWrap>

        <Footer>
          <FooterLeft>
            {primaryTopic && (
              <Chip size="sm" interactive={false} as="span">
                {primaryTopic}
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
