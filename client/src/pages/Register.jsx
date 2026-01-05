import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Box, Container, Card, Flex, Heading, Text, TextField, Button, Callout } from '@radix-ui/themes';
import { User, Mail, Lock, AlertTriangle, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { authService } from '../services/authService';

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
        setError(errorData.errors.map(e => e.msg).join('. '));
      } else {
        setError(errorData?.message || 'Registration failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size="1" py="9">
      <Card>
        <Box p="5">
          <Flex direction="column" gap="4">
            <Box mb="2">
              <Heading size="4" mb="1">Create account</Heading>
              <Text size="2" color="gray">
                Sign up to get started
              </Text>
            </Box>

            {error && (
              <Callout.Root color="red" size="1">
                <Callout.Icon>
                  <AlertTriangle size={14} />
                </Callout.Icon>
                <Callout.Text>{error}</Callout.Text>
              </Callout.Root>
            )}

            <form onSubmit={handleSubmit}>
              <Flex direction="column" gap="3">
                <Box>
                  <Text as="label" size="2" weight="medium" mb="1">Username</Text>
                  <TextField.Root
                    placeholder="Choose a username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    autoComplete="username"
                  >
                    <TextField.Slot>
                      <User size={14} />
                    </TextField.Slot>
                  </TextField.Root>
                </Box>

                <Box>
                  <Text as="label" size="2" weight="medium" mb="1">Email</Text>
                  <TextField.Root
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                  >
                    <TextField.Slot>
                      <Mail size={14} />
                    </TextField.Slot>
                  </TextField.Root>
                </Box>

                <Box>
                  <Text as="label" size="2" weight="medium" mb="1">Password</Text>
                  <TextField.Root
                    type="password"
                    placeholder="Min 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                  >
                    <TextField.Slot>
                      <Lock size={14} />
                    </TextField.Slot>
                  </TextField.Root>
                </Box>

                <Box>
                  <Text as="label" size="2" weight="medium" mb="1">Confirm Password</Text>
                  <TextField.Root
                    type="password"
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    autoComplete="new-password"
                  >
                    <TextField.Slot>
                      <Lock size={14} />
                    </TextField.Slot>
                    {confirmPassword && password === confirmPassword && (
                      <TextField.Slot>
                        <CheckCircle size={14} color="var(--green-9)" />
                      </TextField.Slot>
                    )}
                  </TextField.Root>
                </Box>

                <Button type="submit" size="2" disabled={loading} mt="2">
                  {loading ? 'Creating...' : 'Create Account'}
                </Button>
              </Flex>
            </form>

            <Text size="2" align="center" color="gray">
              Already have an account?{' '}
              <Link to="/login" style={{ color: 'var(--accent-color)', fontWeight: 500 }}>
                Sign in
              </Link>
            </Text>
          </Flex>
        </Box>
      </Card>
    </Container>
  );
}
