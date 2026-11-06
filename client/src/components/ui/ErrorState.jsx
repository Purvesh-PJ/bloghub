import { AlertTriangle, RotateCw } from 'lucide-react';
import { Surface } from './Surface';
import { Button } from './Button';
import { cn } from '../../lib/utils';

export function ErrorState({ title = 'That did not load', error, onRetry, children, className }) {
  const serverMessage = error?.response?.data?.message;
  const isOffline = typeof navigator !== 'undefined' && navigator.onLine === false;

  return (
    <Surface
      tone="low"
      radius="xl"
      className={cn(
        'flex flex-col items-center text-center gap-4 py-10 px-6 sm:py-12 sm:px-8 border border-destructive/30',
        className
      )}
    >
      <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-destructive/10 text-destructive">
        <AlertTriangle className="w-6 h-6" />
      </div>
      <p className="text-xl font-bold tracking-tight text-foreground">{title}</p>
      <p className="text-sm sm:text-base text-muted-foreground max-w-[46ch] leading-relaxed">
        {children ??
          (isOffline
            ? 'You appear to be offline. Your work is safe — this is only the list failing to load.'
            : (serverMessage ??
              'Something went wrong reaching the server. Nothing has been lost; try again.'))}
      </p>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          <RotateCw className="w-3.5 h-3.5 mr-1" /> Try again
        </Button>
      )}
    </Surface>
  );
}
