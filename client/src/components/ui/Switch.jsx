import { cn } from '../../lib/utils';

/**
 * Switch — accessible toggle switch with optional label and subtitle note.
 */
export function Switch({
  checked = false,
  onChange,
  label,
  note,
  disabled = false,
  id,
  name,
  className,
  'aria-label': ariaLabel,
}) {
  return (
    <label
      htmlFor={id}
      className={cn(
        'flex items-center justify-between gap-6 py-4 cursor-pointer border-b border-border/40 last:border-b-0',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      {(label || note) && (
        <span>
          {label && <span className="text-base font-medium text-foreground block">{label}</span>}
          {note && <span className="text-sm text-muted-foreground block mt-0.5">{note}</span>}
        </span>
      )}
      <input
        id={id}
        name={name}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        aria-label={ariaLabel || (typeof label === 'string' ? label : undefined)}
        onChange={(event) => onChange?.(event.target.checked)}
        className="sr-only peer"
      />
      <div
        className={cn(
          'relative w-12 h-7 rounded-full transition-colors duration-200 shrink-0 cursor-pointer',
          checked ? 'bg-primary' : 'bg-muted'
        )}
      >
        <span
          className={cn(
            'absolute top-1 left-1 w-5 h-5 rounded-full bg-primary-foreground transition-transform duration-200 shadow-sm',
            checked && 'translate-x-5'
          )}
        />
      </div>
    </label>
  );
}
