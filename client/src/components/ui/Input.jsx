import * as React from 'react';
import { useId } from 'react';
import { Search, X } from 'lucide-react';
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
            error &&
              'border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20',
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
          error &&
            'border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20',
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

/**
 * SearchInput — accessible, styled search field with built-in search icon and clear button.
 */
export function SearchInput({
  className,
  value,
  onChange,
  onClear,
  placeholder = 'Search…',
  ariaLabel = 'Search',
  disabled = false,
  fullWidth = true,
  density = 'default',
  type = 'text',
  ...props
}) {
  const hasValue = Boolean(value && String(value).length > 0);

  const handleClear = () => {
    if (onClear) {
      onClear();
    } else if (onChange) {
      onChange({ target: { value: '' } });
    }
  };

  return (
    <div className={cn('relative flex items-center', fullWidth ? 'w-full' : 'w-auto')}>
      <div className="absolute left-3.5 flex items-center pointer-events-none text-muted-foreground [&_svg]:h-4 [&_svg]:w-4">
        <Search className="h-4 w-4" aria-hidden="true" />
      </div>
      <input
        type={type}
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        aria-label={ariaLabel}
        className={cn(
          'flex w-full rounded-full bg-secondary pl-10 pr-9 text-sm text-foreground placeholder:text-muted-foreground transition-all duration-150',
          'border border-border',
          'hover:bg-muted focus-visible:outline-none focus-visible:bg-card focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary',
          'disabled:cursor-not-allowed disabled:opacity-50',
          '[&::-webkit-search-cancel-button]:hidden',
          density === 'compact' ? 'h-9 text-xs' : 'h-10 text-sm',
          className
        )}
        {...props}
      />
      {hasValue && !disabled && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear search"
          className="absolute right-2.5 p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
        >
          <X className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
