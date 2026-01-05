import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Box, Flex, Text, Button, Separator, Avatar } from '@radix-ui/themes';
import { LayoutDashboard, FileText, Users, FolderOpen, Settings, LogOut, Home } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const navItems = [
  { path: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { path: '/admin/posts', icon: FileText, label: 'Posts' },
  { path: '/admin/categories', icon: FolderOpen, label: 'Categories' },
  { path: '/admin/users', icon: Users, label: 'Users' },
  { path: '/admin/settings', icon: Settings, label: 'Settings' },
];

export function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (item) => {
    if (item.exact) {
      return location.pathname === item.path;
    }
    return location.pathname.startsWith(item.path);
  };

  return (
    <Flex style={{ minHeight: '100vh' }}>
      {/* Sidebar */}
      <Box
        style={{
          width: '240px',
          backgroundColor: '#ffffff',
          borderRight: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Logo */}
        <Box p="4">
          <Link to="/admin">
            <Text size="4" weight="bold">Admin</Text>
          </Link>
        </Box>

        <Separator size="4" />

        {/* Navigation */}
        <Flex direction="column" gap="1" p="3" style={{ flex: 1 }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item);
            return (
              <Button
                key={item.path}
                variant={active ? 'soft' : 'ghost'}
                asChild
                style={{
                  justifyContent: 'flex-start',
                  fontWeight: active ? '500' : '400',
                }}
              >
                <Link to={item.path}>
                  <Icon size={16} />
                  {item.label}
                </Link>
              </Button>
            );
          })}

          <Separator size="4" my="3" />

          <Button variant="ghost" asChild style={{ justifyContent: 'flex-start' }}>
            <Link to="/">
              <Home size={16} />
              Back to Site
            </Link>
          </Button>
        </Flex>

        {/* User */}
        <Box p="3" style={{ borderTop: '1px solid var(--border-color)' }}>
          <Flex align="center" gap="2" mb="2">
            <Avatar
              size="1"
              fallback={user?.username?.[0]?.toUpperCase() || 'A'}
              radius="full"
              color="gray"
            />
            <Box>
              <Text size="2" weight="medium">{user?.username}</Text>
              <Text size="1" color="gray">Admin</Text>
            </Box>
          </Flex>
          <Button
            variant="soft"
            color="red"
            size="1"
            onClick={handleLogout}
            style={{ width: '100%' }}
          >
            <LogOut size={14} /> Logout
          </Button>
        </Box>
      </Box>

      {/* Main */}
      <Box style={{ flex: 1, backgroundColor: 'var(--bg-secondary)', overflow: 'auto' }}>
        <Box p="5" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <Outlet />
        </Box>
      </Box>
    </Flex>
  );
}
