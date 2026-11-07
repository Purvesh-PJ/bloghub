import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '../../lib/utils';

const GRID_COLS = {
  2: 'grid grid-cols-1 sm:grid-cols-2 gap-4',
  3: 'grid grid-cols-1 sm:grid-cols-3 gap-4',
  4: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4',
};

/**
 * ChoiceGrid — Composed pattern for visual selection cards (Theme, Visibility, Modes).
 * Handles accessible keyboard selection, selection state, and checkmark indicators.
 */
export function ChoiceGrid({
  options = [],
  value,
  onChange,
  columns = 3,
  ariaLabel = 'Options',
  className,
}) {
  const gridClass = GRID_COLS[columns] || GRID_COLS[3];

  return (
    <div role="radiogroup" aria-label={ariaLabel} className={cn(gridClass, className)}>
      {options.map(({ id, label, description, icon: Icon }) => {
        const isActive = value === id;

        return (
          <button
            key={id}
            type="button"
            role="radio"
            aria-checked={isActive}
            onClick={() => onChange?.(id)}
            className={cn(
              'relative flex flex-col items-center gap-3 p-6 rounded-2xl border transition-all cursor-pointer select-none text-center',
              isActive
                ? 'bg-primary/12 text-primary border-primary shadow-sm'
                : 'bg-muted text-muted-foreground border-transparent hover:bg-muted/80'
            )}
          >
            {isActive && (
              <span className="absolute top-3 right-3 flex items-center justify-center w-5 h-5 rounded-full bg-primary text-primary-foreground">
                <Check className="w-3 h-3" aria-hidden="true" />
              </span>
            )}
            {Icon && <Icon className="w-6 h-6 shrink-0" aria-hidden="true" />}
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-semibold">{label}</span>
              {description && <span className="text-xs text-muted-foreground">{description}</span>}
            </div>
          </button>
        );
      })}
    </div>
  );
}
