import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import styled, { css } from 'styled-components';
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
import { Button, Input, TextArea, Surface, Modal, Avatar, Skeleton } from '../components/ui';
import { display, text, media, interactive } from '../styles/theme/mixins';
import { queryKeys } from '../services/queryKeys';

// Mirrors the server-side minimum in validators/auth.validators.js.
const MIN_PASSWORD_LENGTH = 10;

/**
 * Settings.
 *
 * The previous version showed more than it could do. The website field was bound to state
 * that `handleSave` never sent; the three notification toggles were local state that was
 * never persisted; the change-password form had no handler and no endpoint behind it, and
 * neither did Delete Account; the System theme card was rendered permanently inactive.
 * Somebody could fill in a new password, press the button and get no response at all.
 *
 * Every control here is wired to something real, changing the password and deleting the
 * account included — both now have routes behind them rather than a "coming soon" badge.
 */

const Layout = styled.div`
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: ${({ theme }) => theme.spacing['2xl']};
  align-items: start;

  ${media.down('md')`grid-template-columns: 1fr;`}
`;

const Nav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  position: sticky;
  top: calc(${({ theme }) => theme.layout.headerHeight} + ${({ theme }) => theme.spacing.xl});

  ${media.down('md')`
    position: static;
    flex-direction: row;
    overflow-x: auto;
    padding-bottom: ${({ theme }) => theme.spacing.xs};
  `}
`;

const NavItem = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.radii.md};
  border: none;
  text-align: left;
  white-space: nowrap;
  ${text('sm', 'medium')}
  ${interactive}

  background: ${({ theme, $active }) => ($active ? theme.colors.accentContainer : 'transparent')};
  color: ${({ theme, $active }) =>
    $active ? theme.colors.accentText : theme.colors.textSecondary};

  ${({ $active }) =>
    $active &&
    css`
      font-weight: 600;
    `}

  &:hover {
    background: ${({ theme, $active }) =>
      $active ? theme.colors.accentContainer : theme.colors.surfaceContainer};
    color: ${({ theme, $active }) =>
      $active ? theme.colors.accentText : theme.colors.textPrimary};
  }

  svg {
    width: 17px;
    height: 17px;
    color: ${({ theme, $active }) => ($active ? theme.colors.accentSolid : theme.colors.textMuted)};
  }
`;

const Panels = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};
  min-width: 0;
`;

const Panel = styled(Surface).attrs({ $tone: 'low', $radius: 'xl', $padding: '2xl' })`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};
`;

const PanelHead = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const PanelTitle = styled.h2`
  ${display('xs')}
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const PanelNote = styled.p`
  ${text('sm')}
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const AvatarRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xl};
  padding-bottom: ${({ theme }) => theme.spacing.xl};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  border-bottom: 1px solid ${({ theme }) => theme.colors.lineSubtle};

  ${media.down('sm')`
    flex-direction: column;
    align-items: flex-start;
  `}
`;

const AvatarControls = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  min-width: 0;
`;

/*
  The visible control is the Button rendered as a <label>; this is the real input it wraps.
  Hidden with clip rather than display:none so it stays focusable from the keyboard.
*/
const HiddenFileInput = styled.input`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
  border: 0;
`;

const Fields = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${({ theme }) => theme.spacing.lg};

  .full {
    grid-column: 1 / -1;
  }

  ${media.down('sm')`grid-template-columns: 1fr;`}
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.sm};
`;

/* ── Switch row ──────────────────────────────────────────────────────────── */

const Rows = styled.div`
  display: flex;
  flex-direction: column;
`;

const SwitchRow = styled.label`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.xl};
  padding: ${({ theme }) => theme.spacing.lg} 0;
  cursor: pointer;

  & + & {
    box-shadow: inset 0 1px 0 ${({ theme }) => theme.colors.lineSubtle};
  }
`;

