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
        <label className="text-sm font-medium text-[hsl(var(--muted-foreground))] pl-0.5 select-none">
          {label}
        </label>
      )}

      <RadixSelect.Root value={value} onValueChange={onValueChange} disabled={disabled} name={name}>
        <RadixSelect.Trigger
          aria-label={label}
          className={cn(
            'inline-flex items-center justify-between gap-2 w-full rounded-xl border px-3.5 text-sm transition-colors duration-150',
            'bg-[hsl(var(--card))] text-[hsl(var(--foreground))]',
            'hover:border-[hsl(var(--ring))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'data-[placeholder]:text-[hsl(var(--muted-foreground))]',
            density === 'compact' ? 'h-9' : 'h-10',
            error
              ? 'border-[hsl(var(--destructive))] focus-visible:ring-[hsl(var(--destructive))]'
              : 'border-[hsl(var(--border))]',
            className
          )}
        >
          <RadixSelect.Value placeholder={placeholder} />
          <RadixSelect.Icon className="inline-flex shrink-0 text-[hsl(var(--muted-foreground))]">
            <ChevronDown className="h-4 w-4" />
          </RadixSelect.Icon>
        </RadixSelect.Trigger>

        <RadixSelect.Portal>
          <RadixSelect.Content
            position="popper"
            sideOffset={4}
            className="z-50 min-w-[var(--radix-select-trigger-width)] max-h-[var(--radix-select-content-available-height)] overflow-hidden rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] shadow-xl animate-in fade-in-0 zoom-in-95"
          >
            <RadixSelect.Viewport className="p-1">
              {options.map((option) => (
                <RadixSelect.Item
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                  className={cn(
                    'relative flex h-8.5 items-center gap-2 rounded-lg px-2.5 pr-8 text-sm cursor-pointer select-none outline-none transition-colors duration-100',
                    'focus:bg-[hsl(var(--primary))/0.10] focus:text-[hsl(var(--primary))]',
                    'data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
                  )}
                >
                  <RadixSelect.ItemText>{option.label}</RadixSelect.ItemText>
                  <RadixSelect.ItemIndicator className="absolute right-2.5 inline-flex items-center text-[hsl(var(--primary))]">
                    <Check className="h-4 w-4" />
                  </RadixSelect.ItemIndicator>
                </RadixSelect.Item>
              ))}
            </RadixSelect.Viewport>
          </RadixSelect.Content>
        </RadixSelect.Portal>
      </RadixSelect.Root>

      {error && <span className="text-xs text-[hsl(var(--destructive))] pl-0.5">{error}</span>}
    </div>
  );
}
