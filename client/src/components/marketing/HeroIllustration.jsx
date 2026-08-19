import styled, { keyframes } from 'styled-components';
import { Sparkles, PenLine, Heart, MessageSquare, TrendingUp, CheckCircle2 } from 'lucide-react';
import { media, text } from '../../styles/theme/mixins';

const floatSlow = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-8px) rotate(0.5deg); }
`;

const floatReverse = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(6px) rotate(-1deg); }
`;

const pulseGlow = keyframes`
  0%, 100% { opacity: 0.45; transform: scale(1); }
  50% { opacity: 0.7; transform: scale(1.06); }
`;

const IllustrationWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 520px;
  margin: 0 auto;
  user-select: none;

  ${media.down('lg')`
    max-width: 460px;
    margin-top: ${({ theme }) => theme.spacing.xl};
  `}

  ${media.down('sm')`
    max-width: 100%;
  `}
`;

const AmbientGlow = styled.div`
  position: absolute;
  top: 15%;
  left: 20%;
  width: 320px;
  height: 320px;
  background: radial-gradient(
    circle,
    ${({ theme }) => theme.colors.accentContainer} 0%,
    rgba(14, 165, 233, 0.15) 45%,
    transparent 70%
  );
  filter: blur(48px);
  z-index: 0;
  pointer-events: none;
  animation: ${pulseGlow} 6s ease-in-out infinite;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const MainCanvas = styled.div`
  position: relative;
  z-index: 1;
  background: ${({ theme }) => theme.colors.surfaceElevated};
  border: 1px solid ${({ theme }) => theme.colors.lineSubtle};
  border-radius: ${({ theme }) => theme.radii['2xl']};
  padding: ${({ theme }) => theme.spacing.xl};
  box-shadow:
    0 24px 48px -12px rgba(15, 23, 42, 0.12),
    0 4px 16px -2px rgba(14, 165, 233, 0.08);
  animation: ${floatSlow} 7s ease-in-out infinite;
  backdrop-filter: blur(16px);
  transition: all 300ms ease;

  &:hover {
    box-shadow:
      0 32px 64px -12px rgba(15, 23, 42, 0.18),
      0 8px 24px -2px rgba(14, 165, 233, 0.15);
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const WindowHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid ${({ theme }) => theme.colors.lineSubtle};
`;

const WindowDots = styled.div`
  display: flex;
  gap: 6px;

  span {
    width: 10px;
    height: 10px;
    border-radius: 50%;

    &:nth-child(1) { background: #ef4444; opacity: 0.8; }
    &:nth-child(2) { background: #f59e0b; opacity: 0.8; }
    &:nth-child(3) { background: #10b981; opacity: 0.8; }
  }
`;

const WindowStatus = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  ${text('xs', 'medium')}
  color: ${({ theme }) => theme.colors.textMuted};

  span.indicator {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #10b981;
  }
`;

const ArticlePreview = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const TagStrip = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 4px;
`;

const TagChip = styled.span`
  ${text('xs', 'semibold')}
  padding: 3px 10px;
  border-radius: ${({ theme }) => theme.radii.full};
  background: ${({ theme }) => theme.colors.accentContainer};
  color: ${({ theme }) => theme.colors.accentText};
`;

const StoryTitle = styled.div`
  ${text('lg', 'bold')}
  color: ${({ theme }) => theme.colors.textPrimary};
  line-height: 1.35;
  letter-spacing: -0.02em;
`;

const AuthorRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 6px 0 10px;
`;

const AvatarPlaceholder = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: linear-gradient(135deg, #0ea5e9, #6366f1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 11px;
`;

const AuthorMeta = styled.div`
  ${text('xs', 'medium')}
  color: ${({ theme }) => theme.colors.textSecondary};

  span.time {
    color: ${({ theme }) => theme.colors.textMuted};
  }
`;

const TextSkeleton = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 4px;

  .line {
    height: 8px;
    border-radius: 4px;
    background: ${({ theme }) => theme.colors.surfaceContainer};

    &.l1 { width: 94%; }
    &.l2 { width: 86%; }
    &.l3 { width: 68%; }
  }
`;

const MarkdownCallout = styled.div`
  margin-top: 12px;
  padding: 10px 14px;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surfaceContainerLow};
  border-left: 3px solid ${({ theme }) => theme.colors.accentSolid};
  display: flex;
  align-items: center;
  gap: 10px;
  ${text('xs', 'medium')}
  color: ${({ theme }) => theme.colors.textPrimary};

  svg {
    width: 14px;
    height: 14px;
    color: ${({ theme }) => theme.colors.accentSolid};
    flex-shrink: 0;
  }
