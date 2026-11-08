import { cn } from '../../lib/utils';

const sizeMap = {
  sm: 'w-6 h-6 text-xs',
  md: 'w-7 h-7 text-sm',
  lg: 'w-8 h-8 text-base',
};

/**
 * The BlogHub logo mark — rounded brand square with letter 'B'.
 */
export function BrandMark({ size = 'md', letter = 'B', className, ...rest }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'inline-flex items-center justify-center shrink-0 rounded-sm bg-gradient-to-br from-info to-primary text-primary-foreground font-extrabold leading-none shadow-sm select-none',
        sizeMap[size] || sizeMap.md,
        className
      )}
      {...rest}
    >
      {letter}
    </span>
  );
}
