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
  padding: 0 ${({ theme }) => theme.spacing.lg};
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xl};
`;

const Logo = styled(Link)`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  letter-spacing: ${({ theme }) => theme.letterSpacing.tight};
  
  &:hover {
    color: ${({ theme }) => theme.colors.textPrimary};
  }
`;

const SearchForm = styled.form`
  display: flex;
  align-items: center;
  gap: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`;

const SearchInputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 12px;
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.textMuted};
  pointer-events: none;
`;

const SearchInput = styled.input`
  width: 280px;
  height: 40px;
  padding: 0 ${({ theme }) => theme.spacing.sm} 0 40px;
  background: ${({ theme }) => theme.colors.bgSecondary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-right: none;
  border-radius: ${({ theme }) => theme.radii.md} 0 0 ${({ theme }) => theme.radii.md};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textPrimary};
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.inputPlaceholder};
  }
  
  &:focus {
    outline: none;
    background: ${({ theme }) => theme.colors.bgPrimary};
    border-color: ${({ theme }) => theme.colors.borderHover};
  }
`;

const SearchButton = styled.button`
  height: 40px;
  padding: 0 ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.buttonPrimaryBg};
  color: ${({ theme }) => theme.colors.buttonPrimaryText};
  border: none;
  border-radius: 0 ${({ theme }) => theme.radii.md} ${({ theme }) => theme.radii.md} 0;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    background: ${({ theme }) => theme.colors.buttonPrimaryHover};
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
  justify-content: center;
  gap: 8px;
  height: 40px;
  padding: 0 ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.fontSizes.sm};
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
  }
`;

const SecondaryButton = styled(Button)`
  background: ${({ theme }) => theme.colors.buttonSecondaryBg};
  color: ${({ theme }) => theme.colors.buttonSecondaryText};
  border: 1px solid ${({ theme }) => theme.colors.buttonSecondaryBorder};
  
  &:hover {
    background: ${({ theme }) => theme.colors.buttonSecondaryHover};
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
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const UserEmail = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.textMuted};
  margin-top: 2px;
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
        <LeftSection>
          <Logo to="/">BlogHub</Logo>
          
          <SearchForm onSubmit={handleSearch}>
            <SearchInputWrapper>
              <SearchIcon>
                <Search size={16} />
              </SearchIcon>
              <SearchInput
                type="text"
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </SearchInputWrapper>
            <SearchButton type="submit">Search</SearchButton>
          </SearchForm>
        </LeftSection>

        <Actions>
          <ThemeToggle />
          
          {isAuthenticated ? (
            <>
              <PrimaryButton as={Link} to="/write">
                <Plus size={16} />
                <HideMobile>Write</HideMobile>
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
              <SecondaryButton as={Link} to="/login">Sign In</SecondaryButton>
              <PrimaryButton as={Link} to="/register">Sign Up</PrimaryButton>
            </>
          )}
        </Actions>
      </HeaderContent>
    </HeaderWrapper>
  );
}
