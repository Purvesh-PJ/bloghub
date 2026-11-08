import React from 'react';
import { Check } from 'lucide-react';
import { Card } from '../ui';
import { cn } from '../../lib/utils';

const GRID_COLS = {
  2: 'grid grid-cols-1 sm:grid-cols-2 gap-4',
  3: 'grid grid-cols-1 sm:grid-cols-3 gap-4',
  4: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4',
};

/**
 * ChoiceGrid — Composed pattern for visual selection cards (Theme, Visibility, Modes).
 * Composed entirely of the Card primitive with interactive focus/click states.
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
          <Card
            key={id}
            as="button"
            type="button"
            role="radio"
            aria-checked={isActive}
            onClick={() => onChange?.(id)}
            tone={isActive ? 'accent' : 'base'}
            radius="xl"
            padding="xl"
            bordered
            interactive
            className={cn(
              'relative flex flex-col items-center gap-3 text-center select-none cursor-pointer transition-all',
              isActive
                ? 'border-primary ring-1 ring-primary text-primary shadow-sm'
                : 'border-transparent text-muted-foreground hover:text-foreground'
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
          </Card>
        );
      })}
    </div>
  );
}
