import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { fadeIn } from '../../../components/common/theme/animations';
import {
  Card as UiCard,
  Input as UiInput,
  FieldLabel as UiFieldLabel,
  Button as UiButton,
  Checkbox as UiCheckbox,
} from '../../../components/ui/primitives';

export const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: ${({ theme }) =>
    `linear-gradient(135deg, ${theme.palette.grey[50]} 0%, ${theme.palette.grey[200]} 100%)`};
`;

export const LoginCard = styled(UiCard)`
  display: flex;
  background: ${({ theme }) => theme.palette.background.surface};
  border-radius: ${({ theme }) => theme.radii.xl};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  overflow: hidden;
  width: 100%;
  max-width: 1000px;
  min-height: 600px;
  animation: ${fadeIn} 0.6s ease-in;
`;

export const LoginCardLeft = styled.div`
  flex: 1;
  background: ${({ theme }) =>
    `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`};
  padding: 3rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: ${({ theme }) => theme.palette.text.inverse};

  @media (max-width: 768px) {
    display: none;
  }
`;

export const LoginCardRight = styled.div`
  flex: 1;
  padding: 3rem;
  display: flex;
  flex-direction: column;
`;

export const BrandContainer = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

export const BrandTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.palette.text.primary};
`;

export const BrandTagline = styled.p`
  font-size: 1.1rem;
  opacity: 0.9;
  color: ${({ theme }) => theme.palette.text.secondary};
`;

export const FormTitle = styled.h2`
  font-size: 1.8rem;
  color: ${({ theme }) => theme.palette.text.primary};
  margin-bottom: 2rem;
  text-align: center;
`;

export const LoginForm = styled.form`
  width: 100%;
`;

export const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

export const FormLabel = styled(UiFieldLabel)`
  display: block;
  margin-bottom: 0.5rem;
  color: ${({ theme }) => theme.palette.text.secondary};
  font-size: 0.9rem;
`;

export const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

export const InputIcon = styled.span`
  position: absolute;
  left: 1rem;
  color: ${({ theme }) => theme.palette.grey[500]};
`;

export const FormInput = styled(UiInput)`
  width: 100%;
  padding-left: 2.5rem; /* accommodate left icon */
`;

export const FormOptions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const RememberMeContainer = styled.div`
  display: flex;
  align-items: center;
`;

export const RememberMeCheckbox = styled(UiCheckbox)`
  margin-right: 0.5rem;
`;
export const RememberMeLabel = styled.label`
  color: ${({ theme }) => theme.palette.text.secondary};
  font-size: 0.9rem;
`;

export const ForgotPassword = styled(Link)`
  color: ${({ theme }) => theme.palette.primary.main};
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;

  &:hover {
    color: ${({ theme }) => theme.palette.primary.dark};
    text-decoration: underline;
  }
`;

export const SubmitButton = styled(UiButton)`
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  font-weight: 500;
  background: ${({ theme }) => theme.palette.primary.main};
  color: ${({ theme }) => theme.palette.primary.contrastText};
  border: 0;
  border-radius: ${({ theme }) => theme.radii.lg};
  transition: all 0.2s;

  &:hover {
    background: ${({ theme }) => theme.palette.primary.dark};
  }

  &:disabled {
    background: ${({ theme }) => theme.palette.grey[400]};
    cursor: not-allowed;
  }
`;

export const SocialLoginContainer = styled.div`
  margin-top: 2rem;
  text-align: center;
`;

export const SocialLoginText = styled.p`
  color: ${({ theme }) => theme.palette.text.secondary};
  font-size: 0.9rem;
  margin-bottom: 1rem;
  position: relative;

  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    width: 25%;
    height: 1px;
    background: ${({ theme }) => theme.palette.grey[200]};
  }

  &::before {
    left: 0;
  }
  &::after {
    right: 0;
  }
`;

export const SocialButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
`;

export const SocialButton = styled(UiButton)`
  padding: 0.75rem;
  border: 1px solid ${({ theme }) => theme.palette.grey[200]};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.palette.background.surface};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${({ theme }) => theme.palette.background.subtle};
    border-color: ${({ theme }) => theme.palette.grey[300]};
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

export const LoginFooter = styled.div`
  text-align: center;
  margin-top: 2rem;
  color: ${({ theme }) => theme.palette.text.secondary};
  font-size: 0.9rem;
`;

export const SignUpLink = styled(Link)`
  color: ${({ theme }) => theme.palette.primary.main};
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;

  &:hover {
    color: ${({ theme }) => theme.palette.primary.dark};
    text-decoration: underline;
  }
`;
