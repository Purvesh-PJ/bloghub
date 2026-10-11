import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Bell,
  Palette,
  Shield,
  Sun,
  Moon,
  Monitor,
  Check,
  Info,
  Trash2,
  ImagePlus,
} from 'lucide-react';
import toast from 'react-hot-toast';

import { userService } from '../services/userService';
import { authService } from '../services/authService';
import { settingsService } from '../services/settingsService';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../styles/ThemeProvider';
import { PageShell } from '../components/layout/PageShell';
import { Button, Input, TextArea, Card, Modal, Avatar, Skeleton } from '../components/ui';
import { queryKeys } from '../services/queryKeys';
import { cn } from '../lib/utils';

const MIN_PASSWORD_LENGTH = 10;

function Switch({ checked, onChange, label, note, disabled }) {
  return (
    <label
      className={cn(
        'flex items-center justify-between gap-6 py-4 cursor-pointer border-b border-[hsl(var(--border))/0.4] last:border-b-0',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
    >
      <span>
        <span className="text-base font-medium text-[hsl(var(--foreground))] block">{label}</span>
        {note && <span className="text-sm text-[hsl(var(--muted-foreground))] block mt-0.5">{note}</span>}
      </span>
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange(event.target.checked)}
        className="sr-only peer"
      />
      <div
        className={cn(
          'relative w-12 h-7 rounded-full transition-colors duration-200 shrink-0 cursor-pointer',
          checked ? 'bg-[hsl(var(--primary))]' : 'bg-[hsl(var(--muted))]'
        )}
      >
        <span
          className={cn(
            'absolute top-1 left-1 w-5 h-5 rounded-full bg-white transition-transform duration-200 shadow-sm',
            checked && 'translate-x-5'
          )}
        />
      </div>
    </label>
  );
}

const THEMES = [
  { id: 'light', label: 'Light', icon: Sun },
  { id: 'dark', label: 'Dark', icon: Moon },
  { id: 'system', label: 'System', icon: Monitor },
];

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
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  const { data: settings } = useQuery({
    queryKey: queryKeys.settings.all,
    queryFn: settingsService.getUserSettings,
    retry: false,
  });

  const { data: profileResponse } = useQuery({
    queryKey: queryKeys.profiles.ownDetails(),
    queryFn: () => settingsService.getUserProfile(),
    retry: false,
  });

  const [seededAccount, setSeededAccount] = useState(null);
  if (account && seededAccount !== account) {
    setSeededAccount(account);
    setForm({
      username: account.username || '',
      email: account.email || '',
      bio: account.profile?.bio || '',
    });
  }

  const [seededProfile, setSeededProfile] = useState(null);
  if (profileResponse?.data && seededProfile !== profileResponse) {
    setSeededProfile(profileResponse);
    const profile = profileResponse.data;
    setProfileDetails({
      fullName: profile.fullName ?? '',
      location: profile.location ?? '',
      website: profile.website ?? '',
      socialLinks: {
        github: profile.socialLinks?.github ?? '',
        twitter: profile.socialLinks?.twitter ?? '',
        linkedin: profile.socialLinks?.linkedin ?? '',
      },
    });
  }

  const [seededSettings, setSeededSettings] = useState(null);
  if (settings && seededSettings !== settings) {
    setSeededSettings(settings);
    const data = settings.data ?? settings;
    if (typeof data.emailNotifications === 'boolean') {
      setEmailNotifications(data.emailNotifications);
    }
    if (data.privacySettings) setPrivacy((current) => ({ ...current, ...data.privacySettings }));
  }

  const passwordMutation = useMutation({
    mutationFn: ({ currentPassword, newPassword, confirmPassword }) =>
      authService.changePassword(currentPassword, newPassword, confirmPassword),
    onSuccess: () => {
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      toast.success('Password changed. Please sign in again.');
      logout();
      navigate('/login', { replace: true });
    },
    onError: (error) =>
      toast.error(error.response?.data?.message || 'Could not change your password'),
  });

  const deleteAccountMutation = useMutation({
    mutationFn: (password) => userService.deleteAccount(password),
    onSuccess: () => {
      setConfirmDelete(false);
      toast.success('Your account has been deleted');
      logout();
      navigate('/', { replace: true });
    },
    onError: (error) =>
      toast.error(error.response?.data?.message || 'Could not delete your account'),
  });

  const MAX_AVATAR_BYTES = 2 * 1024 * 1024;

  const handleAvatarPick = (file) => {
    if (!file) return;
    if (file.size > MAX_AVATAR_BYTES) {
      return toast.error('That image is larger than 2 MB');
    }
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
                <Card tone="low" radius="xl" padding="2xl" className="flex flex-col gap-6">
                  <div>
                    <h2 className="text-xl font-bold tracking-tight text-[hsl(var(--foreground))]">
                      Profile
                    </h2>
                    <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">
                      Your name and bio appear on your public page and beside everything you publish.
                    </p>
                  </div>

                  <form
                    onSubmit={(event) => {
                      event.preventDefault();
                      profileMutation.mutate();
                    }}
                    className="flex flex-col gap-6"
                  >
                    {/* Avatar row */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pb-6 border-b border-[hsl(var(--border))/0.4]">
                      <Avatar src={avatarPreview || avatarUrl} name={form.username} size="xl" />
                      <div className="flex flex-col gap-2 min-w-0">
                        <p className="text-xs text-[hsl(var(--muted-foreground))]">
                          JPEG, PNG, WebP or GIF, up to 2 MB. Square images look best.
                        </p>
                        <div className="flex items-center gap-2 flex-wrap">
                          <label className="cursor-pointer">
                            <span className="inline-flex items-center gap-1.5 h-8 px-3.5 rounded-full bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))] border border-[hsl(var(--border))] text-xs font-medium hover:bg-[hsl(var(--muted))] transition-colors select-none">
                              <ImagePlus className="w-3.5 h-3.5" />
                              {avatarUrl || avatarFile ? 'Replace' : 'Upload'}
                            </span>
                            <input
                              type="file"
                              accept="image/jpeg,image/png,image/webp,image/gif"
                              onChange={(event) => handleAvatarPick(event.target.files?.[0])}
                              className="sr-only"
                            />
                          </label>
                          {avatarFile && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={clearAvatarPick}
                            >
                              Cancel
                            </Button>
                          )}
                        </div>
                        {avatarFile && (
                          <p className="text-xs text-amber-500 font-medium">
                            Not saved yet — press Save changes below.
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Inputs grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input
                        label="Username"
                        value={form.username}
                        onChange={(event) => setForm({ ...form, username: event.target.value })}
                        placeholder="Your name"
                      />
                      <Input
                        label="Email"
                        type="email"
                        value={form.email}
                        onChange={(event) => setForm({ ...form, email: event.target.value })}
                        placeholder="you@example.com"
                      />
                      <div className="sm:col-span-2">
                        <TextArea
                          label="Bio"
                          value={form.bio}
                          onChange={(event) => setForm({ ...form, bio: event.target.value })}
                          placeholder="A sentence or two about what you write."
                          rows={4}
                          hint="Shown on your public profile."
                        />
                      </div>

                      <Input
                        label="Display name"
                        value={profileDetails.fullName}
                        onChange={(event) =>
                          setProfileDetails({ ...profileDetails, fullName: event.target.value })
                        }
                        placeholder="How you'd like to be credited"
                        hint="Optional. Shown beneath your username."
                      />
                      <Input
                        label="Location"
                        value={profileDetails.location}
                        onChange={(event) =>
                          setProfileDetails({ ...profileDetails, location: event.target.value })
                        }
                        placeholder="City, country"
                      />
                      <div className="sm:col-span-2">
                        <Input
                          label="Website"
                          type="url"
                          value={profileDetails.website}
                          onChange={(event) =>
                            setProfileDetails({ ...profileDetails, website: event.target.value })
                          }
                          placeholder="https://example.com"
                          hint="Must start with http:// or https://"
                        />
                      </div>

                      <Input
                        label="GitHub"
                        value={profileDetails.socialLinks.github}
                        onChange={(event) =>
                          setProfileDetails({
                            ...profileDetails,
                            socialLinks: {
                              ...profileDetails.socialLinks,
                              github: event.target.value,
                            },
                          })
                        }
                        placeholder="username"
                      />
                      <Input
                        label="X / Twitter"
                        value={profileDetails.socialLinks.twitter}
                        onChange={(event) =>
                          setProfileDetails({
                            ...profileDetails,
                            socialLinks: {
                              ...profileDetails.socialLinks,
                              twitter: event.target.value,
                            },
                          })
                        }
                        placeholder="username"
                      />
                      <div className="sm:col-span-2">
                        <Input
                          label="LinkedIn"
                          value={profileDetails.socialLinks.linkedin}
                          onChange={(event) =>
                            setProfileDetails({
                              ...profileDetails,
                              socialLinks: {
                                ...profileDetails.socialLinks,
                                linkedin: event.target.value,
                              },
                            })
                          }
                          placeholder="username"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-2">
                      <Button type="submit" isLoading={profileMutation.isPending}>
                        Save changes
                      </Button>
                    </div>
                  </form>
                </Card>
              )}

              {tab === 'appearance' && (
                <Card tone="low" radius="xl" padding="2xl" className="flex flex-col gap-6">
                  <div>
                    <h2 className="text-xl font-bold tracking-tight text-[hsl(var(--foreground))]">
                      Appearance
                    </h2>
                    <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">
                      System follows whatever your device is set to, and changes with it.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {THEMES.map(({ id, label, icon: Icon }) => {
                      const isActive = preference === id;
                      return (
                        <button
                          key={id}
                          type="button"
                          onClick={() => handleThemeChange(id)}
                          aria-pressed={isActive}
                          className={cn(
                            'relative flex flex-col items-center gap-3 p-6 rounded-2xl border transition-all cursor-pointer select-none',
                            isActive
                              ? 'bg-[hsl(var(--primary))/0.12] text-[hsl(var(--primary))] border-[hsl(var(--primary))] shadow-sm'
                              : 'bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] border-transparent hover:bg-[hsl(var(--muted))/0.8]'
                          )}
                        >
                          {isActive && (
                            <span className="absolute top-3 right-3 flex items-center justify-center w-5 h-5 rounded-full bg-[hsl(var(--primary))] text-white">
                              <Check className="w-3 h-3" />
                            </span>
                          )}
                          <Icon className="w-6 h-6" />
                          <span className="text-sm font-medium">{label}</span>
                        </button>
                      );
                    })}
                  </div>
                </Card>
              )}

              {tab === 'notifications' && (
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
                      onChange={handleNotifications}
                    />
                  </div>

                  <div className="flex items-center gap-3 p-4 rounded-xl bg-[hsl(var(--muted))] text-sm text-[hsl(var(--muted-foreground))]">
                    <Info className="w-4 h-4 shrink-0 text-[hsl(var(--primary))]" />
                    <span>
                      In-app notifications, push and the weekly digest are still being built. They
                      will appear here once they work, rather than as switches that do nothing.
                    </span>
                  </div>
                </Card>
              )}

              {tab === 'account' && (
                <>
                  {/* Privacy settings */}
                  <Card tone="low" radius="xl" padding="2xl" className="flex flex-col gap-6">
                    <div>
                      <h2 className="text-xl font-bold tracking-tight text-[hsl(var(--foreground))]">
                        Privacy
                      </h2>
                      <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">
                        What other people can see on your public page.
                      </p>
                    </div>

                    <div className="flex flex-col">
                      <Switch
                        label="Show my email address"
                        note="Visitors to your profile can see it."
                        checked={privacy.showEmail}
                        onChange={(value) => handlePrivacy('showEmail', value)}
                      />
                      <Switch
                        label="Show my activity"
                        note="Recent posts and comments appear on your profile."
                        checked={privacy.showActivity}
                        onChange={(value) => handlePrivacy('showActivity', value)}
                      />
                    </div>
                  </Card>

                  {/* Change password */}
                  <Card tone="low" radius="xl" padding="2xl" className="flex flex-col gap-6">
                    <div>
                      <h2 className="text-xl font-bold tracking-tight text-[hsl(var(--foreground))]">
                        Change password
                      </h2>
                      <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">
                        You will be signed out everywhere once it changes, including here — that is
                        what makes changing it useful if the old one leaked.
                      </p>
                    </div>

                    <div className="flex items-center gap-3 p-4 rounded-xl bg-[hsl(var(--muted))] text-sm text-[hsl(var(--muted-foreground))]">
                      <Info className="w-4 h-4 shrink-0 text-[hsl(var(--primary))]" />
                      <span>
                        Signed in as <strong>{user?.email || form.email}</strong>. Sessions use a
                        short-lived token that refreshes silently while you are active.
                      </span>
                    </div>

                    <form
                      onSubmit={(event) => {
                        event.preventDefault();
                        if (passwordForm.newPassword.length < MIN_PASSWORD_LENGTH) {
                          return toast.error(
                            `New password must be at least ${MIN_PASSWORD_LENGTH} characters`
                          );
                        }
                        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
                          return toast.error('New passwords do not match');
                        }
                        passwordMutation.mutate(passwordForm);
                      }}
                      className="flex flex-col gap-4"
                    >
                      <Input
                        label="Current password"
                        type="password"
                        autoComplete="current-password"
                        value={passwordForm.currentPassword}
                        onChange={(event) =>
                          setPasswordForm((f) => ({ ...f, currentPassword: event.target.value }))
                        }
                      />
                      <Input
                        label="New password"
                        type="password"
                        autoComplete="new-password"
                        value={passwordForm.newPassword}
                        onChange={(event) =>
                          setPasswordForm((f) => ({ ...f, newPassword: event.target.value }))
                        }
                        hint={`At least ${MIN_PASSWORD_LENGTH} characters. A passphrase beats punctuation.`}
                      />
                      <Input
                        label="Confirm new password"
                        type="password"
                        autoComplete="new-password"
                        value={passwordForm.confirmPassword}
                        onChange={(event) =>
                          setPasswordForm((f) => ({ ...f, confirmPassword: event.target.value }))
                        }
                      />

                      <div className="flex justify-end pt-2">
                        <Button type="submit" disabled={passwordMutation.isPending}>
                          {passwordMutation.isPending ? 'Changing…' : 'Change password'}
                        </Button>
                      </div>
                    </form>
                  </Card>

                  {/* Delete account */}
                  <Card tone="low" radius="xl" padding="2xl" className="flex flex-col gap-4">
                    <div>
                      <h2 className="text-xl font-bold tracking-tight text-red-500">
                        Delete account
                      </h2>
                      <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">
                        Removes your account, your stories, and the comments and likes on them. This
                        cannot be undone.
                      </p>
                    </div>

                    <div>
                      <Button variant="dangerTonal" onClick={() => setConfirmDelete(true)}>
                        <Trash2 className="w-4 h-4 mr-1.5" /> Delete my account
                      </Button>
                    </div>
                  </Card>
                </>
              )}
            </>
          )}
        </div>
      </div>

      {/* Delete Account Modal */}
      <Modal
        open={confirmDelete}
        onOpenChange={(open) => {
          setConfirmDelete(open);
          if (!open) setDeletePassword('');
        }}
        title="Delete your account?"
        description="Your stories, and the comments and likes on them, go with it. This cannot be undone."
      >
        <form
          onSubmit={(event) => {
            event.preventDefault();
            if (!deletePassword) return toast.error('Enter your password to confirm');
            deleteAccountMutation.mutate(deletePassword);
          }}
          className="flex flex-col gap-4"
        >
          <Input
            label="Confirm your password"
            type="password"
            autoComplete="current-password"
            value={deletePassword}
            onChange={(event) => setDeletePassword(event.target.value)}
          />
          <Modal.Footer>
            <Button type="button" variant="secondary" onClick={() => setConfirmDelete(false)}>
              Keep my account
            </Button>
            <Button type="submit" variant="danger" disabled={deleteAccountMutation.isPending}>
              {deleteAccountMutation.isPending ? 'Deleting…' : 'Delete permanently'}
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </PageShell>
  );
}
