import React from 'react';
import { Card, StatTile, Skeleton } from '../ui';
import { cn } from '../../lib/utils';

const COLUMN_CLASSES = {
  2: 'grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6',
  3: 'grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6',
  4: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6',
  5: 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4',
};

/**
 * StatsGrid — Composed pattern for dashboard telemetry and metrics tiles.
 * Handles responsive grid column layout, card containment, and skeleton states.
 */
export function StatsGrid({
  items = [],
  columns = 4,
  isLoading = false,
  cardPadding = 'lg',
  tone = 'low',
  inCard = true,
  className,
}) {
  const gridClass = COLUMN_CLASSES[columns] || COLUMN_CLASSES[4];

  if (isLoading) {
    const placeholderCount =
      items.length > 0 ? items.length : typeof columns === 'number' ? columns : 4;

    return (
      <div className={cn(gridClass, className)} aria-hidden="true">
        {Array.from({ length: placeholderCount }).map((_, index) => (
          <div
            key={`stats-skeleton-${index + 1}`}
            className="p-6 rounded-2xl bg-card border border-border/60"
          >
            <Skeleton width={48} height={28} className="rounded" />
            <Skeleton width="60%" height={14} className="rounded mt-2" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn(gridClass, className)}>
      {items.map((stat) =>
        inCard ? (
          <Card key={stat.label} tone={tone} radius="lg" padding={cardPadding}>
            <StatTile
              label={stat.label}
              value={stat.value}
              icon={stat.icon}
              hint={stat.hint}
              padded={false}
            />
          </Card>
        ) : (
          <StatTile
            key={stat.label}
            label={stat.label}
            value={stat.value}
            icon={stat.icon}
            hint={stat.hint}
            padded={true}
          />
        )
      )}
    </div>
  );
}