const SwitchLabel = styled.span`
  ${text('md', 'medium')}
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const SwitchNote = styled.span`
  display: block;
  ${text('sm')}
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-top: 2px;
`;

const Track = styled.span`
  position: relative;
  flex-shrink: 0;
  width: 46px;
  height: 28px;
  border-radius: ${({ theme }) => theme.radii.full};
  background: ${({ theme, $on }) =>
    $on ? theme.colors.accentSolid : theme.colors.surfaceContainerHigh};
  transition: background ${({ theme }) => theme.transitions.normal};

  &::after {
    content: '';
    position: absolute;
    top: 3px;
    left: ${({ $on }) => ($on ? '21px' : '3px')};
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: #fff;
    box-shadow: ${({ theme }) => theme.elevation.sm};
    transition: left ${({ theme }) => theme.transitions.normal};
  }

  input:focus-visible + & {
    box-shadow: ${({ theme }) => theme.shadows.focus};
  }
`;

const HiddenCheckbox = styled.input`
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
`;

function Switch({ checked, onChange, label, note, disabled }) {
  return (
    <SwitchRow style={disabled ? { opacity: 0.5, cursor: 'not-allowed' } : undefined}>
      <span>
        <SwitchLabel>{label}</SwitchLabel>
        {note && <SwitchNote>{note}</SwitchNote>}
      </span>
      <HiddenCheckbox
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange(event.target.checked)}
      />
      <Track $on={checked} />
    </SwitchRow>
  );
}

/* ── Theme picker ────────────────────────────────────────────────────────── */

const ThemeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => theme.spacing.md};

  ${media.down('sm')`grid-template-columns: 1fr;`}
`;

const ThemeCard = styled.button`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.radii.lg};
  ${interactive}

  background: ${({ theme, $active }) =>
    $active ? theme.colors.accentContainer : theme.colors.surfaceContainer};
  color: ${({ theme, $active }) =>
    $active ? theme.colors.accentText : theme.colors.textSecondary};
  box-shadow: ${({ theme, $active }) =>
    $active ? `inset 0 0 0 2px ${theme.colors.accentSolid}` : 'none'};

  &:hover {
    background: ${({ theme, $active }) =>
      $active ? theme.colors.accentContainer : theme.colors.surfaceContainerHigh};
  }

  svg {
    width: 22px;
    height: 22px;
  }
`;

const ThemeName = styled.span`
  ${text('sm', 'medium')}
`;

const Tick = styled.span`
  position: absolute;
  top: ${({ theme }) => theme.spacing.sm};
  right: ${({ theme }) => theme.spacing.sm};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.accentSolid};
  color: ${({ theme }) => theme.colors.textOnAccent};

  svg {
    width: 12px;
    height: 12px;
  }
`;

/* ── Notice ──────────────────────────────────────────────────────────────── */

const Notice = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surfaceContainer};
  ${text('sm')}
  color: ${({ theme }) => theme.colors.textSecondary};

  svg {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
    color: ${({ theme }) => theme.colors.textMuted};
  }
