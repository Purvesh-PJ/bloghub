import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import styled, { css } from 'styled-components';
import {
  LayoutDashboard,
  FileText,
  Users,
  Hash,
  Activity,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Shield,
  Compass,
  Globe,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ThemeToggle } from './ThemeToggle';
import { text, label as labelStyle, media, interactive } from '../../styles/theme/mixins';
import { BrandMark, Avatar, Modal, Button } from '../ui';

/**
 * Admin shell.
 *
 * Professional administrative control plane matching the design rhythm of the studio.
 */

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

const AdminBadge = styled.span`
  padding: 2px 7px;
  border-radius: ${({ theme }) => theme.radii.full};
  background: ${({ theme }) => theme.colors.warningContainer};
  color: ${({ theme }) => theme.colors.warningText};
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

const NavItem = styled(Link)`
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  border-radius: ${({ theme }) => theme.radii.md};
  white-space: nowrap;
  ${text('sm', 'medium')}
  ${interactive}

  background: ${({ theme, $active }) => ($active ? theme.colors.accentContainer : 'transparent')};
  color: ${({ theme, $active }) =>
    $active ? theme.colors.accentText : theme.colors.textSecondary};
  text-decoration: none;

  ${({ $active, theme }) =>
    $active &&
    css`
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
    background: ${({ theme, $active }) =>
      $active ? theme.colors.accentContainer : theme.colors.surfaceContainer};
    color: ${({ theme, $active }) =>
      $active ? theme.colors.accentText : theme.colors.textPrimary};
  }

  svg {
    width: 17px;
    height: 17px;
    flex-shrink: 0;
    color: ${({ theme, $active }) => ($active ? theme.colors.accentSolid : theme.colors.textMuted)};
  }
`;

const Foot = styled.div`
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

const Who = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  flex: 1;
`;

const WhoMeta = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

const WhoName = styled.span`
  ${text('sm', 'semibold')}
  color: ${({ theme }) => theme.colors.textPrimary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const WhoRole = styled.span`
  ${labelStyle('xs')}
  color: ${({ theme }) => theme.colors.warningText};
  display: flex;
  align-items: center;
  gap: 3px;
  font-size: 11px;
`;

const SignOut = styled.button`
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
    background: ${({ theme }) => theme.colors.dangerContainer};
    color: ${({ theme }) => theme.colors.dangerSolid};
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

const Main = styled.main`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.colors.surfacePage};
`;

const Inner = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.xl}
    ${({ theme }) => theme.spacing['5xl']};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};

  ${media.down('md')`
    padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.md}
      ${({ theme }) => theme.spacing['4xl']};
    gap: ${({ theme }) => theme.spacing.lg};
  `}
`;

export function AdminLayout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [confirmSignOut, setConfirmSignOut] = useState(false);

  const isActive = (path, exact) => (exact ? pathname === path : pathname.startsWith(path));

  const getPageTitle = () => {
    if (pathname === '/admin') return 'Overview';
    if (pathname.startsWith('/admin/posts')) return 'Posts';
    if (pathname.startsWith('/admin/tags')) return 'Tags & Topics';
    if (pathname.startsWith('/admin/users')) return 'People';
    if (pathname.startsWith('/admin/activity')) return 'Activity';
    return 'Admin Console';
  };

  const closeMobile = () => setMobileMenuOpen(false);

  return (
    <Shell>
      <SidebarBackdrop $open={mobileMenuOpen} onClick={closeMobile} />

      <Sidebar $open={mobileMenuOpen}>
        <BrandRow>
          <Brand to="/admin" onClick={closeMobile}>
            <BrandMark letter="B" />
            <span>BlogHub</span>
            <AdminBadge>Admin</AdminBadge>
          </Brand>
          <DrawerCloseBtn onClick={closeMobile} aria-label="Close menu">
            <X size={18} />
          </DrawerCloseBtn>
        </BrandRow>

        <Nav>
          <NavSectionLabel>Dashboard</NavSectionLabel>
          <NavItem to="/admin" $active={isActive('/admin', true)} onClick={closeMobile}>
            <LayoutDashboard /> Overview
          </NavItem>

          <NavSectionLabel style={{ marginTop: 8 }}>Management</NavSectionLabel>
          <NavItem to="/admin/posts" $active={isActive('/admin/posts')} onClick={closeMobile}>
            <FileText /> Posts
          </NavItem>
          <NavItem to="/admin/tags" $active={isActive('/admin/tags')} onClick={closeMobile}>
            <Hash /> Tags & Topics
          </NavItem>
          <NavItem to="/admin/users" $active={isActive('/admin/users')} onClick={closeMobile}>
            <Users /> People
          </NavItem>

          <NavSectionLabel style={{ marginTop: 8 }}>Insights</NavSectionLabel>
          <NavItem to="/admin/activity" $active={isActive('/admin/activity')} onClick={closeMobile}>
            <Activity /> Activity
          </NavItem>

          <NavSectionLabel style={{ marginTop: 8 }}>Shortcuts</NavSectionLabel>
          <NavItem to="/dashboard" $active={false} onClick={closeMobile}>
            <Compass /> Creator Studio
          </NavItem>
          <NavItem to="/" $active={false} onClick={closeMobile}>
            <Globe /> Public Feed
          </NavItem>
        </Nav>

        <Foot>
          <Who>
            <Avatar name={user?.username} size="sm" />
            <WhoMeta>
              <WhoName>{user?.username}</WhoName>
              <WhoRole>
                <Shield size={10} /> Administrator
              </WhoRole>
            </WhoMeta>
          </Who>
          <SignOut
            onClick={() => setConfirmSignOut(true)}
            aria-label="Sign out"
          >
            <LogOut />
          </SignOut>
        </Foot>
      </Sidebar>

      <Frame>
        <Topbar>
          <TopbarLeft>
            <MenuToggleBtn onClick={() => setMobileMenuOpen(true)} aria-label="Open navigation menu">
              <Menu size={18} />
            </MenuToggleBtn>

            <Breadcrumb>
              <span className="root">Admin</span>
              <ChevronRight size={14} />
              <strong className="current">{getPageTitle()}</strong>
            </Breadcrumb>
          </TopbarLeft>

          <TopbarRight>
            <ThemeToggle />
          </TopbarRight>
        </Topbar>

        <Main>
          <Inner>
            <Outlet />
          </Inner>
        </Main>
      </Frame>

      <Modal
        open={confirmSignOut}
        onOpenChange={setConfirmSignOut}
        title="Sign out of Administrator Console?"
        description="Your administrative session will be ended securely."
      >
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 16 }}>
          <Button variant="secondary" onClick={() => setConfirmSignOut(false)}>
            Stay signed in
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              logout();
              navigate('/');
            }}
          >
            Sign out
          </Button>
        </div>
      </Modal>
    </Shell>
  );
}
