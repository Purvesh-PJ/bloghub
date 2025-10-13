import styled, { css } from 'styled-components';
import { Link } from 'react-router-dom';
import { slideIn } from '../../../../components/common/theme/animations';
import { breakpoint } from '../../../../components/common/theme/breakpoints';

export const HeaderContainer = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing(4)} ${({ theme }) => theme.spacing(8)};
  background-color: ${(props) => (props.$scrolled ? 'rgba(255, 255, 255, 0.95)' : 'transparent')};
  position: sticky;
  top: 0;
  z-index: 1000;
  transition: all ${({ theme }) => theme.motion.duration.normal};
  box-shadow: ${(props) => (props.$scrolled ? props.theme.shadows.md : 'none')};
  backdrop-filter: ${(props) => (props.$scrolled ? 'blur(10px)' : 'none')};

  ${breakpoint.down('desktop')} {
    padding: ${({ theme }) => theme.spacing(4)};
  }

  ${breakpoint.down('tablet')} {
    padding: ${({ theme }) => theme.spacing(3)} ${({ theme }) => theme.spacing(4)};
  }
`;

export const LogoWrapper = styled.div`
  flex: 0 0 auto;
`;

export const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(2)};
  color: ${({ theme }) => theme.palette.primary.main};
  font-size: ${({ theme }) => theme.typography.size.xl};
  font-weight: ${({ theme }) => theme.typography.weight.bold};

  svg {
    font-size: ${({ theme }) => theme.typography.size.xl};
  }
`;

export const LogoText = styled.span`
  ${breakpoint.down('mobile')} {
    display: none;
  }
`;

export const Nav = styled.nav`
  flex: 1;
  display: flex;
  justify-content: center;

  ${breakpoint.down('desktop')} {
    display: none;
  }
`;

export const NavList = styled.ul`
  display: flex;
  list-style: none;
  gap: ${({ theme }) => theme.spacing(6)};
  margin: 0;
  padding: 0;
`;

export const NavItem = styled.li`
  font-size: ${({ theme }) => theme.typography.size.md};
  font-weight: ${({ theme }) => theme.typography.weight.medium};

  ${breakpoint.down('desktop')} {
    margin: ${({ theme }) => theme.spacing(3)} 0;
    width: 100%;
    text-align: center;
  }
`;

export const NavLink = styled(Link)`
  color: ${(props) =>
    props.$active ? props.theme.palette.primary.main : props.theme.palette.text.secondary};
  text-decoration: none;
  position: relative;
  transition: color ${({ theme }) => theme.motion.duration.fast};
  padding: ${({ theme }) => theme.spacing(2)} 0;

  &:hover {
    color: ${({ theme }) => theme.palette.primary.main};
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: ${(props) => (props.$active ? '100%' : '0')};
    height: 2px;
    background-color: ${({ theme }) => theme.palette.primary.main};
    transition: width ${({ theme }) => theme.motion.duration.normal};
  }

  &:hover::after {
    width: 100%;
  }

  ${breakpoint.down('desktop')} {
    display: block;
    padding: ${({ theme }) => theme.spacing(3)};

    &:hover::after {
      width: 0;
    }
  }
`;

export const SearchContainer = styled.form`
  display: flex;
  align-items: center;
  margin: 0 ${({ theme }) => theme.spacing(4)};

  ${breakpoint.down('desktop')} {
    display: none;
  }
`;

export const SearchInput = styled.input`
  padding: ${({ theme }) => theme.spacing(2)} ${({ theme }) => theme.spacing(4)};
  border: ${({ theme }) => theme.borderWidth.thin} solid ${({ theme }) => theme.palette.grey[200]};
  border-radius: ${({ theme }) => theme.radii.pill} 0 0 ${({ theme }) => theme.radii.pill};
  font-size: ${({ theme }) => theme.typography.size.sm};
  width: 200px;
  outline: none;
  transition: all ${({ theme }) => theme.motion.duration.fast};

  &:focus {
    border-color: ${({ theme }) => theme.palette.primary.main};
    box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1);
  }
`;

export const SearchButton = styled.button`
  background-color: ${({ theme }) => theme.palette.primary.main};
  color: ${({ theme }) => theme.palette.common.white};
  border: none;
  padding: ${({ theme }) => theme.spacing(2)} ${({ theme }) => theme.spacing(4)};
  border-radius: 0 ${({ theme }) => theme.radii.pill} ${({ theme }) => theme.radii.pill} 0;
  cursor: pointer;
  transition: background-color ${({ theme }) => theme.motion.duration.fast};

  &:hover {
    background-color: ${({ theme }) => theme.palette.primary.dark};
  }
`;

export const UserActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(3)};

  ${breakpoint.down('desktop')} {
    display: none;
  }
`;

export const AuthButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(2)};
  padding: ${(props) =>
    props.$primary
      ? `${props.theme.spacing(2)} ${props.theme.spacing(5)}`
      : `${props.theme.spacing(2)} ${props.theme.spacing(4)}`};
  border-radius: ${({ theme }) => theme.radii.pill};
  font-size: ${({ theme }) => theme.typography.size.sm};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  cursor: pointer;
  transition: all ${({ theme }) => theme.motion.duration.fast};
  margin: ${(props) => (props.$fullWidth ? `${props.theme.spacing(2)} 0` : '0')};
  width: ${(props) => (props.$fullWidth ? '100%' : 'auto')};
  justify-content: ${(props) => (props.$fullWidth ? 'center' : 'flex-start')};

  ${(props) =>
    props.$primary
      ? css`
          background-color: ${props.theme.palette.primary.main};
          color: ${props.theme.palette.common.white};
          border: none;

          &:hover {
            background-color: ${props.theme.palette.primary.dark};
          }
        `
      : css`
          background-color: ${props.theme.palette.background.surface};
          color: ${props.theme.palette.text.secondary};
          border: ${props.theme.borderWidth.thin} solid ${props.theme.palette.grey[200]};

          &:hover {
            background-color: ${props.theme.palette.grey[50]};
            border-color: ${props.theme.palette.grey[300]};
          }
        `}
`;

export const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  font-size: ${({ theme }) => theme.typography.size.xl};
  color: ${({ theme }) => theme.palette.text.secondary};
  cursor: pointer;

  ${breakpoint.down('desktop')} {
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
  background-color: ${({ theme }) => theme.palette.background.surface};
  padding: ${({ theme }) => theme.spacing(8)};
  display: flex;
  flex-direction: column;
  align-items: center;
  transform: ${(props) => (props.$open ? 'translateX(0)' : 'translateX(100%)')};
  transition: transform ${({ theme }) => theme.motion.duration.normal};
  box-shadow: ${({ theme }) => theme.shadows.xl};
  z-index: 1001;
  overflow-y: auto;

  animation: ${(props) =>
    props.$open
      ? css`
          ${slideIn} 0.3s ease
        `
      : 'none'};
`;

export const CloseButton = styled.button`
  position: absolute;
  top: ${({ theme }) => theme.spacing(4)};
  right: ${({ theme }) => theme.spacing(4)};
  background: none;
  border: none;
  font-size: ${({ theme }) => theme.typography.size.xl};
  color: ${({ theme }) => theme.palette.text.secondary};
  cursor: pointer;
`;
