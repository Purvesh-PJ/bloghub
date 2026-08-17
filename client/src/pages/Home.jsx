import { useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import styled, { keyframes } from 'styled-components';
import {
  ArrowRight,
  PenLine,
  Sparkles,
  Compass,
  Flame,
  Heart,
  BarChart2,
  Layers,
  Clock,
  MessageCircle,
  ShieldCheck,
  CheckCircle2,
  Feather,
} from 'lucide-react';

import { postService } from '../services/postService';
import { categoryService } from '../services/categoryService';
import { useAuth } from '../context/AuthContext';
import { Button, Chip } from '../components/ui';
import { PostCard } from '../components/posts/PostCard';
import { AuthorByline } from '../components/posts/AuthorByline';
import { PostCardSkeleton } from '../components/posts/PostCardSkeleton';
import { display, text, label as labelStyle, media, interactive } from '../styles/theme/mixins';
import { topicIcon } from '../components/marketing/Topics';
import { readingTime } from '../utils/text';

/* ── Keyframe Animations ─────────────────────────────────────────────────── */

const floatAnimation = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
`;

const pulseGlow = keyframes`
  0%, 100% { opacity: 0.4; transform: scale(1); }
  50% { opacity: 0.7; transform: scale(1.05); }
`;

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

/* ── Hero Section ────────────────────────────────────────────────────────── */

const HeroSection = styled.header`
  padding: ${({ theme }) => theme.spacing['3xl']} 0 ${({ theme }) => theme.spacing['2xl']};
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  gap: ${({ theme }) => theme.spacing['3xl']};
  align-items: center;
  min-height: min(74vh, 640px);

  ${media.down('lg')`
    grid-template-columns: 1fr;
    min-height: auto;
    padding: ${({ theme }) => theme.spacing.xl} 0;
  `}
`;

const HeroContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};
  max-width: 640px;
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
  box-shadow: 0 2px 10px rgba(14, 165, 233, 0.15);

  svg {
    width: 14px;
    height: 14px;
    color: ${({ theme }) => theme.colors.accentSolid};
  }
`;

const HeroTitle = styled.h1`
  ${display('2xl')}
  color: ${({ theme }) => theme.colors.textPrimary};
  line-height: 1.1;
  letter-spacing: -0.035em;
  font-weight: 800;

  .gradient-text {
    background: ${({ theme }) => theme.gradients.brandText};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    display: inline-block;
  }

  ${media.down('lg')`font-size: ${({ theme }) => theme.display.xl[0]};`}
  ${media.down('md')`font-size: ${({ theme }) => theme.display.lg[0]};`}
  ${media.down('sm')`font-size: ${({ theme }) => theme.display.md[0]};`}
`;

const HeroSubtitle = styled.p`
  ${text('lg')}
  line-height: 1.7;
  color: ${({ theme }) => theme.colors.textSecondary};
  max-width: 560px;
`;

const HeroActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;
`;

const HeroTopicsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  padding-top: ${({ theme }) => theme.spacing.md};
  border-top: 1px solid ${({ theme }) => theme.colors.lineSubtle};
`;

const TopicLabel = styled.span`
  ${text('xs', 'medium')}
  color: ${({ theme }) => theme.colors.textMuted};
  display: flex;
  align-items: center;
  gap: 6px;
`;

const CategoryPillsRow = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  align-items: center;
`;

const TopicPill = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: ${({ theme }) => theme.radii.full};
  background: ${({ theme }) => theme.colors.surfaceContainer};
  color: ${({ theme }) => theme.colors.textSecondary};
  border: 1px solid ${({ theme }) => theme.colors.lineDefault};
  ${text('xs', 'semibold')}
  transition: all ${({ theme }) => theme.transitions.fast};
  ${interactive}

  svg {
    width: 13px;
    height: 13px;
    color: ${({ theme }) => theme.colors.accentSolid};
  }

  &:hover {
    background: ${({ theme }) => theme.colors.accentContainer};
    color: ${({ theme }) => theme.colors.accentText};
    border-color: ${({ theme }) => theme.colors.accentLine};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(14, 165, 233, 0.2);
  }
`;

/* ── Hero Showcase Card ──────────────────────────────────────────────────── */

const HeroVisual = styled.div`
  position: relative;
  display: flex;
  justify-content: center;

  ${media.down('lg')`
    margin-top: ${({ theme }) => theme.spacing.xl};
  `}
`;

const AmbientGlow = styled.div`
  position: absolute;
  inset: -20px;
  background: radial-gradient(
    circle,
    rgba(14, 165, 233, 0.25) 0%,
    rgba(56, 189, 248, 0.08) 50%,
    transparent 70%
  );
  border-radius: 50%;
  filter: blur(30px);
  z-index: 1;
  pointer-events: none;
  animation: ${pulseGlow} 5s ease-in-out infinite;
`;

const ShowcaseCard = styled.div`
  width: 100%;
  max-width: 450px;
  background: ${({ theme }) => theme.colors.surfaceElevated};
  border: 1px solid ${({ theme }) => theme.colors.lineDefault};
  border-radius: ${({ theme }) => theme.radii['2xl']};
  padding: ${({ theme }) => theme.spacing.xl};
  box-shadow:
    0 24px 48px -12px rgba(15, 23, 42, 0.12),
    0 0 25px -5px rgba(14, 165, 233, 0.2);
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  position: relative;
  z-index: 2;
  animation: ${floatAnimation} 6s ease-in-out infinite;
`;

const SpotlightBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  border-radius: ${({ theme }) => theme.radii.full};
  background: ${({ theme }) => theme.colors.accentContainer};
  color: ${({ theme }) => theme.colors.accentText};
  ${text('xs', 'semibold')}
  border: 1px solid ${({ theme }) => theme.colors.accentLine};

  svg {
    width: 12px;
    height: 12px;
    color: ${({ theme }) => theme.colors.accentSolid};
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
`;

const CardImageMock = styled.div`
  width: 100%;
  height: 180px;
  border-radius: ${({ theme }) => theme.radii.lg};
  background-size: cover;
  background-position: center;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: flex-end;
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.lineSubtle};

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, transparent 30%, rgba(15, 23, 42, 0.75) 100%);
  }
