import styled from 'styled-components';

const TextAreaWrapper = styled.div`
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

const StyledTextArea = styled.textarea`
  width: 100%;
  min-height: ${({ $rows }) => ($rows ? `${$rows * 24}px` : '100px')};
  padding: 10px 12px;
  font-size: 14px;
  font-family: inherit;
  border-radius: ${({ theme }) => theme.radii?.md || '8px'};
  border: 1px solid
    ${({ $hasError, theme }) => ($hasError ? '#ef4444' : theme.colors?.border || '#d1d5db')};
  background: ${({ theme }) => theme.colors?.bgSecondary || '#ffffff'};
  color: ${({ theme }) => theme.colors?.textPrimary || '#111827'};
  outline: none;
  resize: vertical;
  transition: border-color 0.2s ease-in-out;

  &:focus {
    border-color: ${({ $hasError, theme }) =>
      $hasError ? '#ef4444' : theme.colors?.accentPrimary || '#6366f1'};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors?.textMuted || '#9ca3af'};
  }
`;

const ErrorText = styled.span`
  font-size: 12px;
  color: #ef4444;
`;

export function TextArea({ label, error, fullWidth = true, rows = 4, id, ...props }) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <TextAreaWrapper $fullWidth={fullWidth}>
      {label && <Label htmlFor={inputId}>{label}</Label>}
      <StyledTextArea id={inputId} $hasError={!!error} $rows={rows} {...props} />
      {error && <ErrorText>{error}</ErrorText>}
    </TextAreaWrapper>
  );
}
