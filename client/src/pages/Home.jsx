import { useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import styled, { keyframes } from 'styled-components';
import {
  ArrowRight,
  PenLine,
  Sparkles,
  Compass,
  TrendingUp,
  Flame,
  Heart,
  BarChart2,
  Layers,
  Zap,
  Users,
  Clock,
  Eye,
  MessageCircle,
  ShieldCheck,
  Globe2,
} from 'lucide-react';

import { postService } from '../services/postService';
import { categoryService } from '../services/categoryService';
import { useAuth } from '../context/AuthContext';
import { Button, Chip, Skeleton } from '../components/ui';
import { PostCard } from '../components/posts/PostCard';
import { PostCardSkeleton } from '../components/posts/PostCardSkeleton';
import { display, text, label as labelStyle, media, interactive } from '../styles/theme/mixins';
import { topicIcon } from '../components/marketing/Topics';
import { initial, readingTime } from '../utils/text';

/* ── Keyframe Animations ─────────────────────────────────────────────────── */

const floatAnimation = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
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
  min-height: min(72vh, 620px);

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
  max-width: 620px;
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
  box-shadow: 0 2px 8px rgba(14, 165, 233, 0.15);

  svg {
    width: 14px;
    height: 14px;
    color: ${({ theme }) => theme.colors.accentSolid};
  }
`;

const HeroTitle = styled.h1`
  ${display('2xl')}
  color: ${({ theme }) => theme.colors.textPrimary};
  line-height: 1.08;
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
  max-width: 540px;
`;

const HeroActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;
`;

const HeroSocialProof = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};
  padding-top: ${({ theme }) => theme.spacing.md};
  border-top: 1px solid ${({ theme }) => theme.colors.lineSubtle};
  flex-wrap: wrap;
`;

const CategoryPillsRow = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
`;

const MiniPill = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 8px;
  border-radius: ${({ theme }) => theme.radii.full};
  background: ${({ theme }) => theme.colors.surfaceContainer};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 11px;
  font-weight: 600;

  svg {
    width: 12px;
    height: 12px;
    color: ${({ theme }) => theme.colors.accentSolid};
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

const ShowcaseCard = styled.div`
  width: 100%;
  max-width: 440px;
  background: ${({ theme }) => theme.colors.surfaceElevated};
  border: 1px solid ${({ theme }) => theme.colors.lineDefault};
  border-radius: ${({ theme }) => theme.radii['2xl']};
  padding: ${({ theme }) => theme.spacing.xl};
  box-shadow:
    0 20px 40px -15px rgba(15, 23, 42, 0.08),
    0 0 25px -5px rgba(14, 165, 233, 0.15);
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  position: relative;
  z-index: 2;
  animation: ${floatAnimation} 6s ease-in-out infinite;
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
`;

const AuthorInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const AuthorAvatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: ${({ theme }) => theme.gradients.brand};
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 13px;
  box-shadow: 0 2px 6px rgba(14, 165, 233, 0.3);
`;

const AuthorMeta = styled.div`
  display: flex;
  flex-direction: column;
`;

const AuthorName = styled.span`
  ${text('sm', 'bold')}
  color: ${({ theme }) => theme.colors.textPrimary};
  display: flex;
  align-items: center;
  gap: 4px;

  svg {
    width: 13px;
    height: 13px;
    color: ${({ theme }) => theme.colors.accentSolid};
  }
`;

const AuthorHandle = styled.span`
  ${text('xs')}
  color: ${({ theme }) => theme.colors.textMuted};
`;

const CardImageMock = styled.div`
  width: 100%;
  height: 160px;
  border-radius: ${({ theme }) => theme.radii.lg};
  background-image: url('https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80');
  background-size: cover;
  background-position: center;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: flex-end;
  padding: ${({ theme }) => theme.spacing.md};

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, transparent 40%, rgba(15, 23, 42, 0.85) 100%);
  }
`;

const CardTitle = styled.h3`
  ${display('xs')}
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 1.15rem;
  line-height: 1.35;
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
    width: 92%;
    background: ${({ theme }) => theme.gradients.brandBar};
    border-radius: inherit;
  }
`;

const CardFooterStats = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  ${text('xs')}
  color: ${({ theme }) => theme.colors.textMuted};
  padding-top: ${({ theme }) => theme.spacing.xs};
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

/* ── Topic Filter Slider ─────────────────────────────────────────────────── */

const EmptyFeed = styled.p`
  padding: ${({ theme }) => theme.spacing['3xl']} 0;
  text-align: center;
  ${text('md')}
  color: ${({ theme }) => theme.colors.textMuted};
