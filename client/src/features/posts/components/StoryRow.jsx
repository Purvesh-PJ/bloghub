import { Link, useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  ExternalLink,
  Eye,
  EyeOff,
  Globe,
  Share2,
  Heart,
  Lock,
} from 'lucide-react';
import toast from 'react-hot-toast';

import { ReadRateBar } from '../../analytics/components/ReadRateBar';
import { Button, Badge, DropdownMenu } from '../../../components/ui';
import { cn } from '../../../lib/utils';

export function StoryRow({ post, stats, onDelete, onSetVisibility, selected, onToggleSelected }) {
  const navigate = useNavigate();
  const isPublic = post.visibility === 'public';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/post/${post._id}`);
    if (isPublic) {
      toast.success('Public link copied');
    } else {
      toast('Link copied — but this story is not published, so only you can open it', {
        icon: '🔒',
      });
    }
  };

  const visibilityActions = [
    { value: 'public', label: 'Publish story live', icon: <Globe className="w-3.5 h-3.5 mr-2" /> },
    { value: 'draft', label: 'Move to drafts', icon: <EyeOff className="w-3.5 h-3.5 mr-2" /> },
    { value: 'private', label: 'Make private', icon: <Lock className="w-3.5 h-3.5 mr-2" /> },
  ].filter((option) => option.value !== (post.visibility || 'draft'));

  const views = stats?.views ?? post.views?.length ?? 0;
  const reads = stats?.reads ?? 0;
  const rate = stats?.readRate ?? (views > 0 ? Math.round((reads / views) * 100) : 0);

  return (
    <div
      className={cn(
        'grid grid-cols-[28px_minmax(0,1fr)_44px] sm:grid-cols-[28px_minmax(0,1fr)_170px_96px] lg:grid-cols-[28px_minmax(0,1fr)_170px_110px_96px] items-center gap-4 sm:gap-6 p-4 rounded-xl transition-colors border-b border-border/40 last:border-b-0',
        selected ? 'bg-primary/12' : 'hover:bg-muted/50'
      )}
    >
      {/* Select Cell */}
      <div className="flex items-center">
        <input
          type="checkbox"
          checked={selected}
          onChange={() => onToggleSelected(post._id)}
          aria-label={`Select ${post.title || 'Untitled'}`}
          className="w-4 h-4 rounded accent-primary cursor-pointer"
        />
      </div>

      {/* Title & Metadata Cell */}
      <div className="min-w-0">
        <Link
          to={`/post/${post._id}`}
          className="text-base font-semibold text-foreground hover:text-primary transition-colors line-clamp-1 no-underline"
        >
          {post.title || 'Untitled'}
        </Link>
        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground flex-wrap">
          <Badge
            variant={isPublic ? 'success' : post.visibility === 'private' ? 'warning' : 'neutral'}
          >
            {post.visibility || 'draft'}
          </Badge>
          <span>
            {(() => {
              const d = post.createdAt ? new Date(post.createdAt) : null;
              return d && !isNaN(d.getTime())
                ? formatDistanceToNow(d, { addSuffix: true })
                : 'recently';
            })()}
          </span>
          {post.tags?.[0] && <span>· #{post.tags[0]?.name ?? post.tags[0]}</span>}
        </div>
      </div>

      {/* Read Rate Bar Cell */}
      <div className="max-sm:col-start-2 max-sm:col-span-2 max-sm:mt-1">
        <ReadRateBar views={views} reads={reads} rate={rate} />
      </div>

      {/* Engagement Stats Cell */}
      <div className="hidden lg:flex items-center gap-4 text-sm text-muted-foreground tabular-nums">
        <span title="Total views" className="inline-flex items-center gap-1">
          <Eye className="w-3.5 h-3.5 text-primary" /> {views}
        </span>
        <span title="Likes received" className="inline-flex items-center gap-1">
          <Heart className="w-3.5 h-3.5 text-primary" /> {post.likes?.length ?? 0}
        </span>
      </div>

      {/* Row Actions Cell */}
      <div className="flex items-center justify-end">
        <DropdownMenu
          trigger={
            <Button
              variant="ghost"
              size="sm"
              aria-label={`Actions for ${post.title || 'Untitled'}`}
            >
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          }
        >
          <DropdownMenu.Item onSelect={() => navigate(`/edit/${post._id}`)}>
            <Pencil className="w-3.5 h-3.5 mr-2" /> Edit story
          </DropdownMenu.Item>

          <DropdownMenu.Item onSelect={() => navigate(`/post/${post._id}`)}>
            <ExternalLink className="w-3.5 h-3.5 mr-2" />{' '}
            {isPublic ? 'View live story' : 'Preview as reader'}
          </DropdownMenu.Item>

          <DropdownMenu.Item onSelect={handleCopyLink}>
            <Share2 className="w-3.5 h-3.5 mr-2" />{' '}
            {isPublic ? 'Copy public link' : 'Copy private link'}
          </DropdownMenu.Item>

          <DropdownMenu.Separator />
          <DropdownMenu.Label>Visibility</DropdownMenu.Label>

          {visibilityActions.map((option) => (
            <DropdownMenu.Item
              key={option.value}
              onSelect={() => onSetVisibility(post, option.value)}
            >
              {option.icon} {option.label}
            </DropdownMenu.Item>
          ))}

          <DropdownMenu.Separator />
          <DropdownMenu.Item onSelect={() => onDelete(post)} className="text-destructive">
            <Trash2 className="w-3.5 h-3.5 mr-2 text-destructive" /> Delete story
          </DropdownMenu.Item>
        </DropdownMenu>
      </div>
    </div>
  );
}
