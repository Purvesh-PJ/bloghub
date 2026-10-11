import { cn } from '../../lib/utils';

export function Spinner({ size = '20px', color, className, ...props }) {
  const pixelSize = typeof size === 'number' ? `${size}px` : size;

  return (
    <span
      role="status"
      aria-label="Loading"
      className={cn(
        'inline-block rounded-full border-2 border-current border-r-transparent animate-spin opacity-90',
        className
      )}
      style={{
        width: pixelSize,
        height: pixelSize,
        color: color || undefined,
      }}
      {...props}
    />
  );
}
