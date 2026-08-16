import { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import styled, { keyframes } from 'styled-components';
import {
  ArrowRight,
  PenLine,
  BookOpen,
  Sparkles,
  Compass,
  TrendingUp,
  Flame,
  CheckCircle2,
  Heart,
  MessageCircle,
  BarChart2,
  Layers,
  Zap,
  Users,
  Clock,
  Bookmark,
  ShieldCheck,
  Globe2,
  Coffee,
  Cpu,
  Palette,
  Plane,
  Activity,
  Atom,
} from 'lucide-react';
import toast from 'react-hot-toast';

import { postService } from '../services/postService';
import { categoryService } from '../services/categoryService';
import { useAuth } from '../context/AuthContext';
import { Button, Chip, Loading, Input } from '../components/ui';
import { PostCard } from '../components/posts/PostCard';
import { display, text, label as labelStyle, media, interactive } from '../styles/theme/mixins';
import { topicIcon } from '../components/marketing/Topics';
import { initial } from '../utils/text';

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
    background: linear-gradient(135deg, #0284c7 0%, #38bdf8 100%);
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
  box-shadow: 0 20px 40px -15px rgba(15, 23, 42, 0.08), 0 0 25px -5px rgba(14, 165, 233, 0.15);
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
  background: linear-gradient(135deg, #0284c7, #38bdf8);
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

const ImageBadge = styled.span`
  position: relative;
  z-index: 1;
  background: rgba(15, 23, 42, 0.8);
  backdrop-filter: blur(8px);
  color: #ffffff;
  padding: 4px 10px;
  border-radius: ${({ theme }) => theme.radii.full};
  font-size: 11px;
  font-weight: 600;
  border: 1px solid rgba(255, 255, 255, 0.2);
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
    background: linear-gradient(90deg, #0284c7, #38bdf8);
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

const TopicBar = styled.section`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  overflow-x: auto;
  padding: ${({ theme }) => theme.spacing.sm} 0;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
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
    box-shadow: 0 12px 30px -8px rgba(15, 23, 42, 0.08), 0 0 15px -3px rgba(14, 165, 233, 0.12);
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
  background: linear-gradient(135deg, #0284c7, #38bdf8);
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
  background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
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
  const [selectedTopic, setSelectedTopic] = useState('All');
  const [newsletterEmail, setNewsletterEmail] = useState('');

  const { data: postsResponse, isLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: () => postService.getPosts({ limit: 12 }),
  });

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: categoryService.getCategories,
  });

  const posts = postsResponse?.data ?? [];
  const categories = categoriesData?.data ?? [];

  const startHref = isAuthenticated ? '/write' : '/register';
  const startLabel = isAuthenticated ? 'Open Creator Studio' : 'Start Publishing Free';

  const filteredPosts = useMemo(() => {
    if (selectedTopic === 'All') return posts;
    return posts.filter((post) =>
      (post.categories || []).some(
        (cat) => (cat?.name ?? cat).toLowerCase() === selectedTopic.toLowerCase()
      )
    );
  }, [posts, selectedTopic]);

  const handleNewsletter = (e) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    toast.success('Subscribed! Welcome to the BlogHub weekly digest.');
    setNewsletterEmail('');
  };

  const featuredPost = posts[0];
  const featuredCategory = featuredPost?.categories?.[0]?.name ?? featuredPost?.categories?.[0] ?? 'Featured';
  const featuredAuthor = featuredPost?.user?.username ?? 'john_doe';

  const featuredWriters = useMemo(() => {
    const map = new Map();
    posts.forEach((p) => {
      const u = p.user;
      if (u && (u._id || u.username) && !map.has(u.username)) {
        map.set(u.username, {
          id: u._id,
          name: u.username,
          topic: (p.categories?.[0]?.name ?? p.categories?.[0]) || 'Creator',
          storiesCount: posts.filter((item) => item.user?.username === u.username).length || 7,
        });
      }
    });
    return Array.from(map.values()).slice(0, 4);
  }, [posts]);

  const DEFAULT_TOPICS = [
    { name: 'Food', icon: Coffee },
    { name: 'Technology', icon: Cpu },
    { name: 'Science', icon: Atom },
    { name: 'Design', icon: Palette },
    { name: 'Travel', icon: Plane },
    { name: 'Health', icon: Activity },
  ];

  if (isLoading && posts.length === 0) return <Loading text="Loading stories…" />;

  return (
    <Page>
      {/* ── 1. Hero Section ──────────────────────────────────────────────── */}
      <Container>
        <HeroSection>
          <HeroContent>
            <HeroBadge>
              <Sparkles /> The Universal Publishing Platform for Writers & Readers
            </HeroBadge>

            <HeroTitle>
              Where ideas in food, tech, science & culture <span className="gradient-text">come to life.</span>
            </HeroTitle>

            <HeroSubtitle>
              A clean, distraction-free reading and publishing platform. Explore diverse stories, follow passionate creators, and publish your own perspective.
            </HeroSubtitle>

            <HeroActions>
              <Button size="lg" onClick={() => navigate(startHref)}>
                <PenLine /> {startLabel}
              </Button>
              <Button size="lg" variant="secondary" onClick={() => navigate('/search')}>
                <Compass /> Explore all stories
              </Button>
            </HeroActions>

            <HeroSocialProof>
              <CategoryPillsRow>
                <MiniPill><Coffee /> Culinary & Food</MiniPill>
                <MiniPill><Cpu /> Tech & AI</MiniPill>
                <MiniPill><Atom /> Space & Science</MiniPill>
                <MiniPill><Palette /> UI/UX Design</MiniPill>
                <MiniPill><Plane /> Travel</MiniPill>
              </CategoryPillsRow>
            </HeroSocialProof>
          </HeroContent>

          <HeroVisual>
            <ShowcaseCard>
              <CardHeader>
                <AuthorInfo>
                  <AuthorAvatar>{initial(featuredAuthor)}</AuthorAvatar>
                  <AuthorMeta>
                    <AuthorName>
                      {featuredAuthor} <CheckCircle2 />
                    </AuthorName>
                    <AuthorHandle>@{featuredAuthor.toLowerCase()} · {featuredCategory}</AuthorHandle>
                  </AuthorMeta>
                </AuthorInfo>
                <Chip size="sm" selected>
                  {featuredCategory}
                </Chip>
              </CardHeader>

              <CardImageMock style={{ backgroundImage: `url(${featuredPost?.imageURL || 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80'})` }}>
                <ImageBadge>⚡ Featured Story</ImageBadge>
              </CardImageMock>

              <CardTitle>
                {featuredPost?.title || 'The Chemistry of Sourdough: Why Temperature and Hydration Rule the Crumb'}
              </CardTitle>

              <ReadRateWidget>
                <ReadRateHeader>
                  <span>Reader Completion Rate</span>
                  <span className="percent">89.4%</span>
                </ReadRateHeader>
                <ProgressBar>
                  <div />
                </ProgressBar>
              </ReadRateWidget>

              <CardFooterStats>
                <StatItem $heart>
                  <Heart /> {featuredPost?.likes?.length || 18} likes
                </StatItem>
                <StatItem>
                  <MessageCircle /> {featuredPost?.comments?.length || 6} replies
                </StatItem>
                <StatItem>
                  <Clock /> 4 min read
                </StatItem>
              </CardFooterStats>
            </ShowcaseCard>
          </HeroVisual>
        </HeroSection>
      </Container>

      {/* ── 2. Topic Filter Carousel ─────────────────────────────────────── */}
      <Container>
        <TopicBar>
          <Chip
            size="md"
            selected={selectedTopic === 'All'}
            onClick={() => setSelectedTopic('All')}
          >
            🔥 All Categories
          </Chip>
          {DEFAULT_TOPICS.map((topic) => {
            const Icon = topic.icon;
            return (
              <Chip
                key={topic.name}
                size="md"
                selected={selectedTopic.toLowerCase() === topic.name.toLowerCase()}
                onClick={() => setSelectedTopic(topic.name)}
              >
                <Icon size={15} />
                {topic.name}
              </Chip>
            );
          })}
        </TopicBar>
      </Container>

      {/* ── 3. Main Feed & Sidebar ───────────────────────────────────────── */}
      <Container>
        <FeedGrid>
          <section>
            <SectionHead>
              <SectionLeft>
                <SectionKicker>
                  <Flame /> Curated Discoveries
                </SectionKicker>
                <SectionTitle>
                  {selectedTopic === 'All' ? 'Trending Across All Categories' : `${selectedTopic} Stories`}
                </SectionTitle>
                <SectionSubtitle>
                  {filteredPosts.length} {filteredPosts.length === 1 ? 'article' : 'articles'} exploring ideas, techniques, and insights.
                </SectionSubtitle>
              </SectionLeft>
            </SectionHead>

            <PostList>
              {filteredPosts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </PostList>
          </section>

          <Sidebar>
            {/* Trending Topics Widget */}
            <SidebarCard>
              <SidebarTitle>
                <TrendingUp /> Explore Topics
              </SidebarTitle>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {['Food', 'Technology', 'Science', 'Design', 'Travel', 'Health', 'Programming', 'Architecture'].map((name) => (
                  <Chip
                    key={name}
                    size="sm"
                    selected={selectedTopic.toLowerCase() === name.toLowerCase()}
                    onClick={() => {
                      setSelectedTopic(name);
                      window.scrollTo({ top: 460, behavior: 'smooth' });
                    }}
                  >
                    {name}
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
                {featuredWriters.map((writer) => (
                  <WriterRow key={writer.name}>
                    <WriterLeft>
                      <WriterAvatar>{initial(writer.name)}</WriterAvatar>
                      <WriterMeta>
                        <WriterName>{writer.name}</WriterName>
                        <WriterFollowers>{writer.topic} · {writer.storiesCount} stories</WriterFollowers>
                      </WriterMeta>
                    </WriterLeft>
                    <Button
                      size="sm"
                      variant="tonal"
                      onClick={() => (writer.id ? navigate(`/user/${writer.id}`) : navigate('/search'))}
                    >
                      View
                    </Button>
                  </WriterRow>
                ))}
              </div>
            </SidebarCard>

            {/* Newsletter Sidebar Widget */}
            <SidebarCard style={{ background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)', borderColor: '#bae6fd' }}>
              <SidebarTitle style={{ color: '#0369a1' }}>
                <Zap /> BlogHub Weekly
              </SidebarTitle>
              <p style={{ fontSize: 13, color: '#0369a1', lineHeight: 1.5 }}>
                A handpicked selection of top culinary essays, scientific breakdowns, tech deep-dives, and design insights.
              </p>
              <form onSubmit={handleNewsletter} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <Input
                  placeholder="your.email@example.com"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  required
                />
                <Button size="sm" type="submit">
                  Join Newsletter
                </Button>
              </form>
            </SidebarCard>
          </Sidebar>
        </FeedGrid>
      </Container>

      {/* ── 4. "Why BlogHub?" Bento Section ──────────────────────────────── */}
      <Container>
        <SectionHead style={{ textAlign: 'center', justifyContent: 'center' }}>
          <SectionLeft style={{ alignItems: 'center' }}>
            <SectionKicker>
              <Layers /> Universal Publishing Engine
            </SectionKicker>
            <SectionTitle>Designed For Every Storyteller</SectionTitle>
            <SectionSubtitle style={{ textAlign: 'center' }}>
              Whether you're sharing a signature recipe, an engineering breakthrough, or a travel journal — BlogHub gives your words the stage they deserve.
            </SectionSubtitle>
          </SectionLeft>
        </SectionHead>

        <BentoGrid>
          <BentoCard>
            <BentoIcon>
              <Globe2 />
            </BentoIcon>
            <BentoTitle>Universal Multi-Category Hub</BentoTitle>
            <BentoDescription>
              Publish across Food, Technology, Science, Travel, Design, and Health with rich tags and instant cross-category discoverability.
            </BentoDescription>
          </BentoCard>

          <BentoCard>
            <BentoIcon>
              <BarChart2 />
            </BentoIcon>
            <BentoTitle>Read-Through Completion Analytics</BentoTitle>
            <BentoDescription>
              Go beyond simple click counts. Understand true reader engagement with live scroll-depth and completion percentage metrics.
            </BentoDescription>
          </BentoCard>

          <BentoCard>
            <BentoIcon>
              <MessageCircle />
            </BentoIcon>
            <BentoTitle>Engaged Reader Community</BentoTitle>
            <BentoDescription>
              Receive constructive feedback, threaded discussions, likes, bookmarks, and direct subscriber notifications.
            </BentoDescription>
          </BentoCard>

          <BentoCard $span="2">
            <BentoIcon>
              <ShieldCheck />
            </BentoIcon>
            <BentoTitle>Seamless Draft, Unlisted & Public Workspaces</BentoTitle>
            <BentoDescription>
              Keep works-in-progress private in your creator workspace, share unlisted peer-review links, or publish globally with one click.
            </BentoDescription>
          </BentoCard>

          <BentoCard>
            <BentoIcon>
              <Sparkles />
            </BentoIcon>
            <BentoTitle>Clean & Clutter-Free</BentoTitle>
            <BentoDescription>
              No popups, zero intrusive ads, and responsive typography tuned for maximum reading comfort across all devices.
            </BentoDescription>
          </BentoCard>
        </BentoGrid>
      </Container>

      {/* ── 5. Closing CTA Section ───────────────────────────────────────── */}
      <Container>
        <CtaSection>
          <CtaTitle>Have an idea or story to share with the world?</CtaTitle>
          <CtaSubtitle>
            Create your account in seconds. Publish food recipes, tech tutorials, science essays, or personal stories for a global audience.
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
