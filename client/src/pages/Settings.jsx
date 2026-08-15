import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import styled from 'styled-components';
import { User, Bell, Palette, Shield, Sun, Moon, Monitor, Check, Info } from 'lucide-react';
import toast from 'react-hot-toast';

import { userService } from '../services/userService';
import { settingsService } from '../services/settingsService';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../styles/ThemeProvider';
import { PageShell, PageHeader } from '../components/layout/PageShell';
import { Button, Input, TextArea, Surface, Loading, Badge } from '../components/ui';
import { display, text, media, interactive } from '../styles/theme/mixins';

/**
 * Settings.
 *
 * The previous version showed more than it could do. The website field was bound to state
 * that `handleSave` never sent; the three notification toggles were local state that was
 * never persisted; the change-password form had no handler and no endpoint behind it, and
 * neither did Delete Account; the System theme card was rendered permanently inactive.
 * Somebody could fill in a new password, press the button and get no response at all.
 *
 * Every control here is wired to something real. Where the backend genuinely has nothing —
 * there is no password-change route and no account-deletion route — the page says so rather
 * than drawing a form that quietly does nothing.
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
  border-radius: ${({ theme }) => theme.radii.full};
  text-align: left;
  white-space: nowrap;
  ${text('sm', 'medium')}
  ${interactive}

  background: ${({ theme, $active }) => ($active ? theme.colors.accentContainer : 'transparent')};
  color: ${({ theme, $active }) =>
    $active ? theme.colors.accentText : theme.colors.textSecondary};

  &:hover {
    background: ${({ theme, $active }) =>
      $active ? theme.colors.accentContainer : theme.colors.surfaceContainer};
    color: ${({ theme, $active }) =>
      $active ? theme.colors.accentText : theme.colors.textPrimary};
  }

  svg {
    width: 16px;
    height: 16px;
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
  const { user } = useAuth();
  const { preference, setTheme } = useTheme();
  const [tab, setTab] = useState('profile');

  const [form, setForm] = useState({ username: '', email: '', bio: '' });
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [privacy, setPrivacy] = useState({ showEmail: false, showActivity: true });

  const { data: userData, isLoading } = useQuery({
    queryKey: ['currentUser'],
    queryFn: userService.getUser,
  });

  const { data: settings } = useQuery({
    queryKey: ['userSettings'],
    queryFn: settingsService.getUserSettings,
    retry: false,
  });

  useEffect(() => {
    if (userData?.User) {
      setForm({
        username: userData.User.username || '',
        email: userData.User.email || '',
        bio: userData.User.profile?.bio || '',
      });
    }
  }, [userData]);

  useEffect(() => {
    const data = settings?.data ?? settings;
    if (!data) return;
    if (typeof data.emailNotifications === 'boolean') {
      setEmailNotifications(data.emailNotifications);
    }
    if (data.privacySettings) setPrivacy((current) => ({ ...current, ...data.privacySettings }));
  }, [settings]);

  const profileMutation = useMutation({
    mutationFn: () => {
      const body = new FormData();
      body.append('username', form.username);
      body.append('email', form.email);
      body.append('bio', form.bio);
      return userService.updateUser(body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      toast.success('Profile saved');
    },
    onError: () => toast.error('Could not save your profile'),
  });

  const settingsMutation = useMutation({
    mutationFn: (payload) => settingsService.updateUserSettings(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['userSettings'] }),
    onError: () => toast.error('Could not save that preference'),
  });

  const privacyMutation = useMutation({
    mutationFn: (payload) => settingsService.updatePrivacySettings({ privacySettings: payload }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['userSettings'] }),
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

  if (isLoading) return <Loading text="Loading settings…" />;

  return (
    <PageShell $width="wide">
      <PageHeader title="Settings" subtitle="Your account, and how BlogHub behaves for you." />

      <Layout>
        <Nav>
          {TABS.map((item) => (
            <NavItem key={item.id} $active={tab === item.id} onClick={() => setTab(item.id)}>
              <item.icon /> {item.label}
            </NavItem>
          ))}
        </Nav>

        <Panels>
          {tab === 'profile' && (
            <Panel>
              <PanelHead>
                <PanelTitle>Profile</PanelTitle>
                <PanelNote>
                  Your name and bio appear on your public page and beside everything you publish.
                </PanelNote>
              </PanelHead>

              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  profileMutation.mutate();
                }}
              >
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
                  In-app notifications, push and the weekly digest are still being built. They will
                  appear here once they work, rather than as switches that do nothing.
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
                  <PanelTitle>
                    Sign-in and security <Badge variant="neutral">Coming soon</Badge>
                  </PanelTitle>
                  <PanelNote>
                    Changing your password and deleting your account are not built yet. The previous
                    version of this page showed forms for both; neither had anywhere to send your
                    details, so they are not shown until they do.
                  </PanelNote>
                </PanelHead>

                <Notice>
                  <Info />
                  <span>
                    Signed in as <strong>{user?.email || form.email}</strong>. Sessions use a
                    short-lived token that refreshes silently while you are active.
                  </span>
                </Notice>
              </Panel>
            </>
          )}
        </Panels>
      </Layout>
    </PageShell>
  );
}
