import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const getUser = vi.fn();
const updateUser = vi.fn();
const deleteAccount = vi.fn();
vi.mock('../services/userService', () => ({
  userService: {
    getUser: (...args) => getUser(...args),
    updateUser: (...args) => updateUser(...args),
    deleteAccount: (...args) => deleteAccount(...args),
  },
}));

const getUserSettings = vi.fn();
const updateUserSettings = vi.fn();
const getUserProfile = vi.fn();
const updateUserProfile = vi.fn();
vi.mock('../services/settingsService', () => ({
  settingsService: {
    getUserSettings: (...args) => getUserSettings(...args),
    updateUserSettings: (...args) => updateUserSettings(...args),
    getUserProfile: (...args) => getUserProfile(...args),
    updateUserProfile: (...args) => updateUserProfile(...args),
  },
}));

const changePassword = vi.fn();
vi.mock('../../auth/services/authService', () => ({
  authService: {
    changePassword: (...args) => changePassword(...args),
  },
}));

const { renderWithProviders } = await import('../../../test/render');
const { Settings } = await import('../');
const { NotFound } = await import('../../../components/layout/NotFound');

const mockUser = {
  _id: 'user_settings_1',
  username: 'settingsuser',
  email: 'settings@example.com',
  name: 'Settings Test User',
  profile: { bio: 'Writing stories & debugging' },
};

describe('Settings Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getUser.mockResolvedValue({
      User: mockUser,
    });
    getUserSettings.mockResolvedValue({
      success: true,
      data: {
        emailNotifications: true,
        privacySettings: { isPrivate: false },
      },
    });
    getUserProfile.mockResolvedValue({
      success: true,
      data: {
        fullName: 'Settings Test User',
        location: 'Bengaluru, India',
        website: 'https://example.com',
      },
    });
  });

  it('renders navigation buttons and pre-fills user account details', async () => {
    renderWithProviders(<Settings />, {
      user: mockUser,
      route: '/settings',
    });

    expect(screen.getByRole('button', { name: /profile/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /appearance/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /notifications/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /account/i })).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByDisplayValue('settingsuser')).toBeInTheDocument();
      expect(screen.getByDisplayValue('settings@example.com')).toBeInTheDocument();
    });
  });

  it('allows user to switch to account tab and see password change fields', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Settings />, {
      user: mockUser,
      route: '/settings',
    });

    const accountBtn = screen.getByRole('button', { name: /account/i });
    await user.click(accountBtn);

    await waitFor(() => {
      expect(screen.getByLabelText(/current password/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/^new password/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/confirm new password/i)).toBeInTheDocument();
    });
  });
});

describe('NotFound Page', () => {
  it('renders 404 heading and current pathname', () => {
    renderWithProviders(<NotFound />, {
      route: '/invalid-path-12345',
    });

    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'There is nothing at this address' })).toBeInTheDocument();
    expect(screen.getByText('/invalid-path-12345')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /explore/i })).toBeInTheDocument();
  });
});
