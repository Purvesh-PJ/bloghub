import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { Login, Register } from '../';
import { AuthProvider } from '../context/AuthContext';
import { authService } from '../services/authService';

const renderWithAuth = (ui, { route = '/' } = {}) => {
  return render(
    <AuthProvider>
      <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
    </AuthProvider>
  );
};

describe('Login Page', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders sign in fields and headings', () => {
    renderWithAuth(<Login />);

    expect(screen.getByRole('heading', { name: 'Welcome back' })).toBeInTheDocument();
    expect(screen.getByLabelText('Email or username')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign in' })).toBeInTheDocument();
  });

  it('shows error if submitted with empty fields', async () => {
    const user = userEvent.setup();
    renderWithAuth(<Login />);

    await user.click(screen.getByRole('button', { name: 'Sign in' }));

    expect(await screen.findByText('Please fill in all fields')).toBeInTheDocument();
  });

  it('shows server error message on login failure', async () => {
    const user = userEvent.setup();
    vi.spyOn(authService, 'signIn').mockRejectedValue({
      response: { data: { message: 'Incorrect credentials' } },
    });

    renderWithAuth(<Login />);

    await user.type(screen.getByLabelText('Email or username'), 'baduser');
    await user.type(screen.getByLabelText('Password'), 'wrongpass');
    await user.click(screen.getByRole('button', { name: 'Sign in' }));

    expect(await screen.findByText('Incorrect credentials')).toBeInTheDocument();
  });

  it('signs in successfully and navigates to target path', async () => {
    const user = userEvent.setup();
    vi.spyOn(authService, 'signIn').mockResolvedValue({
      success: true,
      data: {
        user: { id: 'usr_1', username: 'alice' },
        accessToken: 'tok_123',
      },
    });

    render(
      <AuthProvider>
        <MemoryRouter initialEntries={['/login']}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<div>Dashboard Home</div>} />
          </Routes>
        </MemoryRouter>
      </AuthProvider>
    );

    await user.type(screen.getByLabelText('Email or username'), 'alice@example.com');
    await user.type(screen.getByLabelText('Password'), 'ValidPassword123');
    await user.click(screen.getByRole('button', { name: 'Sign in' }));

    await waitFor(() => {
      expect(screen.getByText('Dashboard Home')).toBeInTheDocument();
    });
  });
});

describe('Register Page', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('validates minimum username length', async () => {
    const user = userEvent.setup();
    renderWithAuth(<Register />);

    await user.type(screen.getByLabelText('Username'), 'al');
    await user.type(screen.getByLabelText('Email'), 'al@example.com');
    await user.type(screen.getByLabelText('Password'), 'secret123');
    await user.type(screen.getByLabelText('Confirm password'), 'secret123');
    await user.click(screen.getByRole('button', { name: 'Create account' }));

    expect(await screen.findByText('Username must be at least 3 characters')).toBeInTheDocument();
  });

  it('validates invalid email format', async () => {
    const user = userEvent.setup();
    renderWithAuth(<Register />);

    await user.type(screen.getByLabelText('Username'), 'alice');
    await user.type(screen.getByLabelText('Email'), 'alice@domainwithoutdot');
    await user.type(screen.getByLabelText('Password'), 'secret123');
    await user.type(screen.getByLabelText('Confirm password'), 'secret123');
    await user.click(screen.getByRole('button', { name: 'Create account' }));

    expect(await screen.findByText('Please enter a valid email')).toBeInTheDocument();
  });

  it('validates password mismatch', async () => {
    const user = userEvent.setup();
    renderWithAuth(<Register />);

    await user.type(screen.getByLabelText('Username'), 'alice');
    await user.type(screen.getByLabelText('Email'), 'alice@example.com');
    await user.type(screen.getByLabelText('Password'), 'password123');
    await user.type(screen.getByLabelText('Confirm password'), 'different123');
    await user.click(screen.getByRole('button', { name: 'Create account' }));

    expect(await screen.findByText('Passwords do not match')).toBeInTheDocument();
  });

  it('registers successfully and navigates to login', async () => {
    const user = userEvent.setup();
    vi.spyOn(authService, 'signUp').mockResolvedValue({ success: true });

    render(
      <AuthProvider>
        <MemoryRouter initialEntries={['/register']}>
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<div>Login Page Target</div>} />
          </Routes>
        </MemoryRouter>
      </AuthProvider>
    );

    await user.type(screen.getByLabelText('Username'), 'validuser');
    await user.type(screen.getByLabelText('Email'), 'valid@example.com');
    await user.type(screen.getByLabelText('Password'), 'password123');
    await user.type(screen.getByLabelText('Confirm password'), 'password123');
    await user.click(screen.getByRole('button', { name: 'Create account' }));

    await waitFor(() => {
      expect(screen.getByText('Login Page Target')).toBeInTheDocument();
    });
  });
});
