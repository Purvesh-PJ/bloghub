import styled from 'styled-components';
import { display, text, media } from '../../styles/theme/mixins';

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
};

export const PageShell = styled.div`
  max-width: ${({ theme, $width = 'wide' }) => theme.layout[widths[$width]]};
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing['3xl']} ${({ theme }) => theme.spacing.xl}
    ${({ theme }) => theme.spacing['5xl']};

  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing['3xl']};

  ${media.down('md')`
    padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.lg}
      ${({ theme }) => theme.spacing['4xl']};
    gap: ${({ theme }) => theme.spacing['2xl']};
  `}
`;

const HeaderRow = styled.header`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.xl};
  flex-wrap: wrap;
`;

const Titles = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  min-width: 0;
`;

const Title = styled.h1`
  ${display('sm')}
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const Subtitle = styled.p`
  ${text('md')}
  color: ${({ theme }) => theme.colors.textSecondary};
  max-width: 60ch;
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-shrink: 0;
`;

export function PageHeader({ title, subtitle, actions }) {
  return (
    <HeaderRow>
      <Titles>
        <Title>{title}</Title>
        {subtitle && <Subtitle>{subtitle}</Subtitle>}
      </Titles>
      {actions && <Actions>{actions}</Actions>}
    </HeaderRow>
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
`;

const SectionNote = styled.p`
  ${text('sm')}
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export function Section({ title, note, aside, children }) {
  return (
    <SectionRoot>
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
