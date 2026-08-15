import styled, { useTheme, keyframes } from 'styled-components';
import { text, label as labelStyle, media } from '../../styles/theme/mixins';

/**
 * Concept illustrations.
 *
 * Each of these teaches one idea. They are inline SVG built from theme tokens — not
 * screenshots and not grey skeleton boxes — so they re-theme with the application, stay
 * crisp at any size, and cannot go stale when the real UI changes.
 *
 * All are decorative: the surrounding copy carries the meaning for assistive technology.
 */

/* ── 1 · The read gap ─────────────────────────────────────────────────────────
   The argument of the whole page: opened ≠ finished. Two bars, wildly different
   lengths, so the gap is felt before it is read. */

const grow = keyframes`
  from { transform: scaleX(0); }
  to   { transform: scaleX(1); }
`;

const GapWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing['2xl']};
  width: 100%;
`;

const GapRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const GapHead = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const GapLabel = styled.span`
  ${labelStyle('sm')}
  color: ${({ theme }) => theme.colors.textMuted};
`;

const GapValue = styled.span`
  font-size: clamp(2rem, 5vw, 3.5rem);
  line-height: 1;
  font-weight: ${({ theme }) => theme.weights.bold};
  letter-spacing: ${({ theme }) => theme.tracking.tighter};
  font-variant-numeric: tabular-nums;
  color: ${({ theme, $muted }) => ($muted ? theme.colors.textDisabled : theme.colors.textPrimary)};
`;

const GapTrack = styled.div`
  height: 14px;
  border-radius: ${({ theme }) => theme.radii.full};
  background: ${({ theme }) => theme.colors.surfaceContainer};
  overflow: hidden;
`;

const GapFill = styled.div`
  height: 100%;
  width: ${({ $pct }) => $pct}%;
  border-radius: ${({ theme }) => theme.radii.full};
  background: ${({ theme, $accent }) =>
    $accent ? theme.colors.accentSolid : theme.colors.lineStrong};
  transform-origin: left;
  animation: ${grow} 900ms cubic-bezier(0.16, 1, 0.3, 1) both;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const GapNote = styled.p`
  ${text('md')}
  color: ${({ theme }) => theme.colors.textMuted};
  padding-top: ${({ theme }) => theme.spacing.lg};
  border-top: 1px solid ${({ theme }) => theme.colors.lineSubtle};

  strong {
    color: ${({ theme }) => theme.colors.textPrimary};
    font-weight: ${({ theme }) => theme.weights.semibold};
  }
`;

export function ReadGapIllustration({ opened = 1240, finished = 180 }) {
  const rate = Math.round((finished / opened) * 100);

  return (
    <GapWrap aria-hidden="true">
      <GapRow>
        <GapHead>
          <GapLabel>Opened</GapLabel>
          <GapValue $muted>{opened.toLocaleString()}</GapValue>
        </GapHead>
        <GapTrack>
          <GapFill $pct={100} />
        </GapTrack>
      </GapRow>

      <GapRow>
        <GapHead>
          <GapLabel>Finished</GapLabel>
          <GapValue>{finished.toLocaleString()}</GapValue>
        </GapHead>
        <GapTrack>
          <GapFill $pct={rate} $accent />
        </GapTrack>
      </GapRow>

      <GapNote>
        Most platforms only ever show you the first number. The second one is the one that tells you
        whether the piece worked.
      </GapNote>
    </GapWrap>
  );
}

/* ── 2 · Markdown becomes an article ──────────────────────────────────────────
   Shows the actual transformation rather than a picture of an editor. */

const TransformWrap = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};

  ${media.down('sm')`
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing.md};
  `}
`;

const Panel = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.surfaceContainerLow};
  box-shadow: inset 0 0 0 1px ${({ theme }) => theme.colors.lineSubtle};
  min-height: 190px;
`;

const Src = styled.pre`
  font-family: ${({ theme }) => theme.fonts.mono};
  ${text('sm')}
  color: ${({ theme }) => theme.colors.textSecondary};
  white-space: pre-wrap;

  b {
    color: ${({ theme }) => theme.colors.accentText};
    font-weight: ${({ theme }) => theme.weights.medium};
  }
`;

const OutH = styled.div`
  ${text('lg', 'bold')}
  letter-spacing: ${({ theme }) => theme.tracking.tight};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const OutP = styled.p`
  ${text('sm')}
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};

  em {
    font-style: italic;
  }

  b {
    font-weight: ${({ theme }) => theme.weights.semibold};
    color: ${({ theme }) => theme.colors.textPrimary};
  }
`;

const OutCode = styled.code`
  display: block;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radii.sm};
  background: ${({ theme }) => theme.colors.surfaceContainerHigh};
  font-family: ${({ theme }) => theme.fonts.mono};
  ${text('xs')}
  color: ${({ theme }) => theme.colors.accentText};
`;

const Arrow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.radii.full};
  background: ${({ theme }) => theme.colors.accentSolid};
  color: ${({ theme }) => theme.colors.textOnAccent};
  flex-shrink: 0;
  justify-self: center;

  ${media.down('sm')`transform: rotate(90deg);`}
`;

export function MarkdownTransform() {
  return (
    <TransformWrap aria-hidden="true">
      <Panel>
        <Src>
          {`## `}
          <b>Why this matters</b>
          {`\n\nMost teams ship `}
          <b>**blind**</b>
          {`.\nYou need `}
          <b>*evidence*</b>
          {`.\n\n`}
          <b>`readRate`</b>
        </Src>
      </Panel>

      <Arrow>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M5 12h14M13 6l6 6-6 6" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </Arrow>

      <Panel>
        <OutH>Why this matters</OutH>
        <OutP>
          Most teams ship <b>blind</b>.
        </OutP>
        <OutP>
          You need <em>evidence</em>.
        </OutP>
        <OutCode>readRate</OutCode>
      </Panel>
    </TransformWrap>
  );
}

