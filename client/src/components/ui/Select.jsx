import * as React from 'react';
import * as RadixSelect from '@radix-ui/react-select';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';

/**
 * Select — Radix Select underneath with Tailwind & shadcn/ui styling.
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
  className,
}) {
  return (
    <div className={cn('flex flex-col gap-1.5', fullWidth ? 'w-full' : 'w-auto')}>
      {label && (
        <label className="text-sm font-medium text-muted-foreground pl-0.5 select-none">
          {label}
        </label>
      )}

      <RadixSelect.Root value={value} onValueChange={onValueChange} disabled={disabled} name={name}>
        <RadixSelect.Trigger
          aria-label={label}
          className={cn(
            'inline-flex items-center justify-between gap-2 w-full rounded-xl border px-3.5 text-sm transition-colors duration-150',
            'bg-card text-foreground',
            'hover:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'data-[placeholder]:text-muted-foreground',
            density === 'compact' ? 'h-9' : 'h-10',
            error
              ? 'border-destructive focus-visible:ring-destructive'
              : 'border-border',
            className
          )}
        >
          <RadixSelect.Value placeholder={placeholder} />
          <RadixSelect.Icon className="inline-flex shrink-0 text-muted-foreground">
            <ChevronDown className="h-4 w-4" />
          </RadixSelect.Icon>
        </RadixSelect.Trigger>

        <RadixSelect.Portal>
          <RadixSelect.Content
            position="popper"
            sideOffset={4}
            className="z-50 min-w-[var(--radix-select-trigger-width)] max-h-[var(--radix-select-content-available-height)] overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-xl animate-in fade-in-0 zoom-in-95"
          >
            <RadixSelect.Viewport className="p-1">
              {options.map((option) => (
                <RadixSelect.Item
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                  className={cn(
                    'relative flex h-8.5 items-center gap-2 rounded-lg px-2.5 pr-8 text-sm cursor-pointer select-none outline-none transition-colors duration-100',
                    'focus:bg-primary/10 focus:text-primary',
                    'data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
                  )}
                >
                  <RadixSelect.ItemText>{option.label}</RadixSelect.ItemText>
                  <RadixSelect.ItemIndicator className="absolute right-2.5 inline-flex items-center text-primary">
                    <Check className="h-4 w-4" />
                  </RadixSelect.ItemIndicator>
                </RadixSelect.Item>
              ))}
            </RadixSelect.Viewport>
          </RadixSelect.Content>
        </RadixSelect.Portal>
      </RadixSelect.Root>

      {error && <span className="text-xs text-destructive pl-0.5">{error}</span>}
    </div>
  );
}
