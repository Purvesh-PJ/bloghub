import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import styled, { css } from 'styled-components';
import {
  LayoutDashboard,
  PenLine,
  Settings,
  LogOut,
  Globe,
  ExternalLink,
  MessageSquare,
  ShieldCheck,
  FileText,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { ThemeToggle } from './ThemeToggle';
import { Button, Avatar, Modal, BrandMark } from '../ui';
import { text, media, interactive } from '../../styles/theme/mixins';

const Shell = styled.div`
  display: flex;
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.surfacePage};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const Sidebar = styled.aside`
  width: 250px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.lg};
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
  padding: 0 ${({ theme }) => theme.spacing.xs};
  margin-bottom: ${({ theme }) => theme.spacing['2xl']};
`;

const Brand = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  ${text('md', 'bold')}
  color: ${({ theme }) => theme.colors.textPrimary};
  text-decoration: none;
`;

const StudioBadge = styled.span`
  padding: 2px 6px;
  border-radius: 4px;
  background: ${({ theme }) => theme.colors.accentContainer};
  color: ${({ theme }) => theme.colors.accentText};
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
`;

const Nav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;

  ${media.down('md')`
    flex-direction: row;
    overflow-x: auto;
    flex: none;
    margin-bottom: ${({ theme }) => theme.spacing.md};
  `}
`;

const NavLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
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
    `}

  &:hover {
    color: ${({ theme }) => theme.colors.textPrimary};
    background: ${({ theme }) => theme.colors.surfaceContainer};
  }

  svg {
    width: 17px;
    height: 17px;
    color: ${({ theme, $active }) => ($active ? theme.colors.accentSolid : theme.colors.textMuted)};
  }
`;

const UserCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  border-radius: ${({ theme }) => theme.radii.xl};
  background: ${({ theme }) => theme.colors.surfaceContainer};
  border: 1px solid ${({ theme }) => theme.colors.lineSubtle};
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: auto;
`;

const UserProfileLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  text-decoration: none;
  flex: 1;
  border-radius: ${({ theme }) => theme.radii.md};
  padding: 2px;
  ${interactive}

  &:hover span:first-child {
    color: ${({ theme }) => theme.colors.accentText};
  }
`;

const UserAvatar = styled.div`
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: ${({ theme }) => theme.gradients.brand};
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

const UserNameRow = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const UserName = styled.span`
  ${text('sm', 'semibold')}
  color: ${({ theme }) => theme.colors.textPrimary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: color ${({ theme }) => theme.transitions.fast};
`;

const ProfileBadge = styled.span`
  ${text('xs')}
  color: ${({ theme }) => theme.colors.accentText};
  display: flex;
  align-items: center;
  gap: 3px;
  font-size: 11px;
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
  flex-shrink: 0;
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

  ${media.down('md')`
    padding: 0 ${({ theme }) => theme.spacing.md};
  `}
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

const Content = styled.main`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.colors.surfacePage};
`;

export function WorkspaceLayout() {
  const { user, logout, isAdmin } = useAuth();
  const { avatarUrl } = useCurrentUser();
  const location = useLocation();
  const [confirmSignOut, setConfirmSignOut] = useState(false);

  const userId = user?._id || user?.user_id;

  const getPageTitle = () => {
    if (location.pathname === '/dashboard') return 'Dashboard';
    if (location.pathname === '/stories') return 'Stories';
    if (location.pathname.startsWith('/write')) return 'New story';
    if (location.pathname.startsWith('/edit')) return 'Editing a story';
    if (location.pathname === '/comments') return 'Responses';
    if (location.pathname === '/settings') return 'Settings';
    return 'Creator Studio';
  };

  return (
    <Shell>
      <Frame>
        <Sidebar>
          <BrandRow>
            <Brand to="/dashboard">
              <BrandMark letter="B" />
              <span>BlogHub</span>
              <StudioBadge>Studio</StudioBadge>
            </Brand>
            <ThemeToggle />
          </BrandRow>

          <Nav>
            <NavLink to="/dashboard" $active={location.pathname === '/dashboard'}>
              <LayoutDashboard /> Dashboard
            </NavLink>
            <NavLink
              to="/stories"
              $active={location.pathname === '/stories' || location.pathname.startsWith('/edit')}
            >
              <FileText /> Stories
            </NavLink>
            <NavLink to="/write" $active={location.pathname.startsWith('/write')}>
              <PenLine /> Write
            </NavLink>
            <NavLink to="/comments" $active={location.pathname === '/comments'}>
              <MessageSquare /> Responses
            </NavLink>
            <NavLink to="/settings" $active={location.pathname === '/settings'}>
              <Settings /> Settings
            </NavLink>

            {/* An administrator had no way back to the console short of typing the URL. */}
            {isAdmin() && (
              <NavLink to="/admin">
                <ShieldCheck /> Admin console
              </NavLink>
            )}

            <NavLink to="/" style={{ marginTop: 'auto' }}>
              <Globe /> Reader Feed
            </NavLink>
          </Nav>

          <UserCard>
            <UserProfileLink
              to={userId ? `/user/${userId}` : '/settings'}
              title="View Public Profile"
            >
              <Avatar src={avatarUrl} name={user?.username} size="sm" />
              <UserMeta>
                <UserNameRow>
                  <UserName>{user?.username || 'Creator'}</UserName>
                </UserNameRow>
                <ProfileBadge>
                  Public Profile <ExternalLink size={10} />
                </ProfileBadge>
              </UserMeta>
            </UserProfileLink>
            {/*
              Signing out now revokes the session on every device, not just this browser, so
              it asks first. It was an unlabelled 32px icon that acted on the first click.
            */}
            <LogoutButton onClick={() => setConfirmSignOut(true)} aria-label="Sign out">
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

            {!location.pathname.startsWith('/write') && (
              <Button size="sm" as={Link} to="/write">
                <PenLine size={14} /> New Story
              </Button>
            )}
          </Topbar>

          <div style={{ flex: 1 }}>
            <Outlet />
          </div>
        </Content>
      </Frame>

      <Modal
        open={confirmSignOut}
        onOpenChange={setConfirmSignOut}
        title="Sign out everywhere?"
        description="This ends your session on every device you are signed in on, not just this browser. Your drafts and stories are unaffected."
      >
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 16 }}>
          <Button variant="secondary" onClick={() => setConfirmSignOut(false)}>
            Stay signed in
          </Button>
          <Button variant="danger" onClick={logout}>
            Sign out
          </Button>
        </div>
      </Modal>
    </Shell>
  );
}
