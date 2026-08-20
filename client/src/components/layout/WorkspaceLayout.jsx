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
  Menu,
  X,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { ThemeToggle } from './ThemeToggle';
import { Button, Avatar, Modal, BrandMark } from '../ui';
import { text, label as labelStyle, media, interactive } from '../../styles/theme/mixins';

const Shell = styled.div`
  display: flex;
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.surfacePage};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const SidebarBackdrop = styled.div`
  display: none;
  ${media.down('md')`
    display: ${({ $open }) => ($open ? 'block' : 'none')};
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(4px);
    z-index: ${({ theme }) => theme.zIndices.overlay};
  `}
`;

const Sidebar = styled.aside`
  width: 260px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.surfaceContainerLow};
  border-right: 1px solid ${({ theme }) => theme.colors.lineSubtle};
  position: sticky;
  top: 0;
  height: 100vh;
  z-index: ${({ theme }) => theme.zIndices.sticky};
  transition: transform ${({ theme }) => theme.transitions.fast};

  ${media.down('md')`
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    width: 280px;
    z-index: ${({ theme }) => theme.zIndices.modal};
    transform: ${({ $open }) => ($open ? 'translateX(0)' : 'translateX(-100%)')};
    box-shadow: ${({ $open, theme }) => ($open ? theme.elevation.xl : 'none')};
  `}
`;

const Frame = styled.div`
  display: flex;
  flex: 1;
  min-width: 0;
  flex-direction: column;
`;

const BrandRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 ${({ theme }) => theme.spacing.xs};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const Brand = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  ${text('md', 'bold')}
  color: ${({ theme }) => theme.colors.textPrimary};
  text-decoration: none;

  span {
    letter-spacing: -0.01em;
  }
`;

const StudioBadge = styled.span`
  padding: 2px 7px;
  border-radius: ${({ theme }) => theme.radii.full};
  background: ${({ theme }) => theme.colors.accentContainer};
  color: ${({ theme }) => theme.colors.accentText};
  ${labelStyle('xs')}
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
`;

const DrawerCloseBtn = styled.button`
  display: none;
  ${media.down('md')`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: ${({ theme }) => theme.radii.md};
    border: none;
    background: ${({ theme }) => theme.colors.surfaceContainer};
    color: ${({ theme }) => theme.colors.textSecondary};
    cursor: pointer;
  `}
`;

const Nav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  flex: 1;
  overflow-y: auto;
  scrollbar-width: thin;
`;

const NavSectionLabel = styled.span`
  ${labelStyle('xs')}
  color: ${({ theme }) => theme.colors.textMuted};
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.md} 4px;
`;

const NavLink = styled(Link)`
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  border-radius: ${({ theme }) => theme.radii.md};
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

      &::before {
        content: '';
        position: absolute;
        left: -8px;
        top: 25%;
        bottom: 25%;
        width: 3px;
        border-radius: 2px;
        background: ${theme.colors.accentSolid};
      }
    `}

  &:hover {
    color: ${({ theme }) => theme.colors.textPrimary};
    background: ${({ theme, $active }) =>
      $active ? theme.colors.accentContainer : theme.colors.surfaceContainer};
  }

  svg {
    width: 17px;
    height: 17px;
    color: ${({ theme, $active }) => ($active ? theme.colors.accentSolid : theme.colors.textMuted)};
    flex-shrink: 0;
  }
`;

const UserCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  border-radius: ${({ theme }) => theme.radii.lg};
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
  border-radius: ${({ theme }) => theme.radii.sm};
  padding: 2px;
  ${interactive}

  &:hover span:first-child {
    color: ${({ theme }) => theme.colors.accentText};
  }
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
  transition: color ${({ theme }) => theme.transitions.fast};
`;

const ProfileBadge = styled.span`
  ${labelStyle('xs')}
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

const Topbar = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 58px;
  padding: 0 ${({ theme }) => theme.spacing.xl};
  border-bottom: 1px solid ${({ theme }) => theme.colors.lineSubtle};
  background: ${({ theme }) =>
    theme.mode === 'light' ? 'rgba(255, 255, 255, 0.85)' : 'rgba(7, 11, 19, 0.85)'};
  backdrop-filter: blur(16px);
  position: sticky;
  top: 0;
  z-index: ${({ theme }) => theme.zIndices.sticky};

  ${media.down('md')`
    padding: 0 ${({ theme }) => theme.spacing.md};
  `}
`;

const TopbarLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const MenuToggleBtn = styled.button`
  display: none;
  ${media.down('md')`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: ${({ theme }) => theme.radii.md};
    border: 1px solid ${({ theme }) => theme.colors.lineDefault};
    background: ${({ theme }) => theme.colors.surfaceContainer};
    color: ${({ theme }) => theme.colors.textPrimary};
    cursor: pointer;
  `}
`;

const Breadcrumb = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  ${text('sm', 'medium')}
  color: ${({ theme }) => theme.colors.textMuted};

  .root {
    color: ${({ theme }) => theme.colors.textSecondary};
    font-weight: 500;
  }

  .current {
    color: ${({ theme }) => theme.colors.textPrimary};
    font-weight: 600;
  }

  svg {
    color: ${({ theme }) => theme.colors.textMuted};
    width: 14px;
    height: 14px;
  }
`;

