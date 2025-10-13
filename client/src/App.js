import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import ErrorBoundary from './shared/components/error/ErrorBoundary'; // Import ErrorBoundary
import { AuthProvider } from './context/AuthContext';
import { Routing } from 'Routing';
// Import your other pages here

function App() {
  return (
    <AuthProvider>
      <Router>
        <ErrorBoundary>
          <Routing />
        </ErrorBoundary>
      </Router>
    </AuthProvider>
  );
}

export default App;
