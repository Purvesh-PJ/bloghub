import * as RadixSelect from '@radix-ui/react-select';
import styled from 'styled-components';
import { Check, ChevronDown } from 'lucide-react';

/**
 * Select — Radix Select underneath.
 *
 * Radix owns typeahead, arrow-key navigation, collision-aware positioning, the listbox
 * ARIA relationships and touch behaviour. A native <select> cannot be styled to match the
 * rest of the interface; hand-rolling one correctly is a lot of accessibility work.
 */

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'auto')};
`;

const Label = styled.label`
  font-size: ${({ theme }) => theme.ui.base[0]};
  font-weight: ${({ theme }) => theme.weights.medium};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const Trigger = styled(RadixSelect.Trigger)`
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm};
  width: 100%;
  height: ${({ theme, $density }) => theme.density[$density].controlHeight};
  padding: 0 ${({ theme }) => theme.spacing.md};

  background: ${({ theme }) => theme.colors.surfaceRaised};
  border: 1px solid
    ${({ theme, $error }) => ($error ? theme.colors.dangerLine : theme.colors.lineDefault)};
  border-radius: ${({ theme }) => theme.radii.md};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: ${({ theme }) => theme.ui.md[0]};
  text-align: left;

  transition: border-color ${({ theme }) => theme.transitions.fast};

  &:hover:not(:disabled) {
    border-color: ${({ theme }) => theme.colors.lineStrong};
  }

  &[data-placeholder] {
    color: ${({ theme }) => theme.colors.textMuted};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Icon = styled(RadixSelect.Icon)`
  display: inline-flex;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const Content = styled(RadixSelect.Content)`
  overflow: hidden;
  min-width: var(--radix-select-trigger-width);
  max-height: var(--radix-select-content-available-height);
  background: ${({ theme }) => theme.colors.surfaceRaised};
  border: 1px solid ${({ theme }) => theme.colors.lineSubtle};
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: ${({ theme }) => theme.shadows.popover};
  z-index: ${({ theme }) => theme.zIndices.dropdown};
`;

const Viewport = styled(RadixSelect.Viewport)`
  padding: ${({ theme }) => theme.spacing.xs};
`;

const Item = styled(RadixSelect.Item)`
  position: relative;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  height: 32px;
  padding: 0 ${({ theme }) => theme.spacing.sm};
  padding-right: ${({ theme }) => theme.spacing.xl};

  font-size: ${({ theme }) => theme.ui.md[0]};
  color: ${({ theme }) => theme.colors.textPrimary};
  border-radius: ${({ theme }) => theme.radii.sm};
  cursor: pointer;
  user-select: none;
  outline: none;

  /* Radix sets data-highlighted for both pointer and keyboard, so one rule covers both. */
  &[data-highlighted] {
    background: ${({ theme }) => theme.colors.accentSubtle};
    color: ${({ theme }) => theme.colors.accentText};
  }

  &[data-disabled] {
    color: ${({ theme }) => theme.colors.textDisabled};
    pointer-events: none;
  }
`;

const ItemIndicator = styled(RadixSelect.ItemIndicator)`
  position: absolute;
  right: ${({ theme }) => theme.spacing.sm};
  display: inline-flex;
  color: ${({ theme }) => theme.colors.accentText};
`;

const ErrorText = styled.span`
  font-size: ${({ theme }) => theme.ui.sm[0]};
  color: ${({ theme }) => theme.colors.dangerText};
`;

/**
 * @param {Array<{value: string, label: string, disabled?: boolean}>} options
 */
export function Select({
  options = [],
  value,
  onValueChange,
  placeholder = 'Select…',
  label,
  error,
  disabled,
  fullWidth = true,
  density = 'comfortable',
  name,
}) {
  return (
    <Field $fullWidth={fullWidth}>
      {label && <Label>{label}</Label>}

      <RadixSelect.Root value={value} onValueChange={onValueChange} disabled={disabled} name={name}>
        <Trigger $density={density} $error={Boolean(error)} aria-label={label}>
          <RadixSelect.Value placeholder={placeholder} />
          <Icon>
            <ChevronDown size={16} />
          </Icon>
        </Trigger>

        <RadixSelect.Portal>
          <Content position="popper" sideOffset={4}>
            <Viewport>
              {options.map((option) => (
                <Item key={option.value} value={option.value} disabled={option.disabled}>
                  <RadixSelect.ItemText>{option.label}</RadixSelect.ItemText>
                  <ItemIndicator>
                    <Check size={14} />
                  </ItemIndicator>
                </Item>
              ))}
            </Viewport>
          </Content>
        </RadixSelect.Portal>
      </RadixSelect.Root>

      {error && <ErrorText>{error}</ErrorText>}
    </Field>
  );
}
