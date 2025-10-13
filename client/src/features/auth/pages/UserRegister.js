import React, { useState } from 'react';
import {
  RegisterContainer,
  RegisterCard,
  RegisterCardLeft,
  RegisterCardRight,
  LeftContent,
  LeftTitle,
  LeftDescription,
  BrandContainer,
  BrandTitle,
  BrandTagline,
  Form,
  FormTitle,
  FormGroup,
  Label,
  InputWrapper,
  InputIcon,
  Input,
  SubmitButton,
  FormFooter,
  LoginLink,
  ErrorMessage,
  PasswordStrengthBar,
  PasswordStrengthFill,
  PasswordStrengthText,
  TermsText,
} from './UserRegister.styles';
import useAuthActions from '../../../shared/hooks/useAuthActions';
import { FaUser, FaEnvelope, FaLock } from 'react-icons/fa';

const UserRegister = () => {
  const { signup } = useAuthActions();
  const [data, setData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState('');

  const HandleInputChange = (event) => {
    const { name, value } = event.target;

    setData({
      ...data,
      [name]: value,
    });

    // Calculate password strength
    if (name === 'password') {
      calculatePasswordStrength(value);
    }
  };

  const calculatePasswordStrength = (password) => {
    if (password.length === 0) {
      setPasswordStrength('');
    } else if (password.length < 6) {
      setPasswordStrength('weak');
    } else if (password.length < 10) {
      setPasswordStrength('medium');
    } else {
      setPasswordStrength('strong');
    }
  };

  const sendUsersDataToDb = async (event, data) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');

    // Basic validation
    if (data.password !== data.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (data.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setIsLoading(false);
      return;
    }

    try {
      await signup(data);
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <RegisterContainer>
      <RegisterCard>
        <RegisterCardLeft>
          <LeftContent>
            <LeftTitle>Join Our Community</LeftTitle>
            <LeftDescription>
              Create an account to start sharing your stories, connect with other writers, and
              explore amazing content from around the world.
            </LeftDescription>
          </LeftContent>
        </RegisterCardLeft>

        <RegisterCardRight>
          <BrandContainer>
            <BrandTitle>BlogHub</BrandTitle>
            <BrandTagline>Create your account</BrandTagline>
          </BrandContainer>

          <FormTitle>Sign Up</FormTitle>

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <Form onSubmit={(event) => sendUsersDataToDb(event, data)}>
            <FormGroup>
              <Label htmlFor="username">Username</Label>
              <InputWrapper>
                <InputIcon>
                  <FaUser />
                </InputIcon>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Choose a username"
                  value={data.username}
                  onChange={(e) => HandleInputChange(e)}
                  required
                />
              </InputWrapper>
            </FormGroup>

            <FormGroup>
              <Label htmlFor="email">Email</Label>
              <InputWrapper>
                <InputIcon>
                  <FaEnvelope />
                </InputIcon>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={data.email}
                  onChange={(e) => HandleInputChange(e)}
                  required
                />
              </InputWrapper>
            </FormGroup>

            <FormGroup>
              <Label htmlFor="password">Password</Label>
              <InputWrapper>
                <InputIcon>
                  <FaLock />
                </InputIcon>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Create a password"
                  value={data.password}
                  onChange={(e) => HandleInputChange(e)}
                  required
                />
              </InputWrapper>
              {passwordStrength && (
                <>
                  <PasswordStrengthBar>
                    <PasswordStrengthFill strength={passwordStrength} />
                  </PasswordStrengthBar>
                  <PasswordStrengthText strength={passwordStrength}>
                    Password strength: {passwordStrength}
                  </PasswordStrengthText>
                </>
              )}
            </FormGroup>

            <FormGroup>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <InputWrapper>
                <InputIcon>
                  <FaLock />
                </InputIcon>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={data.confirmPassword}
                  onChange={(e) => HandleInputChange(e)}
                  required
                />
              </InputWrapper>
            </FormGroup>

            <SubmitButton type="submit" disabled={isLoading}>
              {isLoading ? 'Creating Account...' : 'Sign Up'}
            </SubmitButton>

            <TermsText>
              By signing up, you agree to our <a href="/terms">Terms of Service</a> and{' '}
              <a href="/privacy">Privacy Policy</a>
            </TermsText>
          </Form>

          <FormFooter>
            Already have an account? <LoginLink to="/login">Sign In</LoginLink>
          </FormFooter>
        </RegisterCardRight>
      </RegisterCard>
    </RegisterContainer>
  );
};

export default UserRegister;
