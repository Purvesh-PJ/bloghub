// Self-hosted variable Inter font for clean, modern Tailwind typography
import '@fontsource-variable/inter/opsz.css';

import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import App from './App';
import { ErrorBoundary } from './components/layout/ErrorBoundary';
import { ThemeProvider } from './styles/ThemeProvider';
import { AuthProvider } from './context/AuthContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

/*
  A data router wrapping the existing route tree, rather than BrowserRouter.

  App.jsx keeps its <Routes> declaration unchanged — the catch-all here just hands everything
  to it. The reason for the swap is useBlocker, which the editor needs to stop an in-app
  navigation from discarding unsaved work, and which is only available under a data router.
*/
const router = createBrowserRouter([
  {
    path: '*',
    element: (
      <AuthProvider>
        <ThemeProvider>
          <App />
          <Toaster position="top-right" />
        </ThemeProvider>
      </AuthProvider>
    ),
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
