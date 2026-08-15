import styled from 'styled-components';
import { text, label as labelStyle, media } from '../../styles/theme/mixins';

/**
 * Table — the admin console's data primitive.
 *
 * The three admin listings used @radix-ui/themes' Table, which rendered unstyled because
 * that package was never given its stylesheet or provider. This is the same structure on
 * theme tokens, with no borders between rows: separation comes from a hairline and from
 * row hover, in keeping with the rest of the design language.
 *
 * Wrap it in Table.Scroll on narrow screens — a data table is the one place where
 * horizontal scrolling beats reflowing, because the columns mean something together.
 */

const Scroll = styled.div`
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;

  /* The scrollbar should not draw attention until it is needed. */
  scrollbar-width: thin;
`;

const Root = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;

  ${media.down('md')`
    min-width: 640px;
  `}
`;

const Head = styled.thead`
  th {
    padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
    ${labelStyle('sm')}
    color: ${({ theme }) => theme.colors.textMuted};
    white-space: nowrap;
    border-bottom: 1px solid ${({ theme }) => theme.colors.lineSubtle};
  }
`;

const Body = styled.tbody`
  tr {
    transition: background ${({ theme }) => theme.transitions.fast};
  }

  tr:hover {
    background: ${({ theme }) => theme.colors.surfaceContainer};
  }

  tr + tr td {
    box-shadow: inset 0 1px 0 ${({ theme }) => theme.colors.lineSubtle};
  }

  td {
    padding: ${({ theme }) => theme.spacing.lg};
    ${text('sm')}
    color: ${({ theme }) => theme.colors.textSecondary};
    vertical-align: middle;
  }

  /* First column carries the identity of the row, so it reads as primary. */
  td:first-child {
    ${text('sm', 'medium')}
    color: ${({ theme }) => theme.colors.textPrimary};
  }
`;

const Empty = styled.td`
  padding: ${({ theme }) => theme.spacing['4xl']} ${({ theme }) => theme.spacing.lg} !important;
  text-align: center;
  color: ${({ theme }) => theme.colors.textMuted} !important;
`;

export function Table({ children, ...props }) {
  return (
    <Scroll>
      <Root {...props}>{children}</Root>
    </Scroll>
  );
}

Table.Head = Head;
Table.Body = Body;
Table.Row = 'tr';
Table.Cell = 'td';
Table.HeaderCell = 'th';
Table.Empty = Empty;
