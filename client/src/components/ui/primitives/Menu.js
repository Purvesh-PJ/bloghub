import styled, { css } from 'styled-components';
import { useState, useRef, useEffect } from 'react';

// Menu container
export const MenuContainer = styled.div`
  position: relative;
  display: inline-block;
`;

// Menu trigger button
export const MenuTrigger = styled.button`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(2)};
  padding: ${({ theme }) => `${theme.spacing(2)} ${theme.spacing(3)}`};
  font-size: ${({ theme }) => theme.typography.size.sm};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  color: ${({ theme }) => theme.palette.text.primary};
  background: ${({ theme }) => theme.palette.background.surface};
  border: ${({ theme }) => theme.borderWidth.thin} solid ${({ theme }) => theme.palette.divider};
  border-radius: ${({ theme }) => theme.radii.md};
  cursor: pointer;
  transition: all ${({ theme }) => theme.motion.duration.fast};

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.palette.background.subtle};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.palette.primary.main};
    outline-offset: 2px;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// Menu content/dropdown
export const MenuContent = styled.div`
  position: absolute;
  z-index: ${({ theme }) => theme.zIndex.dropdown || 1300};
  min-width: 180px;
  max-width: ${({ $maxWidth }) => $maxWidth || '320px'};
  margin-top: ${({ theme }) => theme.spacing(1)};
  padding: ${({ theme }) => theme.spacing(2)};
  background: ${({ theme }) => theme.palette.background.surface};
  border: ${({ theme }) => theme.borderWidth.thin} solid ${({ theme }) => theme.palette.divider};
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  opacity: ${({ $open }) => ($open ? 1 : 0)};
  visibility: ${({ $open }) => ($open ? 'visible' : 'hidden')};
  transform: ${({ $open }) => ($open ? 'translateY(0)' : 'translateY(-8px)')};
  transition: all ${({ theme }) => theme.motion.duration.fast};

  ${({ $placement = 'bottom-start' }) => {
    switch ($placement) {
      case 'bottom-end':
        return css`
          top: 100%;
          right: 0;
        `;
      case 'top-start':
        return css`
          bottom: 100%;
          left: 0;
        `;
      case 'top-end':
        return css`
          bottom: 100%;
          right: 0;
        `;
      default:
        return css`
          top: 100%;
          left: 0;
        `;
    }
  }}
`;

// Menu item
export const MenuItem = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(3)};
  padding: ${({ theme }) => `${theme.spacing(2)} ${theme.spacing(3)}`};
  font-size: ${({ theme }) => theme.typography.size.sm};
  color: ${({ theme, $danger }) =>
    $danger ? theme.palette.error.main : theme.palette.text.primary};
  background: transparent;
  border: none;
  border-radius: ${({ theme }) => theme.radii.md};
  cursor: pointer;
  text-align: left;
  transition: all ${({ theme }) => theme.motion.duration.fast};

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.palette.background.subtle};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  ${({ $active, theme }) =>
    $active &&
    css`
      background: ${theme.palette.primary.main}15;
      color: ${theme.palette.primary.main};
    `}
`;

// Menu icon
export const MenuIcon = styled.span`
  display: flex;
  align-items: center;
  font-size: 1.2em;
`;

// Menu divider
export const MenuDivider = styled.hr`
  border: 0;
  border-top: ${({ theme }) => theme.borderWidth.thin} solid ${({ theme }) => theme.palette.divider};
  margin: ${({ theme }) => `${theme.spacing(2)} 0`};
`;

// Controlled Menu
export function Menu({ children, $placement = 'bottom-start', ...props }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  return (
    <MenuContainer ref={menuRef} {...props}>
      {typeof children === 'function' ? children({ open, setOpen, $placement }) : children}
    </MenuContainer>
  );
}

Menu.Trigger = MenuTrigger;
Menu.Content = MenuContent;
Menu.Item = MenuItem;
Menu.Icon = MenuIcon;
Menu.Divider = MenuDivider;

export default Menu;
