import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../lib/utils';

export const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 select-none shrink-0',
  {
    variants: {
      variant: {
        neutral: 'bg-secondary text-muted-foreground border border-transparent',
        primary: 'bg-accent text-accent-foreground border border-transparent',
        success: 'bg-success/15 text-emerald-600 dark:text-emerald-400 border border-transparent',
        warning: 'bg-warning/15 text-amber-600 dark:text-amber-400 border border-transparent',
        danger: 'bg-destructive/15 text-destructive border border-transparent',
        info: 'bg-info/15 text-sky-600 dark:text-sky-400 border border-transparent',
        outline: 'text-foreground border border-border bg-transparent',
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
