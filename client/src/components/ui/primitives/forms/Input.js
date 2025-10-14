import styled, { css } from 'styled-components';

const base = css`
  width: 100%;
  height: ${(p) => p.theme.spacing(10)};
  padding: 0 ${(p) => p.theme.spacing(3)};
  border: ${(p) => p.theme.borderWidth.thin} solid ${(p) => p.theme.palette.divider};
  border-radius: ${(p) => p.theme.radii.lg};
  background: ${(p) => p.theme.palette.background.surface};
  color: ${(p) => p.theme.palette.text.primary};
  font-family: ${(p) => p.theme.typography.fontFamily.body};
  font-size: ${(p) => p.theme.typography.size.md};
  outline: none;
  transition:
    border-color ${(p) => p.theme.motion.duration.fast} ${(p) => p.theme.motion.easing.standard},
    box-shadow ${(p) => p.theme.motion.duration.fast} ${(p) => p.theme.motion.easing.standard},
    background ${(p) => p.theme.motion.duration.fast} ${(p) => p.theme.motion.easing.standard};

  &:hover:not(:focus) {
    border-color: ${(p) => p.theme.palette.grey[400]};
  }

  &:focus {
    border-color: ${(p) => p.theme.palette.primary.main};
    box-shadow: 0 0 0 3px
      ${(p) => (p.theme.mode === 'dark' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.15)')};
    background: ${(p) => p.theme.palette.background.surface};
  }

  &::placeholder {
    color: ${(p) => p.theme.palette.text.muted};
    opacity: 1;
  }

  &:disabled {
    background: ${(p) => p.theme.palette.background.subtle};
    color: ${(p) => p.theme.palette.text.muted};
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

export const Input = styled.input`
  ${base}
`;

export const TextArea = styled.textarea`
  ${base}
  height: auto;
  min-height: ${(p) => p.theme.spacing(25)};
  padding: ${(p) => p.theme.spacing(2.5)} ${(p) => p.theme.spacing(3)};
  resize: vertical;
`;

export const Select = styled.select`
  ${base}
`;

export const FieldLabel = styled.label`
  display: inline-block;
  margin-bottom: ${(p) => p.theme.spacing(2)};
  color: ${(p) => p.theme.palette.text.primary};
  font-weight: ${(p) => p.theme.typography.weight.medium};
  font-size: ${(p) => p.theme.typography.size.sm};
  line-height: ${(p) => p.theme.typography.lineHeight.normal};
`;

export const FieldError = styled.div`
  margin-top: ${(p) => p.theme.spacing(2)};
  color: ${(p) => p.theme.palette.error.main};
  font-size: ${(p) => p.theme.typography.size.sm};
  display: flex;
  align-items: center;
  gap: ${(p) => p.theme.spacing(1)};
  animation: slideDown ${(p) => p.theme.motion.duration.normal}
    ${(p) => p.theme.motion.easing.standard};

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-4px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
