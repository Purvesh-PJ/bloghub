import styled, { css } from 'styled-components';
import { AlertCircle, CheckCircle2, Info, AlertTriangle } from 'lucide-react';

const alertVariantStyles = {
  info: css`
    background: rgba(14, 165, 233, 0.1);
    border: 1px solid rgba(14, 165, 233, 0.3);
    color: #0369a1;
  `,
  success: css`
    background: rgba(34, 197, 94, 0.1);
    border: 1px solid rgba(34, 197, 94, 0.3);
    color: #15803d;
  `,
  warning: css`
    background: rgba(245, 158, 11, 0.1);
    border: 1px solid rgba(245, 158, 11, 0.3);
    color: #b45309;
  `,
  error: css`
    background: rgba(239, 68, 68, 0.1);
    border: 1px solid rgba(239, 68, 68, 0.3);
    color: #b91c1c;
  `,
};

const StyledAlert = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 16px;
  border-radius: ${({ theme }) => theme.radii?.md || '8px'};
  font-size: 14px;
  line-height: 1.5;

  ${({ $variant }) => alertVariantStyles[$variant] || alertVariantStyles.info}

  svg {
    flex-shrink: 0;
    margin-top: 2px;
  }
`;

const IconMap = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  error: AlertCircle,
};

export function Alert({ children, variant = 'info', title, ...props }) {
  const IconComponent = IconMap[variant] || Info;

  return (
    <StyledAlert $variant={variant} {...props}>
      <IconComponent size={18} />
      <div>
        {title && <strong style={{ display: 'block', marginBottom: 2 }}>{title}</strong>}
        {children}
      </div>
    </StyledAlert>
  );
}
