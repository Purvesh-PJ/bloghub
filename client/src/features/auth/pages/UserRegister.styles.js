import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { fadeIn } from '../../../components/common/theme/animations';
import { breakpoint } from '../../../components/common/theme/breakpoints';
import {
  Card as UiCard,
  Input as UiInput,
  FieldLabel as UiFieldLabel,
  Button as UiButton,
} from '../../../components/ui/primitives';

export const RegisterContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing(8)};
  background: ${({ theme }) =>
    `linear-gradient(135deg, ${theme.palette.grey[50]} 0%, ${theme.palette.grey[200]} 100%)`};

  ${breakpoint.down('tablet')} {
    padding: ${({ theme }) => theme.spacing(4)};
  }
`;

export const RegisterCard = styled(UiCard)`
  display: flex;
  background: ${({ theme }) => theme.palette.background.surface};
  border-radius: ${({ theme }) => theme.radii.xl};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  overflow: hidden;
  width: 100%;
  max-width: 1000px;
  min-height: 600px;
  animation: ${fadeIn} 0.6s ease-in;

  ${breakpoint.down('tablet')} {
    flex-direction: column;
    min-height: auto;
  }
`;

export const RegisterCardLeft = styled.div`
  flex: 1;
  background: ${({ theme }) =>
    `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.dark} 100%)`};
  padding: ${({ theme }) => theme.spacing(12)};
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: ${({ theme }) => theme.palette.text.inverse};

  ${breakpoint.down('tablet')} {
    display: none;
  }
`;

export const LeftContent = styled.div`
  text-align: center;
`;

export const LeftTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.size.h1};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  margin-bottom: ${({ theme }) => theme.spacing(4)};
  color: ${({ theme }) => theme.palette.common.white};
`;

export const LeftDescription = styled.p`
  font-size: ${({ theme }) => theme.typography.size.lg};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
  opacity: 0.95;
  color: ${({ theme }) => theme.palette.common.white};
`;

export const RegisterCardRight = styled.div`
  flex: 1;
  padding: ${({ theme }) => theme.spacing(12)};
  display: flex;
  flex-direction: column;
  justify-content: center;

  ${breakpoint.down('tablet')} {
    padding: ${({ theme }) => theme.spacing(8)};
  }

  ${breakpoint.down('mobile')} {
    padding: ${({ theme }) => theme.spacing(6)};
  }
`;

export const BrandContainer = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing(8)};
`;

export const BrandTitle = styled.h1`
  font-size: ${({ theme }) => theme.typography.size.h1};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  margin-bottom: ${({ theme }) => theme.spacing(2)};
  color: ${({ theme }) => theme.palette.text.primary};
`;

export const BrandTagline = styled.p`
  font-size: ${({ theme }) => theme.typography.size.md};
  color: ${({ theme }) => theme.palette.text.secondary};
`;

export const FormTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.size.h2};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  color: ${({ theme }) => theme.palette.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing(8)};
  text-align: center;
`;

export const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(6)};
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(2)};
`;

export const Label = styled(UiFieldLabel)`
  display: block;
  font-size: ${({ theme }) => theme.typography.size.sm};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  color: ${({ theme }) => theme.palette.text.secondary};
`;

export const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

export const InputIcon = styled.span`
  position: absolute;
  left: ${({ theme }) => theme.spacing(4)};
  color: ${({ theme }) => theme.palette.grey[500]};
  display: flex;
  align-items: center;
`;

export const Input = styled(UiInput)`
  width: 100%;
  padding: ${({ theme }) =>
    `${theme.spacing(3)} ${theme.spacing(4)} ${theme.spacing(3)} ${theme.spacing(12)}`};
  border: ${({ theme }) => theme.borderWidth.thin} solid ${({ theme }) => theme.palette.grey[200]};
  border-radius: ${({ theme }) => theme.radii.lg};
  font-size: ${({ theme }) => theme.typography.size.md};
  color: ${({ theme }) => theme.palette.text.primary};
  background: ${({ theme }) => theme.palette.background.subtle};
  transition: all ${({ theme }) => theme.motion.duration.fast};

  &::placeholder {
    color: ${({ theme }) => theme.palette.text.muted};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.palette.secondary.main};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.palette.secondary.main}1A;
    background: ${({ theme }) => theme.palette.background.surface};
  }

  &:disabled {
    background: ${({ theme }) => theme.palette.grey[100]};
    cursor: not-allowed;
  }
