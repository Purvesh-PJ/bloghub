import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../lib/utils';

/**
 * Skeleton — animated shimmer placeholder for loading states.
 */
const skeletonVariants = cva('animate-pulse shrink-0 bg-muted', {
  variants: {
    variant: {
      default: 'rounded-md',
      circle: 'rounded-full',
      pill: 'rounded-full',
      card: 'rounded-2xl border border-border',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export function Skeleton({
  className,
  variant = 'default',
  width,
  height,
  radius,
  style,
  ...props
}) {
  const inlineStyle = {
    ...(width ? { width: typeof width === 'number' ? `${width}px` : width } : {}),
    ...(height ? { height: typeof height === 'number' ? `${height}px` : height } : {}),
    ...(radius ? { borderRadius: typeof radius === 'number' ? `${radius}px` : radius } : {}),
    ...style,
  };

  return (
    <div style={inlineStyle} className={cn(skeletonVariants({ variant }), className)} {...props} />
  );
}

export function SkeletonText({
  lines = 3,
  gap = 'sm',
  lineHeight = '14px',
  lastLineWidth = '60%',
  className,
}) {
  const gapClass = gap === 'sm' ? 'gap-2' : gap === 'md' ? 'gap-3' : 'gap-4';

  return (
    <div className={cn('flex flex-col w-full', gapClass, className)}>
      {Array.from({ length: lines }).map((_, index) => {
        const isLast = index === lines - 1;
        const width = isLast ? lastLineWidth : index % 2 === 1 ? '92%' : '100%';
        const textKey = `skeleton-text-line-${index + 1}`;
        return <Skeleton key={textKey} width={width} height={lineHeight} className="rounded" />;
      })}
    </div>
  );
}

/**
 * TableSkeleton — structured table and management list placeholder.
 */
export function TableSkeleton({
  rows = 5,
  hasAvatar = false,
  hasCheckbox = false,
  hasBadge = true,
  hasSecondary = true,
  inCard = true,
  className,
}) {
  const content = (
    <div className={cn('flex flex-col w-full divide-y divide-border/40', className)}>
      {Array.from({ length: rows }).map((_, index) => {
        const rowKey = `table-skeleton-row-${index + 1}`;
        return (
          <div
            key={rowKey}
            className="flex items-center justify-between py-3.5 px-4 first:pt-2 last:pb-2 gap-4"
          >
            <div className="flex items-center gap-3.5 flex-1 min-w-0">
              {hasCheckbox && <Skeleton width={18} height={18} className="rounded" />}
              {hasAvatar && <Skeleton variant="circle" width={36} height={36} />}
              <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                <Skeleton width={index % 2 === 0 ? '55%' : '65%'} height={15} className="rounded" />
                {hasSecondary && (
                  <Skeleton
                    width={index % 2 === 0 ? '25%' : '35%'}
                    height={11}
                    className="rounded"
                  />
                )}
              </div>
            </div>
            {hasBadge && <Skeleton width={60} height={22} className="rounded-full" />}
          </div>
        );
      })}
    </div>
  );

  if (!inCard) {
    return <div aria-hidden="true">{content}</div>;
  }

  return (
    <div aria-hidden="true" className="w-full">
      <div className="rounded-2xl border border-border bg-card p-2 overflow-hidden shadow-xs">
        {content}
      </div>
    </div>
  );
}

/**
 * ListSkeleton — generic stacked list skeleton for items, comments, or cards.
 */
export function ListSkeleton({ count = 3, gap = 'md', className, renderItem }) {
  const gapClass = gap === 'sm' ? 'gap-2' : gap === 'lg' ? 'gap-6' : 'gap-4';

  return (
    <div aria-hidden="true" className={cn('flex flex-col w-full', gapClass, className)}>
      {Array.from({ length: count }).map((_, index) => {
        const itemKey = `list-skeleton-item-${index + 1}`;
        if (renderItem) {
          return <React.Fragment key={itemKey}>{renderItem(index)}</React.Fragment>;
        }
        return (
          <div
            key={itemKey}
            className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-card/60 gap-4"
          >
            <div className="flex flex-col gap-2 flex-1 min-w-0">
              <Skeleton width="60%" height={16} className="rounded" />
              <Skeleton width="35%" height={12} className="rounded" />
            </div>
            <Skeleton width={50} height={20} className="rounded-full" />
          </div>
        );
      })}
    </div>
  );
}
