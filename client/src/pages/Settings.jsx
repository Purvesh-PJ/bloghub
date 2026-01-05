import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box,
  Container,
  Flex,
  Heading,
  Text,
  TextField,
  TextArea,
  Button,
  Card,
  Tabs,
  Avatar,
  Switch,
  Select,
  Separator,
} from '@radix-ui/themes';
import toast from 'react-hot-toast';
import { userService } from '../services/userService';
import { settingsService } from '../services/settingsService';
import { Loading } from '../components/common/Loading';
import { useAuthStore } from '../store/authStore';

export function Settings() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  
  // Profile state
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  
  // Settings state
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [showEmail, setShowEmail] = useState(false);
  const [showActivity, setShowActivity] = useState(true);
  const [theme, setTheme] = useState('light');

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

  const updatePrivacyMutation = useMutation({
    mutationFn: (data) => settingsService.updatePrivacySettings(data),
    onSuccess: () => toast.success('Privacy settings updated!'),
    onError: () => toast.error('Failed to update privacy settings'),
  });

  const updateAppearanceMutation = useMutation({
    mutationFn: (data) => settingsService.updateAppearanceSettings(data),
    onSuccess: () => toast.success('Appearance settings updated!'),
    onError: () => toast.error('Failed to update appearance settings'),
  });

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('username', username);
    formData.append('email', email);
    formData.append('bio', bio);
    updateProfileMutation.mutate(formData);
  };

  const handlePrivacySubmit = (e) => {
    e.preventDefault();
    updatePrivacyMutation.mutate({
      privacySettings: { showEmail, showActivity },
    });
  };

  const handleAppearanceSubmit = (e) => {
    e.preventDefault();
    updateAppearanceMutation.mutate({ theme });
  };

  if (isLoading) {
    return <Loading text="Loading settings..." />;
  }

  const profile = userData?.User;

  return (
    <Container size="2" py="6">
      <Heading size="6" mb="5">Settings</Heading>

      <Tabs.Root defaultValue="profile">
        <Tabs.List>
          <Tabs.Trigger value="profile">Profile</Tabs.Trigger>
          <Tabs.Trigger value="account">Account</Tabs.Trigger>
          <Tabs.Trigger value="privacy">Privacy</Tabs.Trigger>
          <Tabs.Trigger value="appearance">Appearance</Tabs.Trigger>
        </Tabs.List>

        <Box pt="5">
          <Tabs.Content value="profile">
            <Card>
              <form onSubmit={handleProfileSubmit}>
                <Flex direction="column" gap="5" p="4">
                  <Flex align="center" gap="4">
                    <Avatar
                      size="6"
                      fallback={profile?.username?.[0]?.toUpperCase() || 'U'}
                      radius="full"
                      src={profile?.profile?.image?.data}
                    />
                    <Box>
                      <Text size="2" weight="medium">Profile Picture</Text>
                      <Text size="1" color="gray">JPG, PNG or GIF. Max 2MB.</Text>
                    </Box>
                  </Flex>

                  <Box>
                    <Text as="label" size="2" weight="medium" mb="2">Username</Text>
                    <TextField.Root
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Your username"
                    />
                  </Box>

                  <Box>
                    <Text as="label" size="2" weight="medium" mb="2">Email</Text>
                    <TextField.Root
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Your email"
                    />
                  </Box>

                  <Box>
                    <Text as="label" size="2" weight="medium" mb="2">Bio</Text>
                    <TextArea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Tell us about yourself"
                      rows={4}
                    />
                  </Box>

                  <Flex justify="end">
                    <Button type="submit" disabled={updateProfileMutation.isPending}>
                      {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </Flex>
                </Flex>
              </form>
            </Card>
          </Tabs.Content>

          <Tabs.Content value="account">
            <Card>
              <Flex direction="column" gap="4" p="4">
                <Box>
                  <Heading size="4" mb="2">Account Information</Heading>
                  <Text size="2" color="gray">Manage your account details</Text>
                </Box>
                
                <Separator size="4" />

                <Box>
                  <Text size="2" weight="medium">User ID</Text>
                  <Text size="1" color="gray">{user?.user_id}</Text>
                </Box>

                <Box>
                  <Text size="2" weight="medium">Account Type</Text>
                  <Text size="1" color="gray">{user?.roles?.join(', ') || 'User'}</Text>
                </Box>

                <Separator size="4" />

                <Box>
                  <Text size="2" weight="medium" mb="2">Change Password</Text>
                  <Flex direction="column" gap="2">
                    <TextField.Root type="password" placeholder="Current password" />
                    <TextField.Root type="password" placeholder="New password" />
                    <TextField.Root type="password" placeholder="Confirm new password" />
                  </Flex>
                  <Button mt="3" variant="soft">Update Password</Button>
                </Box>

                <Separator size="4" />

                <Box>
                  <Text size="2" weight="medium" color="red" mb="2">Danger Zone</Text>
                  <Text size="1" color="gray" mb="2">
                    Once you delete your account, there is no going back.
                  </Text>
                  <Button variant="soft" color="red">Delete Account</Button>
                </Box>
              </Flex>
            </Card>
          </Tabs.Content>

          <Tabs.Content value="privacy">
            <Card>
              <form onSubmit={handlePrivacySubmit}>
                <Flex direction="column" gap="4" p="4">
                  <Box>
                    <Heading size="4" mb="2">Privacy Settings</Heading>
                    <Text size="2" color="gray">Control your privacy preferences</Text>
                  </Box>

                  <Separator size="4" />

                  <Flex justify="between" align="center">
                    <Box>
                      <Text size="2" weight="medium">Show Email</Text>
                      <Text size="1" color="gray">Allow others to see your email</Text>
                    </Box>
                    <Switch checked={showEmail} onCheckedChange={setShowEmail} />
                  </Flex>

                  <Flex justify="between" align="center">
                    <Box>
                      <Text size="2" weight="medium">Show Activity</Text>
                      <Text size="1" color="gray">Show your activity on your profile</Text>
                    </Box>
                    <Switch checked={showActivity} onCheckedChange={setShowActivity} />
                  </Flex>

                  <Flex justify="between" align="center">
                    <Box>
                      <Text size="2" weight="medium">Email Notifications</Text>
                      <Text size="1" color="gray">Receive email notifications</Text>
                    </Box>
                    <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                  </Flex>

                  <Flex justify="end">
                    <Button type="submit" disabled={updatePrivacyMutation.isPending}>
                      {updatePrivacyMutation.isPending ? 'Saving...' : 'Save Privacy Settings'}
                    </Button>
                  </Flex>
                </Flex>
              </form>
            </Card>
          </Tabs.Content>

          <Tabs.Content value="appearance">
            <Card>
              <form onSubmit={handleAppearanceSubmit}>
                <Flex direction="column" gap="4" p="4">
                  <Box>
                    <Heading size="4" mb="2">Appearance</Heading>
                    <Text size="2" color="gray">Customize how BlogHub looks</Text>
                  </Box>

                  <Separator size="4" />

                  <Box>
                    <Text as="label" size="2" weight="medium" mb="2">Theme</Text>
                    <Select.Root value={theme} onValueChange={setTheme}>
                      <Select.Trigger placeholder="Select theme" />
                      <Select.Content>
                        <Select.Item value="light">Light</Select.Item>
                        <Select.Item value="dark">Dark</Select.Item>
                        <Select.Item value="system">System</Select.Item>
                      </Select.Content>
                    </Select.Root>
                  </Box>

                  <Flex justify="end">
                    <Button type="submit" disabled={updateAppearanceMutation.isPending}>
                      {updateAppearanceMutation.isPending ? 'Saving...' : 'Save Appearance'}
                    </Button>
                  </Flex>
                </Flex>
              </form>
            </Card>
          </Tabs.Content>
        </Box>
      </Tabs.Root>
    </Container>
  );
}
