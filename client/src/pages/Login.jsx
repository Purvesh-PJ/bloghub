import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Box, Container, Card, Flex, Heading, Text, TextField, Button, Callout } from '@radix-ui/themes';
import { User, Lock, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import { authService } from '../services/authService';
import { useAuthStore } from '../store/authStore';

export function Login() {
  const [credential, setCredential] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuth } = useAuthStore();

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
        toast.success('Signed in');
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
    <Container size="1" py="9">
      <Card>
        <Box p="5">
          <Flex direction="column" gap="4">
            <Box mb="2">
              <Heading size="4" mb="1">Sign in</Heading>
              <Text size="2" color="gray">
                Enter your credentials to continue
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
                  <Text as="label" size="2" weight="medium" mb="1">
                    Email or Username
                  </Text>
                  <TextField.Root
                    placeholder="Enter email or username"
                    value={credential}
                    onChange={(e) => setCredential(e.target.value)}
                    autoComplete="username"
                  >
                    <TextField.Slot>
                      <User size={14} />
                    </TextField.Slot>
                  </TextField.Root>
                </Box>

                <Box>
                  <Text as="label" size="2" weight="medium" mb="1">
                    Password
                  </Text>
                  <TextField.Root
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                  >
                    <TextField.Slot>
                      <Lock size={14} />
                    </TextField.Slot>
                  </TextField.Root>
                </Box>

                <Button type="submit" size="2" disabled={loading} mt="2">
                  {loading ? 'Signing in...' : 'Sign In'}
                </Button>
              </Flex>
            </form>

            <Text size="2" align="center" color="gray">
              Don't have an account?{' '}
              <Link to="/register" style={{ color: 'var(--accent-color)', fontWeight: 500 }}>
                Sign up
              </Link>
            </Text>
          </Flex>
        </Box>
      </Card>
    </Container>
  );
}