`;

const MoreLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: ${({ theme }) => theme.spacing.xl};
  ${text('sm', 'semibold')}
  color: ${({ theme }) => theme.colors.accentText};

  svg {
    width: 15px;
    height: 15px;
    transition: transform ${({ theme }) => theme.transitions.fast};
  }

  &:hover svg {
    transform: translateX(3px);
  }
`;

/* ── Section Headers ─────────────────────────────────────────────────────── */

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
  max-width: 520px;
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
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.03);
  ${interactive}

  ${({ $span }) =>
    $span === '2' &&
    `
    grid-column: span 2;
  `}

  &:hover {
    border-color: ${({ theme }) => theme.colors.accentLine};
    box-shadow:
      0 12px 30px -8px rgba(15, 23, 42, 0.08),
      0 0 15px -3px rgba(14, 165, 233, 0.12);
    transform: translateY(-3px);
  }

  ${media.down('lg')`
    grid-column: span 1;
  `}
`;

const BentoIcon = styled.div`
  width: 44px;
  height: 44px;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.accentContainer};
  color: ${({ theme }) => theme.colors.accentSolid};
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(14, 165, 233, 0.2);

  svg {
    width: 22px;
    height: 22px;
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
  line-height: 1.6;
`;

/* ── Feed Grid ───────────────────────────────────────────────────────────── */

const FeedGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: ${({ theme }) => theme.spacing['3xl']};
  align-items: start;

  ${media.down('lg')`grid-template-columns: 1fr;`}
`;

const PostList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};
`;

const Sidebar = styled.aside`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing['2xl']};

  ${media.up('lg')`
    position: sticky;
    top: calc(${({ theme }) => theme.layout.headerHeight} + ${({ theme }) => theme.spacing.xl});
  `}
`;

const SidebarCard = styled.div`
  background: ${({ theme }) => theme.colors.surfaceElevated};
  border: 1px solid ${({ theme }) => theme.colors.lineDefault};
  border-radius: ${({ theme }) => theme.radii.xl};
  padding: ${({ theme }) => theme.spacing.xl};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.03);
`;

const SidebarTitle = styled.h4`
  ${text('md', 'bold')}
  color: ${({ theme }) => theme.colors.textPrimary};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};

  svg {
    width: 16px;
    height: 16px;
    color: ${({ theme }) => theme.colors.accentSolid};
  }
`;

const WriterRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};

  & + & {
    padding-top: ${({ theme }) => theme.spacing.md};
    border-top: 1px solid ${({ theme }) => theme.colors.lineSubtle};
  }
`;

const WriterLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  min-width: 0;
`;

const WriterAvatar = styled.div`
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: ${({ theme }) => theme.gradients.brand};
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 12px;
  flex-shrink: 0;
`;

const WriterMeta = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

const WriterName = styled.span`
  ${text('sm', 'semibold')}
  color: ${({ theme }) => theme.colors.textPrimary};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const WriterFollowers = styled.span`
  ${text('xs')}
  color: ${({ theme }) => theme.colors.textMuted};
`;

/* ── CTA Banner ──────────────────────────────────────────────────── */

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
  box-shadow: 0 20px 40px -10px rgba(2, 132, 199, 0.4);

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -20%;
    width: 60%;
    height: 150%;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, transparent 60%);
    pointer-events: none;
  }
`;

const CtaTitle = styled.h2`
  ${display('xl')}
  color: #ffffff;
  font-weight: 800;
  max-width: 22ch;

  ${media.down('md')`font-size: ${({ theme }) => theme.display.md[0]};`}
`;

const CtaSubtitle = styled.p`
  ${text('lg')}
  color: rgba(255, 255, 255, 0.9);
  max-width: 560px;
  line-height: 1.6;
