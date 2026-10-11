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
          className="text-xs font-medium text-[hsl(var(--muted-foreground))] pl-0.5 select-none"
        >
          {label}
        </label>
      )}
      <div className="relative flex items-center w-full">
        {icon && (
          <div className="absolute left-3.5 flex items-center pointer-events-none text-[hsl(var(--muted-foreground))] [&_svg]:h-4 [&_svg]:w-4">
            {icon}
          </div>
        )}
        <input
          id={inputId}
          type={type}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={messageId}
          className={cn(
            'flex h-11 w-full rounded-full bg-[hsl(var(--secondary))] px-4 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] transition-all duration-150',
            'shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)] dark:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)] light:shadow-[inset_0_0_0_1px_rgba(15,23,42,0.08)]',
            'hover:bg-[hsl(var(--muted))] focus-visible:outline-none focus-visible:bg-[hsl(var(--card))] focus-visible:shadow-[inset_0_0_0_1.5px_#0ea5e9,0_0_0_3px_rgba(14,165,233,0.2)]',
            'disabled:cursor-not-allowed disabled:opacity-50',
            icon && 'pl-10',
            error && 'shadow-[inset_0_0_0_1.5px_#ef4444] focus-visible:shadow-[inset_0_0_0_1.5px_#ef4444,0_0_0_3px_rgba(239,68,68,0.2)]',
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
            error ? 'text-red-500 font-medium' : 'text-[hsl(var(--muted-foreground))]'
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
          className="text-xs font-medium text-[hsl(var(--muted-foreground))] pl-0.5 select-none"
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
          'flex min-h-[100px] w-full rounded-2xl bg-[hsl(var(--secondary))] px-4 py-3 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] transition-all duration-150 resize-y',
          'shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)] dark:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)] light:shadow-[inset_0_0_0_1px_rgba(15,23,42,0.08)]',
          'hover:bg-[hsl(var(--muted))] focus-visible:outline-none focus-visible:bg-[hsl(var(--card))] focus-visible:shadow-[inset_0_0_0_1.5px_#0ea5e9,0_0_0_3px_rgba(14,165,233,0.2)]',
          'disabled:cursor-not-allowed disabled:opacity-50',
          error && 'shadow-[inset_0_0_0_1.5px_#ef4444] focus-visible:shadow-[inset_0_0_0_1.5px_#ef4444,0_0_0_3px_rgba(239,68,68,0.2)]',
          className
        )}
        {...props}
      />
      {(error || hint) && (
        <p
          id={messageId}
          className={cn(
            'text-xs pl-1 font-normal',
            error ? 'text-red-500 font-medium' : 'text-[hsl(var(--muted-foreground))]'
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
        'text-xs font-semibold tracking-wider uppercase text-[hsl(var(--muted-foreground))] select-none',
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
