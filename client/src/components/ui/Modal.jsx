import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from './Dialog';

/**
 * Modal — High-level convenience wrapper built on top of standard shadcn/ui Dialog.
 * Keeps 100% backward compatibility with existing BlogHub modals across the app.
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
  const widthClass = typeof width === 'string' && width.startsWith('max-w-') 
    ? width 
    : undefined;
  const widthStyle = !widthClass && width ? { maxWidth: width } : undefined;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        style={widthStyle}
        showClose={showClose}
        className={widthClass}
        aria-describedby={description ? undefined : 'undefined'}
      >
        {title && (
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            {description && <DialogDescription>{description}</DialogDescription>}
          </DialogHeader>
        )}
        {children}
      </DialogContent>
    </Dialog>
  );
}

Modal.Footer = DialogFooter;
Modal.Trigger = DialogTrigger;
Modal.Close = DialogClose;
Modal.Content = DialogContent;
Modal.Title = DialogTitle;
Modal.Description = DialogDescription;
