import { render } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '../styles/ThemeProvider';
import { AuthProvider, authState } from '../context/AuthContext';

/**
 * Renders a screen with the providers it expects from main.jsx.
 *
 * Retries are off and there is no cache between tests: a component that fails a request must
 * show its error state on the first attempt rather than a minute later, and a fixture left in
 * the cache by one test would satisfy the next one's query without the request ever running.
 *
 * @param {React.ReactNode} ui
 * @param {object} [options]
 * @param {string} [options.route] the URL to mount at, e.g. '/user/abc'
 * @param {string} [options.path] the route pattern, so useParams resolves
 * @param {object|null} [options.user] the signed-in account, or null for a visitor
 */
export function renderWithProviders(ui, { route = '/', path = '*', user = null } = {}) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0, staleTime: 0 },
      mutations: { retry: false },
    },
    // Otherwise every deliberately-failing query prints a stack trace into the test output.
    logger: { log: () => {}, warn: () => {}, error: () => {} },
  });

  if (user) {
    authState.setState({ user, accessToken: 'test-token', isAuthenticated: true });
  } else {
    authState.logout();
  }

  const result = render(
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <MemoryRouter initialEntries={[route]}>
            <Routes>
              <Route path={path} element={ui} />
            </Routes>
          </MemoryRouter>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );

  return { ...result, queryClient };
}
