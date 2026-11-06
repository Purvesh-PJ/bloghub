import { Link } from 'react-router-dom';
import { Sparkles, User } from 'lucide-react';
import { Avatar, Button } from '../../../components/ui';

export function DashboardBanner({ user, avatarUrl, bio, firstName }) {
  const userId = user?._id || user?.user_id;

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-card to-primary/10 border border-primary/20 rounded-2xl p-6 sm:p-8 flex items-center justify-between gap-6 flex-wrap shadow-sm">
      <div className="flex items-center gap-4 sm:gap-6 min-w-0">
        <Avatar src={avatarUrl} name={user?.username} size="lg" />
        <div className="flex flex-col gap-1 min-w-0">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground flex items-center gap-2 tracking-tight">
            Welcome back, {firstName} <Sparkles className="w-5 h-5 text-primary" />
          </h2>
          <p className="text-sm text-muted-foreground max-w-[540px] leading-relaxed">
            {bio || 'How your writing is doing. Manage what you have written under Stories.'}
          </p>
        </div>
      </div>

      {userId && (
        <Button as={Link} to={`/user/${userId}`} variant="secondary" size="sm">
          <User className="w-3.5 h-3.5 mr-1" /> View public profile
        </Button>
      )}
    </div>
  );
}
