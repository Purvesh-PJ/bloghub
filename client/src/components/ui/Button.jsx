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
          'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] shadow-sm hover:brightness-105 active:brightness-95 shadow-[0_2px_10px_-2px_rgba(14,165,233,0.35)] hover:shadow-[0_4px_16px_0_rgba(14,165,233,0.45)]',
        secondary:
          'bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))] border border-[hsl(var(--border))] hover:bg-[hsl(var(--muted))] hover:border-[hsl(var(--ring))]',
        tonal:
          'bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] hover:brightness-95 dark:hover:brightness-110',
        outline:
          'border border-[hsl(var(--border))] bg-transparent text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))]',
        ghost:
          'bg-transparent text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]',
        danger:
          'bg-[hsl(var(--destructive))] text-[hsl(var(--destructive-foreground))] hover:brightness-90 shadow-sm',
        subtle:
          'bg-transparent text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]',
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

