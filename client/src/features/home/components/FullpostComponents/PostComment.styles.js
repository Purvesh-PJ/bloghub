import styled, { css } from 'styled-components';
import { SendIcon } from '../../../../shared/icons';
import { pulse, slideIn } from '../../../../components/common/theme/animations';
import { Paper } from '../../../../components/ui/primitives';

export const ParentContainer = styled(Paper)`
  padding: ${({ theme }) => theme.spacing(6)};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(4)};
  animation: ${slideIn} 0.3s ease forwards;
`;

export const CommentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  h3 {
    font-size: ${({ theme }) => theme.typography.size.xl};
    font-weight: ${({ theme }) => theme.typography.weight.semibold};
    color: ${({ theme }) => theme.palette.text.primary};
    margin: 0;
  }
`;

export const LoginPrompt = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(2)};
  font-size: ${({ theme }) => theme.typography.size.sm};
  color: ${({ theme }) => theme.palette.warning.main};

  svg {
    font-size: ${({ theme }) => theme.typography.size.md};
  }
`;

export const EditorWrapper = styled.div`
  position: relative;
  border: ${({ theme }) => theme.borderWidth.thin} solid ${({ theme }) => theme.palette.grey[200]};
  border-radius: ${({ theme }) => theme.radii.lg};
  background-color: ${({ theme }) => theme.palette.background.surface};
  overflow: hidden;
  transition: border-color ${({ theme }) => theme.motion.duration.fast};

  &:focus-within {
    border-color: ${({ theme }) => theme.palette.text.secondary};
  }

  .error-message {
    margin: ${({ theme }) => theme.spacing(2)} ${({ theme }) => theme.spacing(3)};
    font-size: ${({ theme }) => theme.typography.size.sm};
    color: ${({ theme }) => theme.palette.error.main};
  }
`;

export const CommentEditor = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: ${({ theme }) => theme.spacing(4)};
  border: none;
  resize: vertical;
  font-family: inherit;
  font-size: ${({ theme }) => theme.typography.size.md};
  color: ${({ theme }) => theme.palette.text.primary};
  outline: none;

  &::placeholder {
    color: ${({ theme }) => theme.palette.text.muted};
  }

  &:disabled {
    background-color: ${({ theme }) => theme.palette.grey[50]};
    cursor: not-allowed;
  }
`;

export const CharacterCount = styled.div`
  text-align: right;
  padding: ${({ theme }) => theme.spacing(2)} ${({ theme }) => theme.spacing(3)};
  font-size: ${({ theme }) => theme.typography.size.sm};
  color: ${(props) =>
    props.$exceeds ? props.theme.palette.error.main : props.theme.palette.text.muted};
  border-top: ${({ theme }) => theme.borderWidth.thin} solid
    ${({ theme }) => theme.palette.grey[200]};
`;

export const PostButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export const SendMessageIcon = styled(SendIcon)`
  font-size: ${({ theme }) => theme.typography.size.lg};
  margin-left: ${({ theme }) => theme.spacing(2)};
`;

export const AnimatedButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 140px;
  padding: ${({ theme }) => theme.spacing(3)} ${({ theme }) => theme.spacing(6)};
  font-size: ${({ theme }) => theme.typography.size.md};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  color: ${({ theme }) => theme.palette.common.white};
  background-color: ${({ theme }) => theme.palette.primary.main};
  border: none;
  border-radius: ${({ theme }) => theme.radii.lg};
  cursor: pointer;
  transition: all ${({ theme }) => theme.motion.duration.fast};

  ${(props) =>
    props.$isLoading &&
    css`
      background-color: ${props.theme.palette.primary.light};
      animation: ${pulse} 1.5s infinite ease-in-out;
    `}

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.palette.primary.dark};
    transform: translateY(-2px);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    background-color: ${({ theme }) => theme.palette.grey[300]};
    cursor: not-allowed;
  }
`;
