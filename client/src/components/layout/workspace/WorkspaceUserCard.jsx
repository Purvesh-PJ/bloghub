import { Link } from 'react-router-dom';
import { ExternalLink, LogOut } from 'lucide-react';
import { Avatar } from '../../ui';

export function WorkspaceUserCard({ user, avatarUrl, onOpenSignOut, onCloseMobile }) {
  const userId = user?._id || user?.user_id;

  return (
    <div className="flex items-center justify-between p-2.5 rounded-xl bg-muted/50 border border-border/50 gap-2 mt-auto">
      <Link
        to={userId ? `/user/${userId}` : '/settings'}
        title="View Public Profile"
        onClick={onCloseMobile}
        className="flex items-center gap-2.5 min-w-0 flex-1 rounded-md p-0.5 group transition-colors"
      >
        <Avatar src={avatarUrl} name={user?.username} size="sm" />
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-semibold text-foreground group-hover:text-primary truncate transition-colors">
            {user?.username || 'Creator'}
          </span>
          <span className="text-caption font-medium text-primary flex items-center gap-1">
            Public Profile <ExternalLink className="h-2.5 w-2.5" />
          </span>
        </div>
      </Link>
      <button
        type="button"
        onClick={onOpenSignOut}
        aria-label="Sign out"
        className="inline-flex items-center justify-center h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors shrink-0 cursor-pointer"
      >
        <LogOut className="h-4 w-4" />
      </button>
    </div>
  );
}
