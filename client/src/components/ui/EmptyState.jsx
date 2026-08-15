import styled from 'styled-components';
import { display, text } from '../../styles/theme/mixins';
import { Surface } from './Surface';

/**
 * Empty state.
 *
 * The pages each had their own, and most said only "No posts yet" — which tells somebody
 * who has just signed up nothing about what to do next. An empty state is the first thing
 * a new account sees on most of these pages, so it gets a real explanation and a way out.
 */

const Root = styled(Surface)`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing['4xl']} ${({ theme }) => theme.spacing.xl};
`;

const Icon = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: ${({ theme }) => theme.radii.full};
  background: ${({ theme }) => theme.colors.surfaceContainerHigh};
  color: ${({ theme }) => theme.colors.textSecondary};

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

const Actions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-wrap: wrap;
  justify-content: center;
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

export function EmptyState({ icon: IconComponent, title, children, actions, tone = 'low' }) {
  return (
    <Root $tone={tone} $radius="xl">
      {IconComponent && (
        <Icon>
          <IconComponent />
        </Icon>
      )}
      {title && <Title>{title}</Title>}
      {children && <Body>{children}</Body>}
      {actions && <Actions>{actions}</Actions>}
    </Root>
  );
}
