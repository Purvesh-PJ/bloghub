import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled, { css } from 'styled-components';

import { display, text, clamp, media, interactive } from '../../styles/theme/mixins';
import { excerpt, readingTime } from '../../utils/text';
import { AuthorByline } from './AuthorByline';

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

  ${({ $layout, $hasThumb }) =>
    $layout === 'stacked' || !$hasThumb
      ? css`
          grid-template-columns: 1fr;
          align-items: start;
        `
      : css`
          grid-template-columns: 200px 1fr;
          align-items: center;

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
`;

const ContentWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
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
  ${({ $hasThumb }) => ($hasThumb ? clamp(2) : clamp(3))}
`;

const Thumb = styled.div`
  position: relative;
  border-radius: ${({ theme }) => theme.radii.lg};
  overflow: hidden;
  background: ${({ theme }) => theme.colors.surfaceContainer};
  width: 100%;
  aspect-ratio: 16 / 10;
  max-height: 135px;
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    aspect-ratio: 16 / 10;
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
      max-height: unset;
    `}
`;

const HashtagsWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 4px;
`;

const TagHash = styled.span`
  ${text('xs', 'semibold')}
  color: ${({ theme }) => theme.colors.accentText};
  letter-spacing: 0.01em;
  transition: all ${({ theme }) => theme.transitions.fast};
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.colors.accentSolidHover};
    text-decoration: underline;
    text-underline-offset: 3px;
  }
`;

export function PostCard({ post, layout = 'row', variant = 'elevated' }) {
  const navigate = useNavigate();
  const [imageFailed, setImageFailed] = useState(false);

  if (!post) return null;

  const rawTags = (post.tags || [])
    .map((t) => (typeof t === 'string' ? t : t?.name))
    .filter(Boolean);

  const author = post.author?.name || post.author?.username || post.user?.username || 'Anonymous';
  const created = post.createdAt ? new Date(post.createdAt) : null;
  const isValidDate = created && !Number.isNaN(created.getTime());
  const showThumb = Boolean(post.imageURL) && !imageFailed;

  return (
    <Card to={`/post/${post._id}`} $layout={layout} $hasThumb={showThumb} $variant={variant}>
      {showThumb && (
        <Thumb $layout={layout}>
          <img src={post.imageURL} alt="" loading="lazy" onError={() => setImageFailed(true)} />
        </Thumb>
      )}

      <Body>
        <ContentWrap>
          {/* 1. Title First */}
          <Title $variant={variant}>{post.title}</Title>

          {/* 2. User Profile & Details */}
          <AuthorByline
            name={author}
            at={isValidDate ? created : undefined}
            readingMinutes={readingTime(post.content)}
          />

          {/* 3. Short description / Excerpt */}
          <Excerpt $hasThumb={showThumb}>{excerpt(post.content)}</Excerpt>

          {/* 4. Hashtags directly below description */}
          {rawTags.length > 0 && (
            <HashtagsWrap>
              {rawTags.slice(0, 3).map((tag) => {
                const clean = tag.toLowerCase().replace(/^[#_-]+/, '');
                return (
                  <TagHash
                    key={clean}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      navigate(`/search?topic=${encodeURIComponent(clean)}`);
                    }}
                    title={`Explore stories in #${clean}`}
                  >
                    #{clean}
                  </TagHash>
                );
              })}
            </HashtagsWrap>
          )}
        </ContentWrap>
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
