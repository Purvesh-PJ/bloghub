import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../lib/utils';

/**
 * Skeleton — animated shimmer placeholder for loading states.
 */
const skeletonVariants = cva(
  'animate-pulse shrink-0 bg-[hsl(var(--muted))]',
  {
    variants: {
      variant: {
        default: 'rounded-md',
        circle: 'rounded-full',
        pill: 'rounded-full',
        card: 'rounded-2xl border border-[hsl(var(--border))]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export function Skeleton({
  className,
  variant = 'default',
  $variant,
  width,
  $width,
  height,
  $height,
  radius,
  $radius,
  style,
  ...props
}) {
  const finalVariant = variant !== 'default' ? variant : ($variant || 'default');
  const finalWidth = width || $width;
  const finalHeight = height || $height;

  const inlineStyle = {
    ...(finalWidth ? { width: typeof finalWidth === 'number' ? `${finalWidth}px` : finalWidth } : {}),
    ...(finalHeight ? { height: typeof finalHeight === 'number' ? `${finalHeight}px` : finalHeight } : {}),
    ...style,
  };

  return (
    <div
      style={inlineStyle}
      className={cn(skeletonVariants({ variant: finalVariant }), className)}
      {...props}
    />
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
        return (
          <Skeleton
            key={index}
            width={width}
            height={lineHeight}
            className="rounded"
          />
        );
      })}
    </div>
  );
}
