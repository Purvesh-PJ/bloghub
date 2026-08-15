import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { AtSign, Lock, User } from 'lucide-react';
import { authService } from '../services/authService';
import { Button, Input, Alert } from '../components/ui';
import { AuthShell, AuthHeading, AuthSubheading, AuthForm, AuthFooter } from './auth/AuthShell';

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
        toast.success('Account created');
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
    <AuthShell>
      <AuthHeading>Create your account</AuthHeading>
      <AuthSubheading>Start publishing in a couple of minutes.</AuthSubheading>

      {error && <Alert variant="error">{error}</Alert>}

      <AuthForm onSubmit={handleSubmit}>
        <Input
          name="username"
          label="Username"
          placeholder="yourname"
          icon={<User />}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
        />

        <Input
          name="email"
          label="Email"
          type="email"
          placeholder="you@example.com"
          icon={<AtSign />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />

        <Input
          name="password"
          label="Password"
          type="password"
          placeholder="At least 6 characters"
          icon={<Lock />}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
        />

        <Input
          name="confirmPassword"
          label="Confirm password"
          type="password"
          placeholder="Repeat your password"
          icon={<Lock />}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          autoComplete="new-password"
        />

        <Button type="submit" isLoading={loading} fullWidth size="lg">
          Create account
        </Button>
      </AuthForm>

      <AuthFooter>
        Already have an account? <Link to="/login">Sign in</Link>
      </AuthFooter>
    </AuthShell>
  );
}
