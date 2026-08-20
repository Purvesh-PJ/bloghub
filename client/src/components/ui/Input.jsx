import { useId } from 'react';
import styled, { css } from 'styled-components';
import { text, label as labelStyle, interactive } from '../../styles/theme/mixins';

/**
 * Input and TextArea.
 *
 * Fields sit on a container tone with no border — the tone itself defines the field. A ring
 * appears on focus. This is the soft, borderless form language of the reference sites.
 */

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'auto')};
`;

const Label = styled.label`
  ${text('sm', 'medium')}
  color: ${({ theme }) => theme.colors.textSecondary};
  padding-left: ${({ theme }) => theme.spacing.xs};
`;

const controlBase = css`
  width: 100%;
  background: ${({ theme }) => theme.colors.surfaceContainer};
  color: ${({ theme }) => theme.colors.textPrimary};
  border: none;
  ${text('md')}
  ${interactive}

  /* Crisp border and smooth transition */
  box-shadow: inset 0 0 0 1px ${({ theme }) => theme.colors.lineDefault};

  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
  }

  &:hover:not(:disabled):not(:focus) {
    background: ${({ theme }) => theme.colors.surfaceContainerLow};
    box-shadow: inset 0 0 0 1px ${({ theme }) => theme.colors.lineStrong};
  }

  &:focus {
    outline: none;
    background: ${({ theme }) => theme.colors.surfaceElevated};
    box-shadow:
      inset 0 0 0 1.5px ${({ theme }) => theme.colors.accentSolid},
      0 0 0 3px rgba(14, 165, 233, 0.2);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  ${({ $error, theme }) =>
    $error &&
    css`
      box-shadow: inset 0 0 0 1.5px ${theme.colors.dangerLine};

      &:focus {
        box-shadow:
          inset 0 0 0 1.5px ${theme.colors.dangerSolid},
          0 0 0 3px rgba(239, 68, 68, 0.2);
      }
    `}
`;

const StyledInput = styled.input`
  ${controlBase}
  height: 48px;
  padding: 0 ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.radii.md};

  /* Room for a leading icon when one is present. */
  ${({ $hasIcon, theme }) =>
    $hasIcon &&
    css`
      padding-left: ${theme.spacing['3xl']};
    `}
`;

const StyledTextArea = styled.textarea`
  ${controlBase}
  min-height: 120px;
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.radii.md};
  resize: vertical;
  line-height: 1.6;
`;

const ControlWrap = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const LeadingIcon = styled.span`
  position: absolute;
  left: ${({ theme }) => theme.spacing.lg};
  display: inline-flex;
  pointer-events: none;
  color: ${({ theme }) => theme.colors.textMuted};

  svg {
    width: 18px;
    height: 18px;
  }
`;

const Message = styled.span`
  ${text('sm')}
  padding-left: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme, $error }) => ($error ? theme.colors.dangerText : theme.colors.textMuted)};
`;

/**
 * A label is only a label if it points at the field.
 *
 * `id ?? props.name` left `inputId` undefined whenever a caller passed neither — which is
 * seventeen fields across Settings, the editor and the admin console, every password box
 * among them. `htmlFor={undefined}` renders no `for` attribute at all, so the visible text
 * sat beside a control that assistive technology announced as unlabelled, and clicking the
 * label did not focus the field. `useId` gives every instance a stable fallback.
 */
export function Input({ label, error, hint, icon, fullWidth = true, id, ...props }) {
  const generatedId = useId();
  const inputId = id ?? props.name ?? generatedId;
  const messageId = error || hint ? `${inputId}-message` : undefined;

  return (
    <Field $fullWidth={fullWidth}>
      {label && <Label htmlFor={inputId}>{label}</Label>}
      <ControlWrap>
        {icon && <LeadingIcon>{icon}</LeadingIcon>}
        <StyledInput
          id={inputId}
          $error={Boolean(error)}
          $hasIcon={Boolean(icon)}
          aria-invalid={Boolean(error) || undefined}
          // Announced with the field, so an error or a format hint is not left to sighted
          // readers only.
          aria-describedby={messageId}
          {...props}
        />
      </ControlWrap>
      {(error || hint) && (
        <Message id={messageId} $error={Boolean(error)}>
          {error || hint}
        </Message>
      )}
    </Field>
  );
}

export function TextArea({ label, error, hint, fullWidth = true, id, ...props }) {
  const generatedId = useId();
  const inputId = id ?? props.name ?? generatedId;
  const messageId = error || hint ? `${inputId}-message` : undefined;

  return (
    <Field $fullWidth={fullWidth}>
      {label && <Label htmlFor={inputId}>{label}</Label>}
      <StyledTextArea
        id={inputId}
        $error={Boolean(error)}
        aria-invalid={Boolean(error) || undefined}
        aria-describedby={messageId}
        {...props}
      />
      {(error || hint) && (
        <Message id={messageId} $error={Boolean(error)}>
          {error || hint}
        </Message>
      )}
    </Field>
  );
}

/** Uppercase eyebrow used above section titles and stat values. */
export const Eyebrow = styled.span`
  ${labelStyle('md')}
  color: ${({ theme }) => theme.colors.textMuted};
`;
