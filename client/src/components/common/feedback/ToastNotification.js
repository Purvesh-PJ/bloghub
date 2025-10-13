import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Box, Flex, Text, IconButton } from '../../ui/primitives';
import styled, { keyframes } from 'styled-components';

const slideIn = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const slideOut = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
`;

const ToastContainer = styled(Box)`
  position: fixed;
  top: ${(p) => (p.$position?.includes('top') ? '20px' : 'auto')};
  bottom: ${(p) => (p.$position?.includes('bottom') ? '20px' : 'auto')};
  left: ${(p) => (p.$position?.includes('left') ? '20px' : 'auto')};
  right: ${(p) => (p.$position?.includes('right') ? '20px' : 'auto')};
  z-index: 1000;
  max-width: 400px;
  min-width: 300px;
`;

const Toast = styled(Flex)`
  background: ${(p) => p.theme.palette.background.surface};
  border: ${(p) => p.theme.borderWidth.thin} solid
    ${(p) => {
      switch (p.$variant) {
        case 'success':
          return p.theme.palette.success?.main || '#10b981';
        case 'warning':
          return p.theme.palette.warning?.main || '#f59e0b';
        case 'error':
          return p.theme.palette.error?.main || '#ef4444';
        default:
          return p.theme.palette.primary.main;
      }
    }};
  border-left: 4px solid
    ${(p) => {
      switch (p.$variant) {
        case 'success':
          return p.theme.palette.success?.main || '#10b981';
        case 'warning':
          return p.theme.palette.warning?.main || '#f59e0b';
        case 'error':
          return p.theme.palette.error?.main || '#ef4444';
        default:
          return p.theme.palette.primary.main;
      }
    }};
  border-radius: ${(p) => p.theme.radii.lg};
  box-shadow: ${(p) => p.theme.shadows.lg};
  padding: ${(p) => p.theme.spacing(4)};
  animation: ${(p) => (p.$isExiting ? slideOut : slideIn)} 0.3s ease-out;
  align-items: flex-start;
  gap: ${(p) => p.theme.spacing(3)};
`;

const ToastIcon = styled(Box)`
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(p) => {
    switch (p.$variant) {
      case 'success':
        return p.theme.palette.success?.main || '#10b981';
      case 'warning':
        return p.theme.palette.warning?.main || '#f59e0b';
      case 'error':
        return p.theme.palette.error?.main || '#ef4444';
      default:
        return p.theme.palette.primary.main;
    }
  }};
`;

const ToastContent = styled(Box)`
  flex: 1;
  min-width: 0;
`;

const ProgressBar = styled(Box)`
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  background: ${(p) => {
    switch (p.$variant) {
      case 'success':
        return p.theme.palette.success?.main || '#10b981';
      case 'warning':
        return p.theme.palette.warning?.main || '#f59e0b';
      case 'error':
        return p.theme.palette.error?.main || '#ef4444';
      default:
        return p.theme.palette.primary.main;
    }
  }};
  border-radius: 0 0 ${(p) => p.theme.radii.lg} ${(p) => p.theme.radii.lg};
  width: ${(p) => p.$progress}%;
  transition: width 100ms linear;
`;

/**
 * ToastNotification - A toast notification component
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether toast is visible
 * @param {Function} props.onClose - Close handler
 * @param {string} props.variant - Toast variant ('success', 'warning', 'error', 'info')
 * @param {string} props.title - Toast title
 * @param {string} props.message - Toast message
 * @param {React.ReactNode} props.children - Custom content
 * @param {number} props.duration - Auto close duration in milliseconds (0 = no auto close)
 * @param {string} props.position - Toast position ('top-right', 'top-left', 'bottom-right', 'bottom-left')
 * @param {boolean} props.dismissible - Whether toast can be dismissed
 * @param {React.ReactNode} props.icon - Custom icon
 * @param {React.ReactNode} props.actions - Action buttons
 * @param {boolean} props.showProgress - Whether to show progress bar
 * @param {Object} props.toastProps - Additional props for toast
 */
export const ToastNotification = ({
  isOpen,
  onClose,
  variant = 'info',
  title,
  message,
  children,
  duration = 5000,
  position = 'top-right',
  dismissible = true,
  icon,
  actions,
  showProgress = true,
  toastProps = {},
}) => {
  const [isExiting, setIsExiting] = useState(false);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (!isOpen || duration === 0) return;

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, duration - elapsed);
      const progressPercent = (remaining / duration) * 100;

      setProgress(progressPercent);

      if (remaining === 0) {
        handleClose();
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isOpen, duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose?.();
      setIsExiting(false);
      setProgress(100);
    }, 300);
  };

  const getDefaultIcon = () => {
    switch (variant) {
      case 'success':
        return '✓';
      case 'warning':
        return '⚠';
      case 'error':
        return '✕';
      case 'info':
        return 'ℹ';
      default:
        return 'ℹ';
    }
  };

  if (!isOpen) return null;

  return (
    <ToastContainer $position={position}>
      <Toast
        $variant={variant}
        $isExiting={isExiting}
        role="alert"
        aria-live="polite"
        style={{ position: 'relative' }}
        {...toastProps}
      >
        {/* Icon */}
        <ToastIcon $variant={variant}>{icon || getDefaultIcon()}</ToastIcon>

        {/* Content */}
        <ToastContent>
          {title && (
            <Text
              $fontSize="sm"
              $fontWeight="semibold"
              $color="primary"
              style={{ marginBottom: message || children ? '4px' : '0' }}
            >
              {title}
            </Text>
          )}

          {message && (
            <Text
              $fontSize="sm"
              $color="secondary"
              style={{ marginBottom: children ? '8px' : '0' }}
            >
              {message}
            </Text>
          )}

          {children}

          {/* Actions */}
          {actions && (
            <Flex $gap={2} $mt={2}>
              {actions}
            </Flex>
          )}
        </ToastContent>

        {/* Close button */}
        {dismissible && (
          <IconButton
            $variant="ghost"
            $size="sm"
            onClick={handleClose}
            aria-label="Close notification"
          >
            ×
          </IconButton>
        )}

        {/* Progress bar */}
        {showProgress && duration > 0 && <ProgressBar $variant={variant} $progress={progress} />}
      </Toast>
    </ToastContainer>
  );
};

ToastNotification.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func,
  variant: PropTypes.oneOf(['success', 'warning', 'error', 'info']),
  title: PropTypes.string,
  message: PropTypes.string,
  children: PropTypes.node,
  duration: PropTypes.number,
  position: PropTypes.oneOf(['top-right', 'top-left', 'bottom-right', 'bottom-left']),
  dismissible: PropTypes.bool,
  icon: PropTypes.node,
  actions: PropTypes.node,
  showProgress: PropTypes.bool,
  toastProps: PropTypes.object,
};