const TopbarRight = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const FeedLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: ${({ theme }) => theme.radii.full};
  background: ${({ theme }) => theme.colors.surfaceContainer};
  color: ${({ theme }) => theme.colors.textSecondary};
  ${text('xs', 'medium')}
  text-decoration: none;
  ${interactive}

  &:hover {
    color: ${({ theme }) => theme.colors.textPrimary};
    background: ${({ theme }) => theme.colors.surfaceContainerHigh};
  }

  ${media.down('sm')`
    display: none;
  `}
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const userId = user?._id || user?.user_id;

  const getPageTitle = () => {
    if (location.pathname === '/dashboard') return 'Dashboard';
    if (location.pathname === '/stories') return 'Stories';
    if (location.pathname.startsWith('/write')) return 'Write Story';
    if (location.pathname.startsWith('/edit')) return 'Edit Story';
    if (location.pathname === '/comments') return 'Responses';
    if (location.pathname === '/settings') return 'Settings';
    return 'Creator Studio';
  };

  const closeMobile = () => setMobileMenuOpen(false);

  return (
    <Shell>
      <SidebarBackdrop $open={mobileMenuOpen} onClick={closeMobile} />

      <Sidebar $open={mobileMenuOpen}>
        <BrandRow>
          <Brand to="/dashboard" onClick={closeMobile}>
            <BrandMark letter="B" />
            <span>BlogHub</span>
            <StudioBadge>Studio</StudioBadge>
          </Brand>
          <DrawerCloseBtn onClick={closeMobile} aria-label="Close menu">
            <X size={18} />
          </DrawerCloseBtn>
        </BrandRow>

        <Nav>
          <NavSectionLabel>Workspace</NavSectionLabel>
          <NavLink
            to="/dashboard"
            $active={location.pathname === '/dashboard'}
            onClick={closeMobile}
          >
            <LayoutDashboard /> Dashboard
          </NavLink>
          <NavLink
            to="/stories"
            $active={location.pathname === '/stories' || location.pathname.startsWith('/edit')}
            onClick={closeMobile}
          >
            <FileText /> Stories
          </NavLink>
          <NavLink
            to="/write"
            $active={location.pathname.startsWith('/write')}
            onClick={closeMobile}
          >
            <PenLine /> Write
          </NavLink>
          <NavLink
            to="/comments"
            $active={location.pathname === '/comments'}
            onClick={closeMobile}
          >
            <MessageSquare /> Responses
          </NavLink>

          <NavSectionLabel style={{ marginTop: 8 }}>Preferences</NavSectionLabel>
          <NavLink
            to="/settings"
            $active={location.pathname === '/settings'}
            onClick={closeMobile}
          >
            <Settings /> Settings
          </NavLink>

          {isAdmin() && (
            <>
              <NavSectionLabel style={{ marginTop: 8 }}>Management</NavSectionLabel>
              <NavLink to="/admin" onClick={closeMobile}>
                <ShieldCheck /> Admin Console
              </NavLink>
            </>
          )}

          <NavSectionLabel style={{ marginTop: 8 }}>Explore</NavSectionLabel>
          <NavLink to="/" onClick={closeMobile}>
            <Globe /> Reader Feed
          </NavLink>
        </Nav>

        <UserCard>
          <UserProfileLink
            to={userId ? `/user/${userId}` : '/settings'}
            title="View Public Profile"
            onClick={closeMobile}
          >
            <Avatar src={avatarUrl} name={user?.username} size="sm" />
            <UserMeta>
              <UserName>{user?.username || 'Creator'}</UserName>
              <ProfileBadge>
                Public Profile <ExternalLink size={10} />
              </ProfileBadge>
            </UserMeta>
          </UserProfileLink>
          <LogoutButton onClick={() => setConfirmSignOut(true)} aria-label="Sign out">
            <LogOut />
          </LogoutButton>
        </UserCard>
      </Sidebar>

      <Frame>
        <Topbar>
          <TopbarLeft>
            <MenuToggleBtn onClick={() => setMobileMenuOpen(true)} aria-label="Open navigation menu">
              <Menu size={18} />
            </MenuToggleBtn>

            <Breadcrumb>
              <span className="root">Studio</span>
              <ChevronRight size={14} />
              <strong className="current">{getPageTitle()}</strong>
            </Breadcrumb>
          </TopbarLeft>

          <TopbarRight>
            <FeedLink to="/">
              <Globe size={13} /> Reader Feed
            </FeedLink>

            <ThemeToggle />

            {!location.pathname.startsWith('/write') && (
              <Button size="sm" as={Link} to="/write">
                <PenLine size={14} /> New Story
              </Button>
            )}
          </TopbarRight>
        </Topbar>

        <Content>
          <Outlet />
        </Content>
      </Frame>

      <Modal
        open={confirmSignOut}
        onOpenChange={setConfirmSignOut}
        title="Sign out everywhere?"
        description="This ends your session on every device you are signed in on. Your drafts and published stories are safely saved."
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
