import * as React from 'react';
import { cva } from 'class-variance-authority';
import { AlertCircle, CheckCircle2, Info, AlertTriangle } from 'lucide-react';
import { cn } from '../../lib/utils';

/**
 * Alert — accessible feedback callout with Tailwind & shadcn styling.
 */
const alertVariants = cva(
  'relative flex items-start gap-3 w-full rounded-xl p-4 text-sm font-normal border transition-colors',
  {
    variants: {
      variant: {
        info: 'bg-primary/10 text-foreground border-primary/25 [&>svg]:text-primary',
        success: 'bg-success/10 text-foreground border-success/25 [&>svg]:text-success',
        warning: 'bg-warning/10 text-foreground border-warning/25 [&>svg]:text-warning',
        danger: 'bg-destructive/10 text-destructive border-destructive/25 [&>svg]:text-destructive',
      },
    },
    defaultVariants: {
      variant: 'info',
    },
  }
);

const icons = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  danger: AlertCircle,
};

export function Alert({ children, variant = 'info', title, className, ...props }) {
  const key = variant === 'error' ? 'danger' : variant;
  const Icon = icons[key] || Info;

  return (
    <div
      role={key === 'danger' ? 'alert' : 'status'}
      className={cn(alertVariants({ variant: key }), className)}
      {...props}
    >
      <Icon className="h-5 w-5 shrink-0 mt-0.5" />
      <div className="flex-1">
        {title && <h5 className="font-semibold leading-tight mb-1 text-foreground">{title}</h5>}
        <div className="text-sm opacity-90">{children}</div>
      </div>
    </div>
  );
}