`;

/* ── Floating Badges / Satellites ─────────────────────────────────────────── */

const FloatingBadgeTop = styled.div`
  position: absolute;
  top: -16px;
  right: -12px;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: ${({ theme }) => theme.radii.full};
  background: ${({ theme }) => theme.colors.surfaceElevated};
  border: 1px solid ${({ theme }) => theme.colors.lineSubtle};
  box-shadow: 0 12px 28px -4px rgba(15, 23, 42, 0.14);
  ${text('xs', 'semibold')}
  color: ${({ theme }) => theme.colors.textPrimary};
  animation: ${floatReverse} 6s ease-in-out infinite;

  svg {
    width: 15px;
    height: 15px;
    color: #f59e0b;
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const FloatingCardBottom = styled.div`
  position: absolute;
  bottom: -20px;
  left: -14px;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 18px;
  border-radius: ${({ theme }) => theme.radii.xl};
  background: ${({ theme }) => theme.colors.surfaceElevated};
  border: 1px solid ${({ theme }) => theme.colors.lineSubtle};
  box-shadow: 0 16px 36px -6px rgba(15, 23, 42, 0.16);
  animation: ${floatSlow} 8s ease-in-out 1s infinite;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const RateIcon = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.accentContainer};
  color: ${({ theme }) => theme.colors.accentSolid};
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 18px;
    height: 18px;
  }
`;

const RateInfo = styled.div`
  display: flex;
  flex-direction: column;

  strong {
    ${text('sm', 'bold')}
    color: ${({ theme }) => theme.colors.textPrimary};
    display: flex;
    align-items: center;
    gap: 4px;
  }

  span {
    ${text('xs', 'medium')}
    color: ${({ theme }) => theme.colors.textMuted};
  }
`;

const FloatingInteraction = styled.div`
  position: absolute;
  bottom: 24px;
  right: -16px;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 14px;
  border-radius: ${({ theme }) => theme.radii.full};
  background: ${({ theme }) => theme.colors.surfaceElevated};
  border: 1px solid ${({ theme }) => theme.colors.lineSubtle};
  box-shadow: 0 10px 24px -4px rgba(15, 23, 42, 0.12);
  ${text('xs', 'semibold')}
  color: ${({ theme }) => theme.colors.textSecondary};
  animation: ${floatReverse} 7s ease-in-out 0.5s infinite;

  span {
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }

  svg.heart {
    width: 13px;
    height: 13px;
    color: #ef4444;
    fill: #ef4444;
  }

  svg.comment {
    width: 13px;
    height: 13px;
    color: ${({ theme }) => theme.colors.accentSolid};
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

export function HeroIllustration() {
  return (
    <IllustrationWrapper aria-hidden="true">
      <AmbientGlow />

      {/* Floating Top Badge */}
      <FloatingBadgeTop>
        <Sparkles /> #Engineering & Craft
      </FloatingBadgeTop>

      {/* Main Editorial Canvas Card */}
      <MainCanvas>
        <WindowHeader>
          <WindowDots>
            <span />
            <span />
            <span />
          </WindowDots>
          <WindowStatus>
            <span className="indicator" /> Live Markdown
          </WindowStatus>
        </WindowHeader>

        <ArticlePreview>
          <TagStrip>
            <TagChip>Design</TagChip>
            <TagChip>Architecture</TagChip>
          </TagStrip>

          <StoryTitle>
            The Architecture of Thoughtful Digital Writing
          </StoryTitle>

          <AuthorRow>
            <AvatarPlaceholder>AR</AvatarPlaceholder>
            <AuthorMeta>
              Alex Rivera <span className="time">· 4 min read</span>
            </AuthorMeta>
          </AuthorRow>

          <TextSkeleton>
            <div className="line l1" />
            <div className="line l2" />
            <div className="line l3" />
          </TextSkeleton>

          <MarkdownCallout>
            <PenLine />
            <span>&gt; Clarity is not a luxury, it is the entire message.</span>
          </MarkdownCallout>
        </ArticlePreview>
      </MainCanvas>

      {/* Floating Bottom Metric Card */}
      <FloatingCardBottom>
        <RateIcon>
          <TrendingUp />
        </RateIcon>
        <RateInfo>
          <strong>
            94% Read Rate <CheckCircle2 size={13} color="#10b981" />
          </strong>
          <span>True reader attention</span>
        </RateInfo>
      </FloatingCardBottom>

      {/* Floating Interaction Badge */}
      <FloatingInteraction>
        <span>
          <Heart className="heart" /> 184
        </span>
        <span>
          <MessageSquare className="comment" /> 32
        </span>
      </FloatingInteraction>
    </IllustrationWrapper>
  );
}
