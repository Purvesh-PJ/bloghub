import { Select as RadixSelect } from '@radix-ui/themes';
import styled from 'styled-components';

const SelectWrapper = styled.div`
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

const ErrorText = styled.span`
  font-size: 12px;
  color: #ef4444;
`;

export function Select({
  label,
  error,
  options = [],
  placeholder = 'Select an option...',
  value,
  onChange,
  fullWidth = true,
  ...props
}) {
  return (
    <SelectWrapper $fullWidth={fullWidth}>
      {label && <Label>{label}</Label>}
      <RadixSelect.Root value={value} onValueChange={onChange} {...props}>
        <RadixSelect.Trigger placeholder={placeholder} style={{ width: '100%' }} />
        <RadixSelect.Content>
          {options.map((opt) => (
            <RadixSelect.Item key={opt.value || opt} value={opt.value || opt}>
              {opt.label || opt}
            </RadixSelect.Item>
          ))}
        </RadixSelect.Content>
      </RadixSelect.Root>
      {error && <ErrorText>{error}</ErrorText>}
    </SelectWrapper>
  );
}
