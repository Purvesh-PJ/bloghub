import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Box, Card, Flex, Button, H3, IconButton } from '../../ui/primitives';
import styled from 'styled-components';

const Overlay = styled(Box)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${(p) => p.theme.spacing(4)};
  backdrop-filter: blur(4px);
`;

const ModalCard = styled(Card)`
  max-width: ${(p) => p.$maxWidth || '500px'};
  max-height: 90vh;
  width: 100%;
  overflow-y: auto;
  animation: modalEnter 0.2s ease-out;

  @keyframes modalEnter {
    from {
      opacity: 0;
      transform: scale(0.95) translateY(-10px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }
`;

const ModalHeader = styled(Flex)`
  padding: ${(p) => p.theme.spacing(6)};
  border-bottom: ${(p) => p.theme.borderWidth.thin} solid ${(p) => p.theme.palette.divider};
`;

const ModalBody = styled(Box)`
  padding: ${(p) => p.theme.spacing(6)};
  flex: 1;
  overflow-y: auto;
`;

const ModalFooter = styled(Flex)`
  padding: ${(p) => p.theme.spacing(6)};
  border-top: ${(p) => p.theme.borderWidth.thin} solid ${(p) => p.theme.palette.divider};
  gap: ${(p) => p.theme.spacing(3)};
  justify-content: flex-end;
`;

/**
 * Modal - A modal dialog component with overlay and focus management
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether modal is open
 * @param {Function} props.onClose - Close handler
 * @param {string} props.title - Modal title
 * @param {React.ReactNode} props.children - Modal content
 * @param {React.ReactNode} props.footer - Modal footer content
 * @param {string} props.size - Modal size ('sm', 'md', 'lg', 'xl')
 * @param {boolean} props.closeOnOverlay - Whether to close on overlay click
 * @param {boolean} props.closeOnEscape - Whether to close on escape key
 * @param {boolean} props.showCloseButton - Whether to show close button
 * @param {Object} props.modalProps - Additional props for modal card
 */
export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  closeOnOverlay = true,
  closeOnEscape = true,
  showCloseButton = true,
  modalProps = {},
}) => {
  const modalRef = useRef(null);
  const previousFocusRef = useRef(null);

  const sizes = {
    sm: '400px',
    md: '500px',
    lg: '700px',
    xl: '900px',
  };

  useEffect(() => {
    if (isOpen) {
      // Store previously focused element
      previousFocusRef.current = document.activeElement;

      // Focus modal
      modalRef.current?.focus();

      // Prevent body scroll
      document.body.style.overflow = 'hidden';
    } else {
      // Restore body scroll
      document.body.style.overflow = '';

      // Restore focus
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (event) => {
      if (closeOnEscape && event.key === 'Escape') {
        onClose?.();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, closeOnEscape, onClose]);

  const handleOverlayClick = (event) => {
    if (closeOnOverlay && event.target === event.currentTarget) {
      onClose?.();
    }
  };

  if (!isOpen) return null;

  return (
    <Overlay onClick={handleOverlayClick}>
      <ModalCard
        ref={modalRef}
        $maxWidth={sizes[size]}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        {...modalProps}
      >
        {(title || showCloseButton) && (
          <ModalHeader $align="center" $justify="space-between">
            {title && (
              <H3 id="modal-title" style={{ margin: 0 }}>
                {title}
              </H3>
            )}
            {showCloseButton && (
              <IconButton $variant="ghost" $size="sm" onClick={onClose} aria-label="Close modal">
                ×
              </IconButton>
            )}
          </ModalHeader>
        )}

        <ModalBody>{children}</ModalBody>

        {footer && <ModalFooter>{footer}</ModalFooter>}
      </ModalCard>
    </Overlay>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func,
  title: PropTypes.string,
  children: PropTypes.node,
  footer: PropTypes.node,
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  closeOnOverlay: PropTypes.bool,
  closeOnEscape: PropTypes.bool,
  showCloseButton: PropTypes.bool,
  modalProps: PropTypes.object,
};
