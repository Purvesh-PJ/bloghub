import { Avatar as RadixAvatar } from '@radix-ui/themes';
import styled from 'styled-components';

const StyledAvatar = styled(RadixAvatar)`
  flex-shrink: 0;
`;

export function Avatar({
  src,
  fallback = 'U',
  size = '3',
  radius = 'full',
  color = 'indigo',
  ...props
}) {
  const initial = typeof fallback === 'string' ? fallback[0]?.toUpperCase() : 'U';

  return (
    <StyledAvatar
      src={src}
      fallback={initial}
      size={size}
      radius={radius}
      color={color}
      {...props}
    />
  );
}
