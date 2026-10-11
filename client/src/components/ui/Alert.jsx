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
        info: 'bg-[hsl(var(--primary))/0.08] text-[hsl(var(--foreground))] border-[hsl(var(--primary))/0.25] [&>svg]:text-[hsl(var(--primary))]',
        success: 'bg-emerald-500/10 text-[hsl(var(--foreground))] border-emerald-500/25 [&>svg]:text-emerald-500',
        warning: 'bg-amber-500/10 text-[hsl(var(--foreground))] border-amber-500/25 [&>svg]:text-amber-500',
        danger: 'bg-[hsl(var(--destructive))/0.10] text-[hsl(var(--destructive))] border-[hsl(var(--destructive))/0.25] [&>svg]:text-[hsl(var(--destructive))]',
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
        {title && <h5 className="font-semibold leading-tight mb-1 text-[hsl(var(--foreground))]">{title}</h5>}
        <div className="text-sm opacity-90">{children}</div>
      </div>
    </div>
  );
}
