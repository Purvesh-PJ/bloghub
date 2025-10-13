import React from 'react';
import PropTypes from 'prop-types';
import { Box, Text, Flex } from '../../ui/primitives';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

const bounce = keyframes`
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
`;

const SpinnerContainer = styled(Flex)`
  align-items: center;
  justify-content: center;
  gap: ${(p) => p.theme.spacing(3)};
`;

const Spinner = styled(Box)`
  width: ${(p) => p.$size || '24px'};
  height: ${(p) => p.$size || '24px'};
  border: 2px solid ${(p) => p.theme.palette.divider};
  border-top: 2px solid ${(p) => p.$color || p.theme.palette.primary.main};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

const DotsContainer = styled(Flex)`
  gap: ${(p) => p.theme.spacing(1)};
`;

const Dot = styled(Box)`
  width: ${(p) => p.$size || '8px'};
  height: ${(p) => p.$size || '8px'};
  background: ${(p) => p.$color || p.theme.palette.primary.main};
  border-radius: 50%;
  animation: ${bounce} 1.4s ease-in-out infinite both;
  animation-delay: ${(p) => p.$delay || '0s'};
`;

const PulseBox = styled(Box)`
  width: ${(p) => p.$size || '24px'};
  height: ${(p) => p.$size || '24px'};
  background: ${(p) => p.$color || p.theme.palette.primary.main};
  border-radius: ${(p) => p.theme.radii.sm};
  animation: ${pulse} 1.5s ease-in-out infinite;
`;

/**
 * LoadingSpinner - A versatile loading spinner component
 *
 * @param {Object} props
 * @param {string} props.variant - Spinner variant ('spinner', 'dots', 'pulse')
 * @param {string} props.size - Spinner size ('sm', 'md', 'lg') or custom size
 * @param {string} props.color - Spinner color (theme color or custom)
 * @param {string} props.text - Loading text to display
 * @param {boolean} props.centered - Whether to center the spinner
 * @param {string} props.direction - Layout direction ('row' or 'column')
 * @param {Object} props.containerProps - Additional props for container
 */
export const LoadingSpinner = ({
  variant = 'spinner',
  size = 'md',
  color,
  text,
  centered = false,
  direction = 'row',
  containerProps = {},
}) => {
  const sizeMap = {
    sm: '16px',
    md: '24px',
    lg: '32px',
  };

  const dotSizeMap = {
    sm: '6px',
    md: '8px',
    lg: '10px',
  };

  const spinnerSize = sizeMap[size] || size;
  const dotSize = dotSizeMap[size] || '8px';

  const renderSpinner = () => {
    switch (variant) {
      case 'dots':
        return (
          <DotsContainer>
            <Dot $size={dotSize} $color={color} $delay="0s" />
            <Dot $size={dotSize} $color={color} $delay="0.16s" />
            <Dot $size={dotSize} $color={color} $delay="0.32s" />
          </DotsContainer>
        );

      case 'pulse':
        return <PulseBox $size={spinnerSize} $color={color} />;

      default:
        return <Spinner $size={spinnerSize} $color={color} />;
    }
  };

  const Container = centered ? Flex : SpinnerContainer;
  const containerStyles = centered
    ? {
        $align: 'center',
        $justify: 'center',
        $direction: direction,
        $width: '100%',
        $height: '100%',
        $minHeight: '200px',
      }
    : {
        $direction: direction,
      };

  return (
    <Container
      role="status"
      aria-label={text || 'Loading'}
      {...containerStyles}
      {...containerProps}
    >
      {renderSpinner()}

      {text && (
        <Text
          $fontSize={size === 'sm' ? 'sm' : 'md'}
          $color="secondary"
          style={{ marginTop: direction === 'column' ? '8px' : '0' }}
        >
          {text}
        </Text>
      )}
    </Container>
  );
};

LoadingSpinner.propTypes = {
  variant: PropTypes.oneOf(['spinner', 'dots', 'pulse']),
  size: PropTypes.oneOfType([PropTypes.oneOf(['sm', 'md', 'lg']), PropTypes.string]),
  color: PropTypes.string,
  text: PropTypes.string,
  centered: PropTypes.bool,
  direction: PropTypes.oneOf(['row', 'column']),
  containerProps: PropTypes.object,
};
