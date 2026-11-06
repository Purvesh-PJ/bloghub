import { formatDistanceToNow } from 'date-fns';
import { Trash2 } from 'lucide-react';
import { Button, Avatar } from '../../../components/ui';

export function ResponseItem({ comment, onDelete }) {
  return (
    <div className="grid grid-cols-[auto_1fr_auto] gap-4 items-start p-4 hover:bg-[hsl(var(--muted))/0.5] transition-colors rounded-xl">
      <Avatar name={comment.user?.username} size="sm" />
      <div className="min-w-0">
        <div className="flex items-baseline gap-2 flex-wrap mb-0.5">
          <span className="text-sm font-semibold text-[hsl(var(--foreground))]">
            {comment.user?.username || 'Someone'}
          </span>
          <span className="text-xs text-[hsl(var(--muted-foreground))]">
            {comment.createdAt
              ? formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })
              : 'recently'}
          </span>
        </div>
        <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed whitespace-pre-wrap break-words">
          {comment.message}
        </p>

        {comment.replies?.length > 0 && (
          <div className="mt-3 pl-4 border-l-2 border-[hsl(var(--border))/0.6] flex flex-col gap-3">
            {comment.replies.map((reply) => (
              <div key={reply._id}>
                <div className="flex items-baseline gap-2 flex-wrap mb-0.5">
                  <span className="text-sm font-semibold text-[hsl(var(--foreground))]">
                    {reply.user?.username || 'Someone'}
                  </span>
                  <span className="text-xs text-[hsl(var(--muted-foreground))]">
                    {reply.createdAt
                      ? formatDistanceToNow(new Date(reply.createdAt), {
                        addSuffix: true,
                      })
                      : 'recently'}
                  </span>
                </div>
                <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed whitespace-pre-wrap break-words">
                  {reply.message}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <Button
        variant="ghost"
        size="sm"
        aria-label={`Remove response from ${comment.user?.username || 'this reader'}`}
        onClick={() => onDelete(comment)}
      >
        <Trash2 className="w-4 h-4 text-red-500" />
      </Button>
    </div>
  );
}

