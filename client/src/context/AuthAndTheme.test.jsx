import React from 'react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider, useAuth, authState } from './AuthContext';
import { ThemeProvider, useTheme } from '../styles/ThemeProvider';

// Test consumer for AuthContext
const AuthConsumer = () => {
  const { user, isAuthenticated, isLoggedIn, isAdmin, setAuth, setAccessToken, logout } =
    useAuth();

  return (
    <div>
      <div data-testid="auth-status">{isAuthenticated ? 'authenticated' : 'guest'}</div>
      <div data-testid="logged-in">{isLoggedIn() ? 'yes' : 'no'}</div>
      <div data-testid="is-admin">{isAdmin() ? 'yes' : 'no'}</div>
      <div data-testid="username">{user?.username || 'none'}</div>
      <button
        onClick={() =>
          setAuth({
            user: { id: 'user_1', username: 'bob', roles: ['admin'] },
            accessToken: 'token_abc',
            refreshToken: 'refresh_xyz',
          })
        }
      >
        Sign In Admin
      </button>
      <button
        onClick={() =>
          setAuth({
            user: { id: 'user_2', username: 'charlie', roles: ['reader'] },
            accessToken: 'token_reader',
            refreshToken: 'refresh_reader',
          })
        }
      >
        Sign In Regular
      </button>
      <button onClick={() => setAccessToken('token_renewed')}>Renew Token</button>
      <button onClick={() => logout()}>Sign Out</button>
    </div>
  );
};

// Test consumer for ThemeProvider
const ThemeConsumer = () => {
  const { mode, preference, isDark, setTheme, toggleTheme } = useTheme();

  return (
    <div>
      <div data-testid="theme-mode">{mode}</div>
      <div data-testid="theme-preference">{preference}</div>
      <div data-testid="is-dark">{isDark ? 'yes' : 'no'}</div>
      <button onClick={() => setTheme('dark')}>Set Dark</button>
      <button onClick={() => setTheme('light')}>Set Light</button>
      <button onClick={() => toggleTheme()}>Toggle</button>
    </div>
  );
};

describe('AuthContext and authState', () => {
  beforeEach(() => {
    localStorage.clear();
    authState.logout();
  });

  afterEach(() => {
    localStorage.clear();
    authState.logout();
    vi.restoreAllMocks();
  });

  it('renders initial guest state when storage is empty', () => {
    render(
      <AuthProvider>
        <AuthConsumer />
      </AuthProvider>
    );

    expect(screen.getByTestId('auth-status')).toHaveTextContent('guest');
    expect(screen.getByTestId('logged-in')).toHaveTextContent('no');
    expect(screen.getByTestId('username')).toHaveTextContent('none');
  });

  it('restores stored authentication into authState and renders user info', () => {
    authState.setState({
      user: { id: 'usr_stored', username: 'stored_user', roles: ['user'] },
      accessToken: 'saved_token',
      isAuthenticated: true,
    });

    render(
      <AuthProvider>
        <AuthConsumer />
      </AuthProvider>
    );

    expect(screen.getByTestId('auth-status')).toHaveTextContent('authenticated');
    expect(screen.getByTestId('username')).toHaveTextContent('stored_user');
    expect(screen.getByTestId('is-admin')).toHaveTextContent('no');
  });

  it('handles setAuth, persists to storage, and identifies admin role', async () => {
    const user = userEvent.setup();
    render(
      <AuthProvider>
        <AuthConsumer />
      </AuthProvider>
    );

    await user.click(screen.getByRole('button', { name: 'Sign In Admin' }));

    expect(screen.getByTestId('auth-status')).toHaveTextContent('authenticated');
    expect(screen.getByTestId('username')).toHaveTextContent('bob');
    expect(screen.getByTestId('is-admin')).toHaveTextContent('yes');
    expect(screen.getByTestId('logged-in')).toHaveTextContent('yes');

    const stored = JSON.parse(localStorage.getItem('auth-storage'));
    expect(stored.accessToken).toBe('token_abc');
    expect(stored.user.username).toBe('bob');
  });

  it('updates token with setAccessToken', async () => {
    const user = userEvent.setup();
    render(
      <AuthProvider>
        <AuthConsumer />
      </AuthProvider>
    );

    await user.click(screen.getByRole('button', { name: 'Sign In Regular' }));
    await user.click(screen.getByRole('button', { name: 'Renew Token' }));

    const stored = JSON.parse(localStorage.getItem('auth-storage'));
    expect(stored.accessToken).toBe('token_renewed');
  });

  it('logout cleans auth state and removes credentials from storage', async () => {
    const user = userEvent.setup();
    render(
      <AuthProvider>
        <AuthConsumer />
      </AuthProvider>
    );

    await user.click(screen.getByRole('button', { name: 'Sign In Admin' }));
    expect(screen.getByTestId('auth-status')).toHaveTextContent('authenticated');

    await user.click(screen.getByRole('button', { name: 'Sign Out' }));

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('guest');
      expect(screen.getByTestId('username')).toHaveTextContent('none');
    });

    const stored = JSON.parse(localStorage.getItem('auth-storage'));
    expect(stored.isAuthenticated).toBe(false);
    expect(stored.accessToken).toBeNull();
  });

  it('throws descriptive error if useAuth is used outside AuthProvider', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<AuthConsumer />)).toThrow('useAuth must be used within an AuthProvider');
    consoleError.mockRestore();
  });
});

describe('ThemeProvider', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.className = '';
    document.documentElement.removeAttribute('data-theme');
  });

  afterEach(() => {
    localStorage.clear();
    document.documentElement.className = '';
  });

  it('initializes with system preference by default', () => {
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );

    expect(screen.getByTestId('theme-preference')).toHaveTextContent('system');
  });

  it('allows explicit dark theme selection and sets document classes', async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );

    await user.click(screen.getByRole('button', { name: 'Set Dark' }));

    expect(screen.getByTestId('theme-mode')).toHaveTextContent('dark');
    expect(screen.getByTestId('is-dark')).toHaveTextContent('yes');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(localStorage.getItem('theme-preference')).toBe('dark');
  });

  it('toggles theme between dark and light', async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );

    await user.click(screen.getByRole('button', { name: 'Set Dark' }));
    expect(screen.getByTestId('theme-mode')).toHaveTextContent('dark');

    await user.click(screen.getByRole('button', { name: 'Toggle' }));
    expect(screen.getByTestId('theme-mode')).toHaveTextContent('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('throws descriptive error if useTheme is used outside ThemeProvider', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<ThemeConsumer />)).toThrow('useTheme must be used within a ThemeProvider');
    consoleError.mockRestore();
  });
});
