import styled from 'styled-components';
import { display, text, label as labelStyle } from '../../styles/theme/mixins';

/**
 * StatTile — a label, one number, and an optional line under it.
 *
 * A primitive, deliberately: it knows nothing about what is being counted. The dashboard's
 * "Read-through / 30.8% / Finished as a share of opened" and the admin console's plain
 * label-and-value tiles are the same shape with different words, and were written separately
 * as `MetricCard` and `Stat` because the shape had never been named.
 *
 * What goes in it is the caller's business. That split is the point — the tile is reusable,
 * the copy inside it is not.
 */

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};

  padding: ${({ theme, $padded }) => ($padded ? theme.spacing.xl : 0)};
  border-radius: ${({ theme }) => theme.radii.xl};
  background: ${({ theme, $padded }) => ($padded ? theme.colors.surfaceElevated : 'transparent')};
  border: ${({ theme, $padded }) => ($padded ? `1px solid ${theme.colors.lineDefault}` : 'none')};
  box-shadow: ${({ theme, $padded }) => ($padded ? theme.elevation.sm : 'none')};
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm};

  ${labelStyle('sm')}
  color: ${({ theme }) => theme.colors.textMuted};
  font-weight: 600;

  svg {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
    color: ${({ theme }) => theme.colors.accentSolid};
  }
`;

const Value = styled.div`
  ${display('sm')}
  color: ${({ theme }) => theme.colors.textPrimary};
  font-weight: 800;
  /* Digits line up between tiles and do not jitter as a number changes. */
  font-variant-numeric: tabular-nums;
  margin-top: 4px;
`;

const Hint = styled.div`
  ${text('xs')}
  color: ${({ theme }) => theme.colors.textSecondary};
`;

/**
 * @param {object} props
 * @param {string} props.label
 * @param {React.ReactNode} props.value
 * @param {string} [props.hint] one line under the number
 * @param {React.ComponentType} [props.icon]
 * @param {boolean} [props.padded] draw the card around it; false for tiles already inside one
 */
export function StatTile({ label, value, hint, icon: Icon, padded = true, ...rest }) {
  return (
    <Root $padded={padded} {...rest}>
      <Header>
        <span>{label}</span>
        {Icon && <Icon />}
      </Header>
      <Value>{value}</Value>
      {hint && <Hint>{hint}</Hint>}
    </Root>
  );
}
