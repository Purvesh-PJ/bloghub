import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Flex, Box, Button, Text, IconButton } from '../../ui/primitives';
import styled from 'styled-components';

const SideNav = styled(Box)`
  background: ${(p) => p.theme.palette.background.surface};
  border-right: ${(p) => p.theme.borderWidth.thin} solid ${(p) => p.theme.palette.divider};
  height: 100vh;
  width: ${(p) => (p.$collapsed ? '80px' : p.$width || '280px')};
  transition: width ${(p) => p.theme.motion.duration.normal}
    ${(p) => p.theme.motion.easing.standard};
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const NavHeader = styled(Flex)`
  padding: ${(p) => p.theme.spacing(6)};
  border-bottom: ${(p) => p.theme.borderWidth.thin} solid ${(p) => p.theme.palette.divider};
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
`;

const NavBody = styled(Box)`
  flex: 1;
  overflow-y: auto;
  padding: ${(p) => p.theme.spacing(4)} 0;
`;

const NavGroup = styled(Box)`
  margin-bottom: ${(p) => p.theme.spacing(6)};
`;

const NavGroupTitle = styled(Text)`
  padding: 0 ${(p) => p.theme.spacing(6)} ${(p) => p.theme.spacing(2)};
  font-size: ${(p) => p.theme.typography.size.xs};
  font-weight: ${(p) => p.theme.typography.weight.semibold};
  color: ${(p) => p.theme.palette.text.muted};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  opacity: ${(p) => (p.$collapsed ? 0 : 1)};
  transition: opacity ${(p) => p.theme.motion.duration.fast}
    ${(p) => p.theme.motion.easing.standard};
`;

const NavItem = styled(Button)`
  width: 100%;
  justify-content: flex-start;
  padding: ${(p) => p.theme.spacing(3)} ${(p) => p.theme.spacing(6)};
  background: transparent;
  color: ${(p) => p.theme.palette.text.secondary};
  border: none;
  border-radius: 0;
  gap: ${(p) => p.theme.spacing(3)};

  &:hover {
    background: ${(p) => p.theme.palette.background.subtle};
    color: ${(p) => p.theme.palette.text.primary};
  }

  &.active {
    background: ${(p) => p.theme.palette.primary.main};
    color: ${(p) => p.theme.palette.primary.contrastText};

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 4px;
      background: ${(p) => p.theme.palette.primary.contrastText};
    }
  }

  .nav-text {
    opacity: ${(p) => (p.$collapsed ? 0 : 1)};
    transition: opacity ${(p) => p.theme.motion.duration.fast}
      ${(p) => p.theme.motion.easing.standard};
  }
`;

const NavIcon = styled(Box)`
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

/**
 * SideNavigation - A collapsible side navigation component
 *
 * @param {Object} props
 * @param {Array} props.navGroups - Array of navigation groups {title, items}
 * @param {boolean} props.collapsed - Whether navigation is collapsed
 * @param {Function} props.onToggleCollapse - Toggle collapse handler
 * @param {string} props.width - Navigation width when expanded
 * @param {React.ReactNode} props.header - Header content
 * @param {React.ReactNode} props.footer - Footer content
 * @param {Object} props.navProps - Additional props for nav container
 */
export const SideNavigation = ({
  navGroups = [],
  collapsed = false,
  onToggleCollapse,
  width = '280px',
  header,
  footer,
  navProps = {},
}) => {
  return (
    <SideNav
      as="nav"
      $collapsed={collapsed}
      $width={width}
      role="navigation"
      aria-label="Side navigation"
      {...navProps}
    >
      {/* Header */}
      {(header || onToggleCollapse) && (
        <NavHeader>
          {header && !collapsed && <Box>{header}</Box>}
          {onToggleCollapse && (
            <IconButton
              $variant="ghost"
              $size="sm"
              onClick={onToggleCollapse}
              aria-label={collapsed ? 'Expand navigation' : 'Collapse navigation'}
            >
              {collapsed ? '→' : '←'}
            </IconButton>
          )}
        </NavHeader>
      )}

      {/* Navigation Body */}
      <NavBody>
        {navGroups.map((group, groupIndex) => (
          <NavGroup key={group.title || groupIndex}>
            {group.title && <NavGroupTitle $collapsed={collapsed}>{group.title}</NavGroupTitle>}

            {group.items?.map((item, itemIndex) => (
              <NavItem
                key={item.href || item.label || itemIndex}
                as={item.href ? 'a' : 'button'}
                href={item.href}
                onClick={item.onClick}
                className={item.active ? 'active' : ''}
                $collapsed={collapsed}
                aria-current={item.active ? 'page' : undefined}
                title={collapsed ? item.label : undefined}
              >
                {item.icon && <NavIcon>{item.icon}</NavIcon>}
                <span className="nav-text">{item.label}</span>
                {item.badge && !collapsed && (
                  <Box
                    $ml="auto"
                    $bg="primary"
                    $color="white"
                    $px={2}
                    $py={1}
                    $radius="full"
                    $fontSize="xs"
                  >
                    {item.badge}
                  </Box>
                )}
              </NavItem>
            ))}
          </NavGroup>
        ))}
      </NavBody>

      {/* Footer */}
      {footer && !collapsed && (
        <Box $p={6} $borderTop="thin solid" style={{ borderColor: 'var(--divider)' }}>
          {footer}
        </Box>
      )}
    </SideNav>
  );
};

SideNavigation.propTypes = {
  navGroups: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      items: PropTypes.arrayOf(
        PropTypes.shape({
          label: PropTypes.string.isRequired,
          href: PropTypes.string,
          onClick: PropTypes.func,
          icon: PropTypes.node,
          active: PropTypes.bool,
          badge: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        }),
      ),
    }),
  ),
  collapsed: PropTypes.bool,
  onToggleCollapse: PropTypes.func,
  width: PropTypes.string,
  header: PropTypes.node,
  footer: PropTypes.node,
  navProps: PropTypes.object,
};
