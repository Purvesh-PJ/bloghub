import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { User, Bell, Palette, Shield, Sun, Moon, Monitor, Camera, Check } from 'lucide-react';
import styled from 'styled-components';
import toast from 'react-hot-toast';
import { userService } from '../services/userService';
import { Loading } from '../components/common/Loading';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../styles/ThemeProvider';

const PageWrapper = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.lg};
`;

const PageHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const PageTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['3xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const PageSubtitle = styled.p`
  color: ${({ theme }) => theme.colors.textMuted};
`;

const Layout = styled.div`
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: ${({ theme }) => theme.spacing.xl};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

const Sidebar = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 4px;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: row;
    overflow-x: auto;
    padding-bottom: ${({ theme }) => theme.spacing.md};
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    margin-bottom: ${({ theme }) => theme.spacing.lg};
  }
`;

const NavItem = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ $active, theme }) => $active ? theme.colors.accent : theme.colors.textSecondary};
  background: ${({ $active, theme }) => $active ? theme.colors.accentSubtle : 'transparent'};
  border: none;
  border-radius: ${({ theme }) => theme.radii.lg};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  white-space: nowrap;
  
  &:hover {
    background: ${({ $active, theme }) => $active ? theme.colors.accentSubtle : theme.colors.bgHover};
    color: ${({ $active, theme }) => $active ? theme.colors.accent : theme.colors.textPrimary};
  }
  
  svg {
    width: 18px;
    height: 18px;
  }
`;

const Content = styled.div``;

const Section = styled.section`
  background: ${({ theme }) => theme.colors.bgPrimary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.xl};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  overflow: hidden;
`;

const SectionHeader = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 4px;
`;

const SectionDesc = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const SectionBody = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
`;

const AvatarSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const Avatar = styled.div`
  position: relative;
  width: 96px;
  height: 96px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.accent}, #8b5cf6);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: white;
`;

const AvatarUpload = styled.button`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.bgPrimary};
  border: 2px solid ${({ theme }) => theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    background: ${({ theme }) => theme.colors.accent};
    border-color: ${({ theme }) => theme.colors.accent};
    color: white;
  }
  
  svg {
    width: 14px;
    height: 14px;
  }
`;

const AvatarInfo = styled.div``;

const AvatarName = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 4px;
`;

const AvatarEmail = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.lg};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  &.full-width {
    grid-column: 1 / -1;
  }
`;

const Label = styled.label`
  display: block;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 8px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.textPrimary};
  background: ${({ theme }) => theme.colors.bgSecondary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
  }
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.accent};
    box-shadow: ${({ theme }) => theme.shadows.focus};
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 12px 16px;
  font-family: inherit;
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.textPrimary};
  background: ${({ theme }) => theme.colors.bgSecondary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  resize: vertical;
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
  }
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.accent};
  }
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.sm};
  padding-top: ${({ theme }) => theme.spacing.lg};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

const Button = styled.button`
  padding: 10px 20px;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  border-radius: ${({ theme }) => theme.radii.lg};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const PrimaryBtn = styled(Button)`
  background: ${({ theme }) => theme.colors.accent};
  color: white;
  border: none;
  
  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.accentHover};
  }
`;

const SecondaryBtn = styled(Button)`
  background: transparent;
  color: ${({ theme }) => theme.colors.textSecondary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  
  &:hover {
    background: ${({ theme }) => theme.colors.bgHover};
  }
`;

const SettingItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.md} 0;
  
  &:not(:last-child) {
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  }
`;

const SettingInfo = styled.div``;

const SettingLabel = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 2px;
`;

const SettingDesc = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const Toggle = styled.button`
  width: 48px;
  height: 28px;
  border-radius: 14px;
  background: ${({ $on, theme }) => $on ? theme.colors.accent : theme.colors.bgTertiary};
  border: none;
  cursor: pointer;
  position: relative;
  transition: background ${({ theme }) => theme.transitions.fast};
  
  &::after {
    content: '';
    position: absolute;
    top: 3px;
    left: ${({ $on }) => $on ? '23px' : '3px'};
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: white;
    box-shadow: 0 1px 3px rgba(0,0,0,0.2);
    transition: left ${({ theme }) => theme.transitions.fast};
  }
`;

const ThemeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => theme.spacing.md};
`;

const ThemeCard = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ $active, theme }) => $active ? theme.colors.accentSubtle : theme.colors.bgSecondary};
  border: 2px solid ${({ $active, theme }) => $active ? theme.colors.accent : theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.xl};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  position: relative;
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.accent};
  }
  
  svg {
    width: 28px;
    height: 28px;
    color: ${({ $active, theme }) => $active ? theme.colors.accent : theme.colors.textMuted};
  }
`;

const ThemeName = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const CheckBadge = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.accent};
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    width: 12px;
    height: 12px;
    color: white;
  }
`;

const DangerZone = styled.div`
  background: ${({ theme }) => theme.colors.errorBg};
  border: 1px solid ${({ theme }) => theme.colors.errorBorder};
  border-radius: ${({ theme }) => theme.radii.xl};
  padding: ${({ theme }) => theme.spacing.lg};
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

const DangerBtn = styled(Button)`
  background: ${({ theme }) => theme.colors.error};
  color: white;
  border: none;
  
  &:hover {
    background: ${({ theme }) => theme.colors.errorHover};
  }
`;

export function Settings() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { mode, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('profile');

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [website, setWebsite] = useState('');
  const [notifications, setNotifications] = useState({ email: true, push: false, weekly: true });

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

  const updateMutation = useMutation({
    mutationFn: (formData) => userService.updateUser(formData),
    onSuccess: () => {
      queryClient.invalidateQueries(['currentUser']);
      toast.success('Profile updated!');
    },
    onError: () => toast.error('Failed to update'),
  });

  const handleSave = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('username', username);
    formData.append('email', email);
    formData.append('bio', bio);
    updateMutation.mutate(formData);
  };

  if (isLoading) return <Loading text="Loading..." />;

  const profile = userData?.User;
  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  return (
    <PageWrapper>
      <PageHeader>
        <PageTitle>Settings</PageTitle>
        <PageSubtitle>Manage your account preferences</PageSubtitle>
      </PageHeader>

      <Layout>
        <Sidebar>
          {tabs.map((tab) => (
            <NavItem
              key={tab.id}
              $active={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.icon /> {tab.label}
            </NavItem>
          ))}
        </Sidebar>

        <Content>
          {activeTab === 'profile' && (
            <Section>
              <SectionHeader>
                <SectionTitle>Profile Information</SectionTitle>
                <SectionDesc>Update your personal details and public profile</SectionDesc>
              </SectionHeader>
              <SectionBody>
                <form onSubmit={handleSave}>
                  <AvatarSection>
                    <Avatar>
                      {profile?.username?.[0]?.toUpperCase() || 'U'}
                      <AvatarUpload type="button">
                        <Camera />
                      </AvatarUpload>
                    </Avatar>
                    <AvatarInfo>
                      <AvatarName>{profile?.username}</AvatarName>
                      <AvatarEmail>{profile?.email}</AvatarEmail>
                    </AvatarInfo>
                  </AvatarSection>

                  <FormGrid>
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
                        placeholder="your@email.com"
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label>Website</Label>
                      <Input
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        placeholder="https://yoursite.com"
                      />
                    </FormGroup>
                    <FormGroup className="full-width">
                      <Label>Bio</Label>
                      <TextArea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Tell readers about yourself..."
                      />
                    </FormGroup>
                  </FormGrid>

                  <Actions>
                    <SecondaryBtn type="button">Cancel</SecondaryBtn>
                    <PrimaryBtn type="submit" disabled={updateMutation.isPending}>
                      {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
                    </PrimaryBtn>
                  </Actions>
                </form>
              </SectionBody>
            </Section>
          )}

          {activeTab === 'notifications' && (
            <Section>
              <SectionHeader>
                <SectionTitle>Notification Preferences</SectionTitle>
                <SectionDesc>Choose how you want to be notified</SectionDesc>
              </SectionHeader>
              <SectionBody>
                <SettingItem>
                  <SettingInfo>
                    <SettingLabel>Email notifications</SettingLabel>
                    <SettingDesc>Receive emails about comments and likes</SettingDesc>
                  </SettingInfo>
                  <Toggle
                    $on={notifications.email}
                    onClick={() => setNotifications({ ...notifications, email: !notifications.email })}
                  />
                </SettingItem>
                <SettingItem>
                  <SettingInfo>
                    <SettingLabel>Push notifications</SettingLabel>
                    <SettingDesc>Get notified in your browser</SettingDesc>
                  </SettingInfo>
                  <Toggle
                    $on={notifications.push}
                    onClick={() => setNotifications({ ...notifications, push: !notifications.push })}
                  />
                </SettingItem>
                <SettingItem>
                  <SettingInfo>
                    <SettingLabel>Weekly digest</SettingLabel>
                    <SettingDesc>Summary of your stats every week</SettingDesc>
                  </SettingInfo>
                  <Toggle
                    $on={notifications.weekly}
                    onClick={() => setNotifications({ ...notifications, weekly: !notifications.weekly })}
                  />
                </SettingItem>
              </SectionBody>
            </Section>
          )}

          {activeTab === 'appearance' && (
            <Section>
              <SectionHeader>
                <SectionTitle>Appearance</SectionTitle>
                <SectionDesc>Customize how BlogHub looks for you</SectionDesc>
              </SectionHeader>
              <SectionBody>
                <Label style={{ marginBottom: 16 }}>Theme</Label>
                <ThemeGrid>
                  <ThemeCard $active={mode === 'light'} onClick={() => setTheme('light')}>
                    {mode === 'light' && <CheckBadge><Check /></CheckBadge>}
                    <Sun />
                    <ThemeName>Light</ThemeName>
                  </ThemeCard>
                  <ThemeCard $active={mode === 'dark'} onClick={() => setTheme('dark')}>
                    {mode === 'dark' && <CheckBadge><Check /></CheckBadge>}
                    <Moon />
                    <ThemeName>Dark</ThemeName>
                  </ThemeCard>
                  <ThemeCard $active={false}>
                    <Monitor />
                    <ThemeName>System</ThemeName>
                  </ThemeCard>
                </ThemeGrid>
              </SectionBody>
            </Section>
          )}

          {activeTab === 'security' && (
            <>
              <Section>
                <SectionHeader>
                  <SectionTitle>Change Password</SectionTitle>
                  <SectionDesc>Update your password regularly for security</SectionDesc>
                </SectionHeader>
                <SectionBody>
                  <FormGrid>
                    <FormGroup className="full-width">
                      <Label>Current Password</Label>
                      <Input type="password" placeholder="Enter current password" />
                    </FormGroup>
                    <FormGroup>
                      <Label>New Password</Label>
                      <Input type="password" placeholder="Enter new password" />
                    </FormGroup>
                    <FormGroup>
                      <Label>Confirm Password</Label>
                      <Input type="password" placeholder="Confirm new password" />
                    </FormGroup>
                  </FormGrid>
                  <Actions>
                    <PrimaryBtn type="button">Update Password</PrimaryBtn>
                  </Actions>
                </SectionBody>
              </Section>

              <DangerZone>
                <DangerTitle>Delete Account</DangerTitle>
                <DangerText>
                  Once you delete your account, all your data will be permanently removed. This action cannot be undone.
                </DangerText>
                <DangerBtn>Delete My Account</DangerBtn>
              </DangerZone>
            </>
          )}
        </Content>
      </Layout>
    </PageWrapper>
  );
}
