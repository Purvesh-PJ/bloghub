import { Link } from 'react-router-dom';
import { TrendingUp } from 'lucide-react';
import { Card } from '../../../components/ui';
import { ReadRateBar } from '../../analytics/components/ReadRateBar';

export function TopStoriesSection({ topFinished = [] }) {
  return (
    <Card tone="low" radius="xl" padding="xl">
      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 mb-2">
        <TrendingUp className="w-3.5 h-3.5 text-primary" /> Best read-through
      </span>
      {topFinished.length === 0 ? (
        <p className="text-sm text-muted-foreground leading-relaxed mt-2">
          Once a published story is opened by a reader, its read-through appears here.
        </p>
      ) : (
        <div className="mt-2 divide-y divide-border/50">
          {topFinished.map((entry) => (
            <Link
              key={String(entry.postId)}
              to={`/post/${entry.postId}`}
              className="group flex flex-col gap-1.5 py-3 text-inherit no-underline first:pt-0 last:pb-0"
            >
              <h4 className="text-sm font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                {entry.title}
              </h4>
              <ReadRateBar views={entry.views} reads={entry.reads} rate={entry.readRate} />
            </Link>
          ))}
        </div>
      )}
    </Card>
  );
}

