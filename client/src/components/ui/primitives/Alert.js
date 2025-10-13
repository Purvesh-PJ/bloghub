import styled, { css } from 'styled-components';

// Alert variants configuration
const variants = ({ theme, $variant = 'info' }) => {
  const configs = {
    success: {
      bg: theme.palette.success.light,
      border: theme.palette.success.main,
      text: theme.palette.success.dark,
      icon: theme.palette.success.main,
    },
    error: {
      bg: theme.palette.error.light,
      border: theme.palette.error.main,
      text: theme.palette.error.dark,
      icon: theme.palette.error.main,
    },
    warning: {
      bg: theme.palette.warning.light,
      border: theme.palette.warning.main,
      text: theme.palette.warning.dark,
      icon: theme.palette.warning.main,
    },
    info: {
      bg: theme.palette.info.light,
      border: theme.palette.info.main,
      text: theme.palette.info.dark,
      icon: theme.palette.info.main,
    },
  };

  const config = configs[$variant] || configs.info;

  return css`
    background: ${config.bg}20;
    border-color: ${config.border};
    color: ${config.text};

    ${AlertIcon} {
      color: ${config.icon};
    }
  `;
};

// Main Alert container
export const Alert = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing(3)};
  padding: ${({ theme }) => theme.spacing(4)};
  border-radius: ${({ theme }) => theme.radii.lg};
  border: ${({ theme }) => theme.borderWidth.thin} solid transparent;
  font-size: ${({ theme }) => theme.typography.size.sm};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
  ${variants};
  position: relative;
  animation: ${({ theme }) => (theme.mode === 'light' ? 'fadeIn 0.3s ease' : 'none')};

  ${({ $dismissible }) =>
    $dismissible &&
    css`
      padding-right: ${({ theme }) => theme.spacing(10)};
    `}
`;

// Alert icon wrapper
export const AlertIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: ${({ theme }) => theme.spacing(5)};
  height: ${({ theme }) => theme.spacing(5)};
  font-size: ${({ theme }) => theme.typography.size.lg};
`;

// Alert content container
export const AlertContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(1)};
`;

// Alert title
export const AlertTitle = styled.div`
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  font-size: ${({ theme }) => theme.typography.size.sm};
  margin-bottom: ${({ theme }) => theme.spacing(0.5)};
`;

// Alert description
export const AlertDescription = styled.div`
  font-size: ${({ theme }) => theme.typography.size.sm};
  opacity: 0.9;
`;

// Alert close button
export const AlertClose = styled.button`
  position: ${({ $absolute }) => ($absolute ? 'absolute' : 'relative')};
  top: ${({ $absolute, theme }) => ($absolute ? theme.spacing(3) : 'auto')};
  right: ${({ $absolute, theme }) => ($absolute ? theme.spacing(3) : 'auto')};
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${({ theme }) => theme.spacing(6)};
  height: ${({ theme }) => theme.spacing(6)};
  padding: 0;
  border: none;
  background: transparent;
  color: currentColor;
  opacity: 0.6;
  cursor: pointer;
  border-radius: ${({ theme }) => theme.radii.sm};
  transition: all ${({ theme }) => theme.motion.duration.fast};
  flex-shrink: 0;

  &:hover {
    opacity: 1;
    background: currentColor;
    color: ${({ theme }) => theme.palette.common.white};
  }

  &:focus {
    outline: 2px solid currentColor;
    outline-offset: 2px;
  }
`;

// Compose Alert with sub-components
Alert.Icon = AlertIcon;
Alert.Content = AlertContent;
Alert.Title = AlertTitle;
Alert.Description = AlertDescription;
Alert.Close = AlertClose;

export default Alert;
