import * as React from 'react';
import { useId } from 'react';
import { cn } from '../../lib/utils';

export function Input({
  className,
  label,
  error,
  hint,
  icon,
  fullWidth = true,
  id,
  type = 'text',
  ...props
}) {
  const generatedId = useId();
  const inputId = id ?? props.name ?? generatedId;
  const messageId = error || hint ? `${inputId}-message` : undefined;

  return (
    <div className={cn('flex flex-col gap-1.5', fullWidth ? 'w-full' : 'w-auto')}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs font-medium text-muted-foreground pl-0.5 select-none"
        >
          {label}
        </label>
      )}
      <div className="relative flex items-center w-full">
        {icon && (
          <div className="absolute left-3.5 flex items-center pointer-events-none text-muted-foreground [&_svg]:h-4 [&_svg]:w-4">
            {icon}
          </div>
        )}
        <input
          id={inputId}
          type={type}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={messageId}
          className={cn(
            'flex h-11 w-full rounded-full bg-secondary px-4 text-sm text-foreground placeholder:text-muted-foreground transition-all duration-150',
            'border border-border',
            'hover:bg-muted focus-visible:outline-none focus-visible:bg-card focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary',
            'disabled:cursor-not-allowed disabled:opacity-50',
            icon && 'pl-10',
            error && 'border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20',
            className
          )}
          {...props}
        />
      </div>
      {(error || hint) && (
        <p
          id={messageId}
          className={cn(
            'text-xs pl-1 font-normal',
            error ? 'text-destructive font-medium' : 'text-muted-foreground'
          )}
        >
          {error || hint}
        </p>
      )}
    </div>
  );
}

export function TextArea({
  className,
  label,
  error,
  hint,
  fullWidth = true,
  id,
  rows = 4,
  ...props
}) {
  const generatedId = useId();
  const inputId = id ?? props.name ?? generatedId;
  const messageId = error || hint ? `${inputId}-message` : undefined;

  return (
    <div className={cn('flex flex-col gap-1.5', fullWidth ? 'w-full' : 'w-auto')}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs font-medium text-muted-foreground pl-0.5 select-none"
        >
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        rows={rows}
        aria-invalid={Boolean(error) || undefined}
        aria-describedby={messageId}
        className={cn(
          'flex min-h-[100px] w-full rounded-2xl bg-secondary px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground transition-all duration-150 resize-y',
          'border border-border',
          'hover:bg-muted focus-visible:outline-none focus-visible:bg-card focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary',
          'disabled:cursor-not-allowed disabled:opacity-50',
          error && 'border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20',
          className
        )}
        {...props}
      />
      {(error || hint) && (
        <p
          id={messageId}
          className={cn(
            'text-xs pl-1 font-normal',
            error ? 'text-destructive font-medium' : 'text-muted-foreground'
          )}
        >
          {error || hint}
        </p>
      )}
    </div>
  );
}

export function Eyebrow({ className, children, ...props }) {
  return (
    <span
      className={cn(
        'text-xs font-semibold tracking-wider uppercase text-muted-foreground select-none',
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
