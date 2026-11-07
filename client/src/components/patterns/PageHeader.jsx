import React from 'react';
import { cn } from '../../lib/utils';

/**
 * PageHeader — Composed pattern standardizing page headings across workspace and admin.
 * Encapsulates semantic hierarchy (h1), optional eyebrow/badge, subtitle description, and action button slots.
 */
export function PageHeader({
  title,
  description,
  subtitle,
  badge,
  eyebrow,
  actions,
  divider = false,
  className,
  ...props
}) {
  const desc = description || subtitle;

  return (
    <header
      className={cn(
        'flex items-center justify-between gap-4 flex-wrap mb-6',
        divider && 'pb-6 border-b border-border/40',
        className
      )}
      {...props}
    >
      <div>
        {eyebrow && <div className="mb-1">{eyebrow}</div>}
        <div className="flex items-center gap-3 flex-wrap">
          {badge && (
            <span className="inline-flex items-center gap-1 w-fit px-2 py-0.5 rounded-full bg-primary/10 text-primary text-caption font-bold tracking-wider uppercase mb-0.5 select-none">
              {badge}
            </span>
          )}
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            {title}
          </h1>
        </div>
        {desc && <p className="text-sm text-muted-foreground mt-1 max-w-[65ch]">{desc}</p>}
      </div>
      {actions && <div className="flex items-center gap-2.5 shrink-0 flex-wrap">{actions}</div>}
    </header>
  );
}
