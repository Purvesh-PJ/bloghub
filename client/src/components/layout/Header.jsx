import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  Plus,
  User,
  LogOut,
  Settings,
  LayoutDashboard,
  FileText,
  BarChart3,
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
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
  transition:
    background-color ${({ theme }) => theme.transitions.normal},
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
  width: 36px;
  height: 36px;
  padding: 0;
  background: ${({ theme }) => theme.colors.bgTertiary};
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.textSecondary};

  &:hover {
    background: ${({ theme }) => theme.colors.bgActive};
  }
`;

const DropdownWrapper = styled.div`
  position: relative;
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 200px;
  background: ${({ theme }) => theme.colors.cardBg};
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  z-index: ${({ theme }) => theme.zIndices.dropdown};
  overflow: hidden;
`;

const DropdownHeader = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
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

const DropdownItem = styled(Link)`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textPrimary};
  transition: background ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.bgHover};
    color: ${({ theme }) => theme.colors.textPrimary};
  }

  svg {
    width: 14px;
    height: 14px;
    color: ${({ theme }) => theme.colors.textMuted};
  }
`;

const DropdownButton = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 10px ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.error};
  background: transparent;
  border: none;
  cursor: pointer;
  transition: background ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.bgHover};
  }

  svg {
    width: 14px;
    height: 14px;
  }
`;

const DropdownDivider = styled.div`
  height: 1px;
  background: ${({ theme }) => theme.colors.border};
`;

const HideMobile = styled.span`
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`;

export function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { isAuthenticated, user, logout, isAdmin } = useAuthStore();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
    navigate('/');
  };

  const handleDropdownItemClick = () => {
    setIsDropdownOpen(false);
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

              <DropdownWrapper ref={dropdownRef}>
                <AvatarButton onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                  {user?.username?.[0]?.toUpperCase() || 'U'}
                </AvatarButton>

                {isDropdownOpen && (
                  <DropdownMenu>
                    <DropdownHeader>
                      <UserName>{user?.username}</UserName>
                      <UserEmail>{user?.email}</UserEmail>
                    </DropdownHeader>

                    {isAdmin() && (
                      <>
                        <DropdownItem to="/admin" onClick={handleDropdownItemClick}>
                          <LayoutDashboard /> Admin
                        </DropdownItem>
                        <DropdownDivider />
                      </>
                    )}

                    <DropdownItem to="/profile" onClick={handleDropdownItemClick}>
                      <User /> Profile
                    </DropdownItem>
                    <DropdownItem to="/my-posts" onClick={handleDropdownItemClick}>
                      <FileText /> My Posts
                    </DropdownItem>
                    <DropdownItem to="/analytics" onClick={handleDropdownItemClick}>
                      <BarChart3 /> Analytics
                    </DropdownItem>
                    <DropdownItem to="/settings" onClick={handleDropdownItemClick}>
                      <Settings /> Settings
                    </DropdownItem>
                    <DropdownDivider />
                    <DropdownButton onClick={handleLogout}>
                      <LogOut /> Sign Out
                    </DropdownButton>
                  </DropdownMenu>
                )}
              </DropdownWrapper>
            </>
          ) : (
            <>
              <SecondaryButton as={Link} to="/login">
                Sign In
              </SecondaryButton>
              <PrimaryButton as={Link} to="/register">
                Sign Up
              </PrimaryButton>
            </>
          )}
        </Actions>
      </HeaderContent>
    </HeaderWrapper>
  );
}
