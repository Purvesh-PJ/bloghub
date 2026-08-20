import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { LayoutDashboard, FileText, Users, Hash, Activity, LogOut, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ThemeToggle } from './ThemeToggle';
import { text, label as labelStyle, media, interactive } from '../../styles/theme/mixins';
import { BrandMark, Avatar } from '../ui';

/**
 * Admin shell.
 *
 * The console is a different job from the reading side — it is a workspace, so it keeps a
 * persistent sidebar rather than the site header. What it should not be is a different
 * *product*, which is how it read before: it used @radix-ui/themes with no stylesheet and
 * no provider, so the pages inside rendered essentially unstyled.
 */

const Shell = styled.div`
  display: flex;
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.surfacePage};
`;

const Sidebar = styled.aside`
  width: ${({ theme }) => theme.layout.sidebarWidth};
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};
  padding: ${({ theme }) => theme.spacing.xl};
  background: ${({ theme }) => theme.colors.surfaceContainerLow};

  position: sticky;
  top: 0;
  height: 100vh;

  ${media.down('md')`
    position: static;
    height: auto;
    width: 100%;
  `}
`;

/* Below md the shell stacks, so the sidebar becomes a bar across the top. */
const Frame = styled.div`
  display: flex;
  flex: 1;
  min-width: 0;

  ${media.down('md')`flex-direction: column;`}
`;

const Brand = styled(Link)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  ${text('lg', 'semibold')}
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const BrandRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm};
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

const NavItem = styled(Link)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.radii.full};
  white-space: nowrap;
  ${text('sm', 'medium')}
  ${interactive}

  background: ${({ theme, $active }) => ($active ? theme.colors.accentContainer : 'transparent')};
  color: ${({ theme, $active }) =>
    $active ? theme.colors.accentText : theme.colors.textSecondary};

  &:hover {
    background: ${({ theme, $active }) =>
      $active ? theme.colors.accentContainer : theme.colors.surfaceContainer};
    color: ${({ theme, $active }) =>
      $active ? theme.colors.accentText : theme.colors.textPrimary};
  }

  svg {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
  }
`;

const Foot = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  padding-top: ${({ theme }) => theme.spacing.lg};
  border-top: 1px solid ${({ theme }) => theme.colors.lineSubtle};

  ${media.down('md')`display: none;`}
`;

const Who = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  min-width: 0;
`;

const WhoName = styled.span`
  ${text('sm', 'medium')}
  color: ${({ theme }) => theme.colors.textPrimary};
  display: block;
`;

const WhoRole = styled.span`
  ${labelStyle('sm')}
  color: ${({ theme }) => theme.colors.textMuted};
`;

const SignOut = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.radii.full};
  ${text('sm', 'medium')}
  color: ${({ theme }) => theme.colors.textSecondary};
  ${interactive}

  &:hover {
    background: ${({ theme }) => theme.colors.dangerContainer};
    color: ${({ theme }) => theme.colors.dangerText};
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const Main = styled.main`
  flex: 1;
  min-width: 0;
  padding: ${({ theme }) => theme.spacing['3xl']} ${({ theme }) => theme.spacing['2xl']}
    ${({ theme }) => theme.spacing['5xl']};

  ${media.down('md')`
    padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.lg};
  `}
`;

const Inner = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing['2xl']};
`;

const NAV = [
  { path: '/admin', icon: LayoutDashboard, label: 'Overview', exact: true },
  { path: '/admin/posts', icon: FileText, label: 'Posts' },
  { path: '/admin/tags', icon: Hash, label: 'Tags & Topics' },
  { path: '/admin/users', icon: Users, label: 'People' },
  { path: '/admin/activity', icon: Activity, label: 'Activity' },
];

export function AdminLayout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const isActive = (item) => (item.exact ? pathname === item.path : pathname.startsWith(item.path));

  return (
    <Shell>
      <Frame>
        <Sidebar>
          <BrandRow>
            <Brand to="/admin">
              <BrandMark letter="B" />
              Admin
            </Brand>
            <ThemeToggle />
          </BrandRow>

          <Nav>
            {NAV.map((item) => (
              <NavItem key={item.path} to={item.path} $active={isActive(item)}>
                <item.icon />
                {item.label}
              </NavItem>
            ))}

            <NavItem to="/" $active={false}>
              <ArrowLeft />
              Back to site
            </NavItem>
          </Nav>

          <Foot>
            <Who>
              <Avatar name={user?.username} size="sm" />
              <div style={{ minWidth: 0 }}>
                <WhoName>{user?.username}</WhoName>
                <WhoRole>Administrator</WhoRole>
              </div>
            </Who>
            <SignOut
              onClick={() => {
                logout();
                navigate('/');
              }}
            >
              <LogOut /> Sign out
            </SignOut>
          </Foot>
        </Sidebar>

        <Main>
          <Inner>
            <Outlet />
          </Inner>
        </Main>
      </Frame>
    </Shell>
  );
}
