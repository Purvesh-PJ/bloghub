import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../lib/utils';

/**
 * Chip — pill-shaped filter or interactive category token.
 */
const chipVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full font-medium whitespace-nowrap shrink-0 transition-all select-none',
  {
    variants: {
      size: {
        sm: 'h-7 px-3 text-xs',
        md: 'h-9 px-4 text-sm',
      },
      selected: {
        true: 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] shadow-sm font-semibold',
        false:
          'bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--accent-foreground))]',
      },
    },
    defaultVariants: {
      size: 'md',
      selected: false,
    },
  }
);

export const Chip = React.forwardRef(
  (
    {
      className,
      children,
      selected = false,
      size = 'md',
      as,
      onClick,
      interactive = true,
      $selected,
      $size,
      $interactive,
      ...props
    },
    ref
  ) => {
    const Comp = as || 'button';
    const isSelected = selected || $selected || false;
    const finalSize = size || $size || 'md';
    const isClickable = interactive && (Boolean(onClick) || Boolean(as));

    return (
      <Comp
        ref={ref}
        onClick={onClick}
        aria-pressed={onClick ? isSelected : undefined}
        className={cn(
          chipVariants({ size: finalSize, selected: isSelected }),
          !isClickable && 'cursor-default pointer-events-none hover:bg-[hsl(var(--muted))]',
          isClickable && 'cursor-pointer active:scale-95',
          className
        )}
        {...props}
      >
        {children}
      </Comp>
    );
  }
);

Chip.displayName = 'Chip';