`;

const CardTitle = styled(Link)`
  ${display('xs')}
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 1.2rem;
  line-height: 1.35;
  font-weight: 700;
  text-decoration: none;
  transition: color ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.accentText};
  }
`;

const ReadRateWidget = styled.div`
  background: ${({ theme }) => theme.colors.surfaceContainer};
  border: 1px solid ${({ theme }) => theme.colors.lineSubtle};
  border-radius: ${({ theme }) => theme.radii.md};
  padding: ${({ theme }) => theme.spacing.md};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const ReadRateHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  ${text('xs', 'semibold')}
  color: ${({ theme }) => theme.colors.textSecondary};

  span.percent {
    color: ${({ theme }) => theme.colors.accentText};
    font-weight: 700;
  }
`;

const ProgressBar = styled.div`
  height: 6px;
  border-radius: ${({ theme }) => theme.radii.full};
  background: ${({ theme }) => theme.colors.surfaceContainerHigh};
  overflow: hidden;

  div {
    height: 100%;
    background: ${({ theme }) => theme.gradients.brandBar};
    border-radius: inherit;
    transition: width 1s ease-out;
  }
`;

const CardFooterStats = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  ${text('xs')}
  color: ${({ theme }) => theme.colors.textMuted};
  padding-top: ${({ theme }) => theme.spacing.xs};
  border-top: 1px solid ${({ theme }) => theme.colors.lineSubtle};
`;

const StatItem = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;

  svg {
    width: 14px;
    height: 14px;
    color: ${({ $heart, theme }) => ($heart ? '#ef4444' : theme.colors.textMuted)};
    fill: ${({ $heart }) => ($heart ? '#ef4444' : 'none')};
  }
`;

/* ── Value Pillars Strip ─────────────────────────────────────────────────── */

const PillarsSection = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.xl};
  background: ${({ theme }) => theme.colors.surfaceContainerLow};
  border: 1px solid ${({ theme }) => theme.colors.lineSubtle};
  border-radius: ${({ theme }) => theme.radii['2xl']};

  ${media.down('lg')`
    grid-template-columns: repeat(2, 1fr);
  `}

  ${media.down('sm')`
    grid-template-columns: 1fr;
  `}
`;

const PillarCard = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.sm};
`;

const PillarIcon = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.accentContainer};
  color: ${({ theme }) => theme.colors.accentSolid};
  flex-shrink: 0;

  svg {
    width: 20px;
    height: 20px;
  }
`;

const PillarTitle = styled.h3`
  ${text('sm', 'bold')}
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 2px;
`;

const PillarDesc = styled.p`
  ${text('xs')}
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.5;
`;

/* ── Section Headers & Feed ──────────────────────────────────────────────── */

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
  ${labelStyle('sm')}
  color: ${({ theme }) => theme.colors.accentText};
  font-weight: 700;
  letter-spacing: 0.08em;
  display: flex;
  align-items: center;
  gap: 6px;

  svg {
    width: 14px;
    height: 14px;
  }
