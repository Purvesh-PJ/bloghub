import * as React from 'react';
import * as RadixDropdown from '@radix-ui/react-dropdown-menu';
import { cn } from '../../lib/utils';

/**
 * DropdownMenu — Radix DropdownMenu with shadcn/ui Tailwind styling.
 */
const DropdownMenuContent = React.forwardRef(
  ({ className, align = 'end', side = 'bottom', sideOffset = 6, children, ...props }, ref) => (
    <RadixDropdown.Portal>
      <RadixDropdown.Content
        ref={ref}
        align={align}
        side={side}
        sideOffset={sideOffset}
        collisionPadding={8}
        className={cn(
          'z-50 min-w-[200px] overflow-hidden rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-1 text-[hsl(var(--card-foreground))] shadow-lg backdrop-blur-md',
          'animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2',
          className
        )}
        {...props}
      >
        {children}
      </RadixDropdown.Content>
    </RadixDropdown.Portal>
  )
);
DropdownMenuContent.displayName = 'DropdownMenuContent';

const DropdownMenuItem = React.forwardRef(
  ({ className, tone, $tone, ...props }, ref) => {
    const finalTone = tone || $tone;
    const isDanger = finalTone === 'danger';

    return (
      <RadixDropdown.Item
        ref={ref}
        className={cn(
          'relative flex h-[34px] cursor-pointer select-none items-center gap-2 rounded-lg px-2.5 text-sm outline-none transition-colors duration-100',
          'focus:bg-[hsl(var(--muted))] focus:text-[hsl(var(--foreground))]',
          'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
          '[&_svg]:shrink-0 [&_svg]:text-[hsl(var(--muted-foreground))]',
          isDanger
            ? 'text-[hsl(var(--destructive))] focus:bg-[hsl(var(--destructive))]/10 focus:text-[hsl(var(--destructive))] [&_svg]:text-[hsl(var(--destructive))]'
            : 'text-[hsl(var(--foreground))]',
          className
        )}
        {...props}
      />
    );
  }
);
DropdownMenuItem.displayName = 'DropdownMenuItem';

const DropdownMenuLabel = React.forwardRef(({ className, ...props }, ref) => (
  <RadixDropdown.Label
    ref={ref}
    className={cn(
      'px-2.5 pt-2 pb-1 text-[11px] font-semibold tracking-wider uppercase text-[hsl(var(--muted-foreground))] select-none',
      className
    )}
    {...props}
  />
));
DropdownMenuLabel.displayName = 'DropdownMenuLabel';

const DropdownMenuSeparator = React.forwardRef(({ className, ...props }, ref) => (
  <RadixDropdown.Separator
    ref={ref}
    className={cn('-mx-1 my-1 h-px bg-[hsl(var(--border))]', className)}
    {...props}
  />
));
DropdownMenuSeparator.displayName = 'DropdownMenuSeparator';

export function DropdownMenu({
  trigger,
  children,
  align = 'end',
  side = 'bottom',
  sideOffset = 6,
}) {
  return (
    <RadixDropdown.Root>
      <RadixDropdown.Trigger asChild>{trigger}</RadixDropdown.Trigger>
      <DropdownMenuContent align={align} side={side} sideOffset={sideOffset}>
        {children}
      </DropdownMenuContent>
    </RadixDropdown.Root>
  );
}

DropdownMenu.Content = DropdownMenuContent;
DropdownMenu.Item = DropdownMenuItem;
DropdownMenu.Label = DropdownMenuLabel;
DropdownMenu.Separator = DropdownMenuSeparator;
DropdownMenu.Root = RadixDropdown.Root;
DropdownMenu.Trigger = RadixDropdown.Trigger;
DropdownMenu.Portal = RadixDropdown.Portal;
