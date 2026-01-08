import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, AlertCircle, Check } from 'lucide-react';
import styled from 'styled-components';
import toast from 'react-hot-toast';
import { authService } from '../services/authService';

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
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({theme}) => theme.colors.bgPrimary }
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

const ErrorAlert = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.errorBg};
  border-radius: ${({ theme }) => theme.radii.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};

  svg {
    color: ${({ theme }) => theme.colors.error};
    flex-shrink: 0;
    margin-top: 1px;
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

  svg:first-child {
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
  padding: 0 ${({ $hasRightIcon }) => ($hasRightIcon ? '46px' : '16px')} 0 46px;
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

const RightIcon = styled.div`
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.success};
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

  const showPasswordMatch = confirmPassword && password === confirmPassword;

  return (
    <PageWrapper>
      <Card>
        <Header>
          <Title>Create account</Title>
          <Subtitle>Join the community today</Subtitle>
        </Header>

        {error && (
          <ErrorAlert>
            <AlertCircle size={18} />
            <span>{error}</span>
          </ErrorAlert>
        )}

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Username</Label>
            <InputWrapper>
              <User />
              <Input
                type="text"
                placeholder="Choose a username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
              />
            </InputWrapper>
          </FormGroup>

          <FormGroup>
            <Label>Email</Label>
            <InputWrapper>
              <Mail />
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </InputWrapper>
          </FormGroup>

          <FormGroup>
            <Label>Password</Label>
            <InputWrapper>
              <Lock />
              <Input
                type="password"
                placeholder="Min 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
              />
            </InputWrapper>
          </FormGroup>

          <FormGroup>
            <Label>Confirm Password</Label>
            <InputWrapper>
              <Lock />
              <Input
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                $hasRightIcon={showPasswordMatch}
              />
              {showPasswordMatch && (
                <RightIcon>
                  <Check size={18} />
                </RightIcon>
              )}
            </InputWrapper>
          </FormGroup>

          <SubmitButton type="submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </SubmitButton>
        </Form>

        <Footer>
          Already have an account? <Link to="/login">Sign in</Link>
        </Footer>
      </Card>
    </PageWrapper>
  );
}