`;

const SectionTitle = styled.h2`
  ${display('md')}
  color: ${({ theme }) => theme.colors.textPrimary};
  font-weight: 800;
  letter-spacing: -0.025em;

  ${media.down('sm')`font-size: ${({ theme }) => theme.display.sm[0]};`}
`;

const SectionSubtitle = styled.p`
  ${text('md')}
  color: ${({ theme }) => theme.colors.textSecondary};
  max-width: 560px;
`;

const PostList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};
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
  border: 1px dashed ${({ theme }) => theme.colors.lineDefault};

  p {
    ${text('md')}
    color: ${({ theme }) => theme.colors.textSecondary};
    max-width: 440px;
  }
`;

const MoreLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: ${({ theme }) => theme.spacing['2xl']};
  padding: 10px 20px;
  border-radius: ${({ theme }) => theme.radii.full};
  background: ${({ theme }) => theme.colors.surfaceContainer};
  border: 1px solid ${({ theme }) => theme.colors.lineDefault};
  ${text('sm', 'semibold')}
  color: ${({ theme }) => theme.colors.textPrimary};
  text-decoration: none;
  transition: all ${({ theme }) => theme.transitions.fast};

  svg {
    width: 16px;
    height: 16px;
    transition: transform ${({ theme }) => theme.transitions.fast};
  }

  &:hover {
    background: ${({ theme }) => theme.colors.accentContainer};
    color: ${({ theme }) => theme.colors.accentText};
    border-color: ${({ theme }) => theme.colors.accentLine};
    transform: translateY(-2px);

    svg {
      transform: translateX(4px);
    }
  }
`;

/* ── Bento Grid ──────────────────────────────────────────────────────────── */

const BentoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => theme.spacing.xl};

  ${media.down('lg')`grid-template-columns: 1fr 1fr;`}
  ${media.down('sm')`grid-template-columns: 1fr;`}
`;

const BentoCard = styled.div`
  background: ${({ theme }) => theme.colors.surfaceElevated};
  border: 1px solid ${({ theme }) => theme.colors.lineDefault};
  border-radius: ${({ theme }) => theme.radii.xl};
  padding: ${({ theme }) => theme.spacing['2xl']};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  box-shadow: 0 2px 8px -2px rgba(15, 23, 42, 0.04);
  transition: all ${({ theme }) => theme.transitions.normal};
  ${interactive}

  ${({ $span }) =>
    $span === '2' &&
    `
    grid-column: span 2;
  `}

  &:hover {
    border-color: ${({ theme }) => theme.colors.accentLine};
    box-shadow:
      0 16px 36px -10px rgba(15, 23, 42, 0.1),
      0 0 20px -4px rgba(14, 165, 233, 0.15);
    transform: translateY(-4px);
  }

  ${media.down('lg')`
    grid-column: span 1;
  `}
`;

const BentoIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.accentContainer};
  color: ${({ theme }) => theme.colors.accentSolid};
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.2);

  svg {
    width: 24px;
    height: 24px;
  }
`;

const BentoTitle = styled.h3`
  ${display('xs')}
  color: ${({ theme }) => theme.colors.textPrimary};
  font-weight: 700;
`;

const BentoDescription = styled.p`
  ${text('sm')}
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.65;
`;

/* ── CTA Banner ──────────────────────────────────────────────────────────── */

const CtaSection = styled.div`
  background: ${({ theme }) => theme.gradients.brandDeep};
  border-radius: ${({ theme }) => theme.radii['2xl']};
  padding: ${({ theme }) => theme.spacing['4xl']} ${({ theme }) => theme.spacing['2xl']};
  color: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: ${({ theme }) => theme.spacing.xl};
  position: relative;
  overflow: hidden;
  box-shadow: 0 24px 50px -12px rgba(2, 132, 199, 0.45);

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -20%;
    width: 70%;
    height: 160%;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, transparent 60%);
    pointer-events: none;
  }
`;

const CtaTitle = styled.h2`
  ${display('xl')}
  color: #ffffff;
  font-weight: 800;
  max-width: 24ch;

  ${media.down('md')`font-size: ${({ theme }) => theme.display.md[0]};`}
