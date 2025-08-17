import styled, { keyframes } from 'styled-components';
import { Link } from 'react-router-dom';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

export const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%);
`;

export const LoginCard = styled.div`
  display: flex;
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  width: 100%;
  max-width: 1000px;
  min-height: 600px;
  animation: ${fadeIn} 0.6s ease-in;
`;

export const LoginCardLeft = styled.div`
  flex: 1;
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
  padding: 3rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: white;

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
`;

export const BrandTagline = styled.p`
  font-size: 1.1rem;
  opacity: 0.9;
`;

export const FormTitle = styled.h2`
  font-size: 1.8rem;
  color: #1a1a1a;
  margin-bottom: 2rem;
  text-align: center;
`;

export const LoginForm = styled.form`
  width: 100%;
`;

export const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

export const FormLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: #4b5563;
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
  color: #6b7280;
`;

export const FormInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s;
  background: #f9fafb;

  &:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
    background: white;
  }
`;

export const FormOptions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

export const RememberMeContainer = styled.div`
  display: flex;
  align-items: center;
`;

export const RememberMeCheckbox = styled.input`
  margin-right: 0.5rem;
`;

export const RememberMeLabel = styled.label`
  color: #4b5563;
  font-size: 0.9rem;
`;

export const ForgotPassword = styled(Link)`
  color: #6366f1;
  font-size: 0.9rem;
  text-decoration: none;
  transition: color 0.2s;

  &:hover {
    color: #4f46e5;
  }
`;

export const SubmitButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background: #6366f1;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #4f46e5;
  }

  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
  }
`;

export const SocialLoginContainer = styled.div`
  margin-top: 2rem;
  text-align: center;
`;

export const SocialLoginText = styled.p`
  color: #6b7280;
  font-size: 0.9rem;
  margin-bottom: 1rem;
  position: relative;

  &::before,
  &::after {
    content: "";
    position: absolute;
    top: 50%;
    width: 25%;
    height: 1px;
    background: #e5e7eb;
  }

  &::before { left: 0; }
  &::after { right: 0; }
`;

export const SocialButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
`;

export const SocialButton = styled.button`
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #f9fafb;
    border-color: #d1d5db;
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

export const LoginFooter = styled.div`
  text-align: center;
  margin-top: 2rem;
  color: #4b5563;
  font-size: 0.9rem;
`;

export const SignUpLink = styled(Link)`
  color: #6366f1;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;

  &:hover {
    color: #4f46e5;
  }
`;

export const ErrorMessage = styled.div`
  color: #dc2626;
  background: #fee2e2;
  padding: 0.75rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  text-align: center;
`;