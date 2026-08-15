import * as RadixDropdown from '@radix-ui/react-dropdown-menu';
import styled, { keyframes, css } from 'styled-components';

/**
 * DropdownMenu — Radix DropdownMenu underneath.
 *
 * Replaces the hand-rolled menus in Header and MyPosts, which listened for `mousedown` to
 * close and handled nothing else — no Escape, no arrow-key navigation, no focus return to
 * the trigger, no `aria-expanded`, no collision detection near a viewport edge.
 *
 * Usage:
 *   <DropdownMenu trigger={<button>Menu</button>}>
 *     <DropdownMenu.Item onSelect={…}>Profile</DropdownMenu.Item>
 *     <DropdownMenu.Separator />
 *     <DropdownMenu.Item $tone="danger" onSelect={…}>Sign out</DropdownMenu.Item>
 *   </DropdownMenu>
 */

const slideIn = keyframes`
  from { opacity: 0; transform: translateY(-4px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const Content = styled(RadixDropdown.Content)`
  min-width: 200px;
  padding: ${({ theme }) => theme.spacing.xs};

  background: ${({ theme }) => theme.colors.surfaceRaised};
  border: 1px solid ${({ theme }) => theme.colors.lineSubtle};
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: ${({ theme }) => theme.shadows.popover};
  z-index: ${({ theme }) => theme.zIndices.dropdown};

  animation: ${slideIn} ${({ theme }) => theme.motion.fast} ${({ theme }) => theme.motion.easingOut};
`;

const itemBase = css`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  height: 34px;
  padding: 0 ${({ theme }) => theme.spacing.sm};

  font-size: ${({ theme }) => theme.ui.md[0]};
  color: ${({ theme }) => theme.colors.textPrimary};
  border-radius: ${({ theme }) => theme.radii.sm};
  cursor: pointer;
  user-select: none;
  outline: none;

  &[data-highlighted] {
    background: ${({ theme }) => theme.colors.surfaceHover};
  }

  &[data-disabled] {
    color: ${({ theme }) => theme.colors.textDisabled};
    pointer-events: none;
  }

  svg {
    flex-shrink: 0;
    color: ${({ theme }) => theme.colors.textMuted};
  }
`;

const Item = styled(RadixDropdown.Item)`
  ${itemBase}

  ${({ $tone, theme }) =>
    $tone === 'danger' &&
    css`
      color: ${theme.colors.dangerText};

      svg {
        color: ${theme.colors.dangerText};
      }

      &[data-highlighted] {
        background: ${theme.colors.dangerBgSubtle};
      }
    `}
`;

const Label = styled(RadixDropdown.Label)`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.sm}
    ${({ theme }) => theme.spacing.xs};
  font-size: ${({ theme }) => theme.ui.xs[0]};
  font-weight: ${({ theme }) => theme.weights.semibold};
  letter-spacing: ${({ theme }) => theme.tracking.caps};
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const Separator = styled(RadixDropdown.Separator)`
  height: 1px;
  margin: ${({ theme }) => theme.spacing.xs} calc(-1 * ${({ theme }) => theme.spacing.xs});
  background: ${({ theme }) => theme.colors.lineSubtle};
`;

export function DropdownMenu({
  trigger,
  children,
  align = 'end',
  side = 'bottom',
  sideOffset = 6,
}) {
  return (
    <RadixDropdown.Root>
      {/* asChild keeps the caller's element as the trigger instead of nesting a button. */}
      <RadixDropdown.Trigger asChild>{trigger}</RadixDropdown.Trigger>
      <RadixDropdown.Portal>
        <Content align={align} side={side} sideOffset={sideOffset} collisionPadding={8}>
          {children}
        </Content>
      </RadixDropdown.Portal>
    </RadixDropdown.Root>
  );
}

DropdownMenu.Item = Item;
DropdownMenu.Label = Label;
DropdownMenu.Separator = Separator;
