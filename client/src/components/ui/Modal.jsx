import * as Dialog from '@radix-ui/react-dialog';
import styled, { keyframes } from 'styled-components';
import { X } from 'lucide-react';

/**
 * Modal — Radix Dialog underneath.
 *
 * Radix owns the behaviour: focus trap, focus restore on close, Escape to dismiss, scroll
 * lock, `aria-modal`, and the labelling relationship between title and content. We own only
 * how it looks.
 */

const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

const scaleIn = keyframes`
  from { opacity: 0; transform: translate(-50%, -48%) scale(0.97); }
  to   { opacity: 1; transform: translate(-50%, -50%) scale(1); }
`;

const Overlay = styled(Dialog.Overlay)`
  position: fixed;
  inset: 0;
  background: ${({ theme }) => theme.colors.surfaceOverlay};
  z-index: ${({ theme }) => theme.zIndices.overlay};
  animation: ${fadeIn} ${({ theme }) => theme.motion.base} ${({ theme }) => theme.motion.easing};
`;

const Content = styled(Dialog.Content)`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90vw;
  max-width: ${({ $width }) => $width};
  max-height: 85vh;
  overflow-y: auto;
  z-index: ${({ theme }) => theme.zIndices.modal};

  background: ${({ theme }) => theme.colors.surfaceRaised};
  border: 1px solid ${({ theme }) => theme.colors.lineSubtle};
  border-radius: ${({ theme }) => theme.radii.xl};
  box-shadow: ${({ theme }) => theme.shadows.overlay};
  padding: ${({ theme }) => theme.spacing.xl};

  animation: ${scaleIn} ${({ theme }) => theme.motion.base} ${({ theme }) => theme.motion.easing};

  &:focus {
    outline: none;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const Title = styled(Dialog.Title)`
  font-size: ${({ theme }) => theme.display.md[0]};
  line-height: ${({ theme }) => theme.display.md[1]};
  font-weight: ${({ theme }) => theme.weights.semibold};
  letter-spacing: ${({ theme }) => theme.tracking.tight};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const Description = styled(Dialog.Description)`
  margin-top: ${({ theme }) => theme.spacing.xs};
  font-size: ${({ theme }) => theme.ui.md[0]};
  line-height: ${({ theme }) => theme.ui.md[1]};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const CloseButton = styled(Dialog.Close)`
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  margin: -4px -4px 0 0;
  border-radius: ${({ theme }) => theme.radii.md};
  color: ${({ theme }) => theme.colors.textMuted};
  transition:
    background ${({ theme }) => theme.transitions.fast},
    color ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.surfaceHover};
    color: ${({ theme }) => theme.colors.textPrimary};
  }
`;

export function Modal({
  open,
  onOpenChange,
  title,
  description,
  children,
  width = '440px',
  showClose = true,
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Overlay />
        <Content $width={width} aria-describedby={description ? undefined : 'undefined'}>
          {title && (
            <Header>
              <div>
                <Title>{title}</Title>
                {description && <Description>{description}</Description>}
              </div>
              {showClose && (
                <CloseButton aria-label="Close">
                  <X size={18} />
                </CloseButton>
              )}
            </Header>
          )}
          {children}
        </Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

// Escape hatches for callers that need to drive the dialog directly.
Modal.Trigger = Dialog.Trigger;
Modal.Close = Dialog.Close;
