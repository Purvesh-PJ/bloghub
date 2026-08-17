import { Link, useNavigate, useLocation } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { Search, PenLine, User, Settings, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { ThemeToggle } from './ThemeToggle';
import { Button, DropdownMenu, BrandMark, Avatar } from '../ui';
import { text, media, interactive } from '../../styles/theme/mixins';

/**
 * Header — a floating glass bar.
 *
 * Sits inside the viewport rather than flush against it, so the page scrolls *under* a
 * rounded, blurred surface. The account menu is a real Radix DropdownMenu: the previous
 * hand-rolled one listened for `mousedown` and handled nothing else — no Escape, no arrow
 * keys, no focus return, no `aria-expanded`.
 */

/* Full-width sticky bar without any dividing border line for seamless one-page look */
const Wrapper = styled.header`
  position: sticky;
  top: 0;
  z-index: ${({ theme }) => theme.zIndices.sticky};
  background: ${({ theme }) =>
    theme.mode === 'light' ? 'rgba(255, 255, 255, 0.85)' : 'rgba(11, 15, 23, 0.85)'};
  backdrop-filter: saturate(180%) blur(16px);
  -webkit-backdrop-filter: saturate(180%) blur(16px);
  border-bottom: none;
  box-shadow: none;
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
  ${text('md', 'bold')}
  letter-spacing: -0.02em;
  color: ${({ theme }) => theme.colors.textPrimary};
  flex-shrink: 0;
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 2px;

  ${media.down('md')`display: none;`}
`;

const NavLink = styled(Link)`
  padding: 5px 12px;
  border-radius: ${({ theme }) => theme.radii.full};
  ${text('sm', 'medium')}
  color: ${({ theme, $active }) =>
    $active ? theme.colors.accentText : theme.colors.textSecondary};
  ${interactive}

  ${({ $active, theme }) =>
    $active &&
    css`
      background: ${theme.colors.accentContainer};
      font-weight: 600;
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
  gap: 6px;
  height: 34px;
  padding: 0 10px;
  border-radius: ${({ theme }) => theme.radii.full};
  background: ${({ theme }) => theme.colors.surfaceContainer};
  color: ${({ theme }) => theme.colors.textSecondary};
  border: 1px solid ${({ theme }) => theme.colors.lineDefault};
  ${text('xs', 'medium')}
  ${interactive}

  &:hover {
    background: ${({ theme }) => theme.colors.surfaceContainerLow};
    border-color: ${({ theme }) => theme.colors.accentLine};
    color: ${({ theme }) => theme.colors.textPrimary};
  }

  svg {
    width: 14px;
    height: 14px;
  }

  ${media.down('sm')`
    padding: 0;
    width: 34px;
    justify-content: center;
  `}
`;

const Kbd = styled.kbd`
  font-family: inherit;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: ${({ theme }) => theme.radii.xs};
  background: ${({ theme }) => theme.colors.surfaceContainerHigh};
  color: ${({ theme }) => theme.colors.textMuted};
  border: 1px solid ${({ theme }) => theme.colors.lineSubtle};

  ${media.down('sm')`display: none;`}
`;

/*
  A button that wraps an Avatar rather than redrawing one. It used to be the sixth copy of
  the same circle — its own gradient, its own hardcoded white, its own initial derived with
  `username[0]` — and like the rest it could not display an uploaded picture.
*/
const AvatarButton = styled.button`
  display: inline-flex;
  border-radius: ${({ theme }) => theme.radii.full};
  padding: 0;
  border: none;
  background: none;
  box-shadow: 0 2px 8px rgba(14, 165, 233, 0.35);
  ${interactive}

  &:hover {
    transform: scale(1.04);
    box-shadow: 0 4px 12px rgba(14, 165, 233, 0.45);
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
  const { avatarUrl } = useCurrentUser();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Wrapper>
      <Bar>
        <Left>
          <Logo to="/">
            <BrandMark letter="B" />
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
            <span style={{ opacity: 0.8 }}>Search...</span>
            <Kbd>⌘K</Kbd>
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
                    <Avatar src={avatarUrl} name={user?.username} size="sm" />
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
                  <LayoutDashboard /> Creator Studio
                </DropdownMenu.Item>
                <DropdownMenu.Item onSelect={() => navigate(`/user/${user?.user_id || user?._id}`)}>
                  <User /> My Public Profile
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
