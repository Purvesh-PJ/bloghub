import styled, { css, keyframes } from 'styled-components';
import { Link } from 'react-router-dom';
import { RxHamburgerMenu } from 'react-icons/rx';

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideIn = keyframes`
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
`;

export const HeaderContainer = styled.header`
   position: relative;
   z-index: 1000;
`;

export const Navbar = styled.nav`
   position: sticky;
   top: 0;
   display: flex;
   flex-direction: row;
   justify-content: space-between;
   background-color: ${props => props.darkMode ? '#121212' : 'white'};
   border-bottom: 1px solid ${props => props.darkMode ? '#2d3748' : '#e2e8f0'};
   height: 60px;
   align-items: center;
   padding: 0 2rem;
   z-index: 100;
   transition: all 0.3s ease;
   box-shadow: ${props => props.isScrolled ? 
     (props.darkMode ? '0 2px 10px rgba(0, 0, 0, 0.3)' : '0 2px 10px rgba(0, 0, 0, 0.1)') : 'none'
   };
   
   @media (max-width: 768px) {
      padding: 0 1rem;
   }
`;

export const ChildWrapperOne = styled.div`
   display: flex;
   flex-direction: row;
   align-items: center;
   gap: 2rem;
`;

export const ChildWrapperTwo = styled.div`
   display: flex;
   flex-direction: row;
   justify-content: center;
   align-items: center;
   gap: 1rem;
`;

export const NavLinkWrapper = styled.div`
   display: flex;
   flex-direction: row;
   justify-content: center;
   align-items: center;
   
   @media (max-width: 1024px) {
      display: none;
   }
`;

export const SearchWrapper = styled.div`
   display: flex;
   justify-content: center;
   align-items: center;
   
   @media (max-width: 768px) {
      display: none;
   }
`;

export const SigninWrapper = styled.div`
   display: flex;
   justify-content: center;
   align-items: center;
   position: relative;
   
   @media (max-width: 768px) {
      display: none;
   }
`;

export const ProfileWrapper = styled.div`
   position: relative;
`;

export const NavItem = styled(Link)`
   text-decoration: none;
   font-size: 0.9rem;
   letter-spacing: 0.012rem;
   font-size: 0.875rem;
   line-height: 1.25rem;
   font-weight: ${props => props.active ? '600' : '450'};
   color: ${props => {
      if (props.darkMode) {
         return props.active ? '#60a5fa' : '#d1d5db';
      }
      return props.active ? '#2563eb' : '#64748b';
   }};
   text-align: center;
   padding: 0.6rem 0.8rem;
   border-radius: 0.375rem;
   transition: all 0.2s ease;
   position: relative;
   
   &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0.8rem;
      right: 0.8rem;
      height: 2px;
      background-color: ${props => {
         if (props.darkMode) {
            return props.active ? '#60a5fa' : 'transparent';
         }
         return props.active ? '#2563eb' : 'transparent';
      }};
      transition: background-color 0.2s ease;
   }
   
   &:hover {
      color: ${props => props.darkMode ? '#60a5fa' : '#2563eb'};
      background-color: ${props => props.darkMode ? 'rgba(96, 165, 250, 0.1)' : 'rgba(59, 130, 246, 0.05)'};
      
      &::after {
         background-color: ${props => props.darkMode ? '#60a5fa' : '#2563eb'};
      }
   }
`;

export const LogoWrapper = styled.div`
   cursor: pointer;
   padding: 0.5rem;
   border-radius: 0.375rem;
   transition: background-color 0.2s ease;
   
   &:hover {
      background-color: rgba(59, 130, 246, 0.05);
   }
`;

export const LogoText = styled.h1`
   font-size: 1.25rem;
   font-weight: 700;
   color: ${props => props.darkMode ? '#f3f4f6' : '#111827'};
   margin: 0;
   transition: color 0.2s ease;
`;

export const HamburgerIcon = styled(RxHamburgerMenu)`
   font-size: 1.5rem;
   padding: 0.60rem;
   
   &:hover {
      background-color: #EBF0F5;
      color: black;
   }
`;

export const SearchButton = styled.button`
   display: flex;
   justify-content: center;
   align-items: center;
   width: 38px;
   height: 38px;
   border-radius: 50%;
   border: none;
   background-color: ${props => props.darkMode ? '#2d3748' : '#f3f4f6'};
   color: ${props => props.darkMode ? '#d1d5db' : '#334155'};
   font-size: large;
   transition: all 0.2s ease;

   &:hover {
      background-color: ${props => props.darkMode ? '#4a5568' : '#e2e8f0'};
      cursor: pointer;
   }
`;

// Mobile elements
export const MobileMenuButton = styled.button`
   display: none;
   background: none;
   border: none;
   font-size: 1.5rem;
   color: ${props => props.darkMode ? '#d1d5db' : '#64748b'};
   cursor: pointer;
   padding: 0.5rem;
   border-radius: 0.375rem;
   transition: all 0.2s ease;
   
   &:hover {
      background-color: ${props => props.darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'};
   }
   
   @media (max-width: 1024px) {
      display: flex;
      align-items: center;
      justify-content: center;
   }
`;

