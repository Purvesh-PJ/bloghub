import * as React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

/**
 * Modal — Radix Dialog with Tailwind & shadcn styling.
 * Focus trap, aria-modal, smooth overlay backdrop blur, and accessible close button.
 */
export function Modal({
  open,
  onOpenChange,
  title,
  description,
  children,
  width = 'max-w-md',
  showClose = true,
}) {
  // Support numeric or pixel widths passed from styled legacy callers
  const widthClass = typeof width === 'string' && width.startsWith('max-w-') 
    ? width 
    : undefined;
  const widthStyle = !widthClass && width ? { maxWidth: width } : undefined;

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm animate-in fade-in-0 duration-200" />
        <Dialog.Content
          style={widthStyle}
          className={cn(
            'fixed left-1/2 top-1/2 z-50 w-[90vw] -translate-x-1/2 -translate-y-1/2 max-h-[85vh] overflow-y-auto',
            'rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 text-[hsl(var(--card-foreground))] shadow-2xl',
            'duration-200 animate-in fade-in-0 zoom-in-95',
            'focus:outline-none',
            widthClass || 'max-w-md'
          )}
          aria-describedby={description ? undefined : 'undefined'}
        >
          {title && (
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <Dialog.Title className="text-xl font-semibold tracking-tight text-[hsl(var(--foreground))]">
                  {title}
                </Dialog.Title>
                {description && (
                  <Dialog.Description className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">
                    {description}
                  </Dialog.Description>
                )}
              </div>
              {showClose && (
                <Dialog.Close
                  aria-label="Close"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[hsl(var(--muted-foreground))] transition-colors hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <X className="h-4 w-4" />
                </Dialog.Close>
              )}
            </div>
          )}
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function ModalFooter({ className, children, ...props }) {
  return (
    <div
      className={cn('flex items-center justify-end gap-2.5 mt-6', className)}
      {...props}
    >
      {children}
    </div>
  );
}

Modal.Footer = ModalFooter;
Modal.Trigger = Dialog.Trigger;
Modal.Close = Dialog.Close;
Modal.Content = Dialog.Content;
Modal.Title = Dialog.Title;
Modal.Description = Dialog.Description;
