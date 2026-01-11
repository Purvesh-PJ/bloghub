import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Avatar } from '@radix-ui/themes';
import { LayoutDashboard, FileText, Users, FolderOpen, Settings, LogOut, Home } from 'lucide-react';
import styled from 'styled-components';
import { useAuth } from '../../context/AuthContext';
import { ThemeToggle } from '../common/ThemeToggle';

const navItems = [
  { path: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { path: '/admin/posts', icon: FileText, label: 'Posts' },
  { path: '/admin/categories', icon: FolderOpen, label: 'Categories' },
  { path: '/admin/users', icon: Users, label: 'Users' },
  { path: '/admin/settings', icon: Settings, label: 'Settings' },
];

const LayoutWrapper = styled.div`
  display: flex;
  min-height: 100vh;
`;

const Sidebar = styled.aside`
  width: 240px;
  background-color: ${({ theme }) => theme.colors.bgPrimary};
  border-right: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  flex-direction: column;
  transition:
    background-color ${({ theme }) => theme.transitions.normal},
    border-color ${({ theme }) => theme.transitions.normal};
`;

const LogoSection = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Logo = styled(Link)`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.textPrimary};

  &:hover {
    color: ${({ theme }) => theme.colors.textPrimary};
  }
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  margin: 0;
`;

const Navigation = styled.nav`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.md};
  flex: 1;
`;

const NavItem = styled(Link)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.fontSizes.base};
  font-weight: ${({ $active, theme }) =>
    $active ? theme.fontWeights.medium : theme.fontWeights.normal};
  color: ${({ $active, theme }) =>
    $active ? theme.colors.textPrimary : theme.colors.textSecondary};
  background: ${({ $active, theme }) => ($active ? theme.colors.bgTertiary : 'transparent')};
  border-radius: ${({ theme }) => theme.radii.md};
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.bgHover};
    color: ${({ theme }) => theme.colors.textPrimary};
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const NavDivider = styled(Divider)`
  margin: ${({ theme }) => theme.spacing.md} 0;
`;

const UserSection = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const UserName = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.base};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const UserRole = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.xs};
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.error};
  background: ${({ theme }) => theme.colors.errorBg};
  border: none;
  border-radius: ${({ theme }) => theme.radii.md};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.errorBorder};
  }

  svg {
    width: 14px;
    height: 14px;
  }
`;

const MainContent = styled.main`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.bgSecondary};
  overflow: auto;
  transition: background-color ${({ theme }) => theme.transitions.normal};
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xl};
`;

export function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

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
    <LayoutWrapper>
      <Sidebar>
        <LogoSection>
          <Logo to="/admin">Admin</Logo>
          <ThemeToggle />
        </LogoSection>

        <Divider />

        <Navigation>
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item);
            return (
              <NavItem key={item.path} to={item.path} $active={active}>
                <Icon />
                {item.label}
              </NavItem>
            );
          })}

          <NavDivider />

          <NavItem to="/" $active={false}>
            <Home />
            Back to Site
          </NavItem>
        </Navigation>

        <UserSection>
          <UserInfo>
            <Avatar
              size="1"
              fallback={user?.username?.[0]?.toUpperCase() || 'A'}
              radius="full"
              color="gray"
            />
            <UserDetails>
              <UserName>{user?.username}</UserName>
              <UserRole>Admin</UserRole>
            </UserDetails>
          </UserInfo>
          <LogoutButton onClick={handleLogout}>
            <LogOut /> Logout
          </LogoutButton>
        </UserSection>
      </Sidebar>

      <MainContent>
        <ContentWrapper>
          <Outlet />
        </ContentWrapper>
      </MainContent>
    </LayoutWrapper>
  );
}
