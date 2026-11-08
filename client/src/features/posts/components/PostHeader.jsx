import { Link } from 'react-router-dom';
import { Pencil, Trash2 } from 'lucide-react';
import { AuthorByline } from './AuthorByline';
import { Button, Card } from '../../../components/ui';
import { ReadRateBar } from '../../analytics/components/ReadRateBar';
import { readingTime } from '../../../utils/text';

export function PostHeader({ post, isAuthor, postStats, onOpenDelete }) {
  const authorName = post.author?.name || post.user?.username;

  return (
    <>
      {/* Cover Image */}
      {post.imageURL && (
        <div className="w-full aspect-[16/9] sm:aspect-[21/9] rounded-2xl sm:rounded-3xl overflow-hidden bg-muted border border-border/40">
          <img
            src={post.imageURL}
            alt={post.title || 'Post cover'}
            fetchPriority="high"
            decoding="async"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Article Title */}
      <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-foreground leading-tight sm:leading-snug">
        {post.title}
      </h1>

      {/* Byline & Author Actions */}
      <div className="flex items-center justify-between gap-4 flex-wrap pb-6 border-b border-border/60">
        <Link
          to={post.user?._id ? `/user/${post.user._id}` : '#'}
          className="hover:opacity-90 transition-opacity"
        >
          <AuthorByline
            layout="stacked"
            name={authorName}
            at={post.createdAt}
            dateStyle="absolute"
            readingMinutes={readingTime(post.content)}
          />
        </Link>

        {isAuthor && (
          <div className="flex items-center gap-2">
            <Button as={Link} to={`/edit/${post._id}`} variant="secondary" size="sm">
              <Pencil className="h-3.5 w-3.5 mr-1" /> Edit
            </Button>
            <Button variant="dangerTonal" size="sm" onClick={onOpenDelete}>
              <Trash2 className="h-3.5 w-3.5 mr-1" /> Delete
            </Button>
          </div>
        )}
      </div>

      {/* Author Stats Bar */}
      {isAuthor && postStats && postStats.views > 0 && (
        <Card tone="low" radius="lg" padding="lg">
          <ReadRateBar
            views={postStats.views}
            reads={postStats.reads}
            rate={postStats.readRate}
            size="lg"
          />
        </Card>
      )}
    </>
  );
}
