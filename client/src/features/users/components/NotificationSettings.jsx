import { Info } from 'lucide-react';
import { Card, Switch } from '../../../components/ui';

export function NotificationSettings({ emailNotifications, onNotificationsChange }) {
  return (
    <Card tone="low" radius="xl" padding="2xl" className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-[hsl(var(--foreground))]">
          Notifications
        </h2>
        <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">
          What reaches you, and where.
        </p>
      </div>

      <div className="flex flex-col">
        <Switch
          label="Email notifications"
          note="Replies to your posts and new followers."
          checked={emailNotifications}
          onChange={onNotificationsChange}
        />
      </div>

      <div className="flex items-center gap-3 p-4 rounded-xl bg-[hsl(var(--muted))] text-sm text-[hsl(var(--muted-foreground))]">
        <Info className="w-4 h-4 shrink-0 text-[hsl(var(--primary))]" />
        <span>
          In-app notifications, push and the weekly digest are still being built. They will appear
          here once they work, rather than as switches that do nothing.
        </span>
      </div>
    </Card>
  );
}

