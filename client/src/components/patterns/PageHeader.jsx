import React from 'react';
import { cn } from '../../lib/utils';

/**
 * PageHeader — Composed pattern standardizing page headings across workspace and admin.
 * Encapsulates semantic hierarchy (h1), optional eyebrow/badge, subtitle description, and action button slots.
 */
export function PageHeader({ title, description, badge, eyebrow, actions, className, ...props }) {
  return (
    <div
      className={cn('flex items-center justify-between gap-4 flex-wrap mb-6', className)}
      {...props}
    >
      <div>
        {eyebrow && <div className="mb-1">{eyebrow}</div>}
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            {title}
          </h1>
          {badge && <div className="shrink-0">{badge}</div>}
        </div>
        {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2.5 shrink-0">{actions}</div>}
    </div>
  );
}
