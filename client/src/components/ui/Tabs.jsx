import * as React from 'react';
import * as RadixTabs from '@radix-ui/react-tabs';
import { cn } from '../../lib/utils';

/**
 * Tabs — Radix Tabs with Tailwind styling and clean accessibility.
 */
const Root = React.forwardRef(({ className, ...props }, ref) => (
  <RadixTabs.Root
    ref={ref}
    className={cn('flex flex-col gap-6', className)}
    {...props}
  />
));
Root.displayName = 'TabsRoot';

const List = React.forwardRef(({ className, ...props }, ref) => (
  <RadixTabs.List
    ref={ref}
    className={cn(
      'flex items-center gap-1 border-b border-[hsl(var(--border))] overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
      className
    )}
    {...props}
  />
));
List.displayName = 'TabsList';

const Trigger = React.forwardRef(({ className, ...props }, ref) => (
  <RadixTabs.Trigger
    ref={ref}
    className={cn(
      'relative shrink-0 px-4 py-3 text-sm font-medium text-[hsl(var(--muted-foreground))] whitespace-nowrap cursor-pointer select-none transition-colors duration-150',
      'hover:text-[hsl(var(--foreground))]',
      'data-[state=active]:text-[hsl(var(--foreground))] data-[state=active]:font-semibold',
      'after:content-[""] after:absolute after:bottom-[-1px] after:left-0 after:right-0 after:h-[2px] after:bg-transparent after:transition-colors',
      'data-[state=active]:after:bg-[hsl(var(--primary))]',
      'disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
      className
    )}
    {...props}
  />
));
Trigger.displayName = 'TabsTrigger';

const Content = React.forwardRef(({ className, ...props }, ref) => (
  <RadixTabs.Content
    ref={ref}
    className={cn('focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring', className)}
    {...props}
  />
));
Content.displayName = 'TabsContent';

export function Tabs({ tabs = [], value, defaultValue, onValueChange, ariaLabel = 'Tabs', className }) {
  return (
    <Root
      value={value}
      defaultValue={defaultValue ?? tabs[0]?.value}
      onValueChange={onValueChange}
      className={className}
    >
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
