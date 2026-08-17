import styled from 'styled-components';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './Button';
import { text, media } from '../../styles/theme/mixins';

/**
 * Previous / next paging with a position label.
 *
 * Written twice — once in Stories, once in the admin directory — with the same two buttons,
 * the same disabled rules and two different labels. A third list would have been a third copy.
 *
 * The label is announced politely: paging replaces the rows beneath it without moving focus,
 * so a screen-reader user otherwise gets no confirmation that anything happened.
 */

const Root = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  border-top: 1px solid ${({ theme }) => theme.colors.lineSubtle};

  ${media.down('sm')`
    flex-direction: column;
    align-items: stretch;
  `}
`;

const Label = styled.span`
  ${text('xs')}
  color: ${({ theme }) => theme.colors.textMuted};
  font-variant-numeric: tabular-nums;
`;

const Controls = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`;

/**
 * @param {object} props
 * @param {number} props.page current page, 1-indexed
 * @param {number} props.pages total pages
 * @param {number} [props.total] total items, mentioned in the label when given
 * @param {string} [props.noun] plural noun for the total, e.g. "stories"
 * @param {(page: number) => void} props.onChange
 */
export function Pagination({ page, pages, total, noun = 'items', onChange }) {
  // One page is not worth a control.
  if (!pages || pages <= 1) return null;

  return (
    <Root aria-label="Pagination">
      <Label role="status" aria-live="polite">
        Page {page} of {pages}
        {typeof total === 'number' ? ` · ${total} ${noun}` : ''}
      </Label>

      <Controls>
        <Button
          size="sm"
          variant="secondary"
          disabled={page <= 1}
          onClick={() => onChange(page - 1)}
        >
          <ChevronLeft size={14} /> Previous
        </Button>
        <Button
          size="sm"
          variant="secondary"
          disabled={page >= pages}
          onClick={() => onChange(page + 1)}
        >
          Next <ChevronRight size={14} />
        </Button>
      </Controls>
    </Root>
  );
}
