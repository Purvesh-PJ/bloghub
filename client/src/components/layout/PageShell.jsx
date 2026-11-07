import * as React from 'react';
import { cn } from '../../lib/utils';
import { PageHeader } from '../patterns/PageHeader';

export { PageHeader };

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

export function PageShell({ children, width = 'wide', className, ...props }) {
  const maxWidthClass = widthClasses[width] || 'max-w-[1200px]';

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
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
                {title}
              </h2>
            )}
            {note && <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">{note}</p>}
          </div>
          {aside}
        </div>
      )}
      {children}
    </section>
  );
}
