import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import toast from 'react-hot-toast';
import { authService } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import { Button, Input, Card, Alert } from '../components/ui';

const PageWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - ${({ theme }) => theme.layout.headerHeight});
  padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.lg};
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['3xl']};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  letter-spacing: ${({ theme }) => theme.letterSpacing.tight};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const Footer = styled.div`
  text-align: center;
  margin-top: ${({ theme }) => theme.spacing.xl};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textMuted};

  a {
    color: ${({ theme }) => theme.colors.textPrimary};
    font-weight: ${({ theme }) => theme.fontWeights.medium};

    &:hover {
      text-decoration: underline;
    }
  }
`;

export function Login() {
  const [credential, setCredential] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuth } = useAuth();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!credential || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const response = await authService.signIn(credential, password);
      if (response.success) {
        setAuth(response.data);
        toast.success('Welcome back!');
        navigate(from, { replace: true });
      } else {
        setError(response.message || 'Login failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <Card style={{ maxWidth: '400px', width: '100%' }}>
        <Header>
          <Title>Welcome back</Title>
          <Subtitle>Sign in to your account</Subtitle>
        </Header>

        {error && (
          <div style={{ marginBottom: '16px' }}>
            <Alert variant="error">{error}</Alert>
          </div>
        )}

        <Form onSubmit={handleSubmit}>
          <Input
            label="Email or Username"
            type="text"
            placeholder="Enter email or username"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            autoComplete="username"
          />

          <Input
            label="Password"
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />

          <Button type="submit" isLoading={loading} fullWidth size="lg">
            Sign In
          </Button>
        </Form>

        <Footer>
          Don't have an account? <Link to="/register">Sign up</Link>
        </Footer>
      </Card>
    </PageWrapper>
  );
}
