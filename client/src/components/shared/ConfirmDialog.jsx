import { Modal, Button } from '../ui';

/**
 * ConfirmDialog — reusable confirmation modal with consistent visual hierarchy and accessible focus management.
 */
export function ConfirmDialog({
  open = false,
  onOpenChange,
  onClose,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmVariant = 'danger',
  onConfirm,
  loading = false,
  isLoading = false,
  confirmDisabled = false,
  children,
  width = 'max-w-md',
}) {
  const isBusy = loading || isLoading;
  const handleOpenChange =
    onOpenChange ||
    ((isOpen) => {
      if (!isOpen && onClose) onClose();
    });

  return (
    <Modal
      open={open}
      onOpenChange={handleOpenChange}
      title={title}
      description={description}
      width={width}
    >
      {children}
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => {
            if (onClose) onClose();
            else if (onOpenChange) onOpenChange(false);
          }}
          disabled={isBusy}
        >
          {cancelText}
        </Button>
        <Button variant={confirmVariant} onClick={onConfirm} disabled={confirmDisabled || isBusy}>
          {isBusy ? 'Processing…' : confirmText}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
