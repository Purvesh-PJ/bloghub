import * as React from 'react';
import { cn } from '../../lib/utils';

const toneClasses = {
  low: 'bg-card',
  base: 'bg-muted',
  high: 'bg-muted/80',
  accent: 'bg-primary/12',
  elevated: 'bg-popover shadow-lg',
  transparent: 'bg-transparent',
};

const radiusClasses = {
  none: 'rounded-none',
  xs: 'rounded-xs',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-2xl',
  '2xl': 'rounded-3xl',
  '3xl': 'rounded-4xl',
  full: 'rounded-full',
};

const paddingClasses = {
  none: 'p-0',
  xs: 'p-1',
  sm: 'p-2',
  md: 'p-3',
  lg: 'p-4',
  xl: 'p-6',
  '2xl': 'p-8',
};

const variantClasses = {
  featured:
    'bg-card border border-primary/30 shadow-[0_8px_30px_-4px_rgba(14,165,233,0.12),0_2px_8px_-2px_rgba(15,23,42,0.04)]',
  elevated: 'bg-card shadow-[0_4px_16px_-2px_rgba(15,23,42,0.05)] border-none',
  ghost: 'bg-transparent border-none shadow-none',
  inset: 'bg-muted/40 border-none shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)]',
};

export const Surface = React.forwardRef(
  (
    {
      className,
      $tone = 'low',
      tone,
      $radius = 'lg',
      radius,
      $padding = 'xl',
      padding,
      $variant,
      variant,
      $bordered,
      bordered,
      $interactive,
      interactive,
      children,
      as: Comp = 'div',
      ...props
    },
    ref
  ) => {
    const finalTone = tone || $tone || 'low';
    const finalRadius = radius || $radius || 'lg';
    const finalPadding = padding || $padding || 'xl';
    const finalVariant = variant || $variant;
    const isBordered = bordered ?? $bordered;
    const isInteractive = interactive ?? $interactive;

    return (
      <Comp
        ref={ref}
        className={cn(
          finalVariant ? variantClasses[finalVariant] : toneClasses[finalTone],
          radiusClasses[finalRadius],
          paddingClasses[finalPadding],
          isBordered && 'border border-border',
          isInteractive &&
            'cursor-pointer transition-all duration-150 hover:bg-muted hover:-translate-y-0.5 hover:shadow-md',
          className
        )}
        {...props}
      >
        {children}
      </Comp>
    );
  }
);

Surface.displayName = 'Surface';

export function Card({
  className,
  variant,
  tone = 'low',
  radius = 'xl',
  padding = 'xl',
  bordered = false,
  elevation,
  interactive = false,
  children,
  ...props
}) {
  return (
    <Surface
      variant={variant}
      tone={tone}
      radius={radius}
      padding={padding}
      bordered={bordered}
      elevation={elevation}
      interactive={interactive}
      className={className}
      {...props}
    >
      {children}
    </Surface>
  );
}
