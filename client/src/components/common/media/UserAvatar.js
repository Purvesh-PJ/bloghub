import React from 'react';
import PropTypes from 'prop-types';
import { Avatar, Box, Text, Flex } from '../../ui/primitives';
import styled from 'styled-components';

const AvatarContainer = styled(Flex)`
  cursor: ${(p) => (p.$interactive ? 'pointer' : 'default')};
  transition: opacity ${(p) => p.theme.motion.duration.fast}
    ${(p) => p.theme.motion.easing.standard};

  &:hover {
    opacity: ${(p) => (p.$interactive ? 0.8 : 1)};
  }
`;

const UserInfo = styled(Box)`
  min-width: 0; /* Allows text truncation */
`;

const StatusIndicator = styled(Box)`
  position: absolute;
  bottom: 0;
  right: 0;
  width: ${(p) => p.$size || '12px'};
  height: ${(p) => p.$size || '12px'};
  border-radius: 50%;
  border: 2px solid ${(p) => p.theme.palette.background.surface};
  background: ${(p) => {
    switch (p.$status) {
      case 'online':
        return p.theme.palette.success?.main || '#10b981';
      case 'away':
        return p.theme.palette.warning?.main || '#f59e0b';
      case 'busy':
        return p.theme.palette.error?.main || '#ef4444';
      case 'offline':
        return p.theme.palette.grey?.[400] || '#9ca3af';
      default:
        return 'transparent';
    }
  }};
`;

/**
 * UserAvatar - A user avatar component with optional user info and status
 *
 * @param {Object} props
 * @param {Object} props.user - User object {name, avatar, email, status}
 * @param {string} props.size - Avatar size ('xs', 'sm', 'md', 'lg', 'xl')
 * @param {boolean} props.showName - Whether to show user name
 * @param {boolean} props.showEmail - Whether to show user email
 * @param {boolean} props.showStatus - Whether to show status indicator
 * @param {string} props.layout - Layout direction ('horizontal' or 'vertical')
 * @param {Function} props.onClick - Click handler
 * @param {string} props.fallbackText - Fallback text when no avatar
 * @param {Object} props.containerProps - Additional props for container
 */
export const UserAvatar = ({
  user = {},
  size = 'md',
  showName = false,
  showEmail = false,
  showStatus = false,
  layout = 'horizontal',
  onClick,
  fallbackText,
  containerProps = {},
}) => {
  const { name, avatar, email, status } = user;

  const displayName = name || email?.split('@')[0] || 'User';
  const initials =
    fallbackText ||
    displayName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

  const statusSizes = {
    xs: '8px',
    sm: '10px',
    md: '12px',
    lg: '14px',
    xl: '16px',
  };

  const isVertical = layout === 'vertical';
  const isInteractive = !!onClick;

  return (
    <AvatarContainer
      $direction={isVertical ? 'column' : 'row'}
      $align={isVertical ? 'center' : 'center'}
      $gap={isVertical ? 2 : 3}
      $interactive={isInteractive}
      onClick={onClick}
      tabIndex={isInteractive ? 0 : undefined}
      role={isInteractive ? 'button' : undefined}
      {...containerProps}
    >
      {/* Avatar with status */}
      <Box $position="relative" $flexShrink={0}>
        <Avatar src={avatar} alt={displayName} $size={size}>
          {!avatar && initials}
        </Avatar>

        {showStatus && status && (
          <StatusIndicator $status={status} $size={statusSizes[size]} title={`Status: ${status}`} />
        )}
      </Box>

      {/* User info */}
      {(showName || showEmail) && (
        <UserInfo $textAlign={isVertical ? 'center' : 'left'}>
          {showName && name && (
            <Text
              $fontSize={size === 'xs' || size === 'sm' ? 'sm' : 'md'}
              $fontWeight="medium"
              $color="primary"
              style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {name}
            </Text>
          )}

          {showEmail && email && (
            <Text
              $fontSize="xs"
              $color="muted"
              style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                marginTop: showName && name ? '2px' : '0',
              }}
            >
              {email}
            </Text>
          )}
        </UserInfo>
      )}
    </AvatarContainer>
  );
};

UserAvatar.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
    avatar: PropTypes.string,
    email: PropTypes.string,
    status: PropTypes.oneOf(['online', 'away', 'busy', 'offline']),
  }),
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  showName: PropTypes.bool,
  showEmail: PropTypes.bool,
  showStatus: PropTypes.bool,
  layout: PropTypes.oneOf(['horizontal', 'vertical']),
  onClick: PropTypes.func,
  fallbackText: PropTypes.string,
  containerProps: PropTypes.object,
};
