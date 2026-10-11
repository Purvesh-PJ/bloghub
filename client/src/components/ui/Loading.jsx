import { Spinner } from './Spinner';
import { cn } from '../../lib/utils';

export function Loading({ text = 'Loading...', className }) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 py-16 min-h-[300px]',
        className
      )}
    >
      <Spinner size="32px" className="text-[hsl(var(--primary))]" />
      <span className="text-sm text-[hsl(var(--muted-foreground))]">{text}</span>
    </div>
  );
}
