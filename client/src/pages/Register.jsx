import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import toast from 'react-hot-toast';
import { authService } from '../services/authService';
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
  margin-bottom: ${({ theme }) => theme.spacing.md};
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
  gap: ${({ theme }) => theme.spacing.md};
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

export function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const validateForm = () => {
    if (!username || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return false;
    }
    if (username.length < 3) {
      setError('Username must be at least 3 characters');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email');
      return false;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await authService.signUp(username, email, password, confirmPassword);
      if (response.success) {
        toast.success('Account created successfully!');
        navigate('/login');
      } else {
        setError(response.message || 'Registration failed');
      }
    } catch (err) {
      const errorData = err.response?.data;
      if (errorData?.errors?.length > 0) {
        setError(errorData.errors.map((e) => e.msg).join('. '));
      } else {
        setError(errorData?.message || 'Registration failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <Card style={{ maxWidth: '400px', width: '100%' }}>
        <Header>
          <Title>Create account</Title>
          <Subtitle>Join the community today</Subtitle>
        </Header>

        {error && (
          <div style={{ marginBottom: '16px' }}>
            <Alert variant="error">{error}</Alert>
          </div>
        )}

        <Form onSubmit={handleSubmit}>
          <Input
            label="Username"
            type="text"
            placeholder="Choose a username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
          />

          <Input
            label="Email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />

          <Input
            label="Password"
            type="password"
            placeholder="Min 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
          />

          <Input
            label="Confirm Password"
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
          />

          <Button type="submit" isLoading={loading} fullWidth size="lg">
            Create Account
          </Button>
        </Form>

        <Footer>
          Already have an account? <Link to="/login">Sign in</Link>
        </Footer>
      </Card>
    </PageWrapper>
  );
}
