import * as React from 'react';
import { cn } from '../../lib/utils';

/**
 * Editorial layout devices.
 * Gives long articles, landing pages, and editorial content rhythm and hierarchy.
 */

/** Escapes the centred column and runs the full width of the viewport. */
export function FullBleed({ className, children, ...props }) {
  return (
    <div
      className={cn('w-screen ml-[calc(50%-50vw)] mr-[calc(50%-50vw)]', className)}
      {...props}
    >
      {children}
    </div>
  );
}

/** A block that inverts against the page: deep background with high contrast text. */
export function Inverted({ className, children, ...props }) {
  return (
    <FullBleed
      className={cn(
        'bg-gradient-to-tr from-[hsl(var(--primary))] to-sky-700 text-white py-16 sm:py-24 shadow-inner',
        '[&_h1]:text-white [&_h2]:text-white [&_h3]:text-white',
        className
      )}
      {...props}
    >
      {children}
    </FullBleed>
  );
}

/** Re-establishes the reading column inside a full-bleed band. */
export function Column({ className, children, width = 'maxWidth', $width, ...props }) {
  const finalWidth = width !== 'maxWidth' ? width : ($width || 'maxWidth');
  const widthClass = finalWidth === 'maxWidthNarrow' ? 'max-w-[768px]' : 'max-w-[1200px]';

  return (
    <div
      className={cn('w-full mx-auto px-4 sm:px-6', widthClass, className)}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * Numbered section
 * Display-sized numeral hanging in the margin for numbered narratives.
 */
export function Numbered({ n, children, rule = true, className, ...props }) {
  return (
    <div className={className} {...props}>
      {rule && <hr className="border-t border-[hsl(var(--border))/0.4] mb-8" />}
      <section className="relative grid grid-cols-1 lg:grid-cols-[120px_1fr] gap-6 lg:gap-10 items-start">
        <span
          aria-hidden="true"
          className="text-4xl lg:text-6xl font-black text-[hsl(var(--primary))] leading-none tabular-nums select-none"
        >
          {String(n).padStart(2, '0')}
        </span>
        <div className="min-w-0 flex flex-col gap-6">{children}</div>
      </section>
    </div>
  );
}

export function Kicker({ className, children, ...props }) {
  return (
    <p
      className={cn('text-xs font-bold uppercase tracking-wider text-[hsl(var(--primary))]', className)}
      {...props}
    >
      {children}
    </p>
  );
}

export function Headline({ className, children, ...props }) {
  return (
    <h2
      className={cn('text-2xl sm:text-3xl font-bold tracking-tight text-[hsl(var(--foreground))] max-w-[18ch]', className)}
      {...props}
    >
      {children}
    </h2>
  );
}

export function Body({ className, children, ...props }) {
  return (
    <p
      className={cn('text-base sm:text-lg text-[hsl(var(--muted-foreground))] max-w-[56ch] leading-relaxed', className)}
      {...props}
    >
      {children}
    </p>
  );
}

export function Split({ flip = false, $flip, className, children, ...props }) {
  const isFlipped = flip || $flip;
  return (
    <div
      className={cn(
        'grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center',
        isFlipped && '[&>*:first-child]:order-2 [&>*:last-child]:order-1',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
