import React from 'react';
import PropTypes from 'prop-types';
import { Container } from '../../ui/primitives';

/**
 * ResponsiveContainer - A responsive container with theme-based max-widths
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Container content
 * @param {string} props.size - Container size ('sm', 'md', 'lg', 'xl', 'full')
 * @param {number|string} props.paddingX - Horizontal padding
 * @param {boolean} props.center - Whether to center the container
 * @param {Object} props.containerProps - Additional props for Container component
 */
export const ResponsiveContainer = ({
  children,
  size = 'lg',
  paddingX,
  center = true,
  containerProps = {},
  ...boxProps
}) => {
  const maxWidths = {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
    full: '100%',
  };

  return (
    <Container
      $max={maxWidths[size] || maxWidths.lg}
      $px={paddingX}
      style={{
        marginLeft: center ? 'auto' : undefined,
        marginRight: center ? 'auto' : undefined,
      }}
      {...containerProps}
      {...boxProps}
    >
      {children}
    </Container>
  );
};

ResponsiveContainer.propTypes = {
  children: PropTypes.node,
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl', '2xl', 'full']),
  paddingX: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  center: PropTypes.bool,
  containerProps: PropTypes.object,
};
