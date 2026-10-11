import * as React from 'react';
import { cn } from '../../lib/utils';

export function Container({ className, style, maxWidth, $maxWidth, children, ...props }) {
  const maxW = maxWidth || $maxWidth || '1200px';
  return (
    <div
      className={cn('w-full mx-auto px-4', className)}
      style={{ maxWidth: maxW, ...style }}
      {...props}
    >
      {children}
    </div>
  );
}

export function Box({ className, children, ...props }) {
  return (
    <div className={className} {...props}>
      {children}
    </div>
  );
}

export function Flex({ className, children, ...props }) {
  return (
    <div className={cn('flex', className)} {...props}>
      {children}
    </div>
  );
}
