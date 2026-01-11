import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { User, Lock, AlertCircle } from 'lucide-react';
import styled from 'styled-components';
import toast from 'react-hot-toast';
import { authService } from '../services/authService';
import { useAuth } from '../context/AuthContext';

const PageWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - ${({ theme }) => theme.layout.headerHeight});
  padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.lg};
`;

const Card = styled.div`
  width: 100%;
  max-width: 400px;
  background: ${({ theme }) => theme.colors.cardBg};
  border-radius: ${({ theme }) => theme.radii.xl};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  padding: ${({ theme }) => theme.spacing.xl};
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

const ErrorAlert = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.errorBg};
  border-radius: ${({ theme }) => theme.radii.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};

  svg {
    color: ${({ theme }) => theme.colors.error};
    flex-shrink: 0;
  }

  span {
    font-size: ${({ theme }) => theme.fontSizes.sm};
    color: ${({ theme }) => theme.colors.error};
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const FormGroup = styled.div``;

const Label = styled.label`
  display: block;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const InputWrapper = styled.div`
  position: relative;

  svg {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    color: ${({ theme }) => theme.colors.textMuted};
    width: 18px;
    height: 18px;
  }
`;

const Input = styled.input`
  width: 100%;
  height: 48px;
  padding: 0 ${({ theme }) => theme.spacing.md} 0 46px;
  background: ${({ theme }) => theme.colors.inputBg};
  border: 1px solid ${({ theme }) => theme.colors.inputBorder};
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.textPrimary};
  transition: all ${({ theme }) => theme.transitions.fast};

  &::placeholder {
    color: ${({ theme }) => theme.colors.inputPlaceholder};
  }

  &:hover {
    border-color: ${({ theme }) => theme.colors.inputBorderHover};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.inputBorderFocus};
    box-shadow: ${({ theme }) => theme.shadows.focus};
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  height: 48px;
  background: ${({ theme }) => theme.colors.buttonPrimaryBg};
  color: ${({ theme }) => theme.colors.buttonPrimaryText};
  border: none;
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.buttonPrimaryHover};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Footer = styled.p`
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
      <Card>
        <Header>
          <Title>Welcome back</Title>
          <Subtitle>Sign in to your account</Subtitle>
        </Header>

        {error && (
          <ErrorAlert>
            <AlertCircle size={18} />
            <span>{error}</span>
          </ErrorAlert>
        )}

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Email or Username</Label>
            <InputWrapper>
              <User />
              <Input
                type="text"
                placeholder="Enter email or username"
                value={credential}
                onChange={(e) => setCredential(e.target.value)}
                autoComplete="username"
              />
            </InputWrapper>
          </FormGroup>

          <FormGroup>
            <Label>Password</Label>
            <InputWrapper>
              <Lock />
              <Input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </InputWrapper>
          </FormGroup>

          <SubmitButton type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </SubmitButton>
        </Form>

        <Footer>
          Don't have an account? <Link to="/register">Sign up</Link>
        </Footer>
      </Card>
    </PageWrapper>
  );
}
