import { cn } from '../../lib/utils';

/**
 * StatTile — a label, one number, and an optional line under it.
 * Features pill / generous 28px card radius, tabular numbers, and soft border.
 */
export function StatTile({ label, value, hint, icon: Icon, padded = true, className, ...rest }) {
  return (
    <div
      className={cn(
        'flex flex-col gap-1',
        padded &&
          'p-6 rounded-[28px] bg-[hsl(var(--card))] border border-[hsl(var(--border))/0.6] shadow-sm',
        className
      )}
      {...rest}
    >
      <div className="flex items-center justify-between gap-2 text-xs font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
        <span>{label}</span>
        {Icon && <Icon className="w-4 h-4 shrink-0 text-[hsl(var(--primary))]" />}
      </div>
      <div className="text-2xl sm:text-3xl font-extrabold text-[hsl(var(--foreground))] tabular-nums mt-1 tracking-tight">
        {value}
      </div>
      {hint && <div className="text-xs text-[hsl(var(--muted-foreground))]">{hint}</div>}
    </div>
  );
}
