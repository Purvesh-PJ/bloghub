import * as React from 'react';
import { cn } from '../../lib/utils';

/**
 * The frame every signed-in page sits in.
 * Standardizes measures, rhythms, header hero blocks, and section gutters.
 */
const widthClasses = {
  wide: 'max-w-[1200px]', // dashboards, listings
  narrow: 'max-w-[768px]', // settings, forms
  reading: 'max-w-[720px]', // article bodies
  full: 'max-w-full',
};

export function PageShell({
  children,
  width = 'wide',
  $width,
  className,
  ...props
}) {
  const finalWidth = width !== 'wide' ? width : ($width || 'wide');
  const maxWidthClass = widthClasses[finalWidth] || 'max-w-[1200px]';

  return (
    <div
      className={cn(
        'w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 pb-16 sm:pb-24 flex flex-col gap-6 sm:gap-8',
        maxWidthClass,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * PageHeader
 * Distinct hero/header component that creates a clear visual boundary
 * between page intent and the data/components below it.
 */
export function PageHeader({ badge, title, subtitle, actions, divider = true, className }) {
  return (
    <header
      className={cn(
        'flex flex-col gap-4',
        divider && 'pb-6 border-b border-[hsl(var(--border))/0.4]',
        className
      )}
    >
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="flex flex-col gap-1.5 min-w-0 flex-1">
          {badge && (
            <span className="inline-flex items-center gap-1 w-fit px-2 py-0.5 rounded-full bg-[hsl(var(--primary))/0.10] text-[hsl(var(--primary))] text-[11px] font-bold tracking-wider uppercase mb-0.5 select-none">
              {badge}
            </span>
          )}
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[hsl(var(--foreground))] leading-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm sm:text-base text-[hsl(var(--muted-foreground))] max-w-[65ch] leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
        {actions && (
          <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
            {actions}
          </div>
        )}
      </div>
    </header>
  );
}

/**
 * Section
 * A titled block within a page. Gives every section the same heading weight and rhythm.
 */
export function Section({ title, note, aside, children, className, ...props }) {
  return (
    <section className={cn('flex flex-col gap-4 min-w-0', className)} {...props}>
      {(title || aside) && (
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <div>
            {title && (
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-[hsl(var(--foreground))]">
                {title}
              </h2>
            )}
            {note && <p className="text-xs sm:text-sm text-[hsl(var(--muted-foreground))] mt-0.5">{note}</p>}
          </div>
          {aside}
        </div>
      )}
      {children}
    </section>
  );
}
