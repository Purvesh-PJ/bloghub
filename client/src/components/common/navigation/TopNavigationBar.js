import React from 'react';
import PropTypes from 'prop-types';
import { Flex, Box, Button, Avatar, Text } from '../../ui/primitives';
import styled from 'styled-components';

const NavBar = styled(Flex)`
  background: ${(p) => p.theme.palette.background.surface};
  border-bottom: ${(p) => p.theme.borderWidth.thin} solid ${(p) => p.theme.palette.divider};
  padding: ${(p) => p.theme.spacing(4)} ${(p) => p.theme.spacing(6)};
  position: ${(p) => (p.$sticky ? 'sticky' : 'static')};
  top: ${(p) => (p.$sticky ? '0' : 'auto')};
  z-index: ${(p) => (p.$sticky ? '100' : 'auto')};
  backdrop-filter: ${(p) => (p.$sticky ? 'blur(8px)' : 'none')};
`;

const NavSection = styled(Flex)`
  align-items: center;
  gap: ${(p) => p.theme.spacing(4)};
`;

const Logo = styled(Box)`
  font-weight: ${(p) => p.theme.typography.weight.bold};
  font-size: ${(p) => p.theme.typography.size.lg};
  color: ${(p) => p.theme.palette.text.primary};
  cursor: pointer;
  text-decoration: none;

  &:hover {
    color: ${(p) => p.theme.palette.primary.main};
  }
`;

const NavLink = styled(Button)`
  background: transparent;
  color: ${(p) => p.theme.palette.text.secondary};
  border: none;
  padding: ${(p) => p.theme.spacing(2)} ${(p) => p.theme.spacing(3)};

  &:hover {
    background: ${(p) => p.theme.palette.background.subtle};
    color: ${(p) => p.theme.palette.text.primary};
  }

  &.active {
    color: ${(p) => p.theme.palette.primary.main};
    background: ${(p) => p.theme.palette.background.subtle};
  }
`;

/**
 * TopNavigationBar - A responsive top navigation bar
 *
 * @param {Object} props
 * @param {string|React.ReactNode} props.logo - Logo text or component
 * @param {Function} props.onLogoClick - Logo click handler
 * @param {Array} props.navItems - Array of navigation items {label, href, onClick, active}
 * @param {React.ReactNode} props.rightContent - Content for right side of nav
 * @param {Object} props.user - User object {name, avatar, email}
 * @param {Function} props.onUserClick - User avatar click handler
 * @param {boolean} props.sticky - Whether nav should be sticky
 * @param {string} props.background - Background color
 * @param {Object} props.navProps - Additional props for nav container
 */
export const TopNavigationBar = ({
  logo,
  onLogoClick,
  navItems = [],
  rightContent,
  user,
  onUserClick,
  sticky = false,
  background,
  navProps = {},
}) => {
  return (
    <NavBar
      as="nav"
      $align="center"
      $justify="space-between"
      $sticky={sticky}
      $bg={background}
      role="navigation"
      aria-label="Main navigation"
      {...navProps}
    >
      {/* Left Section - Logo */}
      <NavSection>
        {logo && (
          <Logo
            as={onLogoClick ? 'button' : 'div'}
            onClick={onLogoClick}
            tabIndex={onLogoClick ? 0 : undefined}
          >
            {logo}
          </Logo>
        )}
      </NavSection>

      {/* Center Section - Navigation Items */}
      {navItems.length > 0 && (
        <NavSection as="ul" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {navItems.map((item, index) => (
            <li key={item.href || index}>
              <NavLink
                as={item.href ? 'a' : 'button'}
                href={item.href}
                onClick={item.onClick}
                className={item.active ? 'active' : ''}
                aria-current={item.active ? 'page' : undefined}
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </NavSection>
      )}

      {/* Right Section - User/Actions */}
      <NavSection>
        {rightContent}
        {user && (
          <Flex
            $align="center"
            $gap={3}
            onClick={onUserClick}
            style={{ cursor: onUserClick ? 'pointer' : 'default' }}
            tabIndex={onUserClick ? 0 : undefined}
            role={onUserClick ? 'button' : undefined}
          >
            <Avatar src={user.avatar} alt={user.name} $size="sm" />
            {user.name && (
              <Box>
                <Text $fontSize="sm" $fontWeight="medium">
                  {user.name}
                </Text>
                {user.email && (
                  <Text $fontSize="xs" $color="muted">
                    {user.email}
                  </Text>
                )}
              </Box>
            )}
          </Flex>
        )}
      </NavSection>
    </NavBar>
  );
};

TopNavigationBar.propTypes = {
  logo: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  onLogoClick: PropTypes.func,
  navItems: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      href: PropTypes.string,
      onClick: PropTypes.func,
      active: PropTypes.bool,
    }),
  ),
  rightContent: PropTypes.node,
  user: PropTypes.shape({
    name: PropTypes.string,
    avatar: PropTypes.string,
    email: PropTypes.string,
  }),
  onUserClick: PropTypes.func,
  sticky: PropTypes.bool,
  background: PropTypes.string,
  navProps: PropTypes.object,
};
