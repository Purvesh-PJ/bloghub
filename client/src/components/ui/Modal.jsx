import { Dialog as RadixDialog } from '@radix-ui/themes';
import styled from 'styled-components';
import { X } from 'lucide-react';

const StyledContent = styled(RadixDialog.Content)`
  background: ${({ theme }) => theme.colors?.bgSecondary || '#ffffff'} !important;
  border-radius: ${({ theme }) => theme.radii?.lg || '12px'} !important;
  border: 1px solid ${({ theme }) => theme.colors?.border || '#e5e7eb'} !important;
  max-width: ${({ $maxWidth }) => $maxWidth || '500px'} !important;
  padding: 0 !important;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1) !important;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid ${({ theme }) => theme.colors?.border || '#e5e7eb'};
`;

const StyledTitle = styled(RadixDialog.Title)`
  margin: 0 !important;
  font-size: 18px !important;
  font-weight: 600 !important;
  color: ${({ theme }) => theme.colors?.textPrimary || '#111827'} !important;
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.colors?.textSecondary || '#6b7280'};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border-radius: 4px;

  &:hover {
    background: ${({ theme }) => theme.colors?.bgHover || '#f3f4f6'};
    color: ${({ theme }) => theme.colors?.textPrimary || '#111827'};
  }
`;

const Body = styled.div`
  padding: 20px;
`;

export function Modal({ isOpen, onClose, title, children, maxWidth = '500px' }) {
  return (
    <RadixDialog.Root open={isOpen} onOpenChange={(open) => !open && onClose?.()}>
      <StyledContent $maxWidth={maxWidth}>
        {title && (
          <Header>
            <StyledTitle>{title}</StyledTitle>
            <RadixDialog.Close>
              <CloseButton aria-label="Close modal">
                <X size={18} />
              </CloseButton>
            </RadixDialog.Close>
          </Header>
        )}
        <Body>{children}</Body>
      </StyledContent>
    </RadixDialog.Root>
  );
}
