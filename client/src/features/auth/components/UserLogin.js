import React, { useState } from 'react';
import {
  LoginContainer,
  LoginCard,
  LoginForm,
  FormTitle,
  FormGroup,
  FormLabel,
  FormInput,
  SubmitButton,
  InputIcon,
  InputWrapper,
  ForgotPassword,
  FormOptions,
  RememberMeContainer,
  RememberMeCheckbox,
  RememberMeLabel,
  LoginCardLeft,
  BrandContainer,
  BrandTitle,
  BrandTagline,
  LoginCardRight,
  LoginFooter,
  SignUpLink,
  SocialLoginContainer,
  SocialLoginText,
  SocialButtons,
  SocialButton,
} from './UserLogin.styles';
import { useNavigate } from 'react-router-dom';
import useLogin from '../../../shared/hooks/useLogin';
import { FaEnvelope, FaLock, FaGoogle, FaFacebook, FaTwitter } from 'react-icons/fa';
import { BiErrorCircle } from 'react-icons/bi';
import { Alert } from '../../../../components/ui/primitives';

const UserLogin = () => {
  const { loginData, handleLoginInputChange, handleLoginSubmit } = useLogin({
    credential: '',
    password: '',
  });
  const navigate = useNavigate();
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Check if user is already logged in
  const accessToken = localStorage.getItem('accessToken');
  if (accessToken) {
    navigate('/Home');
  }

  // Enhanced submit handler with loading state
  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await handleLoginSubmit(event);
      // If handleLoginSubmit doesn't navigate on success, you might need to add navigation here
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LoginContainer>
      <LoginCard>
        <LoginCardLeft>
          <BrandContainer>
            <BrandTitle>BlogHub</BrandTitle>
            <BrandTagline>Share your stories with the world</BrandTagline>
          </BrandContainer>
        </LoginCardLeft>

        <LoginCardRight>
          <FormTitle>Welcome Back</FormTitle>

          {error && (
            <Alert $variant="error" style={{ marginBottom: '1.5rem' }}>
              <Alert.Icon>
                <BiErrorCircle size={20} />
              </Alert.Icon>
              <Alert.Content>{error}</Alert.Content>
            </Alert>
          )}

          <LoginForm onSubmit={handleSubmit}>
            <FormGroup>
              <FormLabel>Email or Username</FormLabel>
              <InputWrapper>
                <InputIcon>
                  <FaEnvelope />
                </InputIcon>
                <FormInput
                  name="credential"
                  value={loginData.credential}
                  type="text"
                  placeholder="Enter your email or username"
                  onChange={(e) => handleLoginInputChange(e)}
                  required
                />
              </InputWrapper>
            </FormGroup>

            <FormGroup>
              <FormLabel>Password</FormLabel>
              <InputWrapper>
                <InputIcon>
                  <FaLock />
                </InputIcon>
                <FormInput
                  name="password"
                  value={loginData.password}
                  type="password"
                  placeholder="Enter your password"
                  onChange={(e) => handleLoginInputChange(e)}
                  required
                />
              </InputWrapper>
            </FormGroup>

            <FormOptions>
              <RememberMeContainer>
                <RememberMeCheckbox
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                />
                <RememberMeLabel htmlFor="rememberMe">Remember me</RememberMeLabel>
              </RememberMeContainer>

              <ForgotPassword to="/forgot-password">Forgot Password?</ForgotPassword>
            </FormOptions>

            <SubmitButton type="submit" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign In'}
            </SubmitButton>

            <SocialLoginContainer>
              <SocialLoginText>Or sign in with</SocialLoginText>
              <SocialButtons>
                <SocialButton type="button">
                  <FaGoogle />
                </SocialButton>
                <SocialButton type="button">
                  <FaFacebook />
                </SocialButton>
                <SocialButton type="button">
                  <FaTwitter />
                </SocialButton>
              </SocialButtons>
            </SocialLoginContainer>
          </LoginForm>

          <LoginFooter>
            Don't have an account? <SignUpLink to="/register">Sign Up</SignUpLink>
          </LoginFooter>
        </LoginCardRight>
      </LoginCard>
    </LoginContainer>
  );
};

export default UserLogin;
