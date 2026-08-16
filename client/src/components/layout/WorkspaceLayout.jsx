import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import styled, { css } from 'styled-components';
import {
  LayoutDashboard,
  PenLine,
  User,
  Settings,
  LogOut,
  ArrowLeft,
  Sparkles,
  BarChart3,
  Globe,
  Compass,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ThemeToggle } from './ThemeToggle';
import { Button } from '../ui';
import { text, label as labelStyle, media, interactive } from '../../styles/theme/mixins';
import { initial } from '../../utils/text';

const Shell = styled.div`
  display: flex;
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.surfacePage};
`;

const Sidebar = styled.aside`
  width: 260px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};
  padding: ${({ theme }) => theme.spacing.xl};
  background: ${({ theme }) => theme.colors.surfaceContainerLow};
  border-right: 1px solid ${({ theme }) => theme.colors.lineSubtle};

  position: sticky;
  top: 0;
  height: 100vh;

  ${media.down('md')`
    position: static;
    height: auto;
    width: 100%;
    border-right: none;
    border-bottom: 1px solid ${({ theme }) => theme.colors.lineSubtle};
  `}
`;

const Frame = styled.div`
  display: flex;
  flex: 1;
  min-width: 0;

  ${media.down('md')`flex-direction: column;`}
`;

const BrandRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Brand = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  ${text('md', 'bold')}
  letter-spacing: -0.02em;
  color: ${({ theme }) => theme.colors.textPrimary};
  text-decoration: none;
`;

const Mark = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: ${({ theme }) => theme.radii.sm};
  background: linear-gradient(135deg, #0284c7 0%, #38bdf8 100%);
  color: #ffffff;
  font-size: 15px;
  font-weight: 800;
  box-shadow: 0 2px 8px rgba(14, 165, 233, 0.4);
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

const NavSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const SectionLabel = styled.span`
  ${labelStyle('xs')}
  color: ${({ theme }) => theme.colors.textMuted};
  padding: 0 ${({ theme }) => theme.spacing.md};
  margin-bottom: 4px;
  font-weight: 700;
  letter-spacing: 0.06em;
`;

const Nav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  flex: 1;

  ${media.down('md')`
    flex-direction: row;
    overflow-x: auto;
    flex: none;
  `}
`;

const NavLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: 10px ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radii.lg};
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
      border: 1px solid ${theme.colors.accentLine};
    `}

  &:hover {
    color: ${({ theme }) => theme.colors.textPrimary};
    background: ${({ theme }) => theme.colors.surfaceContainer};
  }

  svg {
    width: 17px;
    height: 17px;
    color: ${({ theme, $active }) =>
      $active ? theme.colors.accentSolid : theme.colors.textMuted};
  }
`;

const UserCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radii.xl};
  background: ${({ theme }) => theme.colors.surfaceContainer};
  border: 1px solid ${({ theme }) => theme.colors.lineSubtle};
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: auto;
`;

const UserLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  min-width: 0;
`;

const UserAvatar = styled.div`
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: linear-gradient(135deg, #0284c7 0%, #38bdf8 100%);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 13px;
  flex-shrink: 0;
`;

const UserMeta = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

const UserName = styled.span`
  ${text('sm', 'semibold')}
  color: ${({ theme }) => theme.colors.textPrimary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const UserRole = styled.span`
  ${text('xs')}
  color: ${({ theme }) => theme.colors.textMuted};
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: ${({ theme }) => theme.radii.md};
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.colors.textMuted};
  cursor: pointer;
  ${interactive}

  &:hover {
    color: ${({ theme }) => theme.colors.dangerSolid};
    background: ${({ theme }) => theme.colors.dangerContainer};
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const Topbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
  padding: 0 ${({ theme }) => theme.spacing.xl};
  border-bottom: 1px solid ${({ theme }) => theme.colors.lineSubtle};
  background: ${({ theme }) =>
    theme.mode === 'light' ? 'rgba(255, 255, 255, 0.85)' : 'rgba(11, 15, 23, 0.85)'};
  backdrop-filter: blur(12px);
  position: sticky;
  top: 0;
  z-index: 10;
`;

const Breadcrumb = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  ${text('sm', 'medium')}
  color: ${({ theme }) => theme.colors.textMuted};

  strong {
    color: ${({ theme }) => theme.colors.textPrimary};
    font-weight: 600;
  }
`;

const TopbarActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const Content = styled.main`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
`;

export function WorkspaceLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const userId = user?._id || user?.user_id;

  const getPageTitle = () => {
    if (location.pathname === '/dashboard') return 'Dashboard & Stories';
    if (location.pathname.startsWith('/write') || location.pathname.startsWith('/edit')) return 'Story Editor';
    if (location.pathname === '/settings') return 'Account Settings';
    return 'Creator Studio';
  };

  return (
    <Shell>
      <Frame>
        <Sidebar>
          <BrandRow>
            <Brand to="/dashboard">
              <Mark>B</Mark>
              <span>BlogHub</span>
              <StudioBadge>Studio</StudioBadge>
            </Brand>
            <ThemeToggle />
          </BrandRow>

          <Nav>
            <NavSection>
              <SectionLabel>CREATOR WORKSPACE</SectionLabel>
              <NavLink to="/dashboard" $active={location.pathname === '/dashboard'}>
                <LayoutDashboard /> Overview & Stories
              </NavLink>
              <NavLink to="/write" $active={location.pathname.startsWith('/write')}>
                <PenLine /> Write New Story
              </NavLink>
            </NavSection>

            <NavSection style={{ marginTop: 16 }}>
              <SectionLabel>ACCOUNT & COMMUNITY</SectionLabel>
              {userId && (
                <NavLink to={`/user/${userId}`} $active={location.pathname === `/user/${userId}`}>
                  <User /> My Public Profile
                </NavLink>
              )}
              <NavLink to="/settings" $active={location.pathname === '/settings'}>
                <Settings /> Profile Settings
              </NavLink>
            </NavSection>

            <NavSection style={{ marginTop: 16 }}>
              <SectionLabel>EXPLORE</SectionLabel>
              <NavLink to="/">
                <Globe /> Public Reader Feed
              </NavLink>
              <NavLink to="/search">
                <Compass /> Explore Topics
              </NavLink>
            </NavSection>
          </Nav>

          <UserCard>
            <UserLeft>
              <UserAvatar>{initial(user?.username || 'C')}</UserAvatar>
              <UserMeta>
                <UserName>{user?.username || 'Creator'}</UserName>
                <UserRole>@{user?.username?.toLowerCase() || 'creator'}</UserRole>
              </UserMeta>
            </UserLeft>
            <LogoutButton onClick={logout} title="Sign Out">
              <LogOut />
            </LogoutButton>
          </UserCard>
        </Sidebar>

        <Content>
          <Topbar>
            <Breadcrumb>
              <span>Studio</span>
              <span>/</span>
              <strong>{getPageTitle()}</strong>
            </Breadcrumb>

            <TopbarActions>
              <Button size="sm" as={Link} to="/write">
                <PenLine size={14} /> New Story
              </Button>
            </TopbarActions>
          </Topbar>

          <div style={{ flex: 1, padding: '24px 0' }}>
            <Outlet />
          </div>
        </Content>
      </Frame>
    </Shell>
  );
}
