import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { User, Shield, Eye, Palette, Lock, Trash2, Sun, Moon, Monitor } from 'lucide-react';
import styled from 'styled-components';
import toast from 'react-hot-toast';
import { userService } from '../services/userService';
import { settingsService } from '../services/settingsService';
import { Loading } from '../components/common/Loading';
import { useAuthStore } from '../store/authStore';
import { useTheme } from '../styles/ThemeProvider';

const PageWrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.lg};
`;

const PageTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['3xl']};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  letter-spacing: ${({ theme }) => theme.letterSpacing.tight};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const TabList = styled.div`
  display: flex;
  gap: 4px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  overflow-x: auto;
`;

const Tab = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ $active, theme }) => ($active ? theme.colors.textPrimary : theme.colors.textMuted)};
  background: transparent;
  border: none;
  border-bottom: 2px solid
    ${({ $active, theme }) => ($active ? theme.colors.textPrimary : 'transparent')};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  margin-bottom: -1px;
  white-space: nowrap;

  &:hover {
    color: ${({ theme }) => theme.colors.textPrimary};
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const Card = styled.div`
  background: ${({ theme }) => theme.colors.cardBg};
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: ${({ theme }) => theme.shadows.card};
`;

const CardHeader = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const CardTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 4px;
`;

const CardDescription = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const CardContent = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const FormGroup = styled.div``;

const Label = styled.label`
  display: block;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 8px;
`;

const Input = styled.input`
  width: 100%;
  height: 44px;
  padding: 0 ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.inputBg};
  border: 1px solid ${({ theme }) => theme.colors.inputBorder};
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.textPrimary};
  transition: all ${({ theme }) => theme.transitions.fast};

  &::placeholder {
    color: ${({ theme }) => theme.colors.inputPlaceholder};
  }
  &:hover {
    border-color: ${({ theme }) => theme.colors.inputBorderHover};
  }
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.inputBorderFocus};
    box-shadow: ${({ theme }) => theme.shadows.focus};
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 100px;
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.inputBg};
  border: 1px solid ${({ theme }) => theme.colors.inputBorder};
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-family: inherit;
  color: ${({ theme }) => theme.colors.textPrimary};
  resize: vertical;
  transition: all ${({ theme }) => theme.transitions.fast};

  &::placeholder {
    color: ${({ theme }) => theme.colors.inputPlaceholder};
  }
  &:hover {
    border-color: ${({ theme }) => theme.colors.inputBorderHover};
  }
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.inputBorderFocus};
    box-shadow: ${({ theme }) => theme.shadows.focus};
  }
`;

const AvatarSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const Avatar = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.bgTertiary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const AvatarInfo = styled.div``;

const AvatarTitle = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 4px;
`;

const AvatarHint = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-top: ${({ theme }) => theme.spacing.md};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  margin-top: ${({ theme }) => theme.spacing.md};
`;

const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 40px;
  padding: 0 ${({ theme }) => theme.spacing.lg};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  border-radius: ${({ theme }) => theme.radii.md};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  border: none;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const PrimaryButton = styled(Button)`
  background: ${({ theme }) => theme.colors.buttonPrimaryBg};
  color: ${({ theme }) => theme.colors.buttonPrimaryText};
  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.buttonPrimaryHover};
  }
`;

const SecondaryButton = styled(Button)`
  background: ${({ theme }) => theme.colors.buttonSecondaryBg};
  color: ${({ theme }) => theme.colors.buttonSecondaryText};
  border: 1px solid ${({ theme }) => theme.colors.buttonSecondaryBorder};
  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.buttonSecondaryHover};
  }
`;

const DangerButton = styled(Button)`
  background: ${({ theme }) => theme.colors.errorBg};
  color: ${({ theme }) => theme.colors.error};
  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.errorBorder};
  }
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  margin: ${({ theme }) => theme.spacing.lg} 0;
`;

const SettingRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.md} 0;

  &:not(:last-child) {
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  }
`;

const SettingInfo = styled.div``;

const SettingTitle = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 2px;
`;

const SettingDescription = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const Toggle = styled.button`
  width: 44px;
  height: 24px;
  border-radius: 12px;
  background: ${({ $checked, theme }) =>
    $checked ? theme.colors.textPrimary : theme.colors.bgTertiary};
  border: none;
  cursor: pointer;
  position: relative;
  transition: all ${({ theme }) => theme.transitions.fast};

  &::after {
    content: '';
    position: absolute;
    top: 2px;
    left: ${({ $checked }) => ($checked ? '22px' : '2px')};
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: ${({ $checked, theme }) =>
      $checked ? theme.colors.bgPrimary : theme.colors.textMuted};
    transition: all ${({ theme }) => theme.transitions.fast};
  }
`;

const ThemeOptions = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => theme.spacing.md};
`;

const ThemeOption = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ $active, theme }) => ($active ? theme.colors.bgTertiary : theme.colors.cardBg)};
  border: 2px solid
    ${({ $active, theme }) => ($active ? theme.colors.textPrimary : theme.colors.border)};
  border-radius: ${({ theme }) => theme.radii.lg};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    border-color: ${({ theme }) => theme.colors.textMuted};
  }

  svg {
    width: 24px;
    height: 24px;
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`;

const ThemeLabel = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.sm} 0;
`;

const InfoLabel = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const InfoValue = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const DangerZone = styled.div`
  margin-top: ${({ theme }) => theme.spacing.xl};
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.errorBg};
  border-radius: ${({ theme }) => theme.radii.lg};
`;

const DangerTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.error};
  margin-bottom: 8px;
`;

const DangerText = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

