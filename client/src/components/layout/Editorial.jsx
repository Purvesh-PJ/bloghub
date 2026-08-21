import styled, { css } from 'styled-components';
import { display, text, label as labelStyle, media } from '../../styles/theme/mixins';

/**
 * Editorial layout devices.
 *
 * Every page in the application had the same bones: a centred 1200px column, a title with a
 * subtitle under it, then a stack of cards. Changing the palette does not fix that — a page
 * built from identical blocks reads as monotonous whatever colour the blocks are.
 *
 * These are the pieces that break the column: a band that escapes it entirely, a block that
 * inverts against the page, and section numerals set large enough to be furniture rather
 * than labels. Used sparingly, they give a long page a rhythm to scroll through.
 */

/**
 * Escapes the centred column and runs the full width of the viewport.
 *
 * The margin trick rather than `position: absolute` so the band still participates in flow
 * and pushes what follows. `overflow-x: clip` on the page prevents the 100vw from creating a
 * horizontal scrollbar where a scrollbar is already present.
 */
export const FullBleed = styled.div`
  width: 100vw;
  margin-left: calc(50% - 50vw);
  margin-right: calc(50% - 50vw);
`;

/**
 * A block that inverts against the page: near-black in light mode, and the palest sand in
 * dark. Two or three of these down a long page do more for rhythm than any amount of
 * spacing, because the eye registers the change of ground before it reads a word.
 */
export const Inverted = styled(FullBleed)`
  background: ${({ theme }) =>
    theme.mode === 'light' ? theme.gradients.brand : theme.gradients.inkDeep};
  color: ${({ theme }) => theme.colors.textOnInk};
  padding: ${({ theme }) => theme.spacing['6xl']} 0;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1);

  h1,
  h2,
  h3 {
    color: ${({ theme }) => theme.colors.textOnInk};
  }

  ${media.down('md')`
    padding: ${({ theme }) => theme.spacing['4xl']} 0;
  `}
`;

/** Re-establishes the reading column inside a full-bleed band. */
export const Column = styled.div`
  max-width: ${({ theme, $width }) => theme.layout[$width ?? 'maxWidth']};
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.xl};

  ${media.down('md')`padding: 0 ${({ theme }) => theme.spacing.lg};`}
`;

/* ── Numbered section ────────────────────────────────────────────────────────
   The numeral is set at display size and hangs in the left margin on wide
   screens, so the section reads as an item in a sequence rather than as one more
   heading. Below lg it comes inline, where there is no margin to hang in. */

const NumberedRoot = styled.section`
  position: relative;
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: ${({ theme }) => theme.spacing['2xl']};
  align-items: start;

  ${media.down('lg')`
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing.lg};
  `}
`;

const Numeral = styled.span`
  ${display('lg')}
  color: ${({ theme }) => theme.colors.accentText};
  line-height: 0.9;
  font-variant-numeric: tabular-nums;

  ${media.down('lg')`
    ${display('sm')}
    color: ${({ theme }) => theme.colors.accentText};
  `}
`;

const NumberedBody = styled.div`
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const Rule = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => theme.colors.lineSubtle};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

export function Numbered({ n, children, rule = true, ...props }) {
  return (
    <div {...props}>
      {rule && <Rule />}
      <NumberedRoot>
        <Numeral aria-hidden="true">{String(n).padStart(2, '0')}</Numeral>
        <NumberedBody>{children}</NumberedBody>
      </NumberedRoot>
    </div>
  );
}

/* ── Type helpers used across the marketing page ─────────────────────────── */

export const Kicker = styled.p`
  ${labelStyle('sm')}
  color: ${({ theme }) => theme.colors.accentText};
`;

export const Headline = styled.h2`
  ${display('md')}
  color: ${({ theme }) => theme.colors.textPrimary};
  max-width: 18ch;
`;

export const Body = styled.p`
  ${text('lg')}
  color: ${({ theme }) => theme.colors.textSecondary};
  max-width: 56ch;
`;

/**
 * An asymmetric two-column row that alternates which side the visual sits on.
 * Alternating is the cheapest way to stop a run of feature sections looking like a list.
 */
export const Split = styled.div`
  display: grid;
  grid-template-columns: ${({ $flip }) => ($flip ? '1.1fr 0.9fr' : '0.9fr 1.1fr')};
  gap: ${({ theme }) => theme.spacing['3xl']};
  align-items: center;

  ${({ $flip }) =>
    $flip &&
    css`
      direction: rtl;

      > * {
        direction: ltr;
      }
    `}

  ${media.down('md')`
    grid-template-columns: 1fr;
    direction: ltr;
    gap: ${({ theme }) => theme.spacing.xl};
  `}
`;
