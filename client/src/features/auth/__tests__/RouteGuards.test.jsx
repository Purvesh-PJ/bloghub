import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ProtectedRoute } from '../guards/ProtectedRoute';
import { AdminRoute } from '../guards/AdminRoute';
import * as AuthModule from '../context/AuthContext';

// Target test destinations
const ProtectedContent = () => <div>Protected Secret Content</div>;
const AdminContent = () => <div>Admin Dashboard Content</div>;
const HomePage = () => <div>Home Landing Page</div>;
const LoginPage = () => {
  const location = useLocation();
  return (
    <div>
      <div>Login Page</div>
      <div data-testid="from-path">{location.state?.from?.pathname || 'none'}</div>
    </div>
  );
};

describe('ProtectedRoute', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('redirects unauthenticated user to /login preserving source path in state', () => {
    vi.spyOn(AuthModule, 'useAuth').mockReturnValue({ isAuthenticated: false });

    render(
      <MemoryRouter initialEntries={['/workspace/stories']}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/workspace/stories"
            element={
              <ProtectedRoute>
                <ProtectedContent />
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Login Page')).toBeInTheDocument();
    expect(screen.getByTestId('from-path')).toHaveTextContent('/workspace/stories');
    expect(screen.queryByText('Protected Secret Content')).not.toBeInTheDocument();
  });

  it('renders children when user is authenticated', () => {
    vi.spyOn(AuthModule, 'useAuth').mockReturnValue({ isAuthenticated: true });

    render(
      <MemoryRouter initialEntries={['/workspace/stories']}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/workspace/stories"
            element={
              <ProtectedRoute>
                <ProtectedContent />
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Protected Secret Content')).toBeInTheDocument();
    expect(screen.queryByText('Login Page')).not.toBeInTheDocument();
  });
});

describe('AdminRoute', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('redirects unauthenticated user to /login', () => {
    vi.spyOn(AuthModule, 'useAuth').mockReturnValue({
      isAuthenticated: false,
      isAdmin: () => false,
    });

    render(
      <MemoryRouter initialEntries={['/admin/posts']}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/admin/posts"
            element={
              <AdminRoute>
                <AdminContent />
              </AdminRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Login Page')).toBeInTheDocument();
    expect(screen.queryByText('Admin Dashboard Content')).not.toBeInTheDocument();
  });

  it('redirects authenticated non-admin user to root /', () => {
    vi.spyOn(AuthModule, 'useAuth').mockReturnValue({
      isAuthenticated: true,
      isAdmin: () => false,
    });

    render(
      <MemoryRouter initialEntries={['/admin/posts']}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/admin/posts"
            element={
              <AdminRoute>
                <AdminContent />
              </AdminRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Home Landing Page')).toBeInTheDocument();
    expect(screen.queryByText('Admin Dashboard Content')).not.toBeInTheDocument();
  });

  it('renders children when user is an authenticated administrator', () => {
    vi.spyOn(AuthModule, 'useAuth').mockReturnValue({
      isAuthenticated: true,
      isAdmin: () => true,
    });

    render(
      <MemoryRouter initialEntries={['/admin/posts']}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/admin/posts"
            element={
              <AdminRoute>
                <AdminContent />
              </AdminRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Admin Dashboard Content')).toBeInTheDocument();
    expect(screen.queryByText('Home Landing Page')).not.toBeInTheDocument();
  });
});

