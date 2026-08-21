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
  Check,
} from 'lucide-react';

import { postService } from '../services/postService';
import { useTags } from '../hooks/useTags';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui';
import { PostCard } from '../components/posts/PostCard';
import { PostCardSkeleton } from '../components/posts/PostCardSkeleton';
import { HeroIllustration } from '../components/marketing/HeroIllustration';
import { TopicMarquee } from '../components/marketing/Topics';
import { display, text, media, interactive } from '../styles/theme/mixins';
import { queryKeys } from '../services/queryKeys';
import { iconPx } from '../styles/theme';

/* ── Page Shell ──────────────────────────────────────────────────────────── */

const Page = styled.div`
  overflow-x: clip;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing['3xl']};
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

/* ── Hero Section (Left Aligned, Clean & Spacious Editorial Layout) ──────── */

const HeroSection = styled.header`
  padding: ${({ theme }) => theme.spacing['2xl']} 0 ${({ theme }) => theme.spacing.md};
  display: grid;
  grid-template-columns: 1.12fr 0.88fr;
  align-items: center;
  gap: ${({ theme }) => theme.spacing['3xl']};

  ${media.down('lg')`
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing['2xl']};
    padding: ${({ theme }) => theme.spacing.xl} 0 ${({ theme }) => theme.spacing.sm};
  `}

  ${media.down('sm')`
    padding: ${({ theme }) => theme.spacing.lg} 0 0;
  `}
`;

const HeroContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  gap: ${({ theme }) => theme.spacing.xl};
  width: 100%;
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
  ${display('xl')}
  color: ${({ theme }) => theme.colors.textPrimary};
  line-height: 1.15;
  letter-spacing: -0.03em;
  font-weight: 800;
  max-width: 800px;

  .gradient-text {
    background: ${({ theme }) => theme.gradients.brandText};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    display: inline-block;
  }

  ${media.down('md')`font-size: ${({ theme }) => theme.display.lg[0]};`}
  ${media.down('sm')`font-size: ${({ theme }) => theme.display.md[0]};`}
`;

const HeroSubtitle = styled.p`
  ${text('md')}
  line-height: 1.7;
  color: ${({ theme }) => theme.colors.textSecondary};
  max-width: 660px;
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
  gap: ${({ theme }) => theme.spacing.xl};
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
    width: 14px;
    height: 14px;
    color: ${({ theme }) => theme.colors.accentSolid};
  }
`;

/* ── Live Topic Discovery Strip ──────────────────────────────────────────── */

const TopicStripWrap = styled.section`
  padding: ${({ theme }) => theme.spacing.xs} 0;
  width: 100%;
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

const PostGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${({ theme }) => theme.spacing.xl};

  ${media.down('lg')`
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing.lg};
  `}
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
  color: ${({ theme }) => theme.colors.textOnInk};
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
  color: ${({ theme }) => theme.colors.textOnInk};
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
    color: ${({ theme }) => theme.colors.accentText};
  }
`;

/* ── Main Component ──────────────────────────────────────────────────────── */

export function Home() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const { data: trendingResponse, isLoading } = useQuery({
    queryKey: queryKeys.posts.trending(),
    queryFn: () => postService.getTrending({ limit: 12 }),
  });

  const { names: tags, isLoading: tagsLoading } = useTags({ withPostsOnly: true });

  const posts = useMemo(() => trendingResponse?.data ?? [], [trendingResponse]);
  const isRanked = trendingResponse?.trendedBy === 'engagement';
  const trendingWindow = trendingResponse?.window ?? 14;

  const startHref = isAuthenticated ? '/write' : '/register';
  const startLabel = isAuthenticated ? 'Open Creator Studio' : 'Start Writing for Free';

  return (
    <Page>
      {/* ── 1. Hero Section (Clean, Confident Left-Aligned Editorial Header) ── */}
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

          {/* Right Side Relatable Editorial Illustration */}
          <HeroIllustration />
        </HeroSection>
      </Container>

      {/* ── 2. Live Topic Discovery Strip ────────────────────────────────── */}
      <TopicStripWrap>
        <TopicMarquee topics={tags} loading={tagsLoading} />
      </TopicStripWrap>

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

        <PostGrid>
          {isLoading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <PostCardSkeleton key={index} layout="row" />
            ))
          ) : posts.length === 0 ? (
            <EmptyFeed style={{ gridColumn: '1 / -1' }}>
              <Feather size={iconPx.xl} style={{ opacity: 0.5 }} />
              <h3>No stories published yet</h3>
              <p>Be the very first writer to share an insightful article with the community!</p>
              <Button size="md" onClick={() => navigate(startHref)}>
                <PenLine /> Write a story
              </Button>
            </EmptyFeed>
          ) : (
            posts.map((post) => <PostCard key={post._id} post={post} layout="row" />)
          )}
        </PostGrid>

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
