import { Component } from 'react';

/*
  The one place in the application that does not use the theme.

  This is the last line of defence: it renders when something below it has already thrown,
  which includes ThemeProvider itself. A styled-component here would need the very context
  that may be the thing that failed, so the fallback would crash instead of catching. Plain
  inline styles with literal colours are deliberate, and this file is the only exception to
  the rule that colour comes from a token.
*/
const styles = {
  container: {
    maxWidth: '500px',
    margin: '100px auto',
    padding: '0 24px',
  },
  card: {
    background: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.04), 0 2px 4px rgba(0, 0, 0, 0.03)',
    padding: '48px 32px',
    textAlign: 'center',
  },
  title: {
    fontSize: '24px',
    fontWeight: 600,
    color: '#ef4444',
    marginBottom: '16px',
  },
  text: {
    fontSize: '15px',
    color: '#6b6b6b',
    lineHeight: 1.6,
    marginBottom: '24px',
  },
  button: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '10px 20px',
    background: '#1a1a1a',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
  },
};

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={styles.container}>
          <div style={styles.card}>
            <h1 style={styles.title}>Something went wrong</h1>
            <p style={styles.text}>
              {this.state.error?.message ||
                "We're sorry, but something unexpected happened. Please try refreshing the page."}
            </p>
            <div
              style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}
            >
              <button style={styles.button} onClick={() => window.location.reload()}>
                Refresh Page
              </button>
              <button
                style={{ ...styles.button, background: '#0284c7' }}
                onClick={() => (window.location.href = '/')}
              >
                Go to Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
