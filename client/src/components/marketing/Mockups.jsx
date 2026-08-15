import styled, { keyframes } from 'styled-components';
import { Heart, MessageCircle, TrendingUp, Eye } from 'lucide-react';
import { text, label as labelStyle, media } from '../../styles/theme/mixins';

/**
 * Marketing mockups.
 *
 * Small, purely decorative renderings of the product used to illustrate the landing page.
 * They are built from theme tokens rather than screenshots, so they re-theme with the rest
 * of the application and never go stale when the real UI changes.
 *
 * All of them are aria-hidden — they are pictures of software, not software.
 */

const Frame = styled.div`
  border-radius: ${({ theme }) => theme.radii.xl};
  background: ${({ theme }) => theme.colors.surfaceElevated};
  box-shadow:
    inset 0 0 0 1px ${({ theme }) => theme.colors.lineSubtle},
    ${({ theme }) => theme.elevation.xl};
  overflow: hidden;
  user-select: none;
`;

const TitleBar = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.surfaceContainerLow};
  border-bottom: 1px solid ${({ theme }) => theme.colors.lineSubtle};
`;

const Dot = styled.span`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.lineStrong};
`;

const TabPill = styled.span`
  margin-left: auto;
  padding: 4px ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radii.full};
  background: ${({ theme }) => theme.colors.accentContainer};
  color: ${({ theme }) => theme.colors.accentText};
  ${text('xs', 'medium')}
`;

/* ── Editor ──────────────────────────────────────────────────────────────────── */

const EditorBody = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 300px;

  ${media.down('sm')`grid-template-columns: 1fr;`}
`;

const Pane = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};

  & + & {
    border-left: 1px solid ${({ theme }) => theme.colors.lineSubtle};
    background: ${({ theme }) => theme.colors.surfaceContainerLow};
  }
`;

const Mono = styled.span`
  font-family: ${({ theme }) => theme.fonts.mono};
  ${text('sm')}
  color: ${({ theme, $accent }) =>
    $accent ? theme.colors.accentText : theme.colors.textSecondary};
`;

const RenderedH = styled.div`
  ${text('lg', 'semibold')}
  color: ${({ theme }) => theme.colors.textPrimary};
`;

/* Skeleton lines stand in for body copy without inventing filler text. */
const Line = styled.div`
  height: ${({ $h }) => $h ?? 8}px;
  width: ${({ $w }) => $w ?? '100%'};
  border-radius: ${({ theme }) => theme.radii.full};
  background: ${({ theme }) => theme.colors.surfaceContainerHigh};
`;

const caret = keyframes`
  0%, 49% { opacity: 1; }
  50%, 100% { opacity: 0; }
`;

const Caret = styled.span`
  display: inline-block;
  width: 2px;
  height: 15px;
  vertical-align: text-bottom;
  background: ${({ theme }) => theme.colors.accentSolid};
  animation: ${caret} 1.1s steps(1) infinite;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

export function EditorMockup() {
  return (
    <Frame aria-hidden="true">
      <TitleBar>
        <Dot />
        <Dot />
        <Dot />
        <TabPill>Draft</TabPill>
      </TitleBar>
      <EditorBody>
        <Pane>
          <Mono $accent># Shipping fast without</Mono>
          <Mono $accent># breaking things</Mono>
          <Mono>
            Every deploy used to be a gamble
            <Caret />
          </Mono>
          <Line $w="92%" />
          <Line $w="78%" />
          <Mono $accent>## The turning point</Mono>
          <Line $w="86%" />
          <Line $w="64%" />
        </Pane>
        <Pane>
          <RenderedH>Shipping fast without breaking things</RenderedH>
          <Line $w="96%" />
          <Line $w="88%" />
          <Line $w="70%" />
          <RenderedH style={{ fontSize: '15px' }}>The turning point</RenderedH>
          <Line $w="92%" />
          <Line $w="60%" />
        </Pane>
      </EditorBody>
    </Frame>
  );
}

/* ── Analytics ───────────────────────────────────────────────────────────────── */

