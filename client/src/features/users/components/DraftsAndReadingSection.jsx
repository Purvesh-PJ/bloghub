import { Link } from 'react-router-dom';
import { Pencil, ArrowRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Card, Badge } from '../../../components/ui';

export function DraftsAndReadingSection({ drafts = [] }) {
  return (
    <Card tone="low" radius="xl" padding="xl">
      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 mb-2">
        <Pencil className="w-3.5 h-3.5 text-primary" /> Pick up where you left off
      </span>
      {drafts.length === 0 ? (
        <p className="text-sm text-muted-foreground leading-relaxed mt-2">
          No unfinished drafts. Anything you start and do not publish waits here.
        </p>
      ) : (
        <div className="mt-2 divide-y divide-border/50">
          {drafts.map((post) => (
            <Link
              key={post._id}
              to={`/edit/${post._id}`}
              className="group flex items-center justify-between gap-3 py-3 text-inherit no-underline first:pt-0 last:pb-0"
            >
              <span className="min-w-0">
                <h4 className="text-sm font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                  {post.title || 'Untitled'}
                </h4>
                <span className="text-xs text-muted-foreground block mt-0.5">
                  edited{' '}
                  {post.updatedAt
                    ? formatDistanceToNow(new Date(post.updatedAt), { addSuffix: true })
                    : 'recently'}
                </span>
              </span>
              <Badge variant="neutral">draft</Badge>
            </Link>
          ))}
        </div>
      )}
      <Link
        to="/stories"
        className="group inline-flex items-center gap-1.5 mt-5 text-sm font-semibold text-primary hover:underline"
      >
        Manage all stories{' '}
        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
      </Link>
    </Card>
  );
}

