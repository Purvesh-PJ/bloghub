// Three self-hosted variable faces — no external request and no font-loading shift.
//
// Fraunces carries the display type, Newsreader the article bodies, and Inter the interface
// chrome. Inter and Newsreader ship their optical-size axis, so large settings pick up
// display shapes rather than being body type scaled up; Fraunces' `soft` cut carries the
// SOFT axis, which is what keeps its large sizes from turning brittle.
import '@fontsource-variable/fraunces/soft.css';
import '@fontsource-variable/newsreader/opsz.css';
import '@fontsource-variable/inter/opsz.css';

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
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

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <ThemeProvider>
              <App />
              <Toaster position="top-right" />
            </ThemeProvider>
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