`;

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
  /*
    One source for the account, shared with the header.

    This screen used to declare its own `useQuery` on the same key alongside this hook — two
    definitions of the same fetch, which happened to agree. Any drift between them would have
    shown as the header and the form disagreeing about the signed-in user.
  */
  const { account, avatarUrl, isLoading } = useCurrentUser();
  const navigate = useNavigate();
  const { preference, setTheme } = useTheme();
  const [tab, setTab] = useState('profile');

  const [form, setForm] = useState({ username: '', email: '', bio: '' });
  /*
    The rest of the public profile.

    `PUT /settings/profile` and its service wrapper have accepted these fields all along, and
    the profile schema declares every one of them — nothing anywhere in the app ever sent
    them, so a writer had no way to say where they are, link their own site, or connect a
    handle. Kept separate from `form` because they save through a different endpoint:
    username, email and avatar go to `PUT /users/setUser`, these to `PUT /settings/profile`.
  */
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

  /*
    Seeding the editable fields from what the server holds.

    Done during render rather than in an effect, keyed on the fetched payload itself: an
    effect paints one frame with empty inputs before filling them, which on this screen reads
    as "your profile is blank". Each block runs again only when a refetch produces a new
    object — after a save, for instance, so the form re-syncs with what was actually stored.
  */
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
    // Older responses returned the settings bare rather than under `data`.
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
      // The token that made this request was revoked along with the others, so there is no
      // session left to return to.
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

  // Mirrors the server's own limits, so an oversized file is refused here rather than after
  // an upload the browser has already spent time on.
  const MAX_AVATAR_BYTES = 2 * 1024 * 1024;

  const handleAvatarPick = (file) => {
    if (!file) return;
    if (file.size > MAX_AVATAR_BYTES) {
      return toast.error('That image is larger than 2 MB');
    }
    setAvatarFile(file);
    // Shown immediately, so the choice is visible before it is saved.
    setAvatarPreview(URL.createObjectURL(file));
  };

  const clearAvatarPick = () => {
    if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    setAvatarFile(null);
    setAvatarPreview(null);
  };

  /*
    Saving the profile touches two endpoints: the account fields and the avatar go to
    `PUT /users/setUser` as multipart, the rest to `PUT /settings/profile` as JSON. Issued in
    sequence rather than together so that a rejected username — the likeliest failure, since
    it is the one with a uniqueness constraint — is reported before the second write lands
    and leaves the two halves disagreeing.
  */
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
        // The server only accepts an http(s) URL, and rejects an empty string as one. Send
        // nothing when the field is blank rather than a value it must refuse.
        ...(profileDetails.website.trim() && { website: profileDetails.website.trim() }),
        socialLinks: profileDetails.socialLinks,
      });
    },
    onSuccess: () => {
      clearAvatarPick();
      queryClient.invalidateQueries({ queryKey: queryKeys.currentUser() });
      queryClient.invalidateQueries({ queryKey: queryKeys.profiles.ownDetails() });
      // The public page reads the same profile, so its cached copy is now stale.
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
    // Persist for other devices. The local choice already applies either way, so a failure
    // here is not worth interrupting anybody over.
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
    <PageShell $width="wide">
      <Layout>
        <Nav>
          {TABS.map((item) => (
            <NavItem key={item.id} $active={tab === item.id} onClick={() => setTab(item.id)}>
              <item.icon /> {item.label}
            </NavItem>
          ))}
        </Nav>

        <Panels>
          {isLoading ? (
            <Panel aria-hidden="true">
              <PanelHead>
                <Skeleton $width={140} $height={24} $radius="xs" />
                <Skeleton $width="60%" $height={14} $radius="xs" />
              </PanelHead>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginTop: 16 }}>
                <Skeleton $width="100%" $height={44} $radius="md" />
                <Skeleton $width="100%" $height={44} $radius="md" />
                <Skeleton $width="100%" $height={96} $radius="md" />
                <Skeleton $width={120} $height={40} $radius="full" />
              </div>
            </Panel>
          ) : (
            <>
              {tab === 'profile' && (
                <Panel>
                  <PanelHead>
                    <PanelTitle>Profile</PanelTitle>
                    <PanelNote>
                      Your name and bio appear on your public page and beside everything you
                      publish.
                    </PanelNote>
                  </PanelHead>

                  <form
                    onSubmit={(event) => {
                      event.preventDefault();
                      profileMutation.mutate();
                    }}
                  >
                    {/*
                  The API has accepted an avatar all along and getUser returns one, but there
                  was no control anywhere in the app to send it, so the feature was invisible.
                */}
                    <AvatarRow>
                      <Avatar src={avatarPreview || avatarUrl} name={form.username} size="xl" />
                      <AvatarControls>
                        <PanelNote>
                          JPEG, PNG, WebP or GIF, up to 2 MB. Square images look best.
                        </PanelNote>
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                          <Button type="button" variant="secondary" size="sm" as="label">
                            <ImagePlus size={14} /> {avatarUrl || avatarFile ? 'Replace' : 'Upload'}
                            <HiddenFileInput
                              type="file"
                              accept="image/jpeg,image/png,image/webp,image/gif"
                              onChange={(event) => handleAvatarPick(event.target.files?.[0])}
                            />
                          </Button>
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
                          <PanelNote>Not saved yet — press Save changes below.</PanelNote>
                        )}
                      </AvatarControls>
                    </AvatarRow>

                    <Fields>
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
                      <div className="full">
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
                      <div className="full">
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
                    </Fields>

                    <Actions style={{ marginTop: 24 }}>
                      <Button type="submit" isLoading={profileMutation.isPending}>
                        Save changes
                      </Button>
                    </Actions>
                  </form>
                </Panel>
              )}

              {tab === 'appearance' && (
                <Panel>
                  <PanelHead>
                    <PanelTitle>Appearance</PanelTitle>
                    <PanelNote>
                      System follows whatever your device is set to, and changes with it.
                    </PanelNote>
                  </PanelHead>

                  <ThemeGrid>
                    {THEMES.map(({ id, label, icon: Icon }) => (
                      <ThemeCard
                        key={id}
                        type="button"
                        $active={preference === id}
                        onClick={() => handleThemeChange(id)}
                        aria-pressed={preference === id}
                      >
                        {preference === id && (
                          <Tick>
                            <Check />
                          </Tick>
                        )}
                        <Icon />
                        <ThemeName>{label}</ThemeName>
                      </ThemeCard>
                    ))}
                  </ThemeGrid>
                </Panel>
              )}

              {tab === 'notifications' && (
                <Panel>
                  <PanelHead>
                    <PanelTitle>Notifications</PanelTitle>
                    <PanelNote>What reaches you, and where.</PanelNote>
                  </PanelHead>

                  <Rows>
                    <Switch
                      label="Email notifications"
                      note="Replies to your posts and new followers."
                      checked={emailNotifications}
                      onChange={handleNotifications}
                    />
                  </Rows>

                  <Notice>
                    <Info />
                    <span>
                      In-app notifications, push and the weekly digest are still being built. They
                      will appear here once they work, rather than as switches that do nothing.
                    </span>
                  </Notice>
                </Panel>
              )}

              {tab === 'account' && (
                <>
                  <Panel>
                    <PanelHead>
                      <PanelTitle>Privacy</PanelTitle>
                      <PanelNote>What other people can see on your public page.</PanelNote>
                    </PanelHead>

                    <Rows>
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
                    </Rows>
                  </Panel>

                  <Panel>
                    <PanelHead>
                      <PanelTitle>Change password</PanelTitle>
                      <PanelNote>
                        You will be signed out everywhere once it changes, including here — that is
                        what makes changing it useful if the old one leaked.
                      </PanelNote>
                    </PanelHead>

                    <Notice>
                      <Info />
                      <span>
                        Signed in as <strong>{user?.email || form.email}</strong>. Sessions use a
                        short-lived token that refreshes silently while you are active.
                      </span>
                    </Notice>

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
                    >
                      <Rows>
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
                      </Rows>

                      <div style={{ marginTop: 16 }}>
                        <Button type="submit" disabled={passwordMutation.isPending}>
                          {passwordMutation.isPending ? 'Changing…' : 'Change password'}
                        </Button>
                      </div>
                    </form>
                  </Panel>

                  <Panel>
                    <PanelHead>
                      <PanelTitle>Delete account</PanelTitle>
                      <PanelNote>
                        Removes your account, your stories, and the comments and likes on them. This
                        cannot be undone.
                      </PanelNote>
                    </PanelHead>

                    <Button variant="dangerTonal" onClick={() => setConfirmDelete(true)}>
                      <Trash2 size={16} /> Delete my account
                    </Button>
                  </Panel>
                </>
              )}
            </>
          )}
        </Panels>
      </Layout>

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
        >
          <Input
            label="Confirm your password"
            type="password"
            autoComplete="current-password"
            value={deletePassword}
            onChange={(event) => setDeletePassword(event.target.value)}
          />
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 16 }}>
            <Button type="button" variant="secondary" onClick={() => setConfirmDelete(false)}>
              Keep my account
            </Button>
            <Button type="submit" variant="danger" disabled={deleteAccountMutation.isPending}>
              {deleteAccountMutation.isPending ? 'Deleting…' : 'Delete permanently'}
            </Button>
          </div>
        </form>
      </Modal>
    </PageShell>
  );
}
