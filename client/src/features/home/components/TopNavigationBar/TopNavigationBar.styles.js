import styled, { css } from 'styled-components';
import breakpoints from '../../../../components/common/theme/breakpoints';
import { Link } from 'react-router-dom';
import { RxHamburgerMenu } from 'react-icons/rx';
import { fadeIn, slideIn } from '../../../../components/common/theme/animations';
import {
  Paper as UiPaper,
  Button as UiButton,
  IconButton as UiIconButton,
} from '../../../../components/ui/primitives';

export const HeaderContainer = styled.header`
  position: sticky;
  top: 0;
  z-index: 1000;
`;

export const Navbar = styled.nav.withConfig({
  shouldForwardProp: (prop) => !['isScrolled', 'darkMode'].includes(prop),
})`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${(p) =>
    p.isScrolled
      ? p.theme.mode === 'dark'
        ? 'rgba(15, 23, 42, 0.95)'
        : 'rgba(255, 255, 255, 0.95)'
      : p.theme.palette.background.surface};
  backdrop-filter: ${(p) => (p.isScrolled ? 'blur(12px)' : 'none')};
  -webkit-backdrop-filter: ${(p) => (p.isScrolled ? 'blur(12px)' : 'none')};
  border-bottom: ${(p) => p.theme.borderWidth.thin} solid ${(p) => p.theme.palette.divider};
  height: ${(p) => p.theme.spacing(16)};
  padding: 0 ${(p) => p.theme.spacing(6)};
  margin: 0 auto;
  width: 100%;
  z-index: ${(p) => p.theme.zIndex.navbar};
  transition:
    background-color ${(p) => p.theme.motion.duration.normal}
      ${(p) => p.theme.motion.easing.standard},
    box-shadow ${(p) => p.theme.motion.duration.normal} ${(p) => p.theme.motion.easing.standard},
    backdrop-filter ${(p) => p.theme.motion.duration.normal}
      ${(p) => p.theme.motion.easing.standard};
  box-shadow: ${(p) => (p.isScrolled ? p.theme.shadows.md : 'none')};

  @media (max-width: ${breakpoints.lg}) {
    padding: 0 ${(p) => p.theme.spacing(4)};
    height: ${(p) => p.theme.spacing(15)};
  }

  @media (max-width: ${breakpoints.md}) {
    padding: 0 ${(p) => p.theme.spacing(3)};
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

  @media (max-width: ${breakpoints.lg}) {
    display: none;
  }
`;

export const SearchWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  @media (max-width: ${breakpoints.md}) {
    display: none;
  }
`;

export const SigninWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;

  @media (max-width: ${breakpoints.md}) {
    display: none;
  }
`;

export const ProfileWrapper = styled.div`
  position: relative;
`;

export const NavItem = styled(Link).withConfig({
  shouldForwardProp: (prop) => !['active', 'darkMode'].includes(prop),
})`
  text-decoration: none;
  font-size: ${(p) => p.theme.typography.size.md};
  font-weight: ${(props) =>
    props.active ? props.theme.typography.weight.semibold : props.theme.typography.weight.medium};
  color: ${(p) => (p.active ? p.theme.palette.text.primary : p.theme.palette.text.secondary)};
  padding: ${(p) => `${p.theme.spacing(2)} ${p.theme.spacing(3)}`};
  border-radius: ${(p) => p.theme.radii.lg};
  transition: all ${(p) => p.theme.motion.duration.fast} ${(p) => p.theme.motion.easing.standard};
  position: relative;
  display: inline-flex;
  align-items: center;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: ${(p) => p.theme.palette.primary.main};
    opacity: ${(p) => (p.active ? 0.1 : 0)};
    border-radius: ${(p) => p.theme.radii.lg};
    transition: opacity ${(p) => p.theme.motion.duration.fast}
      ${(p) => p.theme.motion.easing.standard};
  }

  &:hover {
    color: ${(p) => p.theme.palette.text.primary};
    transform: translateY(-1px);

    &::before {
      opacity: 0.08;
    }
  }

  &:active {
    transform: translateY(0);
  }

  &:focus-visible {
    outline: 2px solid ${(p) => p.theme.palette.primary.main};
    outline-offset: 2px;
  }
`;

export const LogoWrapper = styled.div`
  cursor: pointer;
  padding: ${(p) => p.theme.spacing(2)};
  border-radius: 0.375rem;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${(p) => p.theme.palette.background.subtle};
  }

  &:focus-visible {
    outline: 2px solid ${(p) => p.theme.palette.primary.main};
    outline-offset: 2px;
    border-radius: ${(p) => p.theme.radii.md};
  }
`;

export const LogoText = styled.h1`
  font-size: ${(p) => p.theme.typography.size.h3};
  font-weight: ${(p) => p.theme.typography.weight.bold};
  background: linear-gradient(
    135deg,
    ${(p) => p.theme.palette.primary.main} 0%,
    ${(p) => p.theme.palette.secondary.main} 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  letter-spacing: -0.02em;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.8;
  }
`;

export const HamburgerIcon = styled(RxHamburgerMenu)`
  font-size: 1.5rem;
  padding: ${(p) => p.theme.spacing(2)};

  &:hover {
    background-color: ${(p) => p.theme.palette.background.subtle};
    color: ${(p) => p.theme.palette.text.primary};
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
  background-color: ${(p) => p.theme.palette.background.subtle};
  color: ${(p) => p.theme.palette.text.secondary};
  font-size: large;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${(p) => p.theme.palette.background.subtle};
    color: ${(p) => p.theme.palette.text.primary};
    cursor: pointer;
  }

  &:focus-visible {
    outline: 2px solid ${(p) => p.theme.palette.primary.main};
    outline-offset: 2px;
  }
`;

