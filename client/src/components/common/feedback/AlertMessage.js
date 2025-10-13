import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Alert,
  AlertIcon,
  AlertContent,
  AlertTitle,
  AlertDescription,
  AlertClose,
  Flex,
  IconButton,
} from '../../ui/primitives';

/**
 * AlertMessage - A comprehensive alert component with auto-dismiss
 *
 * @param {Object} props
 * @param {string} props.variant - Alert variant ('success', 'warning', 'error', 'info')
 * @param {string} props.title - Alert title
 * @param {string} props.message - Alert message/description
 * @param {React.ReactNode} props.children - Custom content
 * @param {boolean} props.dismissible - Whether alert can be dismissed
 * @param {number} props.autoClose - Auto close delay in milliseconds (0 = no auto close)
 * @param {Function} props.onClose - Close handler
 * @param {React.ReactNode} props.icon - Custom icon
 * @param {React.ReactNode} props.actions - Action buttons
 * @param {Object} props.alertProps - Additional props for alert
 */
export const AlertMessage = ({
  variant = 'info',
  title,
  message,
  children,
  dismissible = true,
  autoClose = 0,
  onClose,
  icon,
  actions,
  alertProps = {},
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (autoClose > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, autoClose);

      return () => clearTimeout(timer);
    }
  }, [autoClose]);

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
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

  if (!isVisible) return null;

  return (
    <Alert $variant={variant} role="alert" {...alertProps}>
      <Flex $align="flex-start" $gap={3} $width="100%">
        {/* Icon */}
        <AlertIcon>{icon || getDefaultIcon()}</AlertIcon>

        {/* Content */}
        <AlertContent $flex="1">
          {title && <AlertTitle>{title}</AlertTitle>}

          {message && <AlertDescription>{message}</AlertDescription>}

          {children}

          {/* Actions */}
          {actions && (
            <Flex $gap={2} $mt={3}>
              {actions}
            </Flex>
          )}
        </AlertContent>

        {/* Close button */}
        {dismissible && (
          <AlertClose asChild>
            <IconButton $variant="ghost" $size="sm" onClick={handleClose} aria-label="Close alert">
              ×
            </IconButton>
          </AlertClose>
        )}
      </Flex>
    </Alert>
  );
};

AlertMessage.propTypes = {
  variant: PropTypes.oneOf(['success', 'warning', 'error', 'info']),
  title: PropTypes.string,
  message: PropTypes.string,
  children: PropTypes.node,
  dismissible: PropTypes.bool,
  autoClose: PropTypes.number,
  onClose: PropTypes.func,
  icon: PropTypes.node,
  actions: PropTypes.node,
  alertProps: PropTypes.object,
};
