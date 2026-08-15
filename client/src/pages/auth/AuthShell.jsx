import styled from 'styled-components';
import { PenLine, BarChart3, MessagesSquare } from 'lucide-react';
import { display, text, label as labelStyle, media } from '../../styles/theme/mixins';
import { topicIcon } from '../../components/marketing/Topics';

/**
 * Shared shell for the auth pages.
 *
 * A split screen rather than a card floating on an empty page. The form sits directly on
 * the surface, and the other half does the job a landing page would: it says what the
 * platform is and what it covers.
 */

const Page = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: calc(100vh - ${({ theme }) => theme.layout.headerHeight});

  ${media.down('lg')`grid-template-columns: 1fr;`}
`;

/* ── Form side ───────────────────────────────────────────────────────────────── */

const FormSide = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing['4xl']} ${({ theme }) => theme.spacing['2xl']};
`;

const FormInner = styled.div`
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};
`;

export const AuthHeading = styled.h1`
  ${display('lg')}
  color: ${({ theme }) => theme.colors.textPrimary};

  ${media.down('md')`font-size: ${({ theme }) => theme.display.md[0]};`}
`;

export const AuthSubheading = styled.p`
  ${text('lg')}
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-top: calc(-1 * ${({ theme }) => theme.spacing.md});
`;

export const AuthForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

export const AuthFooter = styled.p`
  ${text('md')}
  color: ${({ theme }) => theme.colors.textMuted};

  a {
    color: ${({ theme }) => theme.colors.accentText};
    font-weight: ${({ theme }) => theme.weights.medium};

    &:hover {
      text-decoration: underline;
      text-underline-offset: 0.2em;
    }
  }
`;

/* ── Showcase side ───────────────────────────────────────────────────────────── */

const Showcase = styled.aside`
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing['2xl']};
  padding: ${({ theme }) => theme.spacing['4xl']};
  background: ${({ theme }) => theme.colors.surfaceContainerLow};

  ${media.down('lg')`display: none;`}
`;

const Bloom = styled.div`
  position: absolute;
  top: -25%;
  right: -20%;
  width: 70%;
  aspect-ratio: 1;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    ${({ theme }) => theme.colors.accentContainer} 0%,
    transparent 65%
  );
  pointer-events: none;
`;

const Inner = styled.div`
  position: relative;
  max-width: 460px;
  margin: 0 auto;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing['2xl']};
`;

const Kicker = styled.p`
  ${labelStyle('md')}
  color: ${({ theme }) => theme.colors.accentText};
`;

const Pitch = styled.p`
  ${display('md')}
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const Points = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const Point = styled.li`
  display: flex;
  gap: ${({ theme }) => theme.spacing.lg};
  align-items: flex-start;
`;

const PointIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  flex-shrink: 0;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.accentContainer};
  color: ${({ theme }) => theme.colors.accentText};

  svg {
    width: 18px;
    height: 18px;
  }
`;

const PointTitle = styled.p`
  ${text('md', 'semibold')}
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const PointText = styled.p`
  ${text('sm')}
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-top: 2px;
`;

const TopicRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
  padding-top: ${({ theme }) => theme.spacing.xl};
  border-top: 1px solid ${({ theme }) => theme.colors.lineSubtle};
`;

const TopicPill = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radii.full};
  background: ${({ theme }) => theme.colors.surfaceContainer};
  ${text('xs', 'medium')}
  color: ${({ theme }) => theme.colors.textSecondary};

  svg {
    width: 13px;
    height: 13px;
    color: ${({ theme }) => theme.colors.accentText};
  }
`;

const POINTS = [
  {
    icon: PenLine,
    title: 'Write in Markdown',
    text: 'Live preview, code blocks and cover images. Nothing to set up first.',
  },
  {
    icon: BarChart3,
    title: 'See who actually read it',
    text: 'Not just clicks. You also see how many people finished.',
  },
  {
    icon: MessagesSquare,
    title: 'Threaded conversation',
    text: 'Readers reply to each other, follow you and come back.',
  },
];

const TOPICS = ['Technology', 'Design', 'Science', 'Travel', 'Programming', 'Health', 'Food'];

export function AuthShell({ children }) {
  return (
    <Page>
      <FormSide>
        <FormInner>{children}</FormInner>
      </FormSide>

      <Showcase>
        <Bloom aria-hidden="true" />
        <Inner>
          <div>
            <Kicker>BlogHub</Kicker>
            <Pitch>A quieter place to publish what you write.</Pitch>
          </div>

          <Points>
            {POINTS.map(({ icon: Icon, title, text: body }) => (
              <Point key={title}>
                <PointIcon>
                  <Icon />
                </PointIcon>
                <div>
                  <PointTitle>{title}</PointTitle>
                  <PointText>{body}</PointText>
                </div>
              </Point>
            ))}
          </Points>

          <TopicRow>
            {TOPICS.map((name) => {
              const Icon = topicIcon(name);
              return (
                <TopicPill key={name}>
                  <Icon />
                  {name}
                </TopicPill>
              );
            })}
          </TopicRow>
        </Inner>
      </Showcase>
    </Page>
  );
}
