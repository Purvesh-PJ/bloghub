import styled from 'styled-components';
import { display, text, label as labelStyle } from '../../styles/theme/mixins';

/**
 * Read-through rate — the one number this platform exists to show.
 *
 * A view is somebody opening a post. A read is somebody reaching the end. The gap between
 * the two is the only figure here that a like count cannot stand in for, so it is drawn
 * rather than printed: the track is everyone who opened it, the fill is everyone who stayed.
 *
 * Deliberately not colour-coded by value. A low rate on a long technical piece is not a
 * failure, and tinting it red would have the interface pass a judgement it has no basis for.
 */

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme, $size }) => ($size === 'sm' ? theme.spacing.xs : theme.spacing.sm)};
  min-width: 0;
`;

const Track = styled.div`
  position: relative;
  height: ${({ $size }) => ($size === 'sm' ? '6px' : '10px')};
  border-radius: ${({ theme }) => theme.radii.full};
  background: ${({ theme }) => theme.colors.surfaceContainerHigh};
  overflow: hidden;
`;

const Fill = styled.div`
  height: 100%;
  width: ${({ $percent }) => $percent}%;
  border-radius: ${({ theme }) => theme.radii.full};
  background: ${({ theme }) => theme.colors.accentSolid};
  transition: width ${({ theme }) => theme.transitions.slow};

  /* A post with a handful of finishers should still show a mark rather than nothing. */
  min-width: ${({ $percent }) => ($percent > 0 ? '4px' : '0')};

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

const Legend = styled.div`
  display: flex;
  align-items: baseline;
  gap: ${({ theme }) => theme.spacing.sm};
  ${text('xs')}
  color: ${({ theme }) => theme.colors.textMuted};
  white-space: nowrap;
`;

const Percent = styled.span`
  ${text('xs', 'semibold')}
  color: ${({ theme }) => theme.colors.textPrimary};
  font-variant-numeric: tabular-nums;
`;

/* ── Headline variant ────────────────────────────────────────────────────────
   The same figure at the top of the dashboard, where it is the page's thesis
   rather than a row detail. */

const HeadlineRoot = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const Numbers = styled.div`
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xl};
`;

const Figure = styled.div`
  display: flex;
  align-items: baseline;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Value = styled.span`
  ${display('sm')}
  color: ${({ theme, $accent }) => ($accent ? theme.colors.accentText : theme.colors.textPrimary)};
  font-variant-numeric: tabular-nums;
`;

const Caption = styled.span`
  ${labelStyle('sm')}
  color: ${({ theme }) => theme.colors.textMuted};
`;

const format = (n) => new Intl.NumberFormat().format(n ?? 0);

/** Compact bar for table rows and cards. */
export function ReadRateBar({ views = 0, reads = 0, rate, size = 'sm', showLegend = true }) {
  const percent = rate ?? (views > 0 ? (reads / views) * 100 : 0);
  const clamped = Math.max(0, Math.min(100, percent));

  return (
    <Root
      $size={size}
      role="img"
      aria-label={`${format(reads)} of ${format(views)} readers finished, ${clamped.toFixed(0)} percent`}
    >
      <Track $size={size}>
        <Fill $percent={clamped} />
      </Track>
      {showLegend && (
        <Legend>
          <Percent>{clamped.toFixed(0)}%</Percent>
          <span>
            {format(reads)} of {format(views)} finished
          </span>
        </Legend>
      )}
    </Root>
  );
}

/** The same figure as a page-level statement. */
export function ReadRateHeadline({ views = 0, reads = 0, rate }) {
  const percent = rate ?? (views > 0 ? (reads / views) * 100 : 0);
  const clamped = Math.max(0, Math.min(100, percent));

  return (
    <HeadlineRoot>
      <Numbers>
        <Figure>
          <Value>{format(views)}</Value>
          <Caption>opened</Caption>
        </Figure>
        <Figure>
          <Value $accent>{format(reads)}</Value>
          <Caption>finished</Caption>
        </Figure>
        <Figure>
          <Value>{clamped.toFixed(0)}%</Value>
          <Caption>read through</Caption>
        </Figure>
      </Numbers>
      <Track $size="lg">
        <Fill $percent={clamped} />
      </Track>
    </HeadlineRoot>
  );
}
