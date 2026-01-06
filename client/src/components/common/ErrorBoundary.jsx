import { Component } from 'react';

// Simple inline styles for error boundary (can't use styled-components in class component easily)
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
              We're sorry, but something unexpected happened. Please try refreshing the page.
            </p>
            <button style={styles.button} onClick={() => window.location.reload()}>
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
