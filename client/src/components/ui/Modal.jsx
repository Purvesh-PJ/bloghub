import { useEffect } from 'react';
import styled from 'styled-components';
import { X } from 'lucide-react';

const Overlay = styled.div`
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
  padding: 16px;
  backdrop-filter: blur(4px);
`;

const ModalContainer = styled.div`
  background: ${({ theme }) => theme.colors?.bgSecondary || '#ffffff'};
  border-radius: ${({ theme }) => theme.radii?.lg || '12px'};
  border: 1px solid ${({ theme }) => theme.colors?.border || '#e5e7eb'};
  width: 100%;
  max-width: ${({ $maxWidth }) => $maxWidth || '500px'};
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid ${({ theme }) => theme.colors?.border || '#e5e7eb'};
`;

const Title = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors?.textPrimary || '#111827'};
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

const Content = styled.div`
  padding: 20px;
`;

export function Modal({ isOpen, onClose, title, children, maxWidth = '500px' }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <Overlay onClick={onClose}>
      <ModalContainer $maxWidth={maxWidth} onClick={(e) => e.stopPropagation()}>
        {title && (
          <Header>
            <Title>{title}</Title>
            <CloseButton onClick={onClose} aria-label="Close modal">
              <X size={18} />
            </CloseButton>
          </Header>
        )}
        <Content>{children}</Content>
      </ModalContainer>
    </Overlay>
  );
}
