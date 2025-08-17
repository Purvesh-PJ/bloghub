import styled, { css, keyframes } from 'styled-components';
import { Link } from 'react-router-dom';

const slideIn = keyframes`
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
`;

export const HeaderContainer = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  background-color: ${props => props.scrolled ? 'rgba(255, 255, 255, 0.95)' : 'transparent'};
  position: sticky;
  top: 0;
  z-index: 1000;
  transition: all 0.3s ease;
  box-shadow: ${props => props.scrolled ? '0 1px 10px rgba(0, 0, 0, 0.1)' : 'none'};
  backdrop-filter: ${props => props.scrolled ? 'blur(10px)' : 'none'};
  
  @media (max-width: 1024px) {
    padding: 1rem;
  }
  
  @media (max-width: 768px) {
    padding: 0.75rem 1rem;
  }
`;

export const LogoWrapper = styled.div`
  flex: 0 0 auto;
`;

export const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #2563eb;
  font-size: 1.5rem;
  font-weight: 700;
  
  svg {
    font-size: 1.5rem;
  }
`;

export const LogoText = styled.span`
  @media (max-width: 480px) {
    display: none;
  }
`;

export const Nav = styled.nav`
  flex: 1;
  display: flex;
  justify-content: center;
  
  @media (max-width: 1024px) {
    display: none;
  }
`;

export const NavList = styled.ul`
  display: flex;
  list-style: none;
  gap: 1.5rem;
  margin: 0;
  padding: 0;
`;

export const NavItem = styled.li`
  font-size: 1rem;
  font-weight: 500;
  
  @media (max-width: 1024px) {
    margin: 0.75rem 0;
    width: 100%;
    text-align: center;
  }
`;

export const NavLink = styled(Link)`
  color: ${props => props.active ? '#2563eb' : '#475569'};
  text-decoration: none;
  position: relative;
  transition: color 0.2s ease;
  padding: 0.5rem 0;
  
  &:hover {
    color: #2563eb;
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: ${props => props.active ? '100%' : '0'};
    height: 2px;
    background-color: #2563eb;
    transition: width 0.3s ease;
  }
  
  &:hover::after {
    width: 100%;
  }
  
  @media (max-width: 1024px) {
    display: block;
    padding: 0.75rem;
    
    &:hover::after {
      width: 0;
    }
  }
`;

export const SearchContainer = styled.form`
  display: flex;
  align-items: center;
  margin: 0 1rem;
  
  @media (max-width: 1024px) {
    display: none;
  }
`;

export const SearchInput = styled.input`
  padding: 0.5rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 9999px 0 0 9999px;
  font-size: 0.875rem;
  width: 200px;
  outline: none;
  transition: all 0.2s ease;
  
  &:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1);
  }
`;

export const SearchButton = styled.button`
  background-color: #2563eb;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0 9999px 9999px 0;
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: #1d4ed8;
  }
`;

export const UserActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  
  @media (max-width: 1024px) {
    display: none;
  }
`;

export const AuthButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: ${props => props.primary ? '0.5rem 1.25rem' : '0.5rem 1rem'};
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  margin: ${props => props.fullWidth ? '0.5rem 0' : '0'};
  width: ${props => props.fullWidth ? '100%' : 'auto'};
  justify-content: ${props => props.fullWidth ? 'center' : 'flex-start'};
  
  ${props => props.primary ? css`
    background-color: #2563eb;
    color: white;
    border: none;
    
    &:hover {
      background-color: #1d4ed8;
    }
  ` : css`
    background-color: white;
    color: #475569;
    border: 1px solid #e2e8f0;
    
    &:hover {
      background-color: #f8fafc;
      border-color: #cbd5e1;
    }
  `}
`;

export const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  font-size: 1.25rem;
  color: #475569;
  cursor: pointer;
  
  @media (max-width: 1024px) {
    display: block;
  }
`;

export const MobileMenu = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  width: 80%;
  max-width: 350px;
  height: 100vh;
  background-color: white;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  transform: ${props => props.open ? 'translateX(0)' : 'translateX(100%)'};
  transition: transform 0.3s ease;
  box-shadow: -5px 0 15px rgba(0, 0, 0, 0.1);
  z-index: 1001;
  overflow-y: auto;
  
  animation: ${props => props.open ? css`${slideIn} 0.3s ease` : 'none'};
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.25rem;
  color: #475569;
  cursor: pointer;
`; 