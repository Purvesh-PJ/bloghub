import styled, { css, keyframes } from 'styled-components';

// Indeterminate animation
const indeterminate = keyframes`
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(400%);
  }
`;

// Progress variants
const variants = ({ theme, $variant = 'default' }) => {
  const configs = {
    default: theme.palette.primary.main,
    success: theme.palette.success.main,
    error: theme.palette.error.main,
    warning: theme.palette.warning.main,
    info: theme.palette.info.main,
  };
  return configs[$variant] || configs.default;
};

// Progress container
export const ProgressBar = styled.div`
  width: 100%;
  height: ${({ $size, theme }) => {
    if ($size === 'sm') return theme.spacing(1);
    if ($size === 'lg') return theme.spacing(3);
    return theme.spacing(2);
  }};
  background: ${({ theme }) => theme.palette.grey[200]};
  border-radius: ${({ theme }) => theme.radii.pill};
  overflow: hidden;
  position: relative;
`;

// Progress fill
export const ProgressFill = styled.div`
  height: 100%;
  background: ${variants};
  border-radius: ${({ theme }) => theme.radii.pill};
  transition: width ${({ theme }) => theme.motion.duration.normal} ease-out;
  width: ${({ $value }) => `${Math.min(Math.max($value || 0, 0), 100)}%`};
  position: relative;

  ${({ $indeterminate }) =>
    $indeterminate &&
    css`
      width: 25%;
      animation: ${indeterminate} 1.5s ease-in-out infinite;
    `}

  ${({ $striped, theme }) =>
    $striped &&
    css`
      background-image: linear-gradient(
        45deg,
        ${theme.palette.common.white}25 25%,
        transparent 25%,
        transparent 50%,
        ${theme.palette.common.white}25 50%,
        ${theme.palette.common.white}25 75%,
        transparent 75%,
        transparent
      );
      background-size: 1rem 1rem;
    `}

  ${({ $animated }) =>
    $animated &&
    css`
      @keyframes progress-stripes {
        from {
          background-position: 1rem 0;
        }
        to {
          background-position: 0 0;
        }
      }
      animation: progress-stripes 1s linear infinite;
    `}
`;

// Progress label
export const ProgressLabel = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing(2)};
  font-size: ${({ theme }) => theme.typography.size.sm};
  color: ${({ theme }) => theme.palette.text.secondary};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
`;

// Progress wrapper with label
export const ProgressWrapper = styled.div`
  width: 100%;
`;

// Compose ProgressBar with sub-components
ProgressBar.Fill = ProgressFill;
ProgressBar.Label = ProgressLabel;
ProgressBar.Wrapper = ProgressWrapper;

export default ProgressBar;
