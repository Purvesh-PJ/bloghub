import styled from 'styled-components';
import { AlertTriangle, RotateCw } from 'lucide-react';
import { display, text } from '../../styles/theme/mixins';
import { Surface } from './Surface';
import { Button } from './Button';

/**
 * Error state.
 *
 * The counterpart to EmptyState, and the reason it exists: every list in the workspace fell
 * back to its empty state when a request failed, so a writer with fifty posts saw "No stories
 * written yet — start writing today!" during an outage. A failure has to look like a failure,
 * and it has to offer a way to try again.
 */

const Root = styled(Surface)`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing['3xl']} ${({ theme }) => theme.spacing.xl};
  border: 1px solid ${({ theme }) => theme.colors.dangerLine};
`;

const Icon = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: ${({ theme }) => theme.radii.full};
  background: ${({ theme }) => theme.colors.dangerContainer};
  color: ${({ theme }) => theme.colors.dangerText};

  svg {
    width: 24px;
    height: 24px;
  }
`;

const Title = styled.p`
  ${display('xs')}
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const Body = styled.p`
  ${text('md')}
  color: ${({ theme }) => theme.colors.textSecondary};
  max-width: 46ch;
`;

/**
 * @param {object} props
 * @param {string} [props.title]
 * @param {Error} [props.error] the failure, used only to surface a server-supplied message
 * @param {() => void} [props.onRetry]
 * @param {React.ReactNode} [props.children] overrides the derived message
 */
export function ErrorState({ title = 'That did not load', error, onRetry, children }) {
  // A message the server chose to send is more useful than "Request failed with status code
  // 500"; anything else is noise to the reader.
  const serverMessage = error?.response?.data?.message;
  const isOffline = typeof navigator !== 'undefined' && navigator.onLine === false;

  return (
    <Root $tone="low" $radius="xl">
      <Icon>
        <AlertTriangle />
      </Icon>
      <Title>{title}</Title>
      <Body>
        {children ??
          (isOffline
            ? 'You appear to be offline. Your work is safe — this is only the list failing to load.'
            : (serverMessage ??
              'Something went wrong reaching the server. Nothing has been lost; try again.'))}
      </Body>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          <RotateCw size={14} /> Try again
        </Button>
      )}
    </Root>
  );
}
