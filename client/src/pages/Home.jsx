import { useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import styled from 'styled-components';
import {
  ArrowRight,
  PenLine,
  Sparkles,
  Compass,
  Flame,
  BarChart2,
  Layers,
  MessageCircle,
  ShieldCheck,
  CheckCircle2,
  Feather,
  Code,
  Check,
} from 'lucide-react';

import { postService } from '../services/postService';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui';
import { PostCard } from '../components/posts/PostCard';
import { PostCardSkeleton } from '../components/posts/PostCardSkeleton';
import { display, text, media, interactive } from '../styles/theme/mixins';

/* ── Page Shell ──────────────────────────────────────────────────────────── */

const Page = styled.div`
  overflow-x: clip;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing['5xl']};
  padding-bottom: ${({ theme }) => theme.spacing['4xl']};
`;

const Container = styled.div`
  max-width: ${({ theme }) => theme.layout.maxWidth};
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.xl};
  width: 100%;

  ${media.down('md')`
    padding: 0 ${({ theme }) => theme.spacing.lg};
  `}
`;

/* ── Hero Section (Left Aligned Content + Right Studio Visual) ───────────── */

const HeroSection = styled.header`
  padding: ${({ theme }) => theme.spacing['3xl']} 0 ${({ theme }) => theme.spacing['2xl']};
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: ${({ theme }) => theme.spacing['3xl']};
  align-items: center;

  ${media.down('lg')`
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing['2xl']};
    padding: ${({ theme }) => theme.spacing.xl} 0;
  `}
`;

const HeroContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  gap: ${({ theme }) => theme.spacing.xl};
  max-width: 600px;
`;

const HeroBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: 6px 14px;
  border-radius: ${({ theme }) => theme.radii.full};
  background: ${({ theme }) => theme.colors.accentContainer};
  color: ${({ theme }) => theme.colors.accentText};
  ${text('xs', 'semibold')}
  width: fit-content;
  border: 1px solid ${({ theme }) => theme.colors.accentLine};

  svg {
    width: 14px;
    height: 14px;
    color: ${({ theme }) => theme.colors.accentSolid};
  }
`;

const HeroTitle = styled.h1`
  ${display('lg')}
  color: ${({ theme }) => theme.colors.textPrimary};
  line-height: 1.15;
  letter-spacing: -0.03em;
  font-weight: 800;

  .gradient-text {
    background: ${({ theme }) => theme.gradients.brandText};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    display: inline-block;
  }

  ${media.down('md')`font-size: ${({ theme }) => theme.display.md[0]};`}
`;

const HeroSubtitle = styled.p`
  ${text('md')}
  line-height: 1.7;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const HeroActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;
`;