`;

export const SubmitButton = styled(UiButton)`
  width: 100%;
  padding: ${({ theme }) => theme.spacing(4)};
  font-size: ${({ theme }) => theme.typography.size.md};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  margin-top: ${({ theme }) => theme.spacing(2)};
`;

export const FormFooter = styled.div`
  text-align: center;
  margin-top: ${({ theme }) => theme.spacing(6)};
  font-size: ${({ theme }) => theme.typography.size.sm};
  color: ${({ theme }) => theme.palette.text.secondary};
`;

export const LoginLink = styled(Link)`
  color: ${({ theme }) => theme.palette.secondary.main};
  text-decoration: none;
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  transition: color ${({ theme }) => theme.motion.duration.fast};

  &:hover {
    color: ${({ theme }) => theme.palette.secondary.dark};
    text-decoration: underline;
  }
`;

export const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.palette.error.dark};
  background: ${({ theme }) => theme.palette.error.light}20;
  padding: ${({ theme }) => theme.spacing(3)};
  border-radius: ${({ theme }) => theme.radii.lg};
  border: ${({ theme }) => theme.borderWidth.thin} solid ${({ theme }) => theme.palette.error.light};
  font-size: ${({ theme }) => theme.typography.size.sm};
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing(4)};
`;

export const SuccessMessage = styled.div`
  color: ${({ theme }) => theme.palette.success.dark};
  background: ${({ theme }) => theme.palette.success.light}20;
  padding: ${({ theme }) => theme.spacing(3)};
  border-radius: ${({ theme }) => theme.radii.lg};
  border: ${({ theme }) => theme.borderWidth.thin} solid
    ${({ theme }) => theme.palette.success.light};
  font-size: ${({ theme }) => theme.typography.size.sm};
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing(4)};
`;

export const PasswordStrengthBar = styled.div`
  height: 4px;
  border-radius: ${({ theme }) => theme.radii.pill};
  background: ${({ theme }) => theme.palette.grey[200]};
  margin-top: ${({ theme }) => theme.spacing(2)};
  overflow: hidden;
`;

export const PasswordStrengthFill = styled.div`
  height: 100%;
  border-radius: ${({ theme }) => theme.radii.pill};
  background: ${({ strength, theme }) => {
    switch (strength) {
      case 'weak':
        return theme.palette.error.main;
      case 'medium':
        return theme.palette.warning.main;
      case 'strong':
        return theme.palette.success.main;
      default:
        return theme.palette.grey[300];
    }
  }};
  width: ${({ strength }) => {
    switch (strength) {
      case 'weak':
        return '33%';
      case 'medium':
        return '66%';
      case 'strong':
        return '100%';
      default:
        return '0%';
    }
  }};
  transition: all ${({ theme }) => theme.motion.duration.normal};
`;

export const PasswordStrengthText = styled.span`
  font-size: ${({ theme }) => theme.typography.size.xs};
  color: ${({ strength, theme }) => {
    switch (strength) {
      case 'weak':
        return theme.palette.error.main;
      case 'medium':
        return theme.palette.warning.main;
      case 'strong':
        return theme.palette.success.main;
      default:
        return theme.palette.text.muted;
    }
  }};
  margin-top: ${({ theme }) => theme.spacing(1)};
  display: block;
`;

export const TermsText = styled.p`
  font-size: ${({ theme }) => theme.typography.size.xs};
  color: ${({ theme }) => theme.palette.text.muted};
  text-align: center;
  margin-top: ${({ theme }) => theme.spacing(4)};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};

  a {
    color: ${({ theme }) => theme.palette.secondary.main};
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;
