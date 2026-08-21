import styled, { keyframes } from 'styled-components';
import {
  Sparkles,
  PenTool,
  BookOpen,
  Compass,
  Rocket,
  Palette,
  Heart,
  MessageSquare,
  Bookmark,
  CheckCircle2,
} from 'lucide-react';
import { media, text } from '../../styles/theme/mixins';
import { iconPx } from '../../styles/theme';

const floatSlow = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-8px) rotate(0.4deg); }
`;

const floatReverse = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(7px) rotate(-0.8deg); }
`;

const pulseGlow = keyframes`
  0%, 100% { opacity: 0.4; transform: scale(1); }
  50% { opacity: 0.7; transform: scale(1.08); }
`;

const blink = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
`;

const IllustrationWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 520px;
  margin: 0 auto;
  user-select: none;

  ${media.down('lg')`
    max-width: 480px;
    margin-top: ${({ theme }) => theme.spacing.xl};
  `}

  ${media.down('sm')`
    max-width: 100%;
  `}
`;

const AmbientGlow = styled.div`
  position: absolute;
  top: 10%;
  left: 15%;
  width: 360px;
  height: 360px;
  background: radial-gradient(
    circle,
    ${({ theme }) => theme.colors.accentContainer} 0%,
    rgba(14, 165, 233, 0.18) 40%,
    transparent 70%
  );
  filter: blur(52px);
  z-index: 0;
  pointer-events: none;
  animation: ${pulseGlow} 7s ease-in-out infinite;

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
  transition: all ${({ theme }) => theme.transitions.normal};

  &:hover {
    box-shadow:
      0 32px 64px -12px rgba(15, 23, 42, 0.18),
      0 8px 24px -2px rgba(14, 165, 233, 0.15);
    border-color: ${({ theme }) => theme.colors.lineDefault};
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
    width: 9px;
    height: 9px;
    border-radius: 50%;

    &:nth-child(1) {
      background: #ef4444;
      opacity: 0.8;
    }
    &:nth-child(2) {
      background: #f59e0b;
      opacity: 0.8;
    }
    &:nth-child(3) {
      background: #10b981;
      opacity: 0.8;
    }
  }
`;

const WindowStatus = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  ${text('xs', 'semibold')}
  color: ${({ theme }) => theme.colors.accentText};

  svg {
    width: 13px;
    height: 13px;
  }
`;

const ArticlePreview = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const TopicPillsRow = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 4px;
`;

const TopicPill = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  ${text('xs', 'semibold')}
  padding: 3px 10px;
  border-radius: ${({ theme }) => theme.radii.full};
  background: ${({ theme }) => theme.colors.accentContainer};
  color: ${({ theme }) => theme.colors.accentText};

  svg {
    width: 12px;
    height: 12px;
  }
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

const AvatarGradient = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: linear-gradient(135deg, #0ea5e9, #8b5cf6);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 12px;
  box-shadow: 0 2px 8px rgba(14, 165, 233, 0.3);
`;

const AuthorMeta = styled.div`
  ${text('xs', 'medium')}
  color: ${({ theme }) => theme.colors.textSecondary};

  strong {
    color: ${({ theme }) => theme.colors.textPrimary};
  }

  span.time {
    color: ${({ theme }) => theme.colors.textMuted};
  }
`;

const EditorSnippet = styled.div`
  position: relative;
  margin-top: 6px;
  padding: 12px 14px;
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.surfaceContainerLow};
  border-left: 3px solid ${({ theme }) => theme.colors.accentSolid};
  display: flex;
  flex-direction: column;
  gap: 6px;
  ${text('xs')}
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.6;

  .quote-line {
    color: ${({ theme }) => theme.colors.textPrimary};
    font-weight: 500;
    font-style: italic;
  }

  .typing-cursor {
    display: inline-block;
    width: 2px;
    height: 13px;
    background: ${({ theme }) => theme.colors.accentSolid};
    margin-left: 3px;
    vertical-align: middle;
    animation: ${blink} 1s infinite;
  }
`;

/* ── Floating Badges / Satellites ─────────────────────────────────────────── */

const FloatingBadgeTop = styled.div`
  position: absolute;
  top: -16px;
  right: -10px;
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
  bottom: 22px;
  right: -14px;
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

  svg.bookmark {
    width: 13px;
    height: 13px;
    color: #8b5cf6;
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

export function HeroIllustration() {
  return (
    <IllustrationWrapper aria-hidden="true">
      <AmbientGlow />

      {/* Floating Top Badge: Diverse Idea Worlds */}
      <FloatingBadgeTop>
        <Sparkles /> #Ideas & Perspectives
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
            <PenTool /> Editorial Canvas
          </WindowStatus>
        </WindowHeader>

        <ArticlePreview>
          <TopicPillsRow>
            <TopicPill>
              <Compass /> Explore
            </TopicPill>
            <TopicPill>
              <Palette /> Design
            </TopicPill>
            <TopicPill>
              <Rocket /> Tech
            </TopicPill>
          </TopicPillsRow>

          <StoryTitle>Crafting Ideas That Outlast the Algorithm</StoryTitle>

          <AuthorRow>
            <AvatarGradient>BH</AvatarGradient>
            <AuthorMeta>
              <strong>Community Voice</strong> <span className="time">· 3 min read</span>
            </AuthorMeta>
          </AuthorRow>

          <EditorSnippet>
            <span className="quote-line">
              &gt; Write for depth. Read for understanding. Connect with curious minds.
            </span>
            <span>
              A quiet, ad-free haven where thoughtful essays find a welcoming audience
              <span className="typing-cursor" />
            </span>
          </EditorSnippet>
        </ArticlePreview>
      </MainCanvas>

      {/* Floating Bottom Metric Card */}
      <FloatingCardBottom>
        <RateIcon>
          <BookOpen />
        </RateIcon>
        <RateInfo>
          <strong>
            Deep Read Attention <CheckCircle2 size={iconPx.sm} color="#10b981" />
          </strong>
          <span>Zero popups · 100% ad-free</span>
        </RateInfo>
      </FloatingCardBottom>

      {/* Floating Community Interaction */}
      <FloatingInteraction>
        <span>
          <Heart className="heart" /> 248
        </span>
        <span>
          <MessageSquare className="comment" /> 42
        </span>
        <span>
          <Bookmark className="bookmark" /> 95
        </span>
      </FloatingInteraction>
    </IllustrationWrapper>
  );
}
