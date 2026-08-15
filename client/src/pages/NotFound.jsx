import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { Compass, Home } from 'lucide-react';

import { PageShell } from '../components/layout/PageShell';
import { Button } from '../components/ui';
import { display, text } from '../styles/theme/mixins';

/**
 * 404. Says which address failed, which is the one piece of information the reader has that
 * nobody else does — usually enough to spot a truncated or mistyped link.
 */

const Centre = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing['5xl']} 0;
`;

const Code = styled.p`
  ${display('lg')}
  color: ${({ theme }) => theme.colors.accentText};
`;

const Title = styled.h1`
  ${display('sm')}
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const Body = styled.p`
  ${text('lg')}
  color: ${({ theme }) => theme.colors.textSecondary};
  max-width: 44ch;
`;

const Path = styled.code`
  display: inline-block;
  max-width: 100%;
  overflow-wrap: anywhere;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radii.sm};
  background: ${({ theme }) => theme.colors.surfaceContainer};
  ${text('sm')}
  color: ${({ theme }) => theme.colors.textMuted};
`;

const Actions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-wrap: wrap;
  justify-content: center;
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

export function NotFound() {
  const { pathname } = useLocation();

  return (
    <PageShell $width="narrow">
      <Centre>
        <Code>404</Code>
        <Title>There is nothing at this address</Title>
        <Body>
          The page may have been moved or deleted, or the link that brought you here may be
          incomplete.
        </Body>
        <Path>{pathname}</Path>
        <Actions>
          <Button as={Link} to="/">
            <Home /> Home
          </Button>
          <Button as={Link} to="/search" variant="secondary">
            <Compass /> Explore
          </Button>
        </Actions>
      </Centre>
    </PageShell>
  );
}
