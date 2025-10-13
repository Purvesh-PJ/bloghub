import React from 'react';
import styled from 'styled-components';
import { Card, Flex, IconButton, H3 } from '../../../components/ui/primitives';
import { X } from 'lucide-react';

const DialogOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const DialogContent = styled(Card)`
  max-width: ${(props) => props.$maxWidth || '500px'};
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
`;

const DialogHeader = styled(Flex)`
  justify-content: space-between;
  align-items: center;
  padding: ${(p) => p.theme.spacing(4)};
  border-bottom: 1px solid ${(p) => p.theme.palette.divider};
`;

const DialogBody = styled.div`
  padding: ${(p) => p.theme.spacing(4)};
`;

const DialogFooter = styled(Flex)`
  justify-content: flex-end;
  gap: ${(p) => p.theme.spacing(2)};
  padding: ${(p) => p.theme.spacing(4)};
  border-top: 1px solid ${(p) => p.theme.palette.divider};
`;

const Dialog = ({ open, onClose, title, children, actions, maxWidth = '500px', ...props }) => {
  if (!open) return null;

  return (
    <DialogOverlay onClick={onClose}>
      <DialogContent $maxWidth={maxWidth} onClick={(e) => e.stopPropagation()} {...props}>
        {title && (
          <DialogHeader>
            <H3>{title}</H3>
            {onClose && (
              <IconButton onClick={onClose} $size="sm">
                <X size={16} />
              </IconButton>
            )}
          </DialogHeader>
        )}
        <DialogBody>{children}</DialogBody>
        {actions && <DialogFooter>{actions}</DialogFooter>}
      </DialogContent>
    </DialogOverlay>
  );
};

export default Dialog;
