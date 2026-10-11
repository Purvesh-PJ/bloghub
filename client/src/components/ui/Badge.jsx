import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../lib/utils';

export const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 select-none shrink-0',
  {
    variants: {
      variant: {
        neutral:
          'bg-[hsl(var(--secondary))] text-[hsl(var(--muted-foreground))] border border-transparent',
        primary:
          'bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] border border-transparent',
        success:
          'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-transparent',
        warning:
          'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border border-transparent',
        danger:
          'bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-300 border border-transparent',
        info:
          'bg-sky-50 text-sky-700 dark:bg-sky-950/50 dark:text-sky-300 border border-transparent',
        outline:
          'text-[hsl(var(--foreground))] border border-[hsl(var(--border))] bg-transparent',
      },
    },
    defaultVariants: {
      variant: 'neutral',
    },
  }
);

export function Badge({ className, variant, children, ...props }) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props}>
      {children}
    </span>
  );
}
