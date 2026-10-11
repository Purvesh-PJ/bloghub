import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { excerpt, readingTime } from '../../utils/text';
import { AuthorByline } from './AuthorByline';
import { cn } from '../../lib/utils';

/**
 * PostCard — elevated editorial story card.
 * Supports `row` for main feed / search and `stacked` for grids / profile views.
 * Preserves BlogHub signature 28px card radius, ambient glow on hover, and smooth micro-lifts.
 */
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

  const variantClasses = {
    elevated:
      'bg-[hsl(var(--card))] border border-black/8 dark:border-white/8 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.04)] hover:bg-[hsl(var(--card))] hover:border-black/15 dark:hover:border-white/15 hover:shadow-[0_14px_28px_-6px_rgba(15,23,42,0.08),0_0_16px_-2px_rgba(14,165,233,0.10)]',
    featured:
      'bg-[hsl(var(--card))] border border-black/8 dark:border-white/8 shadow-[0_4px_16px_-2px_rgba(15,23,42,0.06)] hover:bg-[hsl(var(--card))] hover:border-black/15 dark:hover:border-white/15 hover:shadow-[0_16px_32px_-6px_rgba(15,23,42,0.1),0_0_16px_-2px_rgba(14,165,233,0.15)]',
    ghost:
      'bg-transparent border border-transparent hover:bg-[hsl(var(--muted))/0.5]',
    inset:
      'bg-[hsl(var(--muted))/0.4] border border-black/8 dark:border-white/8 shadow-inner hover:bg-[hsl(var(--muted))/0.6]',
  };

  return (
    <Link
      to={`/post/${post._id}`}
      className={cn(
        'group relative grid gap-4 sm:gap-6 p-5 sm:p-6 rounded-[24px] text-inherit no-underline overflow-hidden transition-all duration-200 hover:-translate-y-0.5',
        variantClasses[variant] || variantClasses.elevated,
        layout === 'stacked' || !showThumb
          ? 'grid-cols-1 items-start'
          : 'grid-cols-1 sm:grid-cols-[180px_1fr] md:grid-cols-[230px_1fr] items-stretch'
      )}
    >
      {/* Thumbnail */}
      {showThumb && (
        <div
          className={cn(
            'relative rounded-[16px] overflow-hidden bg-[hsl(var(--muted))] w-full shrink-0',
            layout === 'stacked'
              ? 'aspect-video h-auto'
              : 'h-full min-h-[155px] aspect-[16/10]'
          )}
        >
          <img
            src={post.imageURL}
            alt=""
            loading="lazy"
            onError={() => setImageFailed(true)}
            className="w-full h-full object-cover block transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      )}

      {/* Body Content */}
      <div className="min-w-0 flex flex-col justify-between gap-2.5 h-full">
        <div className="flex flex-col gap-2">
          {/* 1. Title */}
          <h3
            className={cn(
              'font-bold leading-snug tracking-tight text-[hsl(var(--foreground))] line-clamp-2 transition-colors duration-150 group-hover:text-[hsl(var(--primary))]',
              variant === 'featured' ? 'text-xl sm:text-2xl' : 'text-lg sm:text-xl'
            )}
          >
            {post.title}
          </h3>

          {/* 2. Author Profile Byline */}
          <AuthorByline
            name={author}
            at={isValidDate ? created : undefined}
            readingMinutes={readingTime(post.content)}
          />

          {/* 3. Description / Excerpt */}
          <p
            className={cn(
              'text-sm leading-relaxed text-[hsl(var(--muted-foreground))]',
              showThumb ? 'line-clamp-2' : 'line-clamp-3'
            )}
          >
            {excerpt(post.content)}
          </p>

          {/* 4. Hashtags */}
          {rawTags.length > 0 && (
            <div className="flex items-center gap-2.5 flex-wrap mt-1">
              {rawTags.slice(0, 3).map((tag) => {
                const clean = tag.toLowerCase().replace(/^[#_-]+/, '');
                return (
                  <span
                    key={clean}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      navigate(`/search?topic=${encodeURIComponent(clean)}`);
                    }}
                    title={`Explore stories in #${clean}`}
                    className="text-xs font-semibold text-[hsl(var(--primary))] tracking-wide cursor-pointer hover:underline hover:underline-offset-4 transition-colors"
                  >
                    #{clean}
                  </span>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

/**
 * Compact post card for sidebars and trending lists.
 */
export function PostCardCompact({ post, rank }) {
  if (!post) return null;

  return (
    <Link
      to={`/post/${post._id}`}
      className="flex gap-3 items-baseline p-3 -mx-3 rounded-xl no-underline transition-all duration-150 hover:bg-[hsl(var(--muted))] hover:translate-x-1"
    >
      {rank != null && (
        <span className="text-xs font-bold text-[hsl(var(--primary))] tabular-nums shrink-0 inline-flex items-center justify-center w-6 h-6 rounded-full bg-[hsl(var(--primary))/0.10] select-none">
          {String(rank).padStart(2, '0')}
        </span>
      )}
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-[hsl(var(--foreground))] line-clamp-2 leading-snug">
          {post.title}
        </p>
        <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1 truncate">
          {post.user?.username ?? 'Anonymous'} · {post.likes?.length ?? 0} likes
        </p>
      </div>
    </Link>
  );
}
