import { formatDistanceToNow, format } from 'date-fns';
import { Clock } from 'lucide-react';
import { Avatar } from '../../../components/ui';
import { cn } from '../../../lib/utils';

/**
 * AuthorByline — Who wrote this, and when.
 * Supports inline (post cards) and stacked (post detail header).
 */
export function AuthorByline({
  name,
  avatarUrl,
  at,
  dateStyle = 'relative',
  readingMinutes,
  note,
  layout = 'inline',
  size,
  className,
}) {
  const date = at ? new Date(at) : null;
  const validDate = date && !Number.isNaN(date.getTime());
  const when = validDate
    ? dateStyle === 'absolute'
      ? format(date, 'd MMM yyyy')
      : formatDistanceToNow(date, { addSuffix: true })
    : null;

  const displayName = name || 'Anonymous';

  if (layout === 'stacked') {
    return (
      <div className={cn('flex items-center gap-3 min-w-0', className)}>
        <Avatar src={avatarUrl} name={displayName} size={size ?? 'md'} />
        <span className="flex flex-col min-w-0">
          <span className="text-base font-bold text-foreground block leading-tight">
            {displayName}
          </span>
          <span className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
            {note ?? (
              <>
                <span>{when}</span>
                {when && readingMinutes ? <Clock className="h-3 w-3" /> : null}
                {readingMinutes ? <span>{readingMinutes} min read</span> : null}
              </>
            )}
          </span>
        </span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex items-center gap-2 text-xs text-muted-foreground min-w-0 select-none flex-wrap',
        className
      )}
    >
      <Avatar src={avatarUrl} name={displayName} size={size ?? 'xs'} />
      <span className="font-medium text-foreground">{displayName}</span>
      {when && (
        <>
          <span className="text-muted-foreground/50">·</span>
          <span>{when}</span>
        </>
      )}
      {readingMinutes ? (
        <>
          <span className="text-muted-foreground/50">·</span>
          <span>{readingMinutes} min read</span>
        </>
      ) : null}
    </div>
  );
}
