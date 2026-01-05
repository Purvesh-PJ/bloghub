import { Link, useNavigate } from 'react-router-dom';
import { Box, Flex, Text, Button, TextField, DropdownMenu, Avatar } from '@radix-ui/themes';
import { Search, Plus, User, LogOut, Settings, LayoutDashboard, FileText, BarChart3 } from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '../../store/authStore';

export function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { isAuthenticated, user, logout, isAdmin } = useAuthStore();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Box
      position="fixed"
      top="0"
      left="0"
      right="0"
      style={{
        height: 'var(--header-height)',
        backgroundColor: '#ffffff',
        borderBottom: '1px solid var(--border-color)',
        zIndex: 100,
      }}
    >
      <Flex
        align="center"
        justify="between"
        px="4"
        style={{ height: '100%', maxWidth: 'var(--max-content-width)', margin: '0 auto' }}
      >
        {/* Logo */}
        <Link to="/">
          <Flex align="center" gap="2">
            <Text size="4" weight="bold" style={{ color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>
              BlogHub
            </Text>
          </Flex>
        </Link>

        {/* Search */}
        <form onSubmit={handleSearch} style={{ flex: 1, maxWidth: '400px', margin: '0 2rem' }} className="hide-mobile">
          <TextField.Root
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="2"
            style={{ backgroundColor: 'var(--bg-secondary)' }}
          >
            <TextField.Slot>
              <Search size={14} strokeWidth={2} />
            </TextField.Slot>
          </TextField.Root>
        </form>

        {/* Actions */}
        <Flex gap="3" align="center">
          {isAuthenticated ? (
            <>
              <Button variant="solid" size="2" asChild>
                <Link to="/write">
                  <Plus size={16} strokeWidth={2} /> <span className="hide-mobile">New Post</span>
                </Link>
              </Button>

              <DropdownMenu.Root>
                <DropdownMenu.Trigger>
                  <Button variant="ghost" style={{ padding: '4px' }}>
                    <Avatar
                      size="2"
                      fallback={user?.username?.[0]?.toUpperCase() || 'U'}
                      radius="full"
                      color="gray"
                    />
                  </Button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content align="end" sideOffset={8}>
                  <Box px="3" py="2">
                    <Text size="2" weight="medium">{user?.username}</Text>
                    <Text size="1" color="gray">{user?.email}</Text>
                  </Box>
                  <DropdownMenu.Separator />
                  
                  {isAdmin() && (
                    <>
                      <DropdownMenu.Item asChild>
                        <Link to="/admin">
                          <LayoutDashboard size={14} /> Admin
                        </Link>
                      </DropdownMenu.Item>
                      <DropdownMenu.Separator />
                    </>
                  )}
                  
                  <DropdownMenu.Item asChild>
                    <Link to="/profile">
                      <User size={14} /> Profile
                    </Link>
                  </DropdownMenu.Item>
                  <DropdownMenu.Item asChild>
                    <Link to="/my-posts">
                      <FileText size={14} /> My Posts
                    </Link>
                  </DropdownMenu.Item>
                  <DropdownMenu.Item asChild>
                    <Link to="/analytics">
                      <BarChart3 size={14} /> Analytics
                    </Link>
                  </DropdownMenu.Item>
                  <DropdownMenu.Item asChild>
                    <Link to="/settings">
                      <Settings size={14} /> Settings
                    </Link>
                  </DropdownMenu.Item>
                  <DropdownMenu.Separator />
                  <DropdownMenu.Item color="red" onClick={handleLogout}>
                    <LogOut size={14} /> Sign Out
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Root>
            </>
          ) : (
            <>
              <Button variant="ghost" size="2" asChild>
                <Link to="/login">Sign In</Link>
              </Button>
              <Button variant="solid" size="2" asChild>
                <Link to="/register">Sign Up</Link>
              </Button>
            </>
          )}
        </Flex>
      </Flex>
    </Box>
  );
}
