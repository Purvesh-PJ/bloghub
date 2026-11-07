import * as React from 'react';
import { useId, forwardRef, useEffect, useRef } from 'react';
import { cn } from '../../lib/utils';

/**
 * Checkbox — accessible, semantic design-system checkbox primitive.
 * Supports checked, indeterminate, disabled, label, hint, and error states.
 */
export const Checkbox = forwardRef(function Checkbox(
  { className, label, error, hint, disabled = false, indeterminate = false, id, ...props },
  forwardedRef
) {
  const generatedId = useId();
  const checkboxId = id ?? props.name ?? generatedId;
  const innerRef = useRef(null);
  const ref = forwardedRef || innerRef;

  useEffect(() => {
    if (ref && 'current' in ref && ref.current) {
      ref.current.indeterminate = Boolean(indeterminate);
    }
  }, [ref, indeterminate]);

  const inputElement = (
    <input
      ref={ref}
      id={checkboxId}
      type="checkbox"
      disabled={disabled}
      className={cn(
        'h-4 w-4 rounded border border-border bg-secondary text-primary accent-primary',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary',
        'disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer transition-colors',
        error && 'border-destructive focus-visible:ring-destructive/20',
        className
      )}
      {...props}
    />
  );

  if (!label && !error && !hint) {
    return inputElement;
  }

  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={checkboxId}
        className={cn(
          'inline-flex items-center gap-2 select-none text-sm text-foreground',
          disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
        )}
      >
        {inputElement}
        {label && <span>{label}</span>}
      </label>
      {(error || hint) && (
        <p
          className={cn(
            'text-xs pl-6 font-normal',
            error ? 'text-destructive font-medium' : 'text-muted-foreground'
          )}
        >
          {error || hint}
        </p>
      )}
    </div>
  );
});
