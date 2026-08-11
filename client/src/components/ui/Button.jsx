import styled, { css } from 'styled-components';

const variantStyles = {
  primary: css`
    background: ${({ theme }) => theme.colors.accentPrimary || theme.colors.primary || '#6366f1'};
    color: #ffffff;
    border: 1px solid transparent;

    &:hover:not(:disabled) {
      opacity: 0.9;
      transform: translateY(-1px);
    }
  `,
  secondary: css`
    background: ${({ theme }) => theme.colors.bgSecondary || '#f3f4f6'};
    color: ${({ theme }) => theme.colors.textPrimary || '#111827'};
    border: 1px solid ${({ theme }) => theme.colors.border || '#e5e7eb'};

    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.bgHover || '#e5e7eb'};
    }
  `,
  outline: css`
    background: transparent;
    color: ${({ theme }) => theme.colors.textPrimary || '#111827'};
    border: 1px solid ${({ theme }) => theme.colors.border || '#d1d5db'};

    &:hover:not(:disabled) {
      border-color: ${({ theme }) => theme.colors.textPrimary || '#111827'};
    }
  `,
  ghost: css`
    background: transparent;
    color: ${({ theme }) => theme.colors.textSecondary || '#4b5563'};
    border: 1px solid transparent;

    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.bgHover || '#f3f4f6'};
      color: ${({ theme }) => theme.colors.textPrimary || '#111827'};
    }
  `,
  danger: css`
    background: #ef4444;
    color: #ffffff;
    border: 1px solid transparent;

    &:hover:not(:disabled) {
      background: #dc2626;
    }
  `,
};

const sizeStyles = {
  sm: css`
    padding: 6px 12px;
    font-size: 13px;
    height: 32px;
  `,
  md: css`
    padding: 8px 16px;
    font-size: 14px;
    height: 40px;
  `,
  lg: css`
    padding: 12px 24px;
    font-size: 16px;
    height: 48px;
  `,
};

const StyledButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-weight: 500;
  border-radius: ${({ theme }) => theme.radii?.md || '8px'};
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  white-space: nowrap;
  user-select: none;
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'auto')};

  ${({ $variant }) => variantStyles[$variant] || variantStyles.primary}
  ${({ $size }) => sizeStyles[$size] || sizeStyles.md}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  disabled,
  ...props
}) {
  return (
    <StyledButton
      $variant={variant}
      $size={size}
      $fullWidth={fullWidth}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? 'Loading...' : children}
    </StyledButton>
  );
}
