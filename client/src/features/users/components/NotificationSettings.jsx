import React from 'react';
import { Switch } from '../../../components/ui';
import { SettingSection } from '../../../components/patterns';

export function NotificationSettings({ emailNotifications, onNotificationsChange }) {
  return (
    <SettingSection
      title="Notifications"
      description="What reaches you, and where."
      info="In-app notifications, push and the weekly digest are still being built. They will appear here once they work, rather than as switches that do nothing."
    >
      <div className="flex flex-col">
        <Switch
          label="Email notifications"
          note="Replies to your posts and new followers."
          checked={emailNotifications}
          onChange={onNotificationsChange}
        />
      </div>
    </SettingSection>
  );
}
