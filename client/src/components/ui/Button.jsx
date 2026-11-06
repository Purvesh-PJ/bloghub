import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import { cn } from '../../lib/utils';
import { Spinner } from './Spinner';

/**
 * BlogHub Button — built on shadcn/ui pattern with class-variance-authority (CVA).
 * Features signature pill-shaped geometry, soft ambient glow, and micro-press scale animations.
 * Supports both shadcn's `asChild` and backward-compatible `as` (e.g. as={Link}).
 */
export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 shrink-0 select-none whitespace-nowrap text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-45 active:scale-[0.98] rounded-full cursor-pointer',
  {
    variants: {
      variant: {
        primary:
          'bg-primary text-primary-foreground shadow-sm hover:brightness-105 active:brightness-95 shadow-[0_2px_10px_-2px_rgba(14,165,233,0.35)] hover:shadow-[0_4px_16px_0_rgba(14,165,233,0.45)]',
        secondary:
          'bg-secondary text-secondary-foreground border border-border hover:bg-muted hover:border-ring',
        tonal:
          'bg-accent text-accent-foreground hover:brightness-95 dark:hover:brightness-110',
        outline:
          'border border-border bg-transparent text-foreground hover:bg-muted hover:text-foreground',
        ghost:
          'bg-transparent text-foreground hover:bg-muted',
        danger:
          'bg-destructive text-destructive-foreground hover:brightness-90 shadow-sm',
        dangerTonal:
          'bg-destructive/10 text-destructive hover:bg-destructive/20 active:bg-destructive/25',
        subtle:
          'bg-transparent text-muted-foreground hover:text-foreground hover:bg-muted',
      },
      size: {
        sm: 'h-8 px-3.5 text-xs',
        md: 'h-10 px-5 text-sm',
        lg: 'h-12 px-6 text-base',
        icon: 'h-9 w-9 p-0',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export const Button = React.forwardRef(
  (
    {
      className,
      variant,
      size,
      loading = false,
      isLoading = false,
      disabled = false,
      fullWidth = false,
      leftIcon,
      rightIcon,
      children,
      asChild = false,
      as,
      ...props
    },
    ref
  ) => {
    const isBusy = loading || isLoading;
    const Comp = asChild ? Slot : (as || 'button');
    const isDisabled = disabled || isBusy;

    return (
      <Comp
        ref={ref}
        disabled={Comp === 'button' ? isDisabled : undefined}
        aria-disabled={isDisabled || undefined}
        className={cn(
          buttonVariants({ variant, size }),
          fullWidth && 'w-full',
          className
        )}
        {...props}
      >
        {loading && <Spinner size="sm" />}
        {!loading && leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
        {children}
        {!loading && rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
      </Comp>
    );
  }
);

Button.displayName = 'Button';

export const IconButton = React.forwardRef(
  ({ className, variant = 'ghost', size = 'icon', ...props }, ref) => {
    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        className={cn('h-9 w-9 rounded-full p-0', className)}
        {...props}
      />
    );
  }
);

IconButton.displayName = 'IconButton';