const HeroFeaturePills = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};
  flex-wrap: wrap;
  padding-top: ${({ theme }) => theme.spacing.xs};
  ${text('xs', 'medium')}
  color: ${({ theme }) => theme.colors.textMuted};

  span {
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  svg {
    width: 13px;
    height: 13px;
    color: ${({ theme }) => theme.colors.accentSolid};
  }
`;

/* ── Hero Studio & Reader Visual (Right Side) ─────────────────────────────── */

const HeroVisualWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const StudioCard = styled.div`
  width: 100%;
  max-width: 460px;
  background: ${({ theme }) => theme.colors.surfaceElevated};
  border-radius: ${({ theme }) => theme.radii['2xl']};
  padding: ${({ theme }) => theme.spacing.xl};
  box-shadow:
    0 20px 40px -12px rgba(15, 23, 42, 0.08),
    0 0 20px -4px rgba(14, 165, 233, 0.12);
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  position: relative;
  border: none;
`;

const StudioHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
`;

const WindowDots = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;

  span {
    width: 10px;
    height: 10px;
    border-radius: 50%;

    &:nth-child(1) {
      background: #ef4444;
      opacity: 0.85;
    }
    &:nth-child(2) {
      background: #f59e0b;
      opacity: 0.85;
    }
    &:nth-child(3) {
      background: #10b981;
      opacity: 0.85;
    }
  }
`;

const StudioStatus = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 10px;
  border-radius: ${({ theme }) => theme.radii.full};
  background: ${({ theme }) => theme.colors.accentContainer};
  color: ${({ theme }) => theme.colors.accentText};
  ${text('xs', 'semibold')}

  svg {
    width: 12px;
    height: 12px;
    color: ${({ theme }) => theme.colors.accentSolid};
  }
`;

const EditorSnippet = styled.div`
  background: ${({ theme }) => theme.colors.surfaceContainer};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  font-family: inherit;
`;

const SnippetHeading = styled.div`
  ${text('sm', 'bold')}
  color: ${({ theme }) => theme.colors.textPrimary};
  letter-spacing: -0.01em;
`;

const SnippetBody = styled.div`
  ${text('xs')}
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.6;
`;

const CodeHighlight = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background: ${({ theme }) => theme.colors.surfaceContainerLow};
  padding: 8px 12px;
  border-radius: ${({ theme }) => theme.radii.md};
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 11px;
  color: ${({ theme }) => theme.colors.accentText};
  margin-top: 4px;

  svg {
    width: 14px;
    height: 14px;
    color: ${({ theme }) => theme.colors.accentSolid};
  }
`;

const MetricFloater = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.surfaceContainerLow};
  border-radius: ${({ theme }) => theme.radii.xl};
`;

const MetricLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  svg {
    color: #10b981;
    width: 18px;
    height: 18px;
  }

  div {
    display: flex;
    flex-direction: column;
    gap: 1px;

    strong {
      ${text('xs', 'semibold')}
      color: ${({ theme }) => theme.colors.textPrimary};
    }

    span {
      font-size: 11px;
      color: ${({ theme }) => theme.colors.textMuted};
    }
  }
`;

const MetricValue = styled.span`
  ${text('sm', 'bold')}
  color: #10b981;
  background: rgba(16, 185, 129, 0.12);
  padding: 4px 10px;
  border-radius: ${({ theme }) => theme.radii.full};
`;

/* ── Value Pillars Strip ─────────────────────────────────────────────────── */

const PillarsSection = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.xl};
  background: ${({ theme }) => theme.colors.surfaceContainerLow};
  border: none;
  border-radius: ${({ theme }) => theme.radii['2xl']};

  ${media.down('lg')`
    grid-template-columns: repeat(2, 1fr);
  `}

  ${media.down('sm')`
    grid-template-columns: 1fr;
    padding: ${({ theme }) => theme.spacing.lg};
  `}
`;

const PillarCard = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.md};
`;

const PillarIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.accentContainer};
  color: ${({ theme }) => theme.colors.accentSolid};
  flex-shrink: 0;

  svg {
    width: 20px;
    height: 20px;
  }
`;

const PillarTitle = styled.h3`
  ${text('sm', 'semibold')}
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 2px;
`;

const PillarDesc = styled.p`
  ${text('xs')}
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.5;
`;

/* ── Feed Section ────────────────────────────────────────────────────────── */

const SectionHead = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing['2xl']};
  flex-wrap: wrap;
`;

const SectionLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const SectionKicker = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  ${text('xs', 'semibold')}
  color: ${({ theme }) => theme.colors.accentText};
  text-transform: uppercase;
  letter-spacing: 0.08em;

  svg {
    width: 13px;
    height: 13px;
    color: ${({ theme }) => theme.colors.accentSolid};
  }
`;

const SectionTitle = styled.h2`
  ${display('sm')}
  color: ${({ theme }) => theme.colors.textPrimary};
  letter-spacing: -0.02em;
  font-weight: 700;
`;

const SectionSubtitle = styled.p`
  ${text('sm')}
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const PostList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};
`;

const MoreLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: ${({ theme }) => theme.spacing['2xl']};
  padding: 10px 20px;
  border-radius: ${({ theme }) => theme.radii.full};
  background: ${({ theme }) => theme.colors.surfaceContainer};
  color: ${({ theme }) => theme.colors.accentText};
  ${text('sm', 'semibold')}
  text-decoration: none;
  transition: all ${({ theme }) => theme.transitions.fast};
  ${interactive}

  svg {
    width: 15px;
    height: 15px;
    transition: transform ${({ theme }) => theme.transitions.fast};
  }

  &:hover {
    background: ${({ theme }) => theme.colors.accentContainer};
    transform: translateY(-1px);

    svg {
      transform: translateX(4px);
    }
  }
