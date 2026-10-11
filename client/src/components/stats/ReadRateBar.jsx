import { cn } from '../../lib/utils';

const format = (n) => new Intl.NumberFormat().format(n ?? 0);

/**
 * Compact bar for table rows and cards.
 * Visualizes read-through attention rate with animated progress fill.
 */
export function ReadRateBar({ views = 0, reads = 0, rate, size = 'sm', showLegend = true }) {
  const percent = rate ?? (views > 0 ? (reads / views) * 100 : 0);
  const clamped = Math.max(0, Math.min(100, percent));

  return (
    <div
      role="img"
      aria-label={`${format(reads)} of ${format(views)} readers finished, ${clamped.toFixed(0)} percent`}
      className={cn('flex flex-col min-w-0', size === 'sm' ? 'gap-1' : 'gap-2')}
    >
      <div
        className={cn(
          'relative w-full rounded-full bg-[hsl(var(--muted))] overflow-hidden',
          size === 'sm' ? 'h-1.5' : 'h-2.5'
        )}
      >
        <div
          style={{ width: `${clamped}%` }}
          className="h-full rounded-full bg-[hsl(var(--primary))] transition-[width] duration-500 ease-out min-w-[4px]"
        />
      </div>

      {showLegend && (
        <div className="flex items-baseline gap-2 text-xs text-[hsl(var(--muted-foreground))] whitespace-nowrap select-none">
          <span className="font-semibold text-[hsl(var(--foreground))] tabular-nums">
            {clamped.toFixed(0)}%
          </span>
          <span>
            {format(reads)} of {format(views)} finished
          </span>
        </div>
      )}
    </div>
  );
}

/**
 * ReadRateHeadline — The same figure as a page-level statement on top of Creator Studio.
 */
export function ReadRateHeadline({ views = 0, reads = 0, rate }) {
  const percent = rate ?? (views > 0 ? (reads / views) * 100 : 0);
  const clamped = Math.max(0, Math.min(100, percent));

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-baseline flex-wrap gap-6 sm:gap-8">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-bold tracking-tight text-[hsl(var(--foreground))] tabular-nums">
            {format(views)}
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
            opened
          </span>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-bold tracking-tight text-[hsl(var(--primary))] tabular-nums">
            {format(reads)}
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
            finished
          </span>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-bold tracking-tight text-[hsl(var(--foreground))] tabular-nums">
            {clamped.toFixed(0)}%
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
            read through
          </span>
        </div>
      </div>

      <div className="relative w-full rounded-full bg-[hsl(var(--muted))] overflow-hidden h-2.5">
        <div
          style={{ width: `${clamped}%` }}
          className="h-full rounded-full bg-[hsl(var(--primary))] transition-[width] duration-500 ease-out min-w-[4px]"
        />
      </div>
    </div>
  );
}
