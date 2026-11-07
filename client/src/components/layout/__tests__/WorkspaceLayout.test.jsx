import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../../test/render';
import { WorkspaceLayout } from '../WorkspaceLayout';

describe('WorkspaceLayout Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders Studio brand, workspace navigation landmarks, and active breadcrumb', () => {
    renderWithProviders(<WorkspaceLayout />, {
      route: '/stories',
      path: '/stories',
      user: { user_id: 'user_123', username: 'author1', roles: ['user'] },
    });

    expect(screen.getByText('BlogHub')).toBeInTheDocument();
    expect(screen.getAllByText('Studio').length).toBeGreaterThanOrEqual(2);

    // Breadcrumb navigation
    const breadcrumb = screen.getByRole('navigation', { name: /breadcrumb/i });
    expect(within(breadcrumb).getByText('Stories')).toBeInTheDocument();

    // Workspace navigation
    const nav = screen.getByRole('navigation', { name: /workspace navigation/i });
    expect(nav).toBeInTheDocument();

    const storiesLink = within(nav).getByRole('link', { name: /stories/i });
    expect(storiesLink).toHaveAttribute('aria-current', 'page');

    const dashboardLink = within(nav).getByRole('link', { name: /dashboard/i });
    expect(dashboardLink).not.toHaveAttribute('aria-current');
  });

  it('renders public profile link in user card and opens sign out confirmation', async () => {
    const user = userEvent.setup();

    renderWithProviders(<WorkspaceLayout />, {
      route: '/dashboard',
      path: '/dashboard',
      user: { user_id: 'user_123', username: 'author1', roles: ['user'] },
    });

    expect(screen.getByText('author1')).toBeInTheDocument();
    expect(screen.getByText(/public profile/i)).toBeInTheDocument();

    // Open sign out modal
    const signOutBtn = screen.getByRole('button', { name: /sign out/i });
    await user.click(signOutBtn);

    expect(await screen.findByText('Sign out everywhere?')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /stay signed in/i })).toBeInTheDocument();
  });

  it('toggles mobile drawer and closes on Escape key', async () => {
    const user = userEvent.setup();

    renderWithProviders(<WorkspaceLayout />, {
      route: '/dashboard',
      path: '/dashboard',
      user: { user_id: 'user_123', username: 'author1', roles: ['user'] },
    });

    const openMenuBtn = screen.getByRole('button', { name: /open navigation menu/i });
    await user.click(openMenuBtn);

    const backdrop = screen.getByLabelText(/close navigation menu/i);
    expect(backdrop).toBeInTheDocument();

    // Press Escape key to close
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(screen.queryByLabelText(/close navigation menu/i)).not.toBeInTheDocument();
  });
});