`;

/* ── Component ───────────────────────────────────────────────────────────── */

export function Home() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Ranked by recent engagement. The response says which it managed — a real ranking, or the
  // newest stories because too little has happened to rank anything — and the section is
  // labelled from that rather than calling whatever came back "trending".
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
  const startLabel = isAuthenticated ? 'Open Creator Studio' : 'Start Publishing Free';

  // The top-ranked story, shown in the hero with its own real figures. It used to be
  // posts[0] — the newest post — captioned "⚡ Featured Story" beside a hardcoded
  // "89.4% completion" that belonged to no post at all.
  const featuredPost = posts[0];
  const featuredCategory = featuredPost?.categories?.[0]?.name ?? featuredPost?.categories?.[0];
  const featuredAuthor = featuredPost?.user?.username;
  const featuredStats = featuredPost?.trending;

  /*
    Writers with more than one story in the current ranking.

    The count is of stories *in this list*, not of everything they have written — the landing
    page has no way to know that — so it is labelled as such. It previously read
    `…length || 7`, which meant a writer the count came out as zero for was shown as having
    seven stories.
  */
  const featuredWriters = useMemo(() => {
    const map = new Map();
    posts.forEach((post) => {
      const author = post.user;
      if (!author?.username) return;

      const existing = map.get(author.username);
      if (existing) {
        existing.storiesCount += 1;
        return;
      }

      map.set(author.username, {
        id: author._id,
        name: author.username,
        topic: post.categories?.[0]?.name ?? post.categories?.[0] ?? 'Writing',
        storiesCount: 1,
      });
    });

    return Array.from(map.values())
      .sort((a, b) => b.storiesCount - a.storiesCount)
      .slice(0, 4);
  }, [posts]);

  /*
    The categories the platform actually has. They were fetched and then ignored in favour of
    five hardcoded pills, so the filter offered topics that did not exist and hid ones that
    did. Falling back to the categories present on the loaded stories keeps the bar useful
    even if the categories request is the one that fails.
  */
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
              <Sparkles /> Markdown in, a clean article out
            </HeroBadge>

            {/*
              The old headline — "Where ideas in food, tech, science & culture come to life" —
              named the seed's categories, ran to four lines, and gave a writer no reason to
              publish here rather than anywhere else. This one leads with the thing the
              platform actually measures and most others do not.
            */}
            <HeroTitle>
              Find out who <span className="gradient-text">finished reading.</span>
            </HeroTitle>

            <HeroSubtitle>
              Most platforms count the click. BlogHub counts how far people actually got — so you
              can see which pieces held attention and which lost it. Write in Markdown, keep drafts
              private until you are ready, and publish when you are.
            </HeroSubtitle>

            <HeroActions>
              <Button size="lg" onClick={() => navigate(startHref)}>
                <PenLine /> {startLabel}
              </Button>
              <Button size="lg" variant="secondary" onClick={() => navigate('/search')}>
                <Compass /> Explore all stories
              </Button>
            </HeroActions>

            {/*
              The real categories, from the API. These were five hardcoded pills reading
              "Tech & AI", "Space & Science" and "UI/UX Design" — none of which are category
              names this platform has.
            */}
            {topics.length > 0 && (
              <HeroSocialProof>
                <CategoryPillsRow>
                  {topics.slice(0, 5).map((topic) => {
                    const Icon = topicIcon(topic.name);
                    return (
                      <MiniPill key={topic.name}>
                        <Icon /> {topic.name}
                      </MiniPill>
                    );
                  })}
                </CategoryPillsRow>
              </HeroSocialProof>
            )}
          </HeroContent>

          {/*
            A real story with its own real figures, not a mock. Everything numeric here used to
            be invented: a fixed "89.4%" completion above a bar hardcoded to 92% width, "4 min
            read", a verification tick beside a name on a platform with no verification, an
            @handle for a concept that does not exist, and `likes || 18` so an unliked post
            showed eighteen. It is only rendered once there is a story to render.
          */}
          {featuredPost && (
            <HeroVisual>
              <ShowcaseCard>
                <CardHeader>
                  <AuthorInfo>
                    <AuthorAvatar>{initial(featuredAuthor)}</AuthorAvatar>
                    <AuthorMeta>
                      <AuthorName>{featuredAuthor}</AuthorName>
                      <AuthorHandle>
                        {isRanked
                          ? `Most read in the last ${trendingWindow} days`
                          : 'Recently published'}
                      </AuthorHandle>
                    </AuthorMeta>
                  </AuthorInfo>
                  {featuredCategory && (
                    <Chip size="sm" selected>
                      {featuredCategory}
                    </Chip>
                  )}
                </CardHeader>

                {featuredPost.imageURL && (
                  <CardImageMock style={{ backgroundImage: `url(${featuredPost.imageURL})` }} />
                )}

                <CardTitle as={Link} to={`/post/${featuredPost._id}`}>
                  {featuredPost.title}
                </CardTitle>

                {/* Only shown when the figures exist — that is, when the ranking was real. */}
                {featuredStats && featuredStats.views > 0 && (
                  <ReadRateWidget>
                    <ReadRateHeader>
                      <span>Read to the end</span>
                      <span className="percent">{featuredStats.readRate}%</span>
                    </ReadRateHeader>
                    <ProgressBar>
                      <div style={{ width: `${featuredStats.readRate}%` }} />
                    </ProgressBar>
                  </ReadRateWidget>
                )}

                <CardFooterStats>
                  {featuredStats && (
                    // "opens", not "reads" — the percentage above is reads as a share of
                    // opens, so calling this one reads too made the two contradict each other.
                    <StatItem>
                      <Eye /> {featuredStats.views} {featuredStats.views === 1 ? 'open' : 'opens'}
                    </StatItem>
                  )}
                  <StatItem $heart>
                    <Heart /> {featuredPost.likes?.length ?? 0}
                  </StatItem>
                  <StatItem>
                    <Clock /> {readingTime(featuredPost.content)} min read
                  </StatItem>
                </CardFooterStats>
              </ShowcaseCard>
            </HeroVisual>
          )}
        </HeroSection>
      </Container>

      {/* ── 3. Main Feed & Sidebar ───────────────────────────────────────── */}
      <Container>
        <FeedGrid>
          <section>
            <SectionHead>
              <SectionLeft>
                {/*
                  The heading follows what the server managed to do. "Curated Discoveries" and
                  "Trending Across All Categories" sat above the twelve newest posts — nothing
                  was curated and nothing was trending, so publishing anything put it on top.
                */}
                <SectionKicker>
                  <Flame /> {isRanked ? 'Most read recently' : 'Fresh from the community'}
                </SectionKicker>
                <SectionTitle>{isRanked ? 'Trending now' : 'Latest stories'}</SectionTitle>
                <SectionSubtitle>
                  {isLoading
                    ? 'Loading stories…'
                    : isRanked
                      ? `Ranked by reads, finishes, likes and comments over the last ${trendingWindow} days.`
                      : 'Not enough reading activity yet to rank anything, so these are the newest.'}
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
                  Nothing has been published yet. If you have something to say, you would be first.
                </EmptyFeed>
              ) : (
                posts.map((post) => <PostCard key={post._id} post={post} />)
              )}
            </PostList>

            {/*
              The list is a top ten, not the archive. Without a way onward the page simply
              stopped, which is also why the filter felt necessary — search is where browsing
              the whole collection belongs.
            */}
            {!isLoading && posts.length > 0 && (
              <MoreLink to="/search">
                Explore all stories <ArrowRight />
              </MoreLink>
            )}
          </section>

          <Sidebar>
            {/*
              Real categories, each a link into search rather than a local filter.

              These were eight hardcoded names — one of them, "Architecture", is not a category
              this platform has — wired to a filter that ran over the twelve ranked posts
              already on the page. So picking "Programming" showed nothing while eight
              published Programming stories sat in the database, and picking a category with no
              stories at all was offered just the same. Browsing belongs on the search page,
              which queries the whole collection; this points there and says how many are
              waiting.
            */}
            <SidebarCard>
              <SidebarTitle>
                <TrendingUp /> Browse by topic
              </SidebarTitle>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {categories.map((category) => (
                  <Chip
                    key={category._id}
                    as={Link}
                    size="sm"
                    to={`/search?topic=${encodeURIComponent(category.name)}`}
                  >
                    {category.name}
                    {category.postCount ? ` (${category.postCount})` : ''}
                  </Chip>
                ))}
              </div>
            </SidebarCard>

            {/* Featured Writers Widget */}
            <SidebarCard>
              <SidebarTitle>
                <Users /> Featured Creators
              </SidebarTitle>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {isLoading && featuredWriters.length === 0
                  ? Array.from({ length: 4 }).map((_, index) => (
                      <div
                        key={index}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: 12,
                          padding: index > 0 ? '8px 0 0 0' : 0,
                          borderTop: index > 0 ? '1px solid rgba(255, 255, 255, 0.05)' : 'none',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
                          <Skeleton $variant="circle" $width={34} $height={34} />
                          <div
                            style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}
                          >
                            <Skeleton $width="70%" $height={13} $radius="xs" />
                            <Skeleton $width="40%" $height={11} $radius="xs" />
                          </div>
                        </div>
                        <Skeleton $width={50} $height={28} $radius="sm" />
                      </div>
                    ))
                  : featuredWriters.map((writer) => (
                      <WriterRow key={writer.name}>
                        <WriterLeft>
                          <WriterAvatar>{initial(writer.name)}</WriterAvatar>
                          <WriterMeta>
                            <WriterName>{writer.name}</WriterName>
                            <WriterFollowers>
                              {writer.topic} · {writer.storiesCount}{' '}
                              {writer.storiesCount === 1 ? 'story' : 'stories'} trending
                            </WriterFollowers>
                          </WriterMeta>
                        </WriterLeft>
                        <Button
                          size="sm"
                          variant="tonal"
                          onClick={() =>
                            writer.id ? navigate(`/user/${writer.id}`) : navigate('/search')
                          }
                        >
                          View
                        </Button>
                      </WriterRow>
                    ))}
              </div>
            </SidebarCard>

            {/*
              A "BlogHub Weekly" signup form used to sit here. There is no newsletter: it took
              an address, threw it away, and answered "Subscribed! Welcome to the BlogHub weekly
              digest." Collecting an address under a promise nothing keeps is the worst kind of
              filler, so it is gone until there is something to send.
            */}
            <SidebarCard>
              <SidebarTitle>
                <Zap /> How ranking works
              </SidebarTitle>
              <p style={{ fontSize: 13, lineHeight: 1.6, opacity: 0.85 }}>
                Stories are ranked by what readers did in the last {trendingWindow} days — opens,
                finishes, likes and comments — with finishing weighted highest. A new story does not
                start at the top; it gets there by being read.
              </p>
            </SidebarCard>
          </Sidebar>
        </FeedGrid>
      </Container>

      {/* ── 4. "Why BlogHub?" Bento Section ──────────────────────────────── */}
      <Container>
        <SectionHead style={{ textAlign: 'center', justifyContent: 'center' }}>
          <SectionLeft style={{ alignItems: 'center' }}>
            <SectionKicker>
              <Layers /> What you get
            </SectionKicker>
            <SectionTitle>Everything here, and nothing you did not ask for</SectionTitle>
            <SectionSubtitle style={{ textAlign: 'center' }}>
              A short list, because it is the whole list. Each of these is built and working.
            </SectionSubtitle>
          </SectionLeft>
        </SectionHead>

        <BentoGrid>
          <BentoCard>
            <BentoIcon>
              <Globe2 />
            </BentoIcon>
            <BentoTitle>Categories and tags</BentoTitle>
            <BentoDescription>
              Put a story under a category an administrator curates, and add up to five tags of your
              own. Readers filter the feed by either.
            </BentoDescription>
          </BentoCard>

          <BentoCard>
            <BentoIcon>
              <BarChart2 />
            </BentoIcon>
            <BentoTitle>Read-through, not just clicks</BentoTitle>
            <BentoDescription>
              Every story records opens and finishes separately, so your dashboard shows what share
              of readers reached the end — per story and across everything you have written.
            </BentoDescription>
          </BentoCard>

          <BentoCard>
            <BentoIcon>
              <MessageCircle />
            </BentoIcon>
            <BentoTitle>Replies you can moderate</BentoTitle>
            <BentoDescription>
              Readers reply, and reply to replies. Everything left on your stories collects in one
              place in your workspace, where you can remove what does not belong.
            </BentoDescription>
          </BentoCard>

          <BentoCard $span="2">
            <BentoIcon>
              <ShieldCheck />
            </BentoIcon>
            <BentoTitle>Draft, private, public</BentoTitle>
            <BentoDescription>
              A draft is yours alone while you work on it. Private keeps a finished piece out of the
              feed. Public publishes it. You can move a story between all three at any time.
            </BentoDescription>
          </BentoCard>

          <BentoCard>
            <BentoIcon>
              <Sparkles />
            </BentoIcon>
            <BentoTitle>Nothing in the way</BentoTitle>
            <BentoDescription>
              No popups, no ads, no paywall. Light and dark themes, and typography set for reading
              rather than for scrolling past.
            </BentoDescription>
          </BentoCard>
        </BentoGrid>
      </Container>

      {/* ── 5. Closing CTA Section ───────────────────────────────────────── */}
      <Container>
        <CtaSection>
          <CtaTitle>Write something and find out if it lands</CtaTitle>
          <CtaSubtitle>
            An account takes a moment. Your first draft is private until you publish it, and from
            the day you do you can see how many readers reached the end.
          </CtaSubtitle>
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
        </CtaSection>
      </Container>
    </Page>
  );
}