/* ── 3 · Visibility states ────────────────────────────────────────────────────
   draft → private → public, as a flow the reader can follow at a glance. */

const FlowWrap = styled.div`
  display: flex;
  align-items: stretch;
  gap: ${({ theme }) => theme.spacing.md};

  ${media.down('sm')`flex-direction: column;`}
`;

const State = styled.div`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme, $active }) =>
    $active ? theme.colors.accentContainer : theme.colors.surfaceContainerLow};
  box-shadow: inset 0 0 0 1px
    ${({ theme, $active }) => ($active ? theme.colors.accentLine : theme.colors.lineSubtle)};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const StateIcon = styled.div`
  color: ${({ theme, $active }) => ($active ? theme.colors.accentText : theme.colors.textMuted)};
`;

const StateName = styled.div`
  ${text('md', 'semibold')}
  color: ${({ theme, $active }) => ($active ? theme.colors.accentText : theme.colors.textPrimary)};
`;

const StateText = styled.div`
  ${text('sm')}
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const Lock = (props) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
    <rect x="4" y="10" width="16" height="11" rx="2.5" strokeWidth="1.8" />
    <path d="M8 10V7a4 4 0 0 1 8 0v3" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const LinkIcon = (props) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
    <path
      d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

const Globe = (props) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
    <circle cx="12" cy="12" r="9" strokeWidth="1.8" />
    <path d="M3 12h18M12 3a15 15 0 0 1 0 18a15 15 0 0 1 0-18" strokeWidth="1.8" />
  </svg>
);

const STATES = [
  { icon: Lock, name: 'Draft', text: 'Only you. Nothing is shared until you say so.' },
  { icon: LinkIcon, name: 'Private', text: 'Reachable by link. Kept off the public feed.' },
  { icon: Globe, name: 'Public', text: 'On the feed, in search, open to everyone.', active: true },
];

export function VisibilityFlow() {
  return (
    <FlowWrap aria-hidden="true">
      {STATES.map(({ icon: Icon, name, text: body, active }) => (
        <State key={name} $active={active}>
          <StateIcon $active={active}>
            <Icon />
          </StateIcon>
          <StateName $active={active}>{name}</StateName>
          <StateText>{body}</StateText>
        </State>
      ))}
    </FlowWrap>
  );
}

/* ── 4 · Comment thread ───────────────────────────────────────────────────────
   Nesting drawn with connector lines, so "threaded" is shown rather than claimed. */

const ThreadWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const Node = styled.div`
  position: relative;
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin-left: ${({ $depth }) => $depth * 36}px;

  /* Elbow connector into the parent. */
  ${({ $depth, theme }) =>
    $depth > 0 &&
    `
      &::before {
        content: '';
        position: absolute;
        left: -20px;
        top: -12px;
        bottom: 50%;
        width: 14px;
        border-left: 2px solid ${theme.colors.lineDefault};
        border-bottom: 2px solid ${theme.colors.lineDefault};
        border-bottom-left-radius: 10px;
      }
    `}
`;

const Face = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.accentContainer};
  color: ${({ theme }) => theme.colors.accentText};
  ${text('xs', 'semibold')}
`;

const Bubble = styled.div`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.surfaceContainerLow};
`;

const Who = styled.div`
  ${text('xs', 'semibold')}
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 4px;
`;

const What = styled.div`
  ${text('sm')}
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const THREAD = [
  { depth: 0, who: 'maya.dev', what: 'The read-rate number completely changed what I write.' },
  { depth: 1, who: 'arjun', what: 'Same. Turns out my long intros were losing everyone.' },
  { depth: 2, who: 'maya.dev', what: 'Cut mine to two sentences. Rate went from 14% to 41%.' },
];

export function CommentThread() {
  return (
    <ThreadWrap aria-hidden="true">
      {THREAD.map((node, index) => (
        <Node key={index} $depth={node.depth}>
          <Face>{node.who[0].toUpperCase()}</Face>
          <Bubble>
            <Who>{node.who}</Who>
            <What>{node.what}</What>
          </Bubble>
        </Node>
      ))}
    </ThreadWrap>
  );
}

/* ── 5 · Hero product frame ───────────────────────────────────────────────────
   A single restrained frame: the editor, mid-sentence, with its live preview. */

const Frame = styled.div`
  border-radius: ${({ theme }) => theme.radii['2xl']};
  background: ${({ theme }) => theme.colors.surfaceElevated};
  box-shadow:
    inset 0 0 0 1px ${({ theme }) => theme.colors.lineSubtle},
    ${({ theme }) => theme.elevation.xl};
  overflow: hidden;
`;

const Chrome = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.lineSubtle};
`;

const Pip = styled.span`
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.lineStrong};
`;

const Pill = styled.span`
  margin-left: auto;
  padding: 3px ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radii.full};
  background: ${({ theme }) => theme.colors.successContainer};
  color: ${({ theme }) => theme.colors.successText};
  ${text('xs', 'medium')}
`;

const FrameBody = styled.div`
  padding: ${({ theme }) => theme.spacing['2xl']};
`;

export function HeroFrame() {
  return (
    <Frame aria-hidden="true">
      <Chrome>
        <Pip />
        <Pip />
        <Pip />
        <Pill>Published</Pill>
      </Chrome>
      <FrameBody>
        <MarkdownTransform />
      </FrameBody>
    </Frame>
  );
}
