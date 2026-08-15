import * as RadixAvatar from '@radix-ui/react-avatar';
import styled from 'styled-components';

/**
 * Avatar — Radix Avatar underneath.
 *
 * Radix handles the image-loading state machine, so the initials fallback appears only
 * after the image has genuinely failed rather than flashing on every render.
 */

const SIZES = {
  xs: '24px',
  sm: '32px',
  md: '40px',
  lg: '56px',
  xl: '80px',
};

const FONT_SIZES = {
  xs: '10px',
  sm: '12px',
  md: '14px',
  lg: '18px',
  xl: '26px',
};

const Root = styled(RadixAvatar.Root)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  vertical-align: middle;
  overflow: hidden;
  user-select: none;

  width: ${({ $size }) => SIZES[$size]};
  height: ${({ $size }) => SIZES[$size]};
  border-radius: ${({ theme, $shape }) =>
    $shape === 'square' ? theme.radii.md : theme.radii.full};
  background: ${({ theme }) => theme.colors.accentSubtle};
`;

const Image = styled(RadixAvatar.Image)`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Fallback = styled(RadixAvatar.Fallback)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  font-family: ${({ theme }) => theme.fonts.ui};
  font-size: ${({ $size }) => FONT_SIZES[$size]};
  font-weight: ${({ theme }) => theme.weights.semibold};
  color: ${({ theme }) => theme.colors.accentText};
  line-height: 1;
`;

const initialsFrom = (name) =>
  (name || '')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase() || '?';

export function Avatar({ src, name, size = 'md', shape = 'circle', delayMs = 300 }) {
  return (
    <Root $size={size} $shape={shape}>
      {src && <Image src={src} alt={name ? `${name}'s avatar` : 'Avatar'} />}
      {/* delayMs avoids the initials flashing while a fast image loads. */}
      <Fallback $size={size} delayMs={src ? delayMs : 0}>
        {initialsFrom(name)}
      </Fallback>
    </Root>
  );
}
