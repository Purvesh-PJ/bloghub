import { Surface } from './Surface';
import { cn } from '../../lib/utils';

/**
 * Empty state.
 *
 * Provides a clear graphic, title, explanation and call to action.
 */
export function EmptyState({
  icon: IconComponent,
  title,
  children,
  actions,
  tone = 'low',
  className,
}) {
  return (
    <Surface
      tone={tone}
      radius="xl"
      className={cn(
        'flex flex-col items-center text-center gap-4 py-12 px-6 sm:py-16 sm:px-8',
        className
      )}
    >
      {IconComponent && (
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] mb-1">
          <IconComponent className="w-6 h-6" />
        </div>
      )}
      {title && (
        <p className="text-xl font-bold tracking-tight text-[hsl(var(--foreground))]">
          {title}
        </p>
      )}
      {children && (
        <p className="text-sm sm:text-base text-[hsl(var(--muted-foreground))] max-w-[46ch] leading-relaxed">
          {children}
        </p>
      )}
      {actions && (
        <div className="flex gap-2 flex-wrap justify-center mt-2">
          {actions}
        </div>
      )}
    </Surface>
  );
}
