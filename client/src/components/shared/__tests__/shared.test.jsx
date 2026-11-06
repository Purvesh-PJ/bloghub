import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../../../test/render';
import { ConfirmDialog } from '../ConfirmDialog';
import { BulkActionBar } from '../BulkActionBar';
import { Switch } from '../../ui/Switch';

describe('Shared Components & Primitives', () => {
  describe('Switch Component', () => {
    it('renders label and handles toggle change', () => {
      const handleChange = vi.fn();
      renderWithProviders(
        <Switch
          label="Email Alerts"
          note="Receive weekly summaries"
          checked={false}
          onChange={handleChange}
        />
      );

      expect(screen.getByText('Email Alerts')).toBeInTheDocument();
      expect(screen.getByText('Receive weekly summaries')).toBeInTheDocument();

      const checkbox = screen.getByRole('checkbox', { name: 'Email Alerts' });
      expect(checkbox).not.toBeChecked();

      fireEvent.click(checkbox);
      expect(handleChange).toHaveBeenCalledWith(true);
    });
  });

  describe('ConfirmDialog Component', () => {
    it('renders title, description and handles confirm / cancel callbacks', () => {
      const handleConfirm = vi.fn();
      const handleClose = vi.fn();

      renderWithProviders(
        <ConfirmDialog
          open={true}
          title="Delete Story"
          description="Are you sure you want to delete this story?"
          confirmText="Yes, delete"
          cancelText="No, keep"
          onConfirm={handleConfirm}
          onClose={handleClose}
        />
      );

      expect(screen.getByText('Delete Story')).toBeInTheDocument();
      expect(screen.getByText('Are you sure you want to delete this story?')).toBeInTheDocument();

      fireEvent.click(screen.getByRole('button', { name: 'No, keep' }));
      expect(handleClose).toHaveBeenCalledTimes(1);

      fireEvent.click(screen.getByRole('button', { name: 'Yes, delete' }));
      expect(handleConfirm).toHaveBeenCalledTimes(1);
    });
  });

  describe('BulkActionBar Component', () => {
    it('renders selected count and handles action buttons and clear', () => {
      const handlePublish = vi.fn();
      const handleClear = vi.fn();

      renderWithProviders(
        <BulkActionBar
          selectedCount={3}
          onClear={handleClear}
          actions={[{ label: 'Publish', onClick: handlePublish }]}
        />
      );

      expect(screen.getByText('3 selected')).toBeInTheDocument();

      fireEvent.click(screen.getByRole('button', { name: 'Publish' }));
      expect(handlePublish).toHaveBeenCalledTimes(1);

      fireEvent.click(screen.getByRole('button', { name: 'Clear' }));
      expect(handleClear).toHaveBeenCalledTimes(1);
    });

    it('renders null when selected count is 0', () => {
      const { container } = renderWithProviders(
        <BulkActionBar selectedCount={0} onClear={() => {}} />
      );
      expect(container.firstChild).toBeNull();
    });
  });
});
