import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './Button';
import { cn } from '../../lib/utils';

/**
 * Previous / next paging with position label and screen-reader status.
 */
export function Pagination({ page, pages, total, noun = 'items', onChange, className }) {
  if (!pages || pages <= 1) return null;

  return (
    <nav
      aria-label="Pagination"
      className={cn(
        'flex flex-col sm:flex-row items-center justify-between gap-3 p-4 px-5 border-t border-[hsl(var(--border))/0.4]',
        className
      )}
    >
      <span role="status" aria-live="polite" className="text-xs text-[hsl(var(--muted-foreground))] tabular-nums">
        Page {page} of {pages}
        {typeof total === 'number' ? ` · ${total} ${noun}` : ''}
      </span>

      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="secondary"
          disabled={page <= 1}
          onClick={() => onChange(page - 1)}
        >
          <ChevronLeft className="w-3.5 h-3.5 mr-1" /> Previous
        </Button>
        <Button
          size="sm"
          variant="secondary"
          disabled={page >= pages}
          onClick={() => onChange(page + 1)}
        >
          Next <ChevronRight className="w-3.5 h-3.5 ml-1" />
        </Button>
      </div>
    </nav>
  );
}