export const MobileMenu = styled.div`
   position: fixed;
   top: 0;
   right: 0;
   bottom: 0;
   width: 300px;
   max-width: 80vw;
   background-color: ${props => props.darkMode ? '#1a1a1a' : 'white'};
   box-shadow: ${props => props.darkMode ? '-5px 0 15px rgba(0, 0, 0, 0.5)' : '-5px 0 15px rgba(0, 0, 0, 0.1)'};
   transform: ${props => props.isOpen ? 'translateX(0)' : 'translateX(100%)'};
   transition: transform 0.3s ease;
   z-index: 1000;
   padding: 2rem;
   display: flex;
   flex-direction: column;
   
   .mobile-content {
      display: flex;
      flex-direction: column;
      height: 100%;
      
      .mobile-nav-links {
         flex: 1;
         display: flex;
         flex-direction: column;
         gap: 0.75rem;
         margin-bottom: 2rem;
      }
   }
   
   animation: ${props => props.isOpen ? css`${slideIn} 0.3s ease` : 'none'};
`;

export const MobileMenuClose = styled.button`
   position: absolute;
   top: 1rem;
   right: 1rem;
   background: none;
   border: none;
   font-size: 1.5rem;
   color: ${props => props.darkMode ? '#d1d5db' : '#64748b'};
   cursor: pointer;
   padding: 0.5rem;
   border-radius: 0.375rem;
   transition: all 0.2s ease;
   
   &:hover {
      background-color: ${props => props.darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'};
      color: ${props => props.darkMode ? 'white' : 'black'};
   }
`;

export const MobileNavItem = styled(Link)`
   text-decoration: none;
   display: flex;
   align-items: center;
   padding: 0.75rem 1rem;
   font-size: 1rem;
   font-weight: ${props => props.active ? '600' : '500'};
   color: ${props => {
      if (props.darkMode) {
         return props.active ? '#60a5fa' : '#d1d5db';
      }
      return props.active ? '#2563eb' : '#64748b';
   }};
   border-radius: 0.375rem;
   transition: all 0.2s ease;
   background-color: ${props => {
      if (props.darkMode) {
         return props.active ? 'rgba(96, 165, 250, 0.1)' : 'transparent';
      }
      return props.active ? 'rgba(59, 130, 246, 0.05)' : 'transparent';
   }};
   
   &:hover {
      background-color: ${props => props.darkMode ? 'rgba(96, 165, 250, 0.1)' : 'rgba(59, 130, 246, 0.05)'};
   }
`;

export const MobileFooter = styled.div`
   margin-top: auto;
   display: flex;
   flex-direction: column;
   gap: 0.75rem;
   margin-top: 2rem;
   
   .theme-toggle {
      margin-top: 0.5rem;
   }
`;

// Dropdown menu
export const DropdownMenu = styled.div`
   position: absolute;
   top: 100%;
   right: 0;
   width: 220px;
   background-color: ${props => props.darkMode ? '#1a1a1a' : 'white'};
   box-shadow: 0 4px 12px ${props => props.darkMode ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0.1)'};
   border-radius: 0.5rem;
   overflow: hidden;
   z-index: 10;
   animation: ${fadeIn} 0.2s ease-out;
`;

export const DropdownItem = styled.div`
   padding: 0.75rem 1rem;
   font-size: 0.875rem;
   color: ${props => props.darkMode ? '#d1d5db' : '#374151'};
   cursor: pointer;
   transition: all 0.2s ease;
   
   &:hover {
      background-color: ${props => props.darkMode ? '#2d3748' : '#f3f4f6'};
   }
`;

// Notification badge
export const NotificationBadge = styled.div`
   position: absolute;
   top: -5px;
   right: -5px;
   width: 18px;
   height: 18px;
   background-color: #ef4444;
   color: white;
   font-size: 0.7rem;
   font-weight: 600;
   display: flex;
   align-items: center;
   justify-content: center;
   border-radius: 50%;
   border: 2px solid ${props => props.darkMode ? '#1a1a1a' : 'white'};
`;

// Write button
export const WriteButton = styled.button`
   display: flex;
   align-items: center;
   gap: 0.5rem;
   background-color: ${props => props.darkMode ? '#2563eb' : '#3b82f6'};
   color: white;
   border: none;
   padding: 0.5rem 1rem;
   border-radius: 9999px;
   font-weight: 500;
   font-size: 0.875rem;
   cursor: pointer;
   transition: all 0.2s ease;
   
   &:hover {
      background-color: ${props => props.darkMode ? '#1d4ed8' : '#2563eb'};
      transform: translateY(-1px);
   }
   
   &:active {
      transform: translateY(1px);
   }
   
   svg {
      font-size: 1rem;
   }
   
   @media (max-width: 768px) {
      display: none;
   }
`;

// Theme toggle
export const ThemeToggle = styled.button`
   display: flex;
   align-items: center;
   justify-content: center;
   width: 36px;
   height: 36px;
   border-radius: 50%;
   background-color: transparent;
   border: 1px solid ${props => props.darkMode ? '#4b5563' : '#e2e8f0'};
   color: ${props => props.darkMode ? '#d1d5db' : '#64748b'};
   font-size: 1.25rem;
   cursor: pointer;
   transition: all 0.2s ease;
   
   &:hover {
      background-color: ${props => props.darkMode ? 'rgba(255, 255, 255, 0.05)' : '#f3f4f6'};
      color: ${props => props.darkMode ? 'white' : '#334155'};
   }
   
   @media (max-width: 768px) {
      display: none;
   }
`;

// Search dialog for mobile
export const SearchDialog = styled.div`
   margin-bottom: 1.5rem;
`;
