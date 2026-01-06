import { Link, useNavigate } from 'react-router-dom';
import { DropdownMenu, Avatar } from '@radix-ui/themes';
import { Search, Plus, User, LogOut, Settings, LayoutDashboard, FileText, BarChart3 } from 'lucide-react';
import { useState } from 'react';
import styled from 'styled-components';
import { useAuthStore } from '../../store/authStore';
import { ThemeToggle } from '../common/ThemeToggle';

const HeaderWrapper = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: ${({ theme }) => theme.layout.headerHeight};
  background-color: ${({ theme }) => theme.colors.bgPrimary};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  z-index: ${({ theme }) => theme.zIndices.sticky};
  transition: background-color ${({ theme }) => theme.transitions.normal},
              border-color ${({ theme }) => theme.transitions.normal};
`;

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  max-width: ${({ theme }) => theme.layout.maxContentWidth};
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.md};
`;

const Logo = styled(Link)`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  letter-spacing: -0.5px;
  
  &:hover {
    color: ${({ theme }) => theme.colors.textPrimary};
  }
`;

const SearchForm = styled.form`
  flex: 1;
  max-width: 400px;
  margin: 0 ${({ theme }) => theme.spacing.xl};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`;

const SearchInput = styled.div`
  position: relative;
  
  input {
    width: 100%;
    height: 36px;
    padding: 0 ${({ theme }) => theme.spacing.sm} 0 36px;
    background: ${({ theme }) => theme.colors.bgSecondary};
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.radii.md};
    font-size: ${({ theme }) => theme.fontSizes.base};
    color: ${({ theme }) => theme.colors.textPrimary};
    transition: all ${({ theme }) => theme.transitions.fast};
    
    &::placeholder {
      color: ${({ theme }) => theme.colors.inputPlaceholder};
    }
    
    &:focus {
      outline: none;
      border-color: ${({ theme }) => theme.colors.borderFocus};
      box-shadow: ${({ theme }) => theme.shadows.focus};
      background: ${({ theme }) => theme.colors.bgPrimary};
    }
  }
  
  svg {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: ${({ theme }) => theme.colors.textMuted};
    pointer-events: none;
  }
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Button = styled.button`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  height: 36px;
  padding: 0 ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.fontSizes.base};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  border-radius: ${({ theme }) => theme.radii.md};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  text-decoration: none;
  border: none;
`;

const PrimaryButton = styled(Button)`
  background: ${({ theme }) => theme.colors.buttonPrimaryBg};
  color: ${({ theme }) => theme.colors.buttonPrimaryText};
  
  &:hover {
    background: ${({ theme }) => theme.colors.buttonPrimaryHover};
    color: ${({ theme }) => theme.colors.buttonPrimaryText};
  }
`;

const GhostButton = styled(Button)`
  background: transparent;
  color: ${({ theme }) => theme.colors.textSecondary};
  
  &:hover {
    background: ${({ theme }) => theme.colors.bgHover};
    color: ${({ theme }) => theme.colors.textPrimary};
  }
`;

const AvatarButton = styled.button`
  padding: 4px;
  background: transparent;
  border: none;
  border-radius: ${({ theme }) => theme.radii.full};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    background: ${({ theme }) => theme.colors.bgHover};
  }
`;

const DropdownHeader = styled.div`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
`;

const UserName = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.base};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const UserEmail = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const HideMobile = styled.span`
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`;

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
    <HeaderWrapper>
      <HeaderContent>
        <Logo to="/">BlogHub</Logo>

        <SearchForm onSubmit={handleSearch}>
          <SearchInput>
            <Search size={14} strokeWidth={2} />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </SearchInput>
        </SearchForm>

        <Actions>
          <ThemeToggle />
          
          {isAuthenticated ? (
            <>
              <PrimaryButton as={Link} to="/write">
                <Plus size={16} strokeWidth={2} />
                <HideMobile>New Post</HideMobile>
              </PrimaryButton>

              <DropdownMenu.Root>
                <DropdownMenu.Trigger>
                  <AvatarButton>
                    <Avatar
                      size="2"
                      fallback={user?.username?.[0]?.toUpperCase() || 'U'}
                      radius="full"
                      color="gray"
                    />
                  </AvatarButton>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content align="end" sideOffset={8}>
                  <DropdownHeader>
                    <UserName>{user?.username}</UserName>
                    <UserEmail>{user?.email}</UserEmail>
                  </DropdownHeader>
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
              <GhostButton as={Link} to="/login">Sign In</GhostButton>
              <PrimaryButton as={Link} to="/register">Sign Up</PrimaryButton>
            </>
          )}
        </Actions>
      </HeaderContent>
    </HeaderWrapper>
  );
}
