import React from 'react';
import { Card } from '../ui';
import { cn } from '../../lib/utils';

/**
 * DataTableCard — Composed pattern encapsulating tabular data containers.
 * Combines Card surface, overflow handling, optional header/actions slot, Table body, and Pagination footer.
 */
export function DataTableCard({
  children,
  header,
  pagination,
  footer,
  tone = 'low',
  radius = 'xl',
  className,
  ...props
}) {
  return (
    <Card
      tone={tone}
      radius={radius}
      padding="none"
      bordered
      className={cn('overflow-hidden', className)}
      {...props}
    >
      {header && (
        <div className="p-4 border-b border-border/40 flex items-center justify-between gap-4 flex-wrap">
          {header}
        </div>
      )}
      {children}
      {pagination}
      {footer && <div className="p-3 border-t border-border/40 bg-muted/30">{footer}</div>}
    </Card>
  );
}
