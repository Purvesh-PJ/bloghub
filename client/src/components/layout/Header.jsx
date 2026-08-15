import { Link, useNavigate, useLocation } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { Search, PenLine, User, LayoutGrid, Settings, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ThemeToggle } from './ThemeToggle';
import { Button, DropdownMenu } from '../ui';
import { text, media, interactive } from '../../styles/theme/mixins';

/**
 * Header — a floating glass bar.
 *
 * Sits inside the viewport rather than flush against it, so the page scrolls *under* a
 * rounded, blurred surface. The account menu is a real Radix DropdownMenu: the previous
 * hand-rolled one listened for `mousedown` and handled nothing else — no Escape, no arrow
 * keys, no focus return, no `aria-expanded`.
 */

/* Full-width sticky bar with a hairline base. A floating pill draws attention to the
   chrome; the chrome should be the quietest thing on the page. */
const Wrapper = styled.header`
  position: sticky;
  top: 0;
  z-index: ${({ theme }) => theme.zIndices.sticky};
  background: ${({ theme }) =>
    theme.mode === 'light' ? 'rgba(252, 252, 253, 0.80)' : 'rgba(17, 17, 19, 0.80)'};
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
  gap: ${({ theme }) => theme.spacing.sm};
  ${text('lg', 'semibold')}
  letter-spacing: ${({ theme }) => theme.tracking.tight};
  color: ${({ theme }) => theme.colors.textPrimary};
  flex-shrink: 0;
`;

const Mark = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: ${({ theme }) => theme.radii.sm};
  background: ${({ theme }) => theme.colors.accentSolid};
  color: ${({ theme }) => theme.colors.textOnAccent};
  font-size: 15px;
  font-weight: ${({ theme }) => theme.weights.bold};
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};

  ${media.down('md')`display: none;`}
`;

const NavLink = styled(Link)`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radii.full};
  ${text('sm', 'medium')}
  color: ${({ theme, $active }) =>
    $active ? theme.colors.textPrimary : theme.colors.textSecondary};
  ${interactive}

  ${({ $active, theme }) =>
    $active &&
    css`
      background: ${theme.colors.surfaceContainer};
    `}

  &:hover {
    color: ${({ theme }) => theme.colors.textPrimary};
    background: ${({ theme }) => theme.colors.surfaceContainer};
  }
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const SearchButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: ${({ theme }) => theme.radii.full};
  color: ${({ theme }) => theme.colors.textSecondary};
  ${interactive}

  &:hover {
    background: ${({ theme }) => theme.colors.surfaceContainer};
    color: ${({ theme }) => theme.colors.textPrimary};
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

const AvatarButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: ${({ theme }) => theme.radii.full};
  background: ${({ theme }) => theme.colors.accentSolid};
  color: ${({ theme }) => theme.colors.textOnAccent};
  ${text('sm', 'semibold')}
  ${interactive}

  &:hover {
    background: ${({ theme }) => theme.colors.accentSolidHover};
  }
`;

const MenuHeader = styled.div`
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.sm};
  border-bottom: 1px solid ${({ theme }) => theme.colors.lineSubtle};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const MenuName = styled.div`
  ${text('sm', 'semibold')}
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const MenuEmail = styled.div`
  ${text('xs')}
  color: ${({ theme }) => theme.colors.textMuted};
`;

const HideOnMobile = styled.span`
  ${media.down('sm')`display: none;`}
`;

const NAV = [
  { to: '/', label: 'Home', exact: true },
  { to: '/search', label: 'Explore' },
];

export function Header() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { isAuthenticated, user, logout, isAdmin } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Wrapper>
      <Bar>
        <Left>
          <Logo to="/">
            <Mark>B</Mark>
            BlogHub
          </Logo>

          <Nav>
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                $active={item.exact ? pathname === item.to : pathname.startsWith(item.to)}
              >
                {item.label}
              </NavLink>
            ))}
          </Nav>
        </Left>

        <Right>
          <SearchButton onClick={() => navigate('/search')} aria-label="Search">
            <Search />
          </SearchButton>

          <ThemeToggle />

          {isAuthenticated ? (
            <>
              <HideOnMobile>
                <Button size="sm" onClick={() => navigate('/write')}>
                  <PenLine /> Write
                </Button>
              </HideOnMobile>

              <DropdownMenu
                trigger={
                  <AvatarButton aria-label="Account menu">
                    {user?.username?.[0]?.toUpperCase() ?? 'U'}
                  </AvatarButton>
                }
              >
                <MenuHeader>
                  <MenuName>{user?.username}</MenuName>
                  <MenuEmail>{user?.email}</MenuEmail>
                </MenuHeader>

                {isAdmin() && (
                  <>
                    <DropdownMenu.Item onSelect={() => navigate('/admin')}>
                      <LayoutDashboard /> Admin dashboard
                    </DropdownMenu.Item>
                    <DropdownMenu.Separator />
                  </>
                )}

                <DropdownMenu.Item onSelect={() => navigate('/dashboard')}>
                  <LayoutGrid /> Dashboard
                </DropdownMenu.Item>
                <DropdownMenu.Item onSelect={() => navigate(`/user/${user?.user_id}`)}>
                  <User /> Public profile
                </DropdownMenu.Item>
                <DropdownMenu.Item onSelect={() => navigate('/settings')}>
                  <Settings /> Settings
                </DropdownMenu.Item>

                <DropdownMenu.Separator />

                <DropdownMenu.Item $tone="danger" onSelect={handleLogout}>
                  <LogOut /> Sign out
                </DropdownMenu.Item>
              </DropdownMenu>
            </>
          ) : (
            <>
              <HideOnMobile>
                <Button size="sm" variant="ghost" onClick={() => navigate('/login')}>
                  Sign in
                </Button>
              </HideOnMobile>
              <Button size="sm" onClick={() => navigate('/register')}>
                Get started
              </Button>
            </>
          )}
        </Right>
      </Bar>
    </Wrapper>
  );
}