`;

const EmptyFeed = styled.div`
  padding: ${({ theme }) => theme.spacing['4xl']} ${({ theme }) => theme.spacing.xl};
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.surfaceContainerLow};
  border-radius: ${({ theme }) => theme.radii.xl};

  h3 {
    ${display('xs')}
    color: ${({ theme }) => theme.colors.textPrimary};
  }

  p {
    ${text('sm')}
    color: ${({ theme }) => theme.colors.textSecondary};
    max-width: 420px;
  }
`;

/* ── "Why BlogHub?" Bento Grid ───────────────────────────────────────────── */

const BentoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => theme.spacing.xl};

  ${media.down('lg')`
    grid-template-columns: repeat(2, 1fr);
  `}

  ${media.down('sm')`
    grid-template-columns: 1fr;
  `}
`;

const BentoCard = styled.div`
  position: relative;
  background: ${({ theme }) => theme.colors.surfaceElevated};
  border-radius: ${({ theme }) => theme.radii['2xl']};
  padding: ${({ theme }) => theme.spacing['2xl']};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  box-shadow: 0 2px 8px -2px rgba(15, 23, 42, 0.04);
  transition: background ${({ theme }) => theme.transitions.fast};

  grid-column: ${({ $span }) => ($span ? `span ${$span}` : 'span 1')};

  ${media.down('lg')`
    grid-column: span 1;
  `}

  &:hover {
    background: ${({ theme }) => theme.colors.surfaceHover};
  }
`;

const BentoIcon = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: ${({ theme }) => theme.radii.xl};
  background: ${({ theme }) => theme.colors.accentContainer};
  color: ${({ theme }) => theme.colors.accentSolid};

  svg {
    width: 22px;
    height: 22px;
  }
`;

const BentoTitle = styled.h3`
  ${text('md', 'bold')}
  color: ${({ theme }) => theme.colors.textPrimary};
  letter-spacing: -0.01em;
`;

const BentoDescription = styled.p`
  ${text('sm')}
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.65;
`;

/* ── Closing CTA Section ─────────────────────────────────────────────────── */

const CtaSection = styled.div`
  position: relative;
  background: ${({ theme }) => theme.gradients.brand};
  border-radius: ${({ theme }) => theme.radii['3xl']};
  padding: ${({ theme }) => theme.spacing['4xl']} ${({ theme }) => theme.spacing['2xl']};
  text-align: center;
  color: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xl};
  overflow: hidden;
  box-shadow: 0 20px 40px -15px rgba(14, 165, 233, 0.35);

  ${media.down('sm')`
    padding: ${({ theme }) => theme.spacing['3xl']} ${({ theme }) => theme.spacing.lg};
  `}
`;

const CtaTitle = styled.h2`
  ${display('md')}
  color: #ffffff;
  font-weight: 800;
  letter-spacing: -0.025em;
  max-width: 640px;
`;

const CtaSubtitle = styled.p`
  ${text('md')}
  color: rgba(255, 255, 255, 0.9);
  max-width: 520px;
  line-height: 1.65;
`;

const CtaHighlights = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xl};
  flex-wrap: wrap;
  justify-content: center;
  padding-top: ${({ theme }) => theme.spacing.sm};
  ${text('xs', 'medium')}
  color: rgba(255, 255, 255, 0.85);

  span {
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  svg {
    width: 14px;
    height: 14px;
    color: #38bdf8;
  }
`;

/* ── Main Component ──────────────────────────────────────────────────────── */

