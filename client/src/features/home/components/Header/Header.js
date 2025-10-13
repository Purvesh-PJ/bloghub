import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { FaSearch, FaBars, FaTimes, FaFeatherAlt, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../../../../context/AuthContext';

const HeaderContainer = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  background-color: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: #3b82f6;
  text-decoration: none;
`;

const NavMenu = styled.nav`
  display: flex;
  gap: 1.5rem;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled(Link)`
  color: #475569;
  text-decoration: none;
  font-weight: 500;

  &:hover {
    color: #3b82f6;
  }
`;

const AuthButtons = styled.div`
  display: flex;
  gap: 1rem;

  @media (max-width: 768px) {
    display: none;
  }
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
`;

const SignInButton = styled(Button)`
  background-color: transparent;
  color: #475569;
  border: 1px solid #e2e8f0;

  &:hover {
    background-color: #f8fafc;
  }
`;

const SignUpButton = styled(Button)`
  background-color: #3b82f6;
  color: white;
  border: none;

  &:hover {
    background-color: #2563eb;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #475569;
  cursor: pointer;

  @media (max-width: 768px) {
    display: block;
  }
`;

const MobileMenu = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  width: 70%;
  height: 100vh;
  background-color: white;
  padding: 2rem;
  transform: ${({ isOpen }) => (isOpen ? 'translateX(0)' : 'translateX(100%)')};
  transition: transform 0.3s ease;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
  z-index: 200;

  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const CloseButton = styled.button`
  align-self: flex-end;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #475569;
  cursor: pointer;
`;

const MobileNavLink = styled(Link)`
  color: #475569;
  text-decoration: none;
  font-weight: 500;
  font-size: 1.25rem;
  padding: 0.5rem 0;

  &:hover {
    color: #3b82f6;
  }
`;

const Header = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
      setSearchTerm('');
      setIsMobileMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <HeaderContainer scrolled={isScrolled}>
      <Logo to="/">
        <FaFeatherAlt />
        <span>Wordsmith</span>
      </Logo>

      <NavMenu>
        <NavLink to="/" active={isActive('/')}>
          Home
        </NavLink>
        <NavLink to="/explore" active={isActive('/explore')}>
          Explore
        </NavLink>
        <NavLink to="/categories" active={isActive('/categories')}>
          Categories
        </NavLink>
        <NavLink to="/about" active={isActive('/about')}>
          About
        </NavLink>
        <NavLink to="/contact" active={isActive('/contact')}>
          Contact
        </NavLink>
      </NavMenu>

      <AuthButtons>
        {isAuthenticated ? (
          <>
            <SignUpButton onClick={() => navigate('/create-post')}>Write a Post</SignUpButton>
            <SignInButton onClick={() => navigate('/dashboard')}>Dashboard</SignInButton>
            <SignInButton onClick={handleLogout}>Log Out</SignInButton>
          </>
        ) : (
          <>
            <SignInButton onClick={() => navigate('/login')}>Sign In</SignInButton>
            <SignUpButton onClick={() => navigate('/signup')}>Sign Up</SignUpButton>
          </>
        )}
      </AuthButtons>

      <MobileMenuButton onClick={() => setIsMobileMenuOpen(true)}>
        <FaBars />
      </MobileMenuButton>

      <MobileMenu isOpen={isMobileMenuOpen}>
        <CloseButton onClick={() => setIsMobileMenuOpen(false)}>
          <FaTimes />
        </CloseButton>

        <form onSubmit={handleSearch} style={{ width: '100%', margin: '1rem 0' }}>
          <input
            type="text"
            placeholder="Search posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%' }}
          />
        </form>

        <NavLink to="/" active={isActive('/')} onClick={() => setIsMobileMenuOpen(false)}>
          Home
        </NavLink>
        <NavLink
          to="/explore"
          active={isActive('/explore')}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          Explore
        </NavLink>
        <NavLink
          to="/categories"
          active={isActive('/categories')}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          Categories
        </NavLink>
        <NavLink to="/about" active={isActive('/about')} onClick={() => setIsMobileMenuOpen(false)}>
          About
        </NavLink>
        <NavLink
          to="/contact"
          active={isActive('/contact')}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          Contact
        </NavLink>

        {isAuthenticated ? (
          <>
            <SignUpButton
              onClick={() => {
                navigate('/create-post');
                setIsMobileMenuOpen(false);
              }}
            >
              Write a Post
            </SignUpButton>
            <SignInButton
              onClick={() => {
                navigate('/dashboard');
                setIsMobileMenuOpen(false);
              }}
            >
              Dashboard
            </SignInButton>
            <SignInButton
              onClick={() => {
                handleLogout();
                setIsMobileMenuOpen(false);
              }}
            >
              Log Out
            </SignInButton>
          </>
        ) : (
          <>
            <SignInButton
              onClick={() => {
                navigate('/login');
                setIsMobileMenuOpen(false);
              }}
            >
              Sign In
            </SignInButton>
            <SignUpButton
              onClick={() => {
                navigate('/signup');
                setIsMobileMenuOpen(false);
              }}
            >
              Sign Up
            </SignUpButton>
          </>
        )}
      </MobileMenu>
    </HeaderContainer>
  );
};

export default Header;
