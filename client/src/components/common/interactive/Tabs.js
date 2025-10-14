import styled, { css } from 'styled-components';
import { useState } from 'react';

// Tab variants
const variants = ({ theme, $variant = 'default' }) => {
  if ($variant === 'pills') {
    return css`
      background: ${theme.palette.grey[100]};
      border-radius: ${theme.radii.lg};
      padding: ${theme.spacing(1)};
    `;
  }
  return css`
    border-bottom: ${theme.borderWidth.thin} solid ${theme.palette.divider};
  `;
};

// TabList container
export const TabList = styled.div`
  display: flex;
  gap: ${({ $gap, theme }) =>
    typeof $gap === 'number' ? theme.spacing($gap) : $gap || theme.spacing(1)};
  ${variants};
  overflow-x: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;

  /* Hide scrollbar but keep functionality */
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

// Individual Tab button
export const Tab = styled.button`
  flex-shrink: 0;
  padding: ${({ theme }) => `${theme.spacing(3)} ${theme.spacing(4)}`};
  font-size: ${({ theme }) => theme.typography.size.sm};
  font-weight: ${({ theme, $active }) =>
    $active ? theme.typography.weight.semibold : theme.typography.weight.medium};
  color: ${({ theme, $active }) =>
    $active ? theme.palette.primary.main : theme.palette.text.secondary};
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all ${({ theme }) => theme.motion.duration.fast};
  position: relative;
  white-space: nowrap;

  ${({ $variant, theme, $active }) => {
    if ($variant === 'pills') {
      return css`
        border-radius: ${theme.radii.md};
        background: ${$active ? theme.palette.background.surface : 'transparent'};
        box-shadow: ${$active ? theme.shadows.sm : 'none'};

        &:hover:not(:disabled) {
          background: ${$active ? theme.palette.background.surface : theme.palette.grey[50]};
        }
      `;
    }
    // Default underline variant
    return css`
      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 2px;
        background: ${theme.palette.primary.main};
        transform: scaleX(${$active ? 1 : 0});
        transition: transform ${theme.motion.duration.normal};
      }

      &:hover:not(:disabled) {
        color: ${theme.palette.primary.main};
        background: ${theme.palette.grey[50]};
      }
    `;
  }}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.palette.primary.main};
    outline-offset: 2px;
    border-radius: ${({ theme }) => theme.radii.sm};
  }

  ${({ $size, theme }) => {
    if ($size === 'sm') {
      return css`
        padding: ${theme.spacing(2)} ${theme.spacing(3)};
        font-size: ${theme.typography.size.xs};
      `;
    }
    if ($size === 'lg') {
      return css`
        padding: ${theme.spacing(4)} ${theme.spacing(6)};
        font-size: ${theme.typography.size.md};
      `;
    }
  }}
`;

// Tab Panel content
export const TabPanel = styled.div`
  padding: ${({ $p, theme }) =>
    typeof $p === 'number' ? theme.spacing($p) : $p || theme.spacing(6)};
  display: ${({ $active }) => ($active ? 'block' : 'none')};
  animation: ${({ $active }) => ($active ? 'fadeIn 0.2s ease' : 'none')};

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(4px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

// Tabs container
export const TabsContainer = styled.div`
  width: 100%;
`;

// Controlled Tabs component
export function Tabs({
  children,
  defaultValue,
  value: controlledValue,
  onChange,
  $variant = 'default',
  ...props
}) {
  const [internalValue, setInternalValue] = useState(defaultValue || 0);
  const isControlled = controlledValue !== undefined;
  const activeValue = isControlled ? controlledValue : internalValue;

  const handleChange = (newValue) => {
    if (!isControlled) {
      setInternalValue(newValue);
    }
    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <TabsContainer {...props}>
      {typeof children === 'function'
        ? children({ activeValue, onChange: handleChange, $variant })
        : children}
    </TabsContainer>
  );
}

// Add static properties
Tabs.List = TabList;
Tabs.Tab = Tab;
Tabs.Panel = TabPanel;

export default Tabs;