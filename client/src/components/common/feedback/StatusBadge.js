import React from 'react';
import PropTypes from 'prop-types';
import { Badge, Flex, Box } from '../../ui/primitives';
import styled from 'styled-components';

const StatusIndicator = styled(Box)`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: currentColor;
  flex-shrink: 0;
`;

/**
 * StatusBadge - A badge component for displaying status with colors and indicators
 *
 * @param {Object} props
 * @param {string} props.status - Status value
 * @param {string} props.variant - Badge variant ('default', 'dot', 'outline')
 * @param {string} props.size - Badge size ('sm', 'md', 'lg')
 * @param {Object} props.colorMap - Custom color mapping for statuses
 * @param {boolean} props.interactive - Whether badge is interactive
 * @param {Function} props.onClick - Click handler
 * @param {Object} props.badgeProps - Additional props for badge
 */
export const StatusBadge = ({
  status,
  variant = 'default',
  size = 'md',
  colorMap = {},
  interactive = false,
  onClick,
  badgeProps = {},
}) => {
  const defaultColorMap = {
    // Success states
    active: { bg: '#dcfce7', color: '#166534' },
    published: { bg: '#dcfce7', color: '#166534' },
    completed: { bg: '#dcfce7', color: '#166534' },
    approved: { bg: '#dcfce7', color: '#166534' },
    online: { bg: '#dcfce7', color: '#166534' },
    success: { bg: '#dcfce7', color: '#166534' },

    // Warning states
    pending: { bg: '#fef3c7', color: '#92400e' },
    draft: { bg: '#fef3c7', color: '#92400e' },
    review: { bg: '#fef3c7', color: '#92400e' },
    warning: { bg: '#fef3c7', color: '#92400e' },
    away: { bg: '#fef3c7', color: '#92400e' },

    // Error states
    inactive: { bg: '#fee2e2', color: '#991b1b' },
    rejected: { bg: '#fee2e2', color: '#991b1b' },
    failed: { bg: '#fee2e2', color: '#991b1b' },
    error: { bg: '#fee2e2', color: '#991b1b' },
    offline: { bg: '#fee2e2', color: '#991b1b' },

    // Info states
    info: { bg: '#dbeafe', color: '#1e40af' },
    processing: { bg: '#dbeafe', color: '#1e40af' },
    busy: { bg: '#dbeafe', color: '#1e40af' },

    // Neutral states
    archived: { bg: '#f3f4f6', color: '#374151' },
    disabled: { bg: '#f3f4f6', color: '#374151' },
    unknown: { bg: '#f3f4f6', color: '#374151' },
  };

  const colors = { ...defaultColorMap, ...colorMap };
  const statusColors = colors[status?.toLowerCase()] || colors.unknown;

  const sizeStyles = {
    sm: { fontSize: '12px', padding: '2px 8px', height: '20px' },
    md: { fontSize: '14px', padding: '4px 12px', height: '24px' },
    lg: { fontSize: '16px', padding: '6px 16px', height: '32px' },
  };

  const badgeStyle = {
    ...sizeStyles[size],
    background: variant === 'outline' ? 'transparent' : statusColors.bg,
    color: statusColors.color,
    border: variant === 'outline' ? `1px solid ${statusColors.color}` : 'none',
  };

  const displayText = status?.charAt(0).toUpperCase() + status?.slice(1).toLowerCase();

  if (variant === 'dot') {
    return (
      <Flex
        $align="center"
        $gap={2}
        onClick={onClick}
        style={{ cursor: interactive ? 'pointer' : 'default' }}
        {...badgeProps}
      >
        <StatusIndicator style={{ color: statusColors.color }} />
        <span style={{ fontSize: sizeStyles[size].fontSize, color: statusColors.color }}>
          {displayText}
        </span>
      </Flex>
    );
  }

  return (
    <Badge $interactive={interactive} onClick={onClick} style={badgeStyle} {...badgeProps}>
      {displayText}
    </Badge>
  );
};

StatusBadge.propTypes = {
  status: PropTypes.string.isRequired,
  variant: PropTypes.oneOf(['default', 'dot', 'outline']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  colorMap: PropTypes.object,
  interactive: PropTypes.bool,
  onClick: PropTypes.func,
  badgeProps: PropTypes.object,
};
