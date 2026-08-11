import styled from 'styled-components';

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'auto')};
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors?.textPrimary || '#374151'};
`;

const StyledInput = styled.input`
  width: 100%;
  height: 40px;
  padding: 8px 12px;
  font-size: 14px;
  border-radius: ${({ theme }) => theme.radii?.md || '8px'};
  border: 1px solid
    ${({ $hasError, theme }) => ($hasError ? '#ef4444' : theme.colors?.border || '#d1d5db')};
  background: ${({ theme }) => theme.colors?.bgSecondary || '#ffffff'};
  color: ${({ theme }) => theme.colors?.textPrimary || '#111827'};
  outline: none;
  transition: border-color 0.2s ease-in-out;

  &:focus {
    border-color: ${({ $hasError, theme }) =>
      $hasError ? '#ef4444' : theme.colors?.accentPrimary || '#6366f1'};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors?.textMuted || '#9ca3af'};
  }

  &:disabled {
    background: ${({ theme }) => theme.colors?.bgDisabled || '#f3f4f6'};
    cursor: not-allowed;
  }
`;

const ErrorText = styled.span`
  font-size: 12px;
  color: #ef4444;
`;

export function Input({ label, error, fullWidth = true, id, ...props }) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <InputWrapper $fullWidth={fullWidth}>
      {label && <Label htmlFor={inputId}>{label}</Label>}
      <StyledInput id={inputId} $hasError={!!error} {...props} />
      {error && <ErrorText>{error}</ErrorText>}
    </InputWrapper>
  );
}