export function Home() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const { data: trendingResponse, isLoading } = useQuery({
    queryKey: ['trendingPosts'],
    queryFn: () => postService.getTrending({ limit: 12 }),
  });

  const posts = useMemo(() => trendingResponse?.data ?? [], [trendingResponse]);
  const isRanked = trendingResponse?.trendedBy === 'engagement';
  const trendingWindow = trendingResponse?.window ?? 14;

  const startHref = isAuthenticated ? '/write' : '/register';
  const startLabel = isAuthenticated ? 'Open Creator Studio' : 'Start Writing for Free';

  return (
    <Page>
      {/* ── 1. Hero Section (Left Aligned Text + Right Markdown Visual) ────── */}
      <Container>
        <HeroSection>
          <HeroContent>
            <HeroBadge>
              <Sparkles /> A sanctuary for thoughtful writing
            </HeroBadge>

            <HeroTitle>
              Where ideas find their voice & stories find{' '}
              <span className="gradient-text">curious minds.</span>
            </HeroTitle>

            <HeroSubtitle>
              BlogHub is a modern, distraction-free publishing space for writers, thinkers, and
              storytellers. Write effortlessly in Markdown, track genuine reader attention, and
              discover perspectives that broaden your world.
            </HeroSubtitle>

            <HeroActions>
              <Button size="lg" onClick={() => navigate(startHref)}>
                <PenLine /> {startLabel}
              </Button>
              <Button size="lg" variant="secondary" onClick={() => navigate('/search')}>
                <Compass /> Explore stories
              </Button>
            </HeroActions>

            <HeroFeaturePills>
              <span>
                <Check /> Pure Markdown Canvas
              </span>
              <span>
                <Check /> True Read Completion Metrics
              </span>
              <span>
                <Check /> 100% Free & Open
              </span>
            </HeroFeaturePills>
          </HeroContent>

          {/* Right Side: Meaningful Markdown & Reader Metrics Studio Visual */}
          <HeroVisualWrapper>
            <StudioCard>
              <StudioHeader>
                <WindowDots>
                  <span />
                  <span />
                  <span />
                </WindowDots>
                <StudioStatus>
                  <Sparkles /> Live Preview · 3 min read
                </StudioStatus>
              </StudioHeader>

              <EditorSnippet>
                <SnippetHeading># The Architecture of Deep Focus</SnippetHeading>
                <SnippetBody>
                  When interface noise drops to zero, thinking gets clear. BlogHub is crafted for
                  writers who value clarity over clutter.
                </SnippetBody>
                <CodeHighlight>
                  <Code />
                  <span>const attention = &#123; depth: &apos;100%&apos;, noise: 0 &#125;;</span>
                </CodeHighlight>
              </EditorSnippet>

              <MetricFloater>
                <MetricLeft>
                  <BarChart2 />
                  <div>
                    <strong>94% Read-Through Rate</strong>
                    <span>Genuine reader attention tracked</span>
                  </div>
                </MetricLeft>
                <MetricValue>Top 5%</MetricValue>
              </MetricFloater>
            </StudioCard>
          </HeroVisualWrapper>
        </HeroSection>
      </Container>

      {/* ── 2. Value Pillars Strip ─────────────────────────────────────────── */}
      <Container>
        <PillarsSection>
          <PillarCard>
            <PillarIcon>
              <Feather />
            </PillarIcon>
            <div>
              <PillarTitle>Markdown Canvas</PillarTitle>
              <PillarDesc>
                Write fluidly with instant live preview and zero interface clutter.
              </PillarDesc>
            </div>
          </PillarCard>

          <PillarCard>
            <PillarIcon>
              <BarChart2 />
            </PillarIcon>
            <div>
              <PillarTitle>True Read Metrics</PillarTitle>
              <PillarDesc>
                Understand how many readers actually finished your piece, not just clicked.
              </PillarDesc>
            </div>
          </PillarCard>

          <PillarCard>
            <PillarIcon>
              <ShieldCheck />
            </PillarIcon>
            <div>
              <PillarTitle>Private & Public</PillarTitle>
              <PillarDesc>
                Polish drafts in private, then publish seamlessly when you are ready.
              </PillarDesc>
            </div>
          </PillarCard>

          <PillarCard>
            <PillarIcon>
              <Sparkles />
            </PillarIcon>
            <div>
              <PillarTitle>Pure Experience</PillarTitle>
              <PillarDesc>
                Zero popups, zero intrusive ads, crafted for pure reading enjoyment.
              </PillarDesc>
            </div>
          </PillarCard>
        </PillarsSection>
      </Container>

      {/* ── 3. Main Feed Section ───────────────────────────────────────────── */}
      <Container>
        <SectionHead>
          <SectionLeft>
            <SectionKicker>
              <Flame /> {isRanked ? 'Community Favorites' : 'Fresh Discoveries'}
            </SectionKicker>
            <SectionTitle>{isRanked ? 'Trending stories' : 'Latest stories'}</SectionTitle>
            <SectionSubtitle>
              {isLoading
                ? 'Fetching stories…'
                : isRanked
                  ? `Ranked by genuine reader engagement over the last ${trendingWindow} days.`
                  : 'Freshly published stories from across the community.'}
            </SectionSubtitle>
          </SectionLeft>
        </SectionHead>

        <PostList>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <PostCardSkeleton key={index} layout="row" />
            ))
          ) : posts.length === 0 ? (
            <EmptyFeed>
              <Feather size={36} style={{ opacity: 0.5 }} />
              <h3>No stories published yet</h3>
              <p>Be the very first writer to share an insightful article with the community!</p>
              <Button size="md" onClick={() => navigate(startHref)}>
                <PenLine /> Write a story
              </Button>
            </EmptyFeed>
          ) : (
            posts.map((post) => <PostCard key={post._id} post={post} layout="row" />)
          )}
        </PostList>

        {!isLoading && posts.length > 0 && (
          <div style={{ textAlign: 'center' }}>
            <MoreLink to="/search">
              Explore all stories <ArrowRight />
            </MoreLink>
          </div>
        )}
      </Container>

      {/* ── 4. "Why BlogHub?" Bento Section ──────────────────────────────── */}
      <Container>
        <SectionHead style={{ textAlign: 'center', justifyContent: 'center' }}>
          <SectionLeft style={{ alignItems: 'center' }}>
            <SectionKicker>
              <Layers /> Built for depth & clarity
            </SectionKicker>
            <SectionTitle>Everything you need to write and connect</SectionTitle>
            <SectionSubtitle style={{ textAlign: 'center' }}>
              Thoughtfully built tools crafted to honor your words and your readers' time.
            </SectionSubtitle>
          </SectionLeft>
        </SectionHead>

        <BentoGrid>
          <BentoCard>
            <BentoIcon>
              <Feather />
            </BentoIcon>
            <BentoTitle>Pure Markdown Canvas</BentoTitle>
            <BentoDescription>
              Write in clean, effortless Markdown with live side-by-side preview, code syntax
              highlighting, cover image support, and distraction-free typography.
            </BentoDescription>
          </BentoCard>

          <BentoCard>
            <BentoIcon>
              <BarChart2 />
            </BentoIcon>
            <BentoTitle>Meaningful Read Metrics</BentoTitle>
            <BentoDescription>
              Go far beyond superficial page clicks. Track how many readers actually finished your
              entire article and understand where your ideas truly resonate.
            </BentoDescription>
          </BentoCard>

          <BentoCard>
            <BentoIcon>
              <MessageCircle />
            </BentoIcon>
            <BentoTitle>Thoughtful Discussions</BentoTitle>
            <BentoDescription>
              Engage with curious readers through threaded responses, meaningful reactions, and
              streamlined creator moderation tools.
            </BentoDescription>
          </BentoCard>

          <BentoCard $span="2">
            <BentoIcon>
              <ShieldCheck />
            </BentoIcon>
            <BentoTitle>Complete Creative & Privacy Control</BentoTitle>
            <BentoDescription>
              Keep works in progress safe with Private Drafts, test ideas privately with direct
              links, or publish publicly to the global feed with curated topics and custom tags.
            </BentoDescription>
          </BentoCard>

          <BentoCard>
            <BentoIcon>
              <Sparkles />
            </BentoIcon>
            <BentoTitle>Serene Reading Sanctuary</BentoTitle>
            <BentoDescription>
              No intrusive popups, no noisy advertising, and no clickbait algorithms. Just clean,
              fast-loading pages with effortless dark and light mode switching.
            </BentoDescription>
          </BentoCard>
        </BentoGrid>
      </Container>

      {/* ── 5. Closing CTA Section ───────────────────────────────────────── */}
      <Container>
        <CtaSection>
          <CtaTitle>Have an idea or story worth sharing?</CtaTitle>
          <CtaSubtitle>
            Join a growing community of writers, creators, and curious thinkers. Start drafting in
            seconds with our distraction-free editor.
          </CtaSubtitle>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Button
              size="lg"
              style={{
                background: '#ffffff',
                color: '#0284c7',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                fontWeight: 700,
              }}
              onClick={() => navigate(startHref)}
            >
              <PenLine /> {startLabel} <ArrowRight />
            </Button>
            <Button
              size="lg"
              variant="secondary"
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                backdropFilter: 'blur(8px)',
              }}
              onClick={() => navigate('/search')}
            >
              <Compass /> Explore Stories
            </Button>
          </div>

          <CtaHighlights>
            <span>
              <CheckCircle2 /> 100% Free to publish
            </span>
            <span>
              <CheckCircle2 /> Markdown & Code native
            </span>
            <span>
              <CheckCircle2 /> Zero intrusive paywalls
            </span>
          </CtaHighlights>
        </CtaSection>
      </Container>
    </Page>
  );
}
