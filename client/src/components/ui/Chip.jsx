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
        true: 'bg-primary text-primary-foreground shadow-sm font-semibold',
        false: 'bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground',
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
      ...props
    },
    ref
  ) => {
    const Comp = as || 'button';
    const isClickable = interactive && (Boolean(onClick) || Boolean(as));

    return (
      <Comp
        ref={ref}
        onClick={onClick}
        aria-pressed={onClick ? selected : undefined}
        className={cn(
          chipVariants({ size, selected }),
          (!isClickable || !interactive) && 'cursor-default pointer-events-none hover:bg-muted',
          isClickable && interactive && 'cursor-pointer active:scale-95',
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
