import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import styled, { css } from 'styled-components';
import {
  Search,
  PenLine,
  User,
  LayoutDashboard,
  Settings,
  LogOut,
  Sparkles,
  BookOpen,
  ArrowLeft,
  Compass,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ThemeToggle } from './ThemeToggle';
import { Button, DropdownMenu } from '../ui';
import { text, media, interactive } from '../../styles/theme/mixins';
import { initial } from '../../utils/text';

const AppLayout = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.bgSecondary};
  transition: background-color ${({ theme }) => theme.transitions.normal};
`;

const StudioHeader = styled.header`
  position: sticky;
  top: 0;
  z-index: ${({ theme }) => theme.zIndices.sticky};
  background: ${({ theme }) =>
    theme.mode === 'light' ? 'rgba(255, 255, 255, 0.92)' : 'rgba(11, 15, 23, 0.92)'};
  backdrop-filter: saturate(180%) blur(16px);
  -webkit-backdrop-filter: saturate(180%) blur(16px);
  border-bottom: 1px solid ${({ theme }) => theme.colors.lineSubtle};
`;

const Bar = styled.div`
  max-width: ${({ theme }) => theme.layout.maxWidth};
  margin: 0 auto;
  height: ${({ theme }) => theme.layout.headerHeight};
  padding: 0 ${({ theme }) => theme.spacing.xl};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.lg};

  ${media.down('md')`
    padding: 0 ${({ theme }) => theme.spacing.md};
  `}
`;

const Left = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xl};
  min-width: 0;
`;

const Logo = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  ${text('md', 'bold')}
  letter-spacing: -0.02em;
  color: ${({ theme }) => theme.colors.textPrimary};
  flex-shrink: 0;
  text-decoration: none;
`;

const Mark = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: ${({ theme }) => theme.radii.xs};
  background: linear-gradient(135deg, #0284c7 0%, #38bdf8 100%);
  color: #ffffff;
  font-size: 14px;
  font-weight: 800;
  box-shadow: 0 2px 8px rgba(14, 165, 233, 0.35);
`;

const StudioBadge = styled.span`
  padding: 2px 6px;
  border-radius: 4px;
  background: ${({ theme }) => theme.colors.accentContainer};
  color: ${({ theme }) => theme.colors.accentText};
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  border: 1px solid ${({ theme }) => theme.colors.accentLine};
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 4px;

  ${media.down('md')`display: none;`}
`;

const NavLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: ${({ theme }) => theme.radii.full};
  ${text('sm', 'medium')}
  color: ${({ theme, $active }) =>
    $active ? theme.colors.accentText : theme.colors.textSecondary};
  text-decoration: none;
  ${interactive}

  ${({ $active, theme }) =>
    $active &&
    css`
      background: ${theme.colors.accentContainer};
      color: ${theme.colors.accentText};
      font-weight: 600;
    `}

  &:hover {
    color: ${({ theme }) => theme.colors.textPrimary};
    background: ${({ theme }) => theme.colors.surfaceContainer};
  }

  svg {
    width: 14px;
    height: 14px;
  }
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Portrait = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #0284c7 0%, #38bdf8 100%);
  color: #ffffff;
  ${text('xs', 'bold')}
  cursor: pointer;
  box-shadow: 0 1px 4px rgba(14, 165, 233, 0.3);
`;

const MainContent = styled.main`
  flex: 1;
  padding-bottom: ${({ theme }) => theme.spacing['4xl']};
`;

export function WorkspaceLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const userItems = [
    {
      label: 'Studio Dashboard',
      icon: <LayoutDashboard size={14} />,
      onClick: () => navigate('/dashboard'),
    },
    {
      label: 'New Story',
      icon: <PenLine size={14} />,
      onClick: () => navigate('/write'),
    },
    ...(user?._id || user?.user_id
      ? [
          {
            label: 'Public Profile',
            icon: <User size={14} />,
            onClick: () => navigate(`/user/${user._id || user.user_id}`),
          },
        ]
      : []),
    {
      label: 'Explore Feed',
      icon: <Compass size={14} />,
      onClick: () => navigate('/'),
    },
    {
      label: 'Settings',
      icon: <Settings size={14} />,
      onClick: () => navigate('/settings'),
    },
    {
      label: 'Sign Out',
      icon: <LogOut size={14} />,
      variant: 'danger',
      onClick: logout,
    },
  ];

  return (
    <AppLayout>
      <StudioHeader>
        <Bar>
          <Left>
            <Logo to="/dashboard">
              <Mark>B</Mark>
              <span>BlogHub</span>
              <StudioBadge>Studio</StudioBadge>
            </Logo>

            <Nav>
              <NavLink to="/dashboard" $active={location.pathname === '/dashboard'}>
                <LayoutDashboard /> Dashboard
              </NavLink>
              <NavLink to="/write" $active={location.pathname.startsWith('/write')}>
                <PenLine /> Write
              </NavLink>
              {user && (user._id || user.user_id) && (
                <NavLink
                  to={`/user/${user._id || user.user_id}`}
                  $active={location.pathname.startsWith('/user')}
                >
                  <User /> Public Profile
                </NavLink>
              )}
              <NavLink to="/settings" $active={location.pathname === '/settings'}>
                <Settings /> Settings
              </NavLink>
            </Nav>
          </Left>

          <Right>
            <Button
              size="sm"
              variant="secondary"
              as={Link}
              to="/"
              style={{ display: 'none', md: 'inline-flex' }}
            >
              <ArrowLeft size={14} /> Reader Mode
            </Button>
            <Button size="sm" as={Link} to="/write">
              <PenLine size={14} /> New Story
            </Button>
            <ThemeToggle />
            <DropdownMenu
              trigger={<Portrait>{initial(user?.username || 'U')}</Portrait>}
              items={userItems}
            />
          </Right>
        </Bar>
      </StudioHeader>

      <MainContent>
        <Outlet />
      </MainContent>
    </AppLayout>
  );
}
