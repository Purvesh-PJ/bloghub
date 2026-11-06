import { cn } from '../../../lib/utils';

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
          'relative w-full rounded-full bg-muted overflow-hidden',
          size === 'sm' ? 'h-1.5' : 'h-2.5'
        )}
      >
        <div
          style={{ width: `${clamped}%` }}
          className="h-full rounded-full bg-primary transition-[width] duration-500 ease-out min-w-[4px]"
        />
      </div>

      {showLegend && (
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{clamped.toFixed(0)}% read through</span>
          <span className="tabular-nums">
            {format(reads)} / {format(views)}
          </span>
        </div>
      )}
    </div>
  );
}

/**
 * Large headline variant for hero headers and dashboards.
 */
export function ReadRateHeadline({ views = 0, reads = 0, rate, label = 'Read-through rate' }) {
  const percent = rate ?? (views > 0 ? (reads / views) * 100 : 0);

  return (
    <div className="flex flex-col gap-2 p-5 rounded-2xl bg-card border border-border">
      <div className="flex items-baseline justify-between gap-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        <span className="text-2xl font-bold tracking-tight text-foreground tabular-nums">
          {percent.toFixed(1)}%
        </span>
      </div>

      <ReadRateBar views={views} reads={reads} rate={percent} size="lg" showLegend={false} />

      <p className="text-xs text-muted-foreground mt-1">
        <strong className="text-foreground font-semibold">{format(reads)}</strong> of{' '}
        <strong className="text-foreground font-semibold">{format(views)}</strong> readers reached
        the end and stayed long enough to finish.
      </p>
    </div>
  );
}
