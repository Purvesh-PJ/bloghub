import styled from 'styled-components';
import { display, text, label as labelStyle, media } from '../../styles/theme/mixins';

/**
 * The frame every signed-in page sits in.
 *
 * Each page used to declare its own wrapper and its own header block, which is why the
 * measures, the top padding and the title sizes all disagreed with each other. Width and
 * rhythm are decided once, here.
 */

const widths = {
  wide: 'maxWidth', // dashboards, listings
  narrow: 'maxWidthNarrow', // settings, forms
  reading: 'contentWidth', // article bodies
  full: '100%',
};

export const PageShell = styled.div`
  max-width: ${({ theme, $width = 'wide' }) =>
    $width === 'full' ? '100%' : theme.layout[widths[$width]] || theme.layout.maxWidth};
  width: 100%;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.xl}
    ${({ theme }) => theme.spacing['5xl']};

  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};

  ${media.down('md')`
    padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.md}
      ${({ theme }) => theme.spacing['4xl']};
    gap: ${({ theme }) => theme.spacing.lg};
  `}
`;

const HeaderContainer = styled.header`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  padding-bottom: ${({ theme, $divider }) => ($divider ? theme.spacing.xl : '0')};
  border-bottom: ${({ theme, $divider }) =>
    $divider ? `1px solid ${theme.colors.lineSubtle}` : 'none'};

  ${media.down('md')`
    padding-bottom: ${({ theme, $divider }) => ($divider ? theme.spacing.lg : '0')};
  `}
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.xl};
  flex-wrap: wrap;
`;

const Titles = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  min-width: 0;
  flex: 1;
`;

const HeaderBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  width: fit-content;
  padding: 2px 8px;
  border-radius: ${({ theme }) => theme.radii.full};
  background: ${({ theme }) => theme.colors.accentContainer};
  color: ${({ theme }) => theme.colors.accentText};
  ${labelStyle('xs')}
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  margin-bottom: 2px;
`;

const Title = styled.h1`
  ${display('sm')}
  color: ${({ theme }) => theme.colors.textPrimary};
  letter-spacing: -0.02em;
  line-height: 1.15;
`;

const Subtitle = styled.p`
  ${text('md')}
  color: ${({ theme }) => theme.colors.textSecondary};
  max-width: 65ch;
  line-height: 1.5;
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-shrink: 0;
  flex-wrap: wrap;
`;

/**
 * PageHeader
 *
 * Distinct hero/header component that creates a clear visual boundary
 * between page intent and the data/components below it.
 */
export function PageHeader({ badge, title, subtitle, actions, divider = true }) {
  return (
    <HeaderContainer $divider={divider}>
      <HeaderRow>
        <Titles>
          {badge && <HeaderBadge>{badge}</HeaderBadge>}
          <Title>{title}</Title>
          {subtitle && <Subtitle>{subtitle}</Subtitle>}
        </Titles>
        {actions && <Actions>{actions}</Actions>}
      </HeaderRow>
    </HeaderContainer>
  );
}

/* ── Section ─────────────────────────────────────────────────────────────────
   A titled block within a page. Gives every section the same heading weight and
   the same gap to its body, which is what makes a long page scan cleanly. */

const SectionRoot = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  min-width: 0;
`;

const SectionHead = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.lg};
  flex-wrap: wrap;
`;

const SectionTitle = styled.h2`
  ${display('xs')}
  color: ${({ theme }) => theme.colors.textPrimary};
  letter-spacing: -0.01em;
`;

const SectionNote = styled.p`
  ${text('sm')}
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-top: 2px;
`;

export function Section({ title, note, aside, children, ...props }) {
  return (
    <SectionRoot {...props}>
      {(title || aside) && (
        <SectionHead>
          <div>
            {title && <SectionTitle>{title}</SectionTitle>}
            {note && <SectionNote>{note}</SectionNote>}
          </div>
          {aside}
        </SectionHead>
      )}
      {children}
    </SectionRoot>
  );
}
