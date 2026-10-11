import * as React from 'react';
import * as RadixAvatar from '@radix-ui/react-avatar';
import { cva } from 'class-variance-authority';
import { cn } from '../../lib/utils';

/**
 * Avatar — Radix Avatar with Tailwind & shadcn patterns.
 * Smooth image loading with graceful initial fallback and BlogHub gradient background.
 */
const avatarVariants = cva(
  'inline-flex shrink-0 items-center justify-center select-none overflow-hidden align-middle bg-gradient-to-tr from-[hsl(var(--primary))] to-[hsl(var(--primary-hover))] shadow-sm',
  {
    variants: {
      size: {
        xs: 'h-6 w-6 text-[11px]',
        sm: 'h-8 w-8 text-xs',
        md: 'h-10 w-10 text-sm',
        lg: 'h-12 w-12 text-base',
        xl: 'h-16 w-16 text-xl',
        '2xl': 'h-24 w-24 text-3xl',
      },
      shape: {
        circle: 'rounded-full',
        square: 'rounded-xl',
      },
    },
    defaultVariants: {
      size: 'md',
      shape: 'circle',
    },
  }
);

const initialsFrom = (name) =>
  (name || '')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase() || '?';

export const Avatar = React.forwardRef(
  (
    {
      className,
      src,
      name,
      size = 'md',
      shape = 'circle',
      delayMs = 300,
      $size,
      $shape,
      ...props
    },
    ref
  ) => {
    const finalSize = size || $size || 'md';
    const finalShape = shape || $shape || 'circle';

    return (
      <RadixAvatar.Root
        ref={ref}
        className={cn(avatarVariants({ size: finalSize, shape: finalShape }), className)}
        {...props}
      >
        {src && (
          <RadixAvatar.Image
            src={src}
            alt={name ? `${name}'s avatar` : 'Avatar'}
            className="h-full w-full object-cover"
          />
        )}
        <RadixAvatar.Fallback
          delayMs={src ? delayMs : 0}
          className="flex h-full w-full items-center justify-center font-bold text-white select-none leading-none tracking-wide"
        >
          {initialsFrom(name)}
        </RadixAvatar.Fallback>
      </RadixAvatar.Root>
    );
  }
);

Avatar.displayName = 'Avatar';
