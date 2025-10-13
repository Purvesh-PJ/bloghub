import styled from 'styled-components';

// Icon size configurations
const sizes = {
  xs: '12px',
  sm: '16px',
  md: '20px',
  lg: '24px',
  xl: '32px',
  '2xl': '40px',
  '3xl': '48px',
};

// IconWrapper - Consistent icon sizing
export const IconWrapper = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: ${({ $size = 'md' }) => sizes[$size] || sizes.md};
  height: ${({ $size = 'md' }) => sizes[$size] || sizes.md};
  color: ${({ $color, theme }) => $color || 'currentColor'};
  line-height: 1;

  svg,
  img {
    width: 100%;
    height: 100%;
    display: block;
  }
`;

// Icon with circular background
export const IconCircle = styled(IconWrapper)`
  border-radius: 50%;
  background: ${({ $bg, theme }) => $bg || theme.palette.background.subtle};
  padding: ${({ $padding, theme }) =>
    typeof $padding === 'number' ? theme.spacing($padding) : $padding || theme.spacing(2)};
  width: auto;
  height: auto;
`;

// Icon with square background
export const IconSquare = styled(IconWrapper)`
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ $bg, theme }) => $bg || theme.palette.background.subtle};
  padding: ${({ $padding, theme }) =>
    typeof $padding === 'number' ? theme.spacing($padding) : $padding || theme.spacing(2)};
  width: auto;
  height: auto;
`;

IconWrapper.Circle = IconCircle;
IconWrapper.Square = IconSquare;

export default IconWrapper;
