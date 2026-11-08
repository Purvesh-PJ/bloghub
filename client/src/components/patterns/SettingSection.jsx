import React from 'react';
import { Card, Alert } from '../ui';
import { cn } from '../../lib/utils';

/**
 * SettingSection — Composed pattern for settings cards featuring standard title,
 * description, optional informational callout, form body, and footer actions.
 */
export function SettingSection({
  title,
  description,
  info,
  tone = 'default',
  action,
  footer,
  children,
  className,
}) {
  const isDanger = tone === 'danger' || tone === 'destructive';

  return (
    <Card tone="low" radius="xl" padding="2xl" className={cn('flex flex-col gap-6', className)}>
      {/* Header with Title, Description, and optional top-right action */}
      {(title || description || action) && (
        <div className="flex items-start justify-between gap-4">
          <div>
            {title && (
              <h2
                className={cn(
                  'text-xl font-bold tracking-tight',
                  isDanger ? 'text-destructive' : 'text-foreground'
                )}
              >
                {title}
              </h2>
            )}
            {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}

      {/* Optional Informational Notice */}
      {info && <Alert variant="info">{info}</Alert>}

      {/* Main Settings Body */}
      {children}

      {/* Optional Footer Action Row */}
      {footer && <div className="flex justify-end pt-2 border-t border-border/40">{footer}</div>}
    </Card>
  );
}
