import styled, { css } from 'styled-components';
import { useState } from 'react';

// Accordion container
export const AccordionContainer = styled.div`
  width: 100%;
  border: ${({ theme }) => theme.borderWidth.thin} solid ${({ theme }) => theme.palette.divider};
  border-radius: ${({ theme }) => theme.radii.lg};
  overflow: hidden;
`;

// Accordion item
export const AccordionItem = styled.div`
  border-bottom: ${({ theme }) => theme.borderWidth.thin} solid
    ${({ theme }) => theme.palette.divider};

  &:last-child {
    border-bottom: none;
  }
`;

// Accordion header/trigger
export const AccordionHeader = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing(4)};
  font-size: ${({ theme }) => theme.typography.size.md};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  color: ${({ theme }) => theme.palette.text.primary};
  background: ${({ theme, $expanded }) =>
    $expanded ? theme.palette.background.subtle : 'transparent'};
  border: none;
  cursor: pointer;
  text-align: left;
  transition: all ${({ theme }) => theme.motion.duration.fast};

  &:hover {
    background: ${({ theme }) => theme.palette.background.subtle};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.palette.primary.main};
    outline-offset: -2px;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// Accordion icon/chevron
export const AccordionIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ theme }) => theme.typography.size.lg};
  color: ${({ theme }) => theme.palette.text.secondary};
  transition: transform ${({ theme }) => theme.motion.duration.fast};
  transform: rotate(${({ $expanded }) => ($expanded ? '180deg' : '0deg')});
  flex-shrink: 0;
  margin-left: ${({ theme }) => theme.spacing(3)};
`;

// Accordion panel/content
export const AccordionPanel = styled.div`
  overflow: hidden;
  transition:
    max-height ${({ theme }) => theme.motion.duration.normal} ease-out,
    opacity ${({ theme }) => theme.motion.duration.fast};
  max-height: ${({ $expanded, $maxHeight }) => ($expanded ? $maxHeight || '1000px' : '0px')};
  opacity: ${({ $expanded }) => ($expanded ? 1 : 0)};
`;

// Accordion content wrapper
export const AccordionContent = styled.div`
  padding: ${({ theme, $p }) =>
    typeof $p === 'number'
      ? `0 ${theme.spacing(4)} ${theme.spacing($p)} ${theme.spacing(4)}`
      : $p || `0 ${theme.spacing(4)} ${theme.spacing(4)} ${theme.spacing(4)}`};
  color: ${({ theme }) => theme.palette.text.secondary};
  font-size: ${({ theme }) => theme.typography.size.sm};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
`;

// Controlled Accordion component
export function Accordion({
  children,
  defaultExpanded,
  expanded: controlledExpanded,
  onChange,
  multiple = false,
  ...props
}) {
  const [internalExpanded, setInternalExpanded] = useState(
    defaultExpanded || (multiple ? [] : null),
  );
  const isControlled = controlledExpanded !== undefined;
  const expanded = isControlled ? controlledExpanded : internalExpanded;

  const handleToggle = (value) => {
    let newExpanded;

    if (multiple) {
      // Multiple items can be expanded
      const currentExpanded = Array.isArray(expanded) ? expanded : [];
      if (currentExpanded.includes(value)) {
        newExpanded = currentExpanded.filter((v) => v !== value);
      } else {
        newExpanded = [...currentExpanded, value];
      }
    } else {
      // Only one item can be expanded
      newExpanded = expanded === value ? null : value;
    }

    if (!isControlled) {
      setInternalExpanded(newExpanded);
    }
    if (onChange) {
      onChange(newExpanded);
    }
  };

  const isExpanded = (value) => {
    if (multiple) {
      return Array.isArray(expanded) && expanded.includes(value);
    }
    return expanded === value;
  };

  return (
    <AccordionContainer {...props}>
      {typeof children === 'function'
        ? children({ expanded, onToggle: handleToggle, isExpanded })
        : children}
    </AccordionContainer>
  );
}

// Add static properties
Accordion.Item = AccordionItem;
Accordion.Header = AccordionHeader;
Accordion.Icon = AccordionIcon;
Accordion.Panel = AccordionPanel;
Accordion.Content = AccordionContent;

export default Accordion;