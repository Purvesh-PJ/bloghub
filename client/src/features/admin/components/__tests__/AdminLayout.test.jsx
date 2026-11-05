import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../../../test/render';
import { AdminLayout } from '../../AdminLayout';

describe('AdminLayout Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders brand header, admin navigation landmarks, and active breadcrumb', () => {
    renderWithProviders(<AdminLayout />, {
      route: '/admin/posts',
      path: '/admin/*',
      user: { user_id: 'admin_1', username: 'superadmin', roles: ['admin'] },
    });

    expect(screen.getByText('BlogHub')).toBeInTheDocument();
    expect(screen.getAllByText('Admin').length).toBeGreaterThanOrEqual(2);

    // Check breadcrumb title derived from route
    const breadcrumb = screen.getByRole('navigation', { name: /breadcrumb/i });
    expect(within(breadcrumb).getByText('Posts')).toBeInTheDocument();

    // Check navigation landmark and active item accessibility
    const nav = screen.getByRole('navigation', { name: /admin navigation/i });
    expect(nav).toBeInTheDocument();

    const postsLink = within(nav).getByRole('link', { name: /posts/i });
    expect(postsLink).toHaveAttribute('aria-current', 'page');

    const overviewLink = within(nav).getByRole('link', { name: /overview/i });
    expect(overviewLink).not.toHaveAttribute('aria-current');
  });

  it('renders admin user card with role badge and opens sign out modal on click', async () => {
    const user = userEvent.setup();

    renderWithProviders(<AdminLayout />, {
      route: '/admin',
      path: '/admin/*',
      user: { user_id: 'admin_1', username: 'superadmin', roles: ['admin'] },
    });

    expect(screen.getByText('superadmin')).toBeInTheDocument();
    expect(screen.getByText('Administrator')).toBeInTheDocument();

    // Open sign out modal
    const signOutBtn = screen.getByRole('button', { name: /sign out/i });
    await user.click(signOutBtn);

    expect(
      await screen.findByText('Sign out of Administrator Console?')
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /stay signed in/i })).toBeInTheDocument();
  });

  it('toggles mobile drawer and closes on Escape key', async () => {
    const user = userEvent.setup();

    renderWithProviders(<AdminLayout />, {
      route: '/admin',
      path: '/admin/*',
      user: { user_id: 'admin_1', username: 'superadmin', roles: ['admin'] },
    });

    const openMenuBtn = screen.getByRole('button', { name: /open navigation menu/i });
    await user.click(openMenuBtn);

    const backdrop = screen.getByLabelText(/close navigation menu/i);
    expect(backdrop).toBeInTheDocument();

    // Press Escape key
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(screen.queryByLabelText(/close navigation menu/i)).not.toBeInTheDocument();
  });
});
