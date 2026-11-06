import { Button } from '../ui';
import { cn } from '../../lib/utils';

/**
 * BulkActionBar — floating or banner action bar for multi-item table / list selections.
 */
export function BulkActionBar({
  selectedCount = 0,
  onClear,
  clearLabel = 'Clear',
  label,
  actions = [],
  variant = 'floating',
  children,
  className,
}) {
  if (selectedCount <= 0) return null;

  const isBanner = variant === 'banner';

  return (
    <aside
      role="region"
      aria-label="Bulk actions"
      className={cn(
        isBanner
          ? 'flex items-center gap-2 flex-wrap p-3 px-5 mb-4 rounded-2xl bg-[hsl(var(--primary))/0.12] border border-[hsl(var(--primary))/0.2]'
          : 'fixed bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 sm:gap-3 px-4 sm:px-5 py-2.5 sm:py-3 rounded-full bg-[hsl(var(--card))] border border-[hsl(var(--border))] shadow-2xl backdrop-blur-xl animate-in fade-in-0 slide-in-from-bottom-4 duration-200 flex-wrap justify-center',
        className
      )}
    >
      <span
        className={cn(
          isBanner
            ? 'text-sm font-semibold text-[hsl(var(--primary))] mr-auto'
            : 'text-xs font-semibold text-[hsl(var(--foreground))] whitespace-nowrap'
        )}
      >
        {label || `${selectedCount} selected`}
      </span>

      {!isBanner && <div className="h-4 w-px bg-[hsl(var(--border))]" />}

      {actions.map((action, i) => (
        <Button
          key={action.label || i}
          size="sm"
          variant={action.variant || (isBanner ? 'secondary' : 'ghost')}
          onClick={action.onClick}
          disabled={action.disabled}
          className={cn(!isBanner && 'text-xs h-8')}
        >
          {action.icon && <span className="mr-1.5 inline-flex shrink-0">{action.icon}</span>}
          {action.label}
        </Button>
      ))}

      {children}

      {onClear && (
        <Button
          size="sm"
          variant="ghost"
          onClick={onClear}
          className={cn(!isBanner && 'text-xs h-8')}
        >
          {clearLabel}
        </Button>
      )}
    </aside>
  );
}
