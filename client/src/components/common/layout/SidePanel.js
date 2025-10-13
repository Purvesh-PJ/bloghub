import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Box, Flex, IconButton, H4 } from '../../ui/primitives';
import styled from 'styled-components';

const Overlay = styled(Box)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  opacity: ${(p) => (p.$isOpen ? 1 : 0)};
  visibility: ${(p) => (p.$isOpen ? 'visible' : 'hidden')};
  transition:
    opacity ${(p) => p.theme.motion.duration.normal} ${(p) => p.theme.motion.easing.standard},
    visibility ${(p) => p.theme.motion.duration.normal} ${(p) => p.theme.motion.easing.standard};
  backdrop-filter: blur(4px);
`;

const Panel = styled(Box)`
  position: fixed;
  top: 0;
  ${(p) => (p.$side === 'right' ? 'right: 0' : 'left: 0')};
  height: 100vh;
  width: ${(p) => p.$width || '400px'};
  background: ${(p) => p.theme.palette.background.surface};
  box-shadow: ${(p) => p.theme.shadows.xl};
  z-index: 1001;
  transform: translateX(
    ${(p) => {
      if (!p.$isOpen) {
        return p.$side === 'right' ? '100%' : '-100%';
      }
      return '0';
    }}
  );
  transition: transform ${(p) => p.theme.motion.duration.normal}
    ${(p) => p.theme.motion.easing.standard};
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const PanelHeader = styled(Flex)`
  padding: ${(p) => p.theme.spacing(6)};
  border-bottom: ${(p) => p.theme.borderWidth.thin} solid ${(p) => p.theme.palette.divider};
  flex-shrink: 0;
`;

const PanelBody = styled(Box)`
  flex: 1;
  overflow-y: auto;
  padding: ${(p) => p.theme.spacing(6)};
`;

/**
 * SidePanel - A sliding side panel component
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether panel is open
 * @param {Function} props.onClose - Close handler
 * @param {string} props.title - Panel title
 * @param {React.ReactNode} props.children - Panel content
 * @param {string} props.side - Panel side ('left' or 'right')
 * @param {string} props.width - Panel width
 * @param {boolean} props.closeOnOverlay - Whether to close on overlay click
 * @param {boolean} props.closeOnEscape - Whether to close on escape key
 * @param {boolean} props.showCloseButton - Whether to show close button
 * @param {Object} props.panelProps - Additional props for panel
 */
export const SidePanel = ({
  isOpen,
  onClose,
  title,
  children,
  side = 'right',
  width = '400px',
  closeOnOverlay = true,
  closeOnEscape = true,
  showCloseButton = true,
  panelProps = {},
}) => {
  const panelRef = useRef(null);
  const previousFocusRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      // Store previously focused element
      previousFocusRef.current = document.activeElement;

      // Focus panel
      panelRef.current?.focus();

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

  return (
    <>
      <Overlay $isOpen={isOpen} onClick={handleOverlayClick} />
      <Panel
        ref={panelRef}
        $isOpen={isOpen}
        $side={side}
        $width={width}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'panel-title' : undefined}
        {...panelProps}
      >
        {(title || showCloseButton) && (
          <PanelHeader $align="center" $justify="space-between">
            {title && (
              <H4 id="panel-title" style={{ margin: 0 }}>
                {title}
              </H4>
            )}
            {showCloseButton && (
              <IconButton $variant="ghost" $size="sm" onClick={onClose} aria-label="Close panel">
                ×
              </IconButton>
            )}
          </PanelHeader>
        )}

        <PanelBody>{children}</PanelBody>
      </Panel>
    </>
  );
};

SidePanel.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func,
  title: PropTypes.string,
  children: PropTypes.node,
  side: PropTypes.oneOf(['left', 'right']),
  width: PropTypes.string,
  closeOnOverlay: PropTypes.bool,
  closeOnEscape: PropTypes.bool,
  showCloseButton: PropTypes.bool,
  panelProps: PropTypes.object,
};