const AnalyticsBody = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};
`;

const StatRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => theme.spacing.md};
`;

const Stat = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.surfaceContainerLow};
`;

const StatLabel = styled.div`
  ${labelStyle('sm')}
  color: ${({ theme }) => theme.colors.textMuted};
  display: flex;
  align-items: center;
  gap: 6px;

  svg {
    width: 12px;
    height: 12px;
  }
`;

const StatValue = styled.div`
  ${text('xl', 'semibold')}
  color: ${({ theme }) => theme.colors.textPrimary};
  font-variant-numeric: tabular-nums;
  margin-top: 4px;
`;

/* A bar chart drawn from a plain array — no charting dependency for a decorative element. */
const Chart = styled.div`
  display: flex;
  align-items: flex-end;
  gap: ${({ theme }) => theme.spacing.sm};
  height: 110px;
`;

const Bar = styled.div`
  flex: 1;
  height: ${({ $h }) => $h}%;
  border-radius: ${({ theme }) => theme.radii.sm};
  background: ${({ theme, $strong }) =>
    $strong ? theme.colors.accentSolid : theme.colors.accentContainer};
`;

const BARS = [34, 52, 41, 68, 57, 84, 72, 96, 78, 61, 88, 100];

export function AnalyticsMockup() {
  return (
    <Frame aria-hidden="true">
      <TitleBar>
        <Dot />
        <Dot />
        <Dot />
        <TabPill>Last 30 days</TabPill>
      </TitleBar>
      <AnalyticsBody>
        <StatRow>
          <Stat>
            <StatLabel>
              <Eye /> Views
            </StatLabel>
            <StatValue>12,480</StatValue>
          </Stat>
          <Stat>
            <StatLabel>
              <TrendingUp /> Read rate
            </StatLabel>
            <StatValue>68%</StatValue>
          </Stat>
          <Stat>
            <StatLabel>
              <Heart /> Likes
            </StatLabel>
            <StatValue>1,902</StatValue>
          </Stat>
        </StatRow>
        <Chart>
          {BARS.map((height, index) => (
            <Bar key={index} $h={height} $strong={index >= BARS.length - 4} />
          ))}
        </Chart>
      </AnalyticsBody>
    </Frame>
  );
}

/* ── Community ───────────────────────────────────────────────────────────────── */

const CommunityBody = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const Comment = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.surfaceContainerLow};
  margin-left: ${({ $indent }) => ($indent ? '32px' : '0')};
`;

const Face = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  flex-shrink: 0;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.accentContainer};
  color: ${({ theme }) => theme.colors.accentText};
  ${text('xs', 'semibold')}
`;

const CommentBody = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Who = styled.span`
  ${text('xs', 'semibold')}
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const Reactions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  ${text('xs')}
  color: ${({ theme }) => theme.colors.textMuted};

  svg {
    width: 12px;
    height: 12px;
  }

  span {
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }
`;

export function CommunityMockup() {
  return (
    <Frame aria-hidden="true">
      <TitleBar>
        <Dot />
        <Dot />
        <Dot />
        <TabPill>14 comments</TabPill>
      </TitleBar>
      <CommunityBody>
        <Comment>
          <Face>M</Face>
          <CommentBody>
            <Who>maya.dev</Who>
            <Line $w="94%" />
            <Line $w="52%" />
            <Reactions>
              <span>
                <Heart /> 24
              </span>
              <span>
                <MessageCircle /> Reply
              </span>
            </Reactions>
          </CommentBody>
        </Comment>

        <Comment $indent>
          <Face>A</Face>
          <CommentBody>
            <Who>arjun</Who>
            <Line $w="88%" />
            <Reactions>
              <span>
                <Heart /> 8
              </span>
            </Reactions>
          </CommentBody>
        </Comment>

        <Comment>
          <Face>S</Face>
          <CommentBody>
            <Who>sara.writes</Who>
            <Line $w="76%" />
            <Line $w="44%" />
          </CommentBody>
        </Comment>
      </CommunityBody>
    </Frame>
  );
}
