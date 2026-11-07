import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button, Table } from '../../ui';
import {
  PageHeader,
  DataTableCard,
  FilterToolbar,
  DataView,
  SettingSection,
  StatsGrid,
  ChoiceGrid,
} from '../';

describe('Composed Patterns', () => {
  describe('FilterToolbar Component', () => {
    it('renders filter chips, sort select, and search input with active interactions', async () => {
      const user = userEvent.setup();
      const onFilterChange = vi.fn();
      const onSortChange = vi.fn();
      const onSearchChange = vi.fn();

      const filters = [
        { id: 'all', label: 'All', count: 10 },
        { id: 'drafts', label: 'Drafts', count: 2 },
      ];
      const sortOptions = [
        { value: 'newest', label: 'Newest' },
        { value: 'oldest', label: 'Oldest' },
      ];

      render(
        <FilterToolbar
          filters={filters}
          activeFilter="all"
          onFilterChange={onFilterChange}
          sortOptions={sortOptions}
          sortValue="newest"
          onSortChange={onSortChange}
          searchValue="test"
          onSearchChange={onSearchChange}
          searchPlaceholder="Search items…"
        />
      );

      // Verify filter chips
      expect(screen.getByRole('button', { name: 'All (10)' })).toBeInTheDocument();
      const draftsChip = screen.getByRole('button', { name: 'Drafts (2)' });
      await user.click(draftsChip);
      expect(onFilterChange).toHaveBeenCalledWith('drafts');

      // Verify search input
      const searchBox = screen.getByPlaceholderText('Search items…');
      expect(searchBox).toHaveValue('test');
    });
  });

  describe('DataView Component', () => {
    it('renders skeleton during loading state', () => {
      render(
        <DataView isLoading={true} skeleton={<div data-testid="custom-skeleton">Loading…</div>}>
          <div>Ready Data</div>
        </DataView>
      );
      expect(screen.getByTestId('custom-skeleton')).toBeInTheDocument();
      expect(screen.queryByText('Ready Data')).not.toBeInTheDocument();
    });

    it('renders error state when request fails', async () => {
      const user = userEvent.setup();
      const onRetry = vi.fn();

      render(
        <DataView
          isError={true}
          error={{ message: 'Network failed' }}
          errorTitle="Could not load items"
          onRetry={onRetry}
        >
          <div>Ready Data</div>
        </DataView>
      );

      expect(screen.getByText('Could not load items')).toBeInTheDocument();
      const retryBtn = screen.getByRole('button', { name: /try again/i });
      await user.click(retryBtn);
      expect(onRetry).toHaveBeenCalledTimes(1);
    });

    it('renders empty state when data array is empty', () => {
      render(
        <DataView
          isEmpty={true}
          emptyTitle="No stories written yet"
          emptyDescription="Drafts stay private until published."
        >
          <div>Ready Data</div>
        </DataView>
      );

      expect(screen.getByText('No stories written yet')).toBeInTheDocument();
      expect(screen.getByText('Drafts stay private until published.')).toBeInTheDocument();
      expect(screen.queryByText('Ready Data')).not.toBeInTheDocument();
    });

    it('renders children when data is ready', () => {
      render(
        <DataView isLoading={false} isError={false} isEmpty={false}>
          <div data-testid="content">Actual Table Content</div>
        </DataView>
      );
      expect(screen.getByTestId('content')).toBeInTheDocument();
    });
  });

  describe('SettingSection Component', () => {
    it('renders card header, optional info notice, body, and footer', () => {
      render(
        <SettingSection
          title="Account Privacy"
          description="Control your profile visibility."
          info="Signed in as user@test.com"
          footer={<Button variant="primary">Save Changes</Button>}
        >
          <div data-testid="settings-form">Form Input Controls</div>
        </SettingSection>
      );

      expect(screen.getByText('Account Privacy')).toBeInTheDocument();
      expect(screen.getByText('Control your profile visibility.')).toBeInTheDocument();
      expect(screen.getByText(/signed in as user@test\.com/i)).toBeInTheDocument();
      expect(screen.getByTestId('settings-form')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Save Changes' })).toBeInTheDocument();
    });
  });

  describe('StatsGrid Component', () => {
    it('renders metrics grid with labels and values', () => {
      const items = [
        { label: 'Published Stories', value: '18' },
        { label: 'Total Reads', value: '4.2k' },
      ];

      render(<StatsGrid items={items} columns={2} />);

      expect(screen.getByText('Published Stories')).toBeInTheDocument();
      expect(screen.getByText('18')).toBeInTheDocument();
      expect(screen.getByText('Total Reads')).toBeInTheDocument();
      expect(screen.getByText('4.2k')).toBeInTheDocument();
    });
  });

  describe('ChoiceGrid Component', () => {
    it('renders option cards in a radiogroup and triggers selection', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      const options = [
        { id: 'light', label: 'Light' },
        { id: 'dark', label: 'Dark' },
      ];

      render(
        <ChoiceGrid options={options} value="light" onChange={onChange} ariaLabel="Theme Mode" />
      );

      const lightCard = screen.getByRole('radio', { name: 'Light' });
      const darkCard = screen.getByRole('radio', { name: 'Dark' });

      expect(lightCard).toHaveAttribute('aria-checked', 'true');
      expect(darkCard).toHaveAttribute('aria-checked', 'false');

      await user.click(darkCard);
      expect(onChange).toHaveBeenCalledWith('dark');
    });
  });

  describe('PageHeader Component', () => {
    it('renders heading, description, badge, and action slots', () => {
      render(
        <PageHeader
          title="Articles"
          description="Manage published articles"
          badge={<span data-testid="test-badge">Beta</span>}
          actions={<Button>Create Article</Button>}
        />
      );

      expect(screen.getByRole('heading', { level: 1, name: 'Articles' })).toBeInTheDocument();
      expect(screen.getByText('Manage published articles')).toBeInTheDocument();
      expect(screen.getByTestId('test-badge')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Create Article' })).toBeInTheDocument();
    });
  });

  describe('DataTableCard Component', () => {
    it('renders card containing table content, optional header, and pagination', () => {
      render(
        <DataTableCard
          header={<div data-testid="table-header">Filter bar</div>}
          pagination={<div data-testid="table-pagination">Page 1 of 5</div>}
        >
          <Table>
            <Table.Head>
              <tr>
                <th>Item</th>
              </tr>
            </Table.Head>
            <Table.Body>
              <tr>
                <td>Row 1</td>
              </tr>
            </Table.Body>
          </Table>
        </DataTableCard>
      );

      expect(screen.getByTestId('table-header')).toBeInTheDocument();
      expect(screen.getByRole('table')).toBeInTheDocument();
      expect(screen.getByText('Row 1')).toBeInTheDocument();
      expect(screen.getByTestId('table-pagination')).toBeInTheDocument();
    });
  });
});