export function Settings() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const { mode, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('profile');

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [showEmail, setShowEmail] = useState(false);
  const [showActivity, setShowActivity] = useState(true);

  const { data: userData, isLoading } = useQuery({
    queryKey: ['currentUser'],
    queryFn: userService.getUser,
  });

  useEffect(() => {
    if (userData?.User) {
      setUsername(userData.User.username || '');
      setEmail(userData.User.email || '');
      setBio(userData.User.profile?.bio || '');
    }
  }, [userData]);

  const updateProfileMutation = useMutation({
    mutationFn: (formData) => userService.updateUser(formData),
    onSuccess: () => {
      queryClient.invalidateQueries(['currentUser']);
      toast.success('Profile updated!');
    },
    onError: () => toast.error('Failed to update profile'),
  });

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('username', username);
    formData.append('email', email);
    formData.append('bio', bio);
    updateProfileMutation.mutate(formData);
  };

  if (isLoading) return <Loading text="Loading settings..." />;

  const profile = userData?.User;

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'account', label: 'Account', icon: Shield },
    { id: 'privacy', label: 'Privacy', icon: Eye },
    { id: 'appearance', label: 'Appearance', icon: Palette },
  ];

  return (
    <PageWrapper>
      <PageTitle>Settings</PageTitle>

      <TabList>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <Tab key={tab.id} $active={activeTab === tab.id} onClick={() => setActiveTab(tab.id)}>
              <Icon /> {tab.label}
            </Tab>
          );
        })}
      </TabList>

      {activeTab === 'profile' && (
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Update your personal details</CardDescription>
          </CardHeader>
          <CardContent>
            <Form onSubmit={handleProfileSubmit}>
              <AvatarSection>
                <Avatar>{profile?.username?.[0]?.toUpperCase() || 'U'}</Avatar>
                <AvatarInfo>
                  <AvatarTitle>Profile Picture</AvatarTitle>
                  <AvatarHint>JPG, PNG or GIF. Max 2MB.</AvatarHint>
                </AvatarInfo>
              </AvatarSection>

              <FormGroup>
                <Label>Username</Label>
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Your username"
                />
              </FormGroup>

              <FormGroup>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                />
              </FormGroup>

              <FormGroup>
                <Label>Bio</Label>
                <TextArea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us about yourself"
                />
              </FormGroup>

              <ButtonRow>
                <PrimaryButton type="submit" disabled={updateProfileMutation.isPending}>
                  {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
                </PrimaryButton>
              </ButtonRow>
            </Form>
          </CardContent>
        </Card>
      )}

      {activeTab === 'account' && (
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>Manage your account details</CardDescription>
          </CardHeader>
          <CardContent>
            <InfoRow>
              <InfoLabel>User ID</InfoLabel>
              <InfoValue>{user?.user_id}</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>Account Type</InfoLabel>
              <InfoValue>{user?.roles?.join(', ') || 'User'}</InfoValue>
            </InfoRow>

            <Divider />

            <FormGroup>
              <Label>Change Password</Label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <Input type="password" placeholder="Current password" />
                <Input type="password" placeholder="New password" />
                <Input type="password" placeholder="Confirm new password" />
              </div>
            </FormGroup>

            <ButtonRow>
              <SecondaryButton type="button">
                <Lock size={16} /> Update Password
              </SecondaryButton>
            </ButtonRow>

            <DangerZone>
              <DangerTitle>Danger Zone</DangerTitle>
              <DangerText>
                Once you delete your account, there is no going back. Please be certain.
              </DangerText>
              <DangerButton type="button">
                <Trash2 size={16} /> Delete Account
              </DangerButton>
            </DangerZone>
          </CardContent>
        </Card>
      )}

      {activeTab === 'privacy' && (
        <Card>
          <CardHeader>
            <CardTitle>Privacy Settings</CardTitle>
            <CardDescription>Control your privacy preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <SettingRow>
              <SettingInfo>
                <SettingTitle>Show Email</SettingTitle>
                <SettingDescription>Allow others to see your email address</SettingDescription>
              </SettingInfo>
              <Toggle $checked={showEmail} onClick={() => setShowEmail(!showEmail)} />
            </SettingRow>

            <SettingRow>
              <SettingInfo>
                <SettingTitle>Show Activity</SettingTitle>
                <SettingDescription>Display your activity on your profile</SettingDescription>
              </SettingInfo>
              <Toggle $checked={showActivity} onClick={() => setShowActivity(!showActivity)} />
            </SettingRow>

            <SettingRow>
              <SettingInfo>
                <SettingTitle>Email Notifications</SettingTitle>
                <SettingDescription>Receive email notifications for updates</SettingDescription>
              </SettingInfo>
              <Toggle
                $checked={emailNotifications}
                onClick={() => setEmailNotifications(!emailNotifications)}
              />
            </SettingRow>

            <ButtonRow>
              <PrimaryButton type="button">Save Privacy Settings</PrimaryButton>
            </ButtonRow>
          </CardContent>
        </Card>
      )}

      {activeTab === 'appearance' && (
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Customize how BlogHub looks</CardDescription>
          </CardHeader>
          <CardContent>
            <Label>Theme</Label>
            <ThemeOptions>
              <ThemeOption $active={mode === 'light'} onClick={() => setTheme('light')}>
                <Sun />
                <ThemeLabel>Light</ThemeLabel>
              </ThemeOption>
              <ThemeOption $active={mode === 'dark'} onClick={() => setTheme('dark')}>
                <Moon />
                <ThemeLabel>Dark</ThemeLabel>
              </ThemeOption>
              <ThemeOption $active={false} onClick={() => {}}>
                <Monitor />
                <ThemeLabel>System</ThemeLabel>
              </ThemeOption>
            </ThemeOptions>
          </CardContent>
        </Card>
      )}
    </PageWrapper>
  );
}