`;

const CtaSubtitle = styled.p`
  ${text('lg')}
  color: rgba(255, 255, 255, 0.92);
  max-width: 580px;
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

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: categoryService.getCategories,
  });

  const posts = useMemo(() => trendingResponse?.data ?? [], [trendingResponse]);
  const isRanked = trendingResponse?.trendedBy === 'engagement';
  const trendingWindow = trendingResponse?.window ?? 14;
  const categories = useMemo(() => categoriesData?.data ?? [], [categoriesData]);

  const startHref = isAuthenticated ? '/write' : '/register';
  const startLabel = isAuthenticated ? 'Open Creator Studio' : 'Start Writing for Free';

  const featuredPost = posts[0];
  const featuredCategory = featuredPost?.categories?.[0]?.name ?? featuredPost?.categories?.[0];
  const featuredAuthor = featuredPost?.user?.username || featuredPost?.author?.username;
  const featuredStats = featuredPost?.trending;

  const topics = useMemo(() => {
    if (categories.length > 0) return categories.map((c) => ({ name: c.name }));

    const fromPosts = new Set();
    posts.forEach((post) => (post.categories || []).forEach((c) => fromPosts.add(c?.name ?? c)));
    return [...fromPosts].filter(Boolean).map((name) => ({ name }));
  }, [categories, posts]);

  return (
    <Page>
      {/* ── 1. Hero Section ──────────────────────────────────────────────── */}
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

            {topics.length > 0 && (
              <HeroTopicsSection>
                <TopicLabel>
                  <Flame size={14} /> Popular Topics:
                </TopicLabel>
                <CategoryPillsRow>
                  {topics.slice(0, 6).map((topic) => {
                    const Icon = topicIcon(topic.name);
                    return (
                      <TopicPill
                        key={topic.name}
                        onClick={() =>
                          navigate(`/search?category=${encodeURIComponent(topic.name)}`)
                        }
                      >
                        <Icon /> {topic.name}
                      </TopicPill>
                    );
                  })}
                </CategoryPillsRow>
              </HeroTopicsSection>
            )}
          </HeroContent>

          {/* Hero Spotlight Card */}
          <HeroVisual>
            <AmbientGlow />
            {featuredPost ? (
              <ShowcaseCard>
                <CardHeader>
                  <AuthorByline
                    layout="stacked"
                    size="sm"
                    name={featuredAuthor}
                    note={isRanked ? `Most read this month` : 'Featured community story'}
                  />
                  <SpotlightBadge>
                    <Sparkles /> Spotlight
                  </SpotlightBadge>
                </CardHeader>

                {featuredPost.imageURL && (
                  <CardImageMock style={{ backgroundImage: `url(${featuredPost.imageURL})` }} />
                )}

                <CardTitle to={`/post/${featuredPost._id}`}>{featuredPost.title}</CardTitle>

                {featuredStats && featuredStats.views > 0 && (
                  <ReadRateWidget>
                    <ReadRateHeader>
                      <span>Read through completion</span>
                      <span className="percent">{featuredStats.readRate}%</span>
                    </ReadRateHeader>
                    <ProgressBar>
                      <div style={{ width: `${featuredStats.readRate}%` }} />
                    </ProgressBar>
                  </ReadRateWidget>
                )}

                <CardFooterStats>
                  {featuredCategory && (
                    <Chip size="sm" selected interactive={false}>
                      {featuredCategory}
                    </Chip>
                  )}
                  <StatItem $heart>
                    <Heart /> {featuredPost.likes?.length ?? 0}
                  </StatItem>
                  <StatItem>
                    <Clock /> {readingTime(featuredPost.content)} min read
                  </StatItem>
                </CardFooterStats>
              </ShowcaseCard>
            ) : (
              <ShowcaseCard>
                <CardHeader>
                  <AuthorByline
                    layout="stacked"
                    size="sm"
                    name="Elena Rostova"
                    note="Staff Writer · 4 min read"
                  />
                  <SpotlightBadge>
                    <Sparkles /> Spotlight
                  </SpotlightBadge>
                </CardHeader>
                <CardImageMock
                  style={{
                    backgroundImage:
                      "url('https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80')",
                  }}
                />
                <CardTitle to="/search">The Art of Distraction-Free Deep Thinking</CardTitle>
                <ReadRateWidget>
                  <ReadRateHeader>
                    <span>Read through completion</span>
                    <span className="percent">94%</span>
                  </ReadRateHeader>
                  <ProgressBar>
                    <div style={{ width: '94%' }} />
                  </ProgressBar>
                </ReadRateWidget>
                <CardFooterStats>
                  <Chip size="sm" selected interactive={false}>
                    Productivity
                  </Chip>
                  <StatItem $heart>
                    <Heart /> 48
                  </StatItem>
                  <StatItem>
                    <Clock /> 4 min read
                  </StatItem>
                </CardFooterStats>
              </ShowcaseCard>
            )}
          </HeroVisual>
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
