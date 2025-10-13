import React from 'react';
import PropTypes from 'prop-types';
import { Section, Box } from '../../ui/primitives';

/**
 * PageSection - A semantic section component with consistent spacing
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Section content
 * @param {number|string} props.paddingY - Vertical padding
 * @param {number|string} props.paddingX - Horizontal padding
 * @param {string} props.background - Background color from theme
 * @param {boolean} props.fullWidth - Whether section takes full width
 * @param {string} props.id - Section ID for navigation
 * @param {Object} props.sectionProps - Additional props for Section component
 */
export const PageSection = ({
  children,
  paddingY = 12,
  paddingX = 4,
  background,
  fullWidth = true,
  id,
  sectionProps = {},
  ...boxProps
}) => {
  return (
    <Section
      id={id}
      $py={paddingY}
      $px={fullWidth ? paddingX : undefined}
      $bg={background}
      $width={fullWidth ? '100%' : 'auto'}
      {...sectionProps}
      {...boxProps}
    >
      {children}
    </Section>
  );
};

PageSection.propTypes = {
  children: PropTypes.node,
  paddingY: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  paddingX: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  background: PropTypes.string,
  fullWidth: PropTypes.bool,
  id: PropTypes.string,
  sectionProps: PropTypes.object,
};
