import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { User, Bell, Palette, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

import { userService } from '../services/userService';
import { authService } from '../../auth/services/authService';
import { settingsService } from '../services/settingsService';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { useAuth } from '../../../features/auth';
import { useTheme } from '../../../styles/ThemeProvider';
import { PageShell } from '../../../components/layout/PageShell';
import { Card, Skeleton } from '../../../components/ui';
import {
  ProfileSettingsForm,
  AppearanceSettings,
  NotificationSettings,
  AccountSecuritySettings,
} from '../components';
import { queryKeys } from '../../../config/queryKeys';
import { cn } from '../../../lib/utils';

const TABS = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'account', label: 'Account', icon: Shield },
];

export function Settings() {
  const queryClient = useQueryClient();
  const { user, logout } = useAuth();
  const { account, avatarUrl, isLoading } = useCurrentUser();
  const navigate = useNavigate();
  const { preference, setTheme } = useTheme();
  const [tab, setTab] = useState('profile');

  const [form, setForm] = useState({ username: '', email: '', bio: '' });
  const [profileDetails, setProfileDetails] = useState({
    fullName: '',
    location: '',
    website: '',
    socialLinks: { github: '', twitter: '', linkedin: '' },
  });
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [privacy, setPrivacy] = useState({ showEmail: false, showActivity: true });

  const [syncedAccount, setSyncedAccount] = useState(null);
  if (account && syncedAccount !== account) {
    setSyncedAccount(account);
    setForm({
      username: account.username || '',
      email: account.email || '',
      bio: account.bio || '',
    });
    setProfileDetails({
      fullName: account.profile?.fullName || '',
      location: account.profile?.location || '',
      website: account.profile?.website || '',
      socialLinks: {
        github: account.profile?.socialLinks?.github || '',
        twitter: account.profile?.socialLinks?.twitter || '',
        linkedin: account.profile?.socialLinks?.linkedin || '',
      },
    });
    if (account.settings) {
      setEmailNotifications(account.settings.emailNotifications ?? true);
      setPrivacy({
        showEmail: account.settings.privacySettings?.showEmail ?? false,
        showActivity: account.settings.privacySettings?.showActivity ?? true,
      });
    }
  }

  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  const handleAvatarPick = (file) => {
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) return toast.error('Images must be smaller than 2 MB');
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const clearAvatarPick = () => {
    if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    setAvatarFile(null);
    setAvatarPreview(null);
  };

  const profileMutation = useMutation({
    mutationFn: async () => {
      const body = new FormData();
      body.append('username', form.username);
      body.append('email', form.email);
      body.append('bio', form.bio);
      if (avatarFile) body.append('image', avatarFile);

      await userService.updateUser(body);

      return settingsService.updateUserProfile({
        fullName: profileDetails.fullName,
        location: profileDetails.location,
        ...(profileDetails.website.trim() && { website: profileDetails.website.trim() }),
        socialLinks: profileDetails.socialLinks,
      });
    },
    onSuccess: () => {
      clearAvatarPick();
      queryClient.invalidateQueries({ queryKey: queryKeys.currentUser() });
      queryClient.invalidateQueries({ queryKey: queryKeys.profiles.ownDetails() });
      queryClient.invalidateQueries({ queryKey: queryKeys.profiles.all });
      toast.success('Profile saved');
    },
    onError: (error) => toast.error(error.response?.data?.message || 'Could not save your profile'),
  });

  const settingsMutation = useMutation({
    mutationFn: (payload) => settingsService.updateUserSettings(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.settings.all }),
    onError: () => toast.error('Could not save that preference'),
  });

  const privacyMutation = useMutation({
    mutationFn: (payload) => settingsService.updatePrivacySettings({ privacySettings: payload }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.settings.all }),
    onError: () => toast.error('Could not save that preference'),
  });

  const passwordMutation = useMutation({
    mutationFn: (payload) =>
      authService.changePassword(payload.currentPassword, payload.newPassword),
    onSuccess: () => {
      toast.success('Password changed — please sign in again');
      logout();
      navigate('/login');
    },
    onError: (error) =>
      toast.error(error.response?.data?.message || 'Could not change your password'),
  });

  const deleteAccountMutation = useMutation({
    mutationFn: (secret) => userService.deleteUser(user?._id || user?.user_id, secret),
    onSuccess: () => {
      toast.success('Account deleted');
      logout();
      navigate('/');
    },
    onError: (error) =>
      toast.error(error.response?.data?.message || 'Could not delete your account'),
  });

  const handleThemeChange = (next) => {
    setTheme(next);
    settingsService.updateAppearanceSettings({ theme: next }).catch(() => {});
  };

  const handleNotifications = (value) => {
    setEmailNotifications(value);
    settingsMutation.mutate({ emailNotifications: value });
  };

  const handlePrivacy = (key, value) => {
    const next = { ...privacy, [key]: value };
    setPrivacy(next);
    privacyMutation.mutate(next);
  };

  return (
    <PageShell width="wide">
      <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-8 items-start">
        {/* Navigation Sidebar */}
        <nav className="flex md:flex-col gap-1 sticky top-20 max-md:static max-md:overflow-x-auto pb-1">
          {TABS.map((item) => {
            const isActive = tab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                className={cn(
                  'flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors text-left whitespace-nowrap cursor-pointer select-none',
                  isActive
                    ? 'bg-[hsl(var(--primary))/0.12] text-[hsl(var(--primary))] font-semibold'
                    : 'text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]'
                )}
              >
                <item.icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Content Panels */}
        <div className="flex flex-col gap-6 min-w-0">
          {isLoading ? (
            <Card tone="low" radius="xl" padding="2xl" aria-hidden="true">
              <div className="flex flex-col gap-2">
                <Skeleton width={140} height={24} className="rounded" />
                <Skeleton width="60%" height={14} className="rounded" />
              </div>
              <div className="flex flex-col gap-5 mt-6">
                <Skeleton width="100%" height={44} className="rounded-xl" />
                <Skeleton width="100%" height={44} className="rounded-xl" />
                <Skeleton width="100%" height={96} className="rounded-xl" />
                <Skeleton width={120} height={40} className="rounded-full" />
              </div>
            </Card>
          ) : (
            <>
              {tab === 'profile' && (
                <ProfileSettingsForm
                  form={form}
                  setForm={setForm}
                  profileDetails={profileDetails}
                  setProfileDetails={setProfileDetails}
                  avatarUrl={avatarUrl}
                  avatarFile={avatarFile}
                  avatarPreview={avatarPreview}
                  handleAvatarPick={handleAvatarPick}
                  clearAvatarPick={clearAvatarPick}
                  onSubmit={(e) => {
                    e.preventDefault();
                    profileMutation.mutate();
                  }}
                  isPending={profileMutation.isPending}
                />
              )}

              {tab === 'appearance' && (
                <AppearanceSettings
                  preference={preference}
                  onThemeChange={handleThemeChange}
                />
              )}

              {tab === 'notifications' && (
                <NotificationSettings
                  emailNotifications={emailNotifications}
                  onNotificationsChange={handleNotifications}
                />
              )}

              {tab === 'account' && (
                <AccountSecuritySettings
                  userEmail={user?.email || form.email}
                  privacy={privacy}
                  onPrivacyChange={handlePrivacy}
                  onPasswordChange={(payload) => passwordMutation.mutate(payload)}
                  isPasswordPending={passwordMutation.isPending}
                  onDeleteAccount={(pw) => deleteAccountMutation.mutate(pw)}
                  isDeletePending={deleteAccountMutation.isPending}
                />
              )}
            </>
          )}
        </div>
      </div>
    </PageShell>
  );
}
