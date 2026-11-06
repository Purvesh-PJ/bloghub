import { Link, useNavigate } from 'react-router-dom';
import { Flame, Feather, PenLine, ArrowRight } from 'lucide-react';
import { Button } from '../../../components/ui';
import { PostCard } from './PostCard';
import { PostCardSkeleton } from './PostCardSkeleton';
import { cn } from '../../../lib/utils';

export function TrendingSection({
  posts = [],
  isLoading = false,
  isRanked = false,
  trendingWindow = 14,
  startHref = '/write',
}) {
  const navigate = useNavigate();

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 w-full">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div className="flex flex-col gap-1.5">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary select-none">
            <Flame className="h-3.5 w-3.5" />
            {isRanked ? 'Community Favorites' : 'Fresh Discoveries'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            {isRanked ? 'Trending stories' : 'Latest stories'}
          </h2>
          <p className="text-sm text-muted-foreground">
            {isLoading
              ? 'Fetching stories…'
              : isRanked
                ? `Ranked by genuine reader engagement over the last ${trendingWindow} days.`
                : 'Freshly published stories from across the community.'}
          </p>
        </div>
      </div>

      {/* Post Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, index) => <PostCardSkeleton key={index} layout="row" />)
        ) : posts.length === 0 ? (
          <div className="col-span-full py-16 px-6 text-center flex flex-col items-center gap-4 bg-card border border-border/40 rounded-xl">
            <Feather className="h-10 w-10 text-muted-foreground opacity-50" />
            <h3 className="text-xl font-bold text-foreground">No stories published yet</h3>
            <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
              Be the very first writer to share an insightful article with the community!
            </p>
            <Button size="md" onClick={() => navigate(startHref)}>
              <PenLine className="h-4 w-4" /> Write a story
            </Button>
          </div>
        ) : (
          posts.map((post) => <PostCard key={post._id} post={post} layout="row" />)
        )}
      </div>

      {!isLoading && posts.length > 0 && (
        <div className="text-center mt-10">
          <Link
            to="/search"
            className={cn(
              'inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold select-none transition-all duration-150',
              'bg-card text-primary border border-border shadow-sm',
              'hover:bg-primary/10 hover:-translate-y-0.5 hover:shadow'
            )}
          >
            Explore all stories{' '}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      )}
    </div>
  );
}
