import * as RadixAvatar from '@radix-ui/react-avatar';
import styled from 'styled-components';

/**
 * Avatar — Radix Avatar underneath.
 *
 * Radix owns the image-loading state machine, so the initials fallback appears only after the
 * image has genuinely failed rather than flashing on every render.
 *
 * This replaced five hand-rolled versions — `Portrait` in PostDetail and UserProfile,
 * `AuthorDot` in PostCard, `AuthorAvatar` in Home, `UserAvatar` in WorkspaceLayout — which
 * were the same circle at five sizes, each with `color: #ffffff` written into it. Two things
 * were wrong with that beyond the repetition: none of them could render an uploaded image at
 * all, so the avatar upload never showed anywhere outside settings; and the hardcoded white
 * repeated the contrast mistake the theme had just stopped making.
 */

const SIZES = {
  xs: { box: '24px', font: '11px' },
  sm: { box: '32px', font: '12px' },
  md: { box: '40px', font: '14px' },
  lg: { box: '48px', font: '17px' },
  xl: { box: '64px', font: '22px' },
  '2xl': { box: '96px', font: '32px' },
};

const Root = styled(RadixAvatar.Root)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  vertical-align: middle;
  overflow: hidden;
  user-select: none;

  width: ${({ $size }) => SIZES[$size].box};
  height: ${({ $size }) => SIZES[$size].box};
  border-radius: ${({ theme, $shape }) =>
    $shape === 'square' ? theme.radii.md : theme.radii.full};
  background: ${({ theme }) => theme.gradients.brand};
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
  font-size: ${({ $size }) => SIZES[$size].font};
  font-weight: ${({ theme }) => theme.weights.bold};
  /* Derived by the theme rather than written as white, which the brand's light end cannot carry. */
  color: ${({ theme }) => theme.colors.textOnAccent};
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

/**
 * @param {object} props
 * @param {string} [props.src] image URL, or a data URI as getUser returns
 * @param {string} [props.name] used for the initials and the alt text
 * @param {'xs'|'sm'|'md'|'lg'|'xl'|'2xl'} [props.size]
 * @param {'circle'|'square'} [props.shape]
 */
export function Avatar({ src, name, size = 'md', shape = 'circle', delayMs = 300, ...rest }) {
  return (
    <Root $size={size} $shape={shape} {...rest}>
      {src && <Image src={src} alt={name ? `${name}'s avatar` : 'Avatar'} />}
      {/* delayMs avoids the initials flashing while a fast image loads. */}
      <Fallback $size={size} delayMs={src ? delayMs : 0}>
        {initialsFrom(name)}
      </Fallback>
    </Root>
  );
}
