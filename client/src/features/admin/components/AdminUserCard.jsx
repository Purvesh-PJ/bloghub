import { LogOut, Shield } from 'lucide-react';
import { Avatar } from '../../../components/ui';
import { useAuth } from '../../../features/auth';
import { useCurrentUser } from '../../users/hooks/useCurrentUser';

/**
 * Sidebar user card with avatar, role pill, and sign-out action button.
 */
export function AdminUserCard({ onSignOut }) {
  const { user } = useAuth();
  const { avatarUrl } = useCurrentUser();

  return (
    <div className="flex items-center justify-between p-2.5 rounded-xl bg-muted/50 border border-border gap-2 mt-auto">
      <div className="flex items-center gap-2.5 min-w-0 flex-1 p-0.5">
        <Avatar src={avatarUrl} name={user?.username} size="sm" />
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-semibold text-foreground truncate">
            {user?.username}
          </span>
          <span className="text-caption font-medium text-destructive flex items-center gap-1">
            <Shield className="h-2.5 w-2.5" aria-hidden="true" /> Administrator
          </span>
        </div>
      </div>
      <button
        onClick={onSignOut}
        aria-label="Sign out"
        className="inline-flex items-center justify-center h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors shrink-0 cursor-pointer"
      >
        <LogOut className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}
