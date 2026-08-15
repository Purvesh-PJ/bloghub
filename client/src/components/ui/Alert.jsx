import styled, { css } from 'styled-components';
import { AlertCircle, CheckCircle2, Info, AlertTriangle } from 'lucide-react';
import { text } from '../../styles/theme/mixins';

/**
 * Alert — an inline message.
 *
 * Was four hard-coded rgba/hex triples, so in dark mode it kept painting a pale wash with
 * dark text on it. Tonal container/text pairs from the theme now, matching Badge.
 */

const variants = {
  info: css`
    background: ${({ theme }) => theme.colors.infoContainer};
    color: ${({ theme }) => theme.colors.infoText};
  `,
  success: css`
    background: ${({ theme }) => theme.colors.successContainer};
    color: ${({ theme }) => theme.colors.successText};
  `,
  warning: css`
    background: ${({ theme }) => theme.colors.warningContainer};
    color: ${({ theme }) => theme.colors.warningText};
  `,
  danger: css`
    background: ${({ theme }) => theme.colors.dangerContainer};
    color: ${({ theme }) => theme.colors.dangerText};
  `,
};

const StyledAlert = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.radii.md};
  ${text('sm')}

  ${({ $variant }) => variants[$variant] || variants.info}

  svg {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
    margin-top: 1px;
  }
`;

const Title = styled.strong`
  display: block;
  ${text('sm', 'semibold')}
  margin-bottom: 2px;
`;

const icons = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  danger: AlertCircle,
};

export function Alert({ children, variant = 'info', title, ...props }) {
  // `error` was the old name for this variant; keep it working.
  const key = variant === 'error' ? 'danger' : variant;
  const Icon = icons[key] || Info;

  return (
    <StyledAlert $variant={key} role={key === 'danger' ? 'alert' : undefined} {...props}>
      <Icon />
      <div>
        {title && <Title>{title}</Title>}
        {children}
      </div>
    </StyledAlert>
  );
}
