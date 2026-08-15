import * as RadixTabs from '@radix-ui/react-tabs';
import styled from 'styled-components';

/**
 * Tabs — Radix Tabs underneath.
 *
 * Radix owns the roving tabindex, arrow-key navigation, Home/End, and the
 * tab ↔ tabpanel ARIA wiring.
 */

const Root = styled(RadixTabs.Root)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};
`;

const List = styled(RadixTabs.List)`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
  border-bottom: 1px solid ${({ theme }) => theme.colors.lineSubtle};
  overflow-x: auto;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const Trigger = styled(RadixTabs.Trigger)`
  position: relative;
  flex-shrink: 0;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.md};

  font-size: ${({ theme }) => theme.ui.md[0]};
  font-weight: ${({ theme }) => theme.weights.medium};
  color: ${({ theme }) => theme.colors.textSecondary};
  white-space: nowrap;

  transition: color ${({ theme }) => theme.transitions.fast};

  /* The indicator is a pseudo-element so switching tabs never shifts layout. */
  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: -1px;
    height: 2px;
    background: transparent;
    transition: background ${({ theme }) => theme.transitions.fast};
  }

  &:hover {
    color: ${({ theme }) => theme.colors.textPrimary};
  }

  &[data-state='active'] {
    color: ${({ theme }) => theme.colors.textPrimary};
    font-weight: ${({ theme }) => theme.weights.semibold};
  }

  &[data-state='active']::after {
    background: ${({ theme }) => theme.colors.accentSolid};
  }

  &[data-disabled] {
    color: ${({ theme }) => theme.colors.textDisabled};
    pointer-events: none;
  }
`;

const Content = styled(RadixTabs.Content)`
  &:focus {
    outline: none;
  }
`;

/**
 * @param {Array<{value: string, label: string, content: React.ReactNode, disabled?: boolean}>} tabs
 */
export function Tabs({ tabs = [], value, defaultValue, onValueChange, ariaLabel = 'Tabs' }) {
  return (
    <Root value={value} defaultValue={defaultValue ?? tabs[0]?.value} onValueChange={onValueChange}>
      <List aria-label={ariaLabel}>
        {tabs.map((tab) => (
          <Trigger key={tab.value} value={tab.value} disabled={tab.disabled}>
            {tab.label}
          </Trigger>
        ))}
      </List>

      {tabs.map((tab) => (
        <Content key={tab.value} value={tab.value}>
          {tab.content}
        </Content>
      ))}
    </Root>
  );
}

Tabs.Root = Root;
Tabs.List = List;
Tabs.Trigger = Trigger;
Tabs.Content = Content;
