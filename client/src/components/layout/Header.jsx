import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  PenLine,
  User,
  LogOut,
  Settings,
  LayoutDashboard,
  FileText,
  BarChart3,
  Bell,
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../../context/AuthContext';
import { ThemeToggle } from '../common/ThemeToggle';

const HeaderWrapper = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: ${({ theme }) => theme.layout.headerHeight};
  background: ${({ theme }) => theme.colors.bgPrimary};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  z-index: ${({ theme }) => theme.zIndices.sticky};
`;

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.lg};
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const Logo = styled(Link)`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.accent};
  display: flex;
  align-items: center;
  gap: 8px;
`;

const LogoIcon = styled.div`
  width: 32px;
  height: 32px;
  background: ${({ theme }) => theme.colors.accent};
  border-radius: ${({ theme }) => theme.radii.md};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  font-size: 16px;
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  background: ${({ theme }) => theme.colors.bgSecondary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.full};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.borderHover};
  }
  
  svg {
    color: ${({ theme }) => theme.colors.textMuted};
    width: 16px;
    height: 16px;
  }
  
  span {
    color: ${({ theme }) => theme.colors.textMuted};
    font-size: ${({ theme }) => theme.fontSizes.sm};
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    span {
      display: none;
    }
    padding: 8px;
  }
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const IconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: transparent;
  border: none;
  border-radius: 50%;
  color: ${({ theme }) => theme.colors.textSecondary};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.bgHover};
    color: ${({ theme }) => theme.colors.accent};
  }
`;

const WriteButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.buttonPrimaryText};
  background: ${({ theme }) => theme.colors.accent};
  border: none;
  border-radius: ${({ theme }) => theme.radii.full};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.accentHover};
    transform: translateY(-1px);
  }

  svg {
    width: 16px;
    height: 16px;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    span {
      display: none;
    }
    padding: 8px 12px;
  }
`;

const AuthButton = styled(Link)`
  padding: 8px 16px;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  border-radius: ${({ theme }) => theme.radii.full};
  transition: all ${({ theme }) => theme.transitions.fast};
`;

const SignInButton = styled(AuthButton)`
  color: ${({ theme }) => theme.colors.textSecondary};
  
  &:hover {
    color: ${({ theme }) => theme.colors.textPrimary};
  }
`;

const SignUpButton = styled(AuthButton)`
  background: ${({ theme }) => theme.colors.accent};
  color: ${({ theme }) => theme.colors.buttonPrimaryText};
  
  &:hover {
    background: ${({ theme }) => theme.colors.accentHover};
  }
`;

const AvatarButton = styled.button`
  width: 36px;
  height: 36px;
  padding: 0;
  background: ${({ theme }) => theme.colors.accentSubtle};
  border: 2px solid ${({ theme }) => theme.colors.accent};
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.accent};
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    transform: scale(1.05);
  }
`;

const DropdownWrapper = styled.div`
  position: relative;
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 220px;
  background: ${({ theme }) => theme.colors.bgPrimary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.xl};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  z-index: ${({ theme }) => theme.zIndices.dropdown};
  overflow: hidden;
`;

const DropdownHeader = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.bgSecondary};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const UserName = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
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
  gap: 12px;
  padding: 12px ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.bgHover};
    color: ${({ theme }) => theme.colors.accent};
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const DropdownButton = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 12px ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textMuted};
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.errorBg};
    color: ${({ theme }) => theme.colors.error};
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const DropdownDivider = styled.div`
  height: 1px;
  background: ${({ theme }) => theme.colors.border};
`;

export function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { isAuthenticated, user, logout, isAdmin } = useAuth();

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
          <Logo to="/">
            <LogoIcon>B</LogoIcon>
            BlogHub
          </Logo>
          
          <SearchBar onClick={() => navigate('/search')}>
            <Search />
            <span>Search...</span>
          </SearchBar>
        </LeftSection>

        <Actions>
          <ThemeToggle />

          {isAuthenticated ? (
            <>
              <WriteButton to="/write">
                <PenLine />
                <span>Write</span>
              </WriteButton>

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
                          <LayoutDashboard /> Admin Dashboard
                        </DropdownItem>
                        <DropdownDivider />
                      </>
                    )}

                    <DropdownItem to="/profile" onClick={handleDropdownItemClick}>
                      <User /> Profile
                    </DropdownItem>
                    <DropdownItem to="/my-posts" onClick={handleDropdownItemClick}>
                      <FileText /> My Stories
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
              <SignInButton to="/login">Sign in</SignInButton>
              <SignUpButton to="/register">Get started</SignUpButton>
            </>
          )}
        </Actions>
      </HeaderContent>
    </HeaderWrapper>
  );
}