// Mobile elements
export const MobileMenuButton = styled.button.withConfig({
  shouldForwardProp: (prop) => prop !== 'darkMode',
})`
  display: none;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: ${(p) => p.theme.palette.text.secondary};
  cursor: pointer;
  padding: ${(p) => p.theme.spacing(2)};
  border-radius: 0.375rem;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${(p) => p.theme.palette.background.subtle};
  }

  @media (max-width: ${breakpoints.lg}) {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &:focus-visible {
    outline: 2px solid ${(p) => p.theme.palette.primary.main};
    outline-offset: 2px;
  }
`;

export const MobileMenu = styled(UiPaper).withConfig({
  shouldForwardProp: (prop) => !['isOpen', 'darkMode'].includes(prop),
})`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: ${(p) => p.theme.spacing(75)};
  max-width: 80vw;
  background-color: ${(p) => p.theme.palette.background.surface};
  box-shadow: -5px 0 15px rgba(0, 0, 0, 0.12);
  transform: ${(props) => (props.isOpen ? 'translateX(0)' : 'translateX(100%)')};
  transition: transform 0.3s ease;
  z-index: 1000;
  padding: 2rem;
  padding: ${(p) => p.theme.spacing(8)};
  display: flex;
  flex-direction: column;
  border-radius: 0;

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

  animation: ${(props) =>
    props.isOpen
      ? css`
          ${slideIn} 0.3s ease
        `
      : 'none'};
`;

export const MobileMenuClose = styled.button.withConfig({
  shouldForwardProp: (prop) => prop !== 'darkMode',
})`
  position: absolute;
  top: ${(p) => p.theme.spacing(4)};
  right: ${(p) => p.theme.spacing(4)};
  background: none;
  border: none;
  font-size: 1.5rem;
  color: ${(p) => p.theme.palette.text.secondary};
  cursor: pointer;
  padding: ${(p) => p.theme.spacing(2)};
  border-radius: 0.375rem;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${(p) => p.theme.palette.background.subtle};
    color: ${(p) => p.theme.palette.text.primary};
  }

  &:focus-visible {
    outline: 2px solid ${(p) => p.theme.palette.primary.main};
    outline-offset: 2px;
  }
`;

export const MobileNavItem = styled(Link).withConfig({
  shouldForwardProp: (prop) => !['active', 'darkMode'].includes(prop),
})`
  text-decoration: none;
  display: flex;
  align-items: center;
  padding: ${(p) => p.theme.spacing(3)} ${(p) => p.theme.spacing(4)};
  font-size: ${(p) => p.theme.typography.size.md};
  font-weight: ${(props) =>
    props.active ? props.theme.typography.weight.semibold : props.theme.typography.weight.medium};
  color: ${(p) => (p.active ? p.theme.palette.primary.main : p.theme.palette.text.secondary)};
  border-radius: 0.375rem;
  transition: all 0.2s ease;
  background-color: ${(p) => (p.active ? p.theme.palette.background.subtle : 'transparent')};

  &:hover {
    background-color: ${(p) => p.theme.palette.background.subtle};
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
export const DropdownMenu = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'darkMode',
})`
  position: absolute;
  top: 100%;
  right: 0;
  width: 220px;
  background-color: ${(p) => p.theme.palette.background.surface};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  border-radius: 0.5rem;
  overflow: hidden;
  z-index: 10;
  animation: ${fadeIn} 0.2s ease-out;
`;

export const DropdownItem = styled.div`
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  color: ${(p) => p.theme.palette.text.secondary};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${(p) => p.theme.palette.background.subtle};
  }
`;

// Notification badge
export const NotificationBadge = styled.div`
  position: absolute;
  top: -5px;
  right: -5px;
  width: 18px;
  height: 18px;
  background-color: ${(p) => p.theme.palette.error.main};
  color: ${(p) => p.theme.palette.error.contrastText};
  font-size: 0.7rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: 2px solid ${(p) => p.theme.palette.background.surface};
`;

// Write button
export const WriteButton = styled(UiButton).withConfig({
  shouldForwardProp: (prop) => prop !== 'darkMode',
})`
  display: flex;
  align-items: center;
  gap: ${(p) => p.theme.spacing(2)};
  background-color: ${(p) => p.theme.palette.primary.main};
  color: ${(p) => p.theme.palette.primary.contrastText};
  border: none;
  padding: ${(p) => p.theme.spacing(2)} ${(p) => p.theme.spacing(4)};
  border-radius: ${(p) => p.theme.radii.pill};
  font-weight: ${(p) => p.theme.typography.weight.medium};
  font-size: ${(p) => p.theme.typography.size.sm};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${(p) => p.theme.palette.primary.dark};
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
export const ThemeToggle = styled(UiIconButton).withConfig({
  shouldForwardProp: (prop) => prop !== 'darkMode',
})`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${(p) => p.theme.spacing(9)};
  height: ${(p) => p.theme.spacing(9)};
  border-radius: 50%;
  background-color: transparent;
  border: ${(p) => p.theme.borderWidth.thin} solid ${(p) => p.theme.palette.divider};
  color: ${(p) => p.theme.palette.text.secondary};
  font-size: ${(p) => p.theme.typography.size.xl};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${(p) => p.theme.palette.background.subtle};
    color: ${(p) => p.theme.palette.text.primary};
  }

  @media (max-width: ${breakpoints.md}) {
    display: none;
  }

  &:focus-visible {
    outline: 2px solid ${(p) => p.theme.palette.primary.main};
    outline-offset: 2px;
  }
`;

// Search dialog for mobile
export const SearchDialog = styled.div`
  margin-bottom: 1.5rem;
`;
