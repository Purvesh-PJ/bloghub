import { Skeleton, SkeletonText } from '../ui/Skeleton';
import { cn } from '../../lib/utils';

export function PostCardSkeleton({ layout = 'row', hasThumb = true, variant = 'elevated' }) {
  const variantClasses = {
    elevated:
      'bg-[hsl(var(--card))] border border-[hsl(var(--border))/0.4] shadow-[0_2px_8px_-2px_rgba(15,23,42,0.04)]',
    featured:
      'bg-[hsl(var(--card))] border border-[hsl(var(--border))/0.5] shadow-[0_4px_16px_-2px_rgba(15,23,42,0.06)]',
    ghost: 'bg-transparent border border-transparent',
    inset: 'bg-[hsl(var(--muted))/0.4] border border-[hsl(var(--border))/0.4]',
  };

  return (
    <div
      className={cn(
        'grid gap-4 sm:gap-6 p-5 sm:p-6 rounded-[24px]',
        variantClasses[variant] || variantClasses.elevated,
        layout === 'stacked' || !hasThumb
          ? 'grid-cols-1 items-start'
          : 'grid-cols-1 sm:grid-cols-[180px_1fr] md:grid-cols-[230px_1fr] items-stretch'
      )}
      aria-hidden="true"
    >
      {hasThumb && (
        <Skeleton
          className={cn(
            'w-full rounded-[16px]',
            layout === 'stacked'
              ? 'aspect-video h-auto'
              : 'h-full min-h-[155px] aspect-[16/10]'
          )}
        />
      )}

      <div className="min-w-0 flex flex-col justify-between gap-3 h-full">
        {/* 1. Title Skeleton */}
        <SkeletonText lines={2} lineHeight="22px" lastLineWidth="75%" gap="sm" />

        {/* 2. Author Profile Meta */}
        <div className="flex items-center gap-2">
          <Skeleton variant="circle" width={24} height={24} />
          <Skeleton width={90} height={14} className="rounded" />
          <Skeleton width={60} height={14} className="rounded" />
          <Skeleton width={70} height={14} className="rounded" />
        </div>

        {/* 3. Excerpt */}
        <SkeletonText lines={2} lineHeight="14px" lastLineWidth="90%" gap="sm" />

        {/* 4. Hashtags */}
        <div className="flex items-center gap-2 mt-1">
          <Skeleton width={50} height={14} className="rounded-full" />
          <Skeleton width={60} height={14} className="rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function PostCardCompactSkeleton() {
  return (
    <div className="flex gap-3 items-center py-2" aria-hidden="true">
      <Skeleton width={24} height={16} className="rounded" />
      <div className="flex-1 flex flex-col gap-1.5">
        <Skeleton width="85%" height={14} className="rounded" />
        <Skeleton width="45%" height={12} className="rounded" />
      </div>
    </div>
  );
}
