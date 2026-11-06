import { Heart, MessageCircle, Eye, Share2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '../../../lib/utils';

export function PostActionBar({
  post,
  liked,
  commentsCount,
  viewCount,
  isAuthenticated,
  onLike,
}) {
  const handleLikeClick = () => {
    if (isAuthenticated) {
      onLike();
    } else {
      toast.error('Sign in to like this');
    }
  };

  const handleShareClick = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
  };

  return (
    <div className="flex items-center gap-2 sm:gap-3 flex-wrap py-4 border-y border-border/60">
      <button
        type="button"
        onClick={handleLikeClick}
        aria-pressed={liked}
        aria-label={liked ? 'Unlike this post' : 'Like this post'}
        className={cn(
          'inline-flex items-center gap-2 h-10 px-4 rounded-full text-sm font-medium transition-colors select-none cursor-pointer',
          liked
            ? 'bg-destructive/10 text-destructive hover:bg-destructive/20'
            : 'bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80'
        )}
      >
        <Heart
          className={cn('h-4 w-4 shrink-0', liked && 'fill-current text-destructive')}
          aria-hidden="true"
        />
        <span>{post.likes?.length || 0}</span>
      </button>

      <a
        href="#comments"
        aria-label={`Jump to ${commentsCount} responses`}
        className="inline-flex items-center gap-2 h-10 px-4 rounded-full text-sm font-medium bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors select-none"
      >
        <MessageCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span>{commentsCount}</span>
      </a>

      {typeof viewCount === 'number' && viewCount > 0 && (
        <span
          aria-label={`${viewCount} ${viewCount === 1 ? 'reader has' : 'readers have'} opened this`}
          className="inline-flex items-center gap-2 h-10 px-4 rounded-full text-sm font-medium bg-muted text-muted-foreground select-none"
        >
          <Eye className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{viewCount}</span>
        </span>
      )}

      <button
        type="button"
        onClick={handleShareClick}
        className="inline-flex items-center gap-2 h-10 px-4 rounded-full text-sm font-medium bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors select-none cursor-pointer"
      >
        <Share2 className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span>Share</span>
      </button>
    </div>
  );
}

