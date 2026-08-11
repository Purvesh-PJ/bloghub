import styled, { css } from 'styled-components';

const badgeVariantStyles = {
  primary: css`
    background: rgba(99, 102, 241, 0.1);
    color: #6366f1;
  `,
  success: css`
    background: rgba(34, 197, 94, 0.1);
    color: #16a34a;
  `,
  warning: css`
    background: rgba(245, 158, 11, 0.1);
    color: #d97706;
  `,
  danger: css`
    background: rgba(239, 68, 68, 0.1);
    color: #dc2626;
  `,
  info: css`
    background: rgba(14, 165, 233, 0.1);
    color: #0284c7;
  `,
};

const StyledBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  font-size: 12px;
  font-weight: 500;
  border-radius: 9999px;
  white-space: nowrap;

  ${({ $variant }) => badgeVariantStyles[$variant] || badgeVariantStyles.primary}
`;

export function Badge({ children, variant = 'primary', ...props }) {
  return (
    <StyledBadge $variant={variant} {...props}>
      {children}
    </StyledBadge>
  );
}
