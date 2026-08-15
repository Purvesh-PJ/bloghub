import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import toast from 'react-hot-toast';
import { AtSign, Lock } from 'lucide-react';
import { authService } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import { Button, Input, Alert } from '../components/ui';
import { display, text, media } from '../styles/theme/mixins';

/* Auth pages share this shell — see AuthShell.jsx. Only the form differs. */
import { AuthShell, AuthHeading, AuthSubheading, AuthForm, AuthFooter } from './auth/AuthShell';

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
        toast.success('Welcome back');
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
    <AuthShell>
      <AuthHeading>Welcome back</AuthHeading>
      <AuthSubheading>Sign in to keep writing.</AuthSubheading>

      {error && <Alert variant="error">{error}</Alert>}

      <AuthForm onSubmit={handleSubmit}>
        <Input
          name="credential"
          label="Email or username"
          type="text"
          placeholder="you@example.com"
          icon={<AtSign />}
          value={credential}
          onChange={(e) => setCredential(e.target.value)}
          autoComplete="username"
        />

        <Input
          name="password"
          label="Password"
          type="password"
          placeholder="••••••••"
          icon={<Lock />}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />

        <Button type="submit" isLoading={loading} fullWidth size="lg">
          Sign in
        </Button>
      </AuthForm>

      <AuthFooter>
        New to BlogHub? <Link to="/register">Create an account</Link>
      </AuthFooter>
    </AuthShell>
  );
}
