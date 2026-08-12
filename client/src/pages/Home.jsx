import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  TrendingUp,
  Sparkles,
  ArrowRight,
  Code,
  Palette,
  Briefcase,
  Heart,
  Cpu,
  Plane,
  PenTool,
  BarChart2,
  Zap,
  BookOpen,
  Compass,
} from 'lucide-react';
import styled from 'styled-components';
import { postService } from '../services/postService';
import { categoryService } from '../services/categoryService';
import { PostCard } from '../components/posts/PostCard';
import { Loading, Button } from '../components/ui';
import { useAuth } from '../context/AuthContext';
import { formatDistanceToNow } from 'date-fns';

const PageWrapper = styled.div`
  min-height: calc(100vh - ${({ theme }) => theme.layout.headerHeight});
  background: ${({ theme }) => theme.colors.bgSecondary};
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.lg};
`;

// Hero Section
const MainHero = styled.section`
  padding: 60px 0 40px;
  text-align: center;
  background: linear-gradient(
    180deg,
    ${({ theme }) => theme.colors.bgPrimary} 0%,
    ${({ theme }) => theme.colors.bgSecondary} 100%
  );
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const HeroBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 18px;
  background: ${({ theme }) => theme.colors.accentSubtle};
  color: ${({ theme }) => theme.colors.accent};
  border-radius: ${({ theme }) => theme.radii.full};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const HeroTitle = styled.h1`
  font-size: 3.5rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.textPrimary};
  line-height: 1.15;
  letter-spacing: -0.02em;
  max-width: 850px;
  margin: 0 auto ${({ theme }) => theme.spacing.md};

  span {
    background: linear-gradient(135deg, ${({ theme }) => theme.colors.accent} 0%, #8b5cf6 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 2.25rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.25rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  max-width: 640px;
  margin: 0 auto ${({ theme }) => theme.spacing.xl};
  line-height: 1.6;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 1rem;
  }
`;

const HeroCTA = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
`;

// Category Slideshow Hero
const HeroSection = styled.section`
  padding: ${({ theme }) => theme.spacing.xl} 0;
`;

const SlideContainer = styled.div`
  position: relative;
  max-width: 1200px;
  margin: 0 auto;
`;

const SlideCard = styled.div`
  background: ${({ theme }) => theme.colors.bgPrimary};
  border-radius: 32px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  overflow: hidden;
  display: grid;
  grid-template-columns: 1fr 1.4fr;
  min-height: 380px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.04);
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transform: ${({ $visible }) => ($visible ? 'scale(1)' : 'scale(0.98)')};
  transition:
    opacity 0.5s ease,
    transform 0.5s ease;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr;
    min-height: auto;
  }
`;

const SlideVisual = styled.div`
  background: ${({ $gradient }) => $gradient};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xxl};
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing.xl};
    min-height: 180px;
  }
`;

const IconWrapper = styled.div`
  width: 140px;
  height: 140px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 28px;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 70px;
    height: 70px;
    color: white;
    stroke-width: 1.5;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 100px;
    height: 100px;

    svg {
      width: 50px;
      height: 50px;
    }
  }
`;

const SlideContent = styled.div`
  padding: ${({ theme }) => theme.spacing.xxl};
  display: flex;
  flex-direction: column;
  justify-content: center;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing.xl};
  }
`;

const SlideLabel = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.accent};
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const SlideTitle = styled.h2`
  font-size: 2.25rem;
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  line-height: 1.15;
  margin-bottom: ${({ theme }) => theme.spacing.sm};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 1.75rem;
  }
`;

const SlideDescription = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.6;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const TopicBadges = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const TopicBadge = styled.span`
  padding: 6px 14px;
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.textSecondary};
  background: ${({ theme }) => theme.colors.bgSecondary};
  border-radius: ${({ theme }) => theme.radii.full};
`;

const ExploreButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 28px;
  background: ${({ theme }) => theme.colors.accent};
  color: white;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  border: none;
  border-radius: ${({ theme }) => theme.radii.full};
  cursor: pointer;
  transition: all 0.3s ease;
  align-self: flex-start;

  &:hover {
    background: ${({ theme }) => theme.colors.accentHover};
    gap: 12px;
  }
`;

const SlideControls = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

const SlideDot = styled.button`
  width: ${({ $active }) => ($active ? '28px' : '8px')};
  height: 8px;
  border-radius: 4px;
  background: ${({ $active, theme }) => ($active ? theme.colors.accent : theme.colors.border)};
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${({ $active, theme }) => ($active ? theme.colors.accent : theme.colors.textMuted)};
  }
`;

// Feature Grid Section
const FeaturesGridSection = styled.section`
  padding: 40px 0 20px;
`;

const SectionHeadline = styled.div`
  text-align: center;
  margin-bottom: 32px;
`;

const SubHeading = styled.h2`
  font-size: 1.85rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 8px;
`;

const SubText = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const GridFour = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

const FeatureCard = styled.div`
  background: ${({ theme }) => theme.colors.bgPrimary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 20px;
  padding: 24px;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.05);
  }
`;

const FeatureIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: ${({ $bg }) => $bg || 'rgba(99, 102, 241, 0.1)'};
  color: ${({ $color }) => $color || '#6366f1'};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
`;

const FeatureTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 8px;
`;

const FeatureDesc = styled.p`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.5;
`;

// Main Content Styles
const MainSection = styled.section`
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: ${({ theme }) => theme.spacing.xl};
  padding: ${({ theme }) => theme.spacing.xl} 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
  }
`;

const FeedSection = styled.main``;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const SectionIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.accentSubtle};
  color: ${({ theme }) => theme.colors.accent};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const FilterTabs = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  flex-wrap: wrap;
`;

const FilterTab = styled.button`
  padding: 8px 16px;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ $active, theme }) =>
    $active ? theme.colors.buttonPrimaryText : theme.colors.textSecondary};
  background: ${({ $active, theme }) => ($active ? theme.colors.accent : theme.colors.bgPrimary)};
  border: 1px solid ${({ $active, theme }) => ($active ? theme.colors.accent : theme.colors.border)};
  border-radius: ${({ theme }) => theme.radii.full};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    border-color: ${({ theme }) => theme.colors.accent};
    color: ${({ $active, theme }) =>
      $active ? theme.colors.buttonPrimaryText : theme.colors.accent};
  }
`;

const PostList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const Sidebar = styled.aside`
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    display: none;
  }
`;

const SidebarCard = styled.div`
  background: ${({ theme }) => theme.colors.bgPrimary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.xl};
  padding: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const SidebarTitle = styled.h3`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.md};

  svg {
    color: ${({ theme }) => theme.colors.accent};
  }
`;

const TrendingList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const TrendingItem = styled(Link)`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm};
  margin: 0 -${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.radii.md};
  transition: background ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.bgHover};
  }
`;

const TrendingNumber = styled.span`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.border};
  min-width: 28px;
`;

const TrendingContent = styled.div`
  flex: 1;
`;

const TrendingAuthor = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 4px;
`;

const TrendingAvatar = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.accentSubtle};
  color: ${({ theme }) => theme.colors.accent};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
`;

const TrendingAuthorName = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const TrendingTitle = styled.h4`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  line-height: 1.4;
  margin-bottom: 4px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const TrendingMeta = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const TopicList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const TopicTag = styled.button`
  padding: 8px 14px;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ $active, theme }) =>
    $active ? theme.colors.badgeActiveText : theme.colors.badgeText};
  background: ${({ $active, theme }) =>
    $active ? theme.colors.badgeActiveBg : theme.colors.badgeBg};
  border: none;
  border-radius: ${({ theme }) => theme.radii.full};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ $active, theme }) =>
      $active ? theme.colors.accentHover : theme.colors.accentMuted};
  }
`;

const WriteCard = styled(SidebarCard)`
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.accent} 0%, #8b5cf6 100%);
  border: none;
  text-align: center;
`;

const WriteTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: #ffffff;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const WriteText = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: rgba(255, 255, 255, 0.85);
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const WriteButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 12px 20px;
  background: #ffffff;
  color: ${({ theme }) => theme.colors.accent};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  border-radius: ${({ theme }) => theme.radii.md};
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

// Rich Starter Welcome Showcase
const WelcomeShowcase = styled.div`
  background: ${({ theme }) => theme.colors.bgPrimary};
  border-radius: 24px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: 40px;
  text-align: center;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.03);
`;

const WelcomeBadge = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 20px;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.accent} 0%, #8b5cf6 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;

  svg {
    width: 30px;
    height: 30px;
  }
`;

const WelcomeTitle = styled.h3`
  font-size: 1.75rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 12px;
`;

const WelcomeDesc = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  max-width: 520px;
  margin: 0 auto 28px;
  line-height: 1.6;
`;

const StarterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-top: 32px;
  text-align: left;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

const StarterCard = styled.div`
  background: ${({ theme }) => theme.colors.bgSecondary};
  border-radius: 16px;
  padding: 20px;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const StarterCardTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 6px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StarterCardDesc = styled.p`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.textMuted};
  line-height: 1.5;
`;

// Category slide data with icons and gradients
const categorySlides = [
  {
    name: 'Technology',
    icon: Code,
    gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    description:
      'Explore the latest in software development, AI, web technologies, and digital innovation. Stay ahead with cutting-edge tech insights.',
    topics: ['Programming', 'AI & ML', 'Web Dev', 'Cloud', 'DevOps'],
  },
  {
    name: 'Design',
    icon: Palette,
    gradient: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)',
    description:
      'Discover creative inspiration, UI/UX trends, graphic design tips, and visual storytelling techniques from talented designers.',
    topics: ['UI/UX', 'Graphic Design', 'Typography', 'Branding', 'Motion'],
  },
  {
    name: 'Business',
    icon: Briefcase,
    gradient: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
    description:
      'Insights on entrepreneurship, startups, marketing strategies, and business growth. Learn from industry leaders and innovators.',
    topics: ['Startups', 'Marketing', 'Leadership', 'Finance', 'Strategy'],
  },
  {
    name: 'Lifestyle',
    icon: Heart,
    gradient: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
    description:
      'Stories about wellness, personal growth, relationships, and living your best life. Find inspiration for everyday moments.',
    topics: ['Wellness', 'Fitness', 'Mindfulness', 'Productivity', 'Self-care'],
  },
  {
    name: 'Science',
    icon: Cpu,
    gradient: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    description:
      'Fascinating discoveries, research breakthroughs, and scientific explanations that make complex topics accessible to everyone.',
    topics: ['Physics', 'Biology', 'Space', 'Research', 'Innovation'],
  },
  {
    name: 'Travel',
    icon: Plane,
    gradient: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
    description:
      'Adventure awaits! Explore travel guides, destination reviews, cultural experiences, and tips for your next journey.',
    topics: ['Destinations', 'Culture', 'Adventure', 'Food', 'Tips'],
  },
];

export function Home() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentSlide, setCurrentSlide] = useState(0);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const { data: posts, isLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: postService.getPosts,
  });

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: categoryService.getCategories,
  });

  // Auto-advance slideshow
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % categorySlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const categories = categoriesData?.data || [];
  let publicPosts = posts?.filter((post) => post.visibility === 'public') || [];

  if (selectedCategory !== 'all') {
    publicPosts = publicPosts.filter((post) =>
      post.categories?.some((cat) => cat.name === selectedCategory || cat === selectedCategory)
    );
  }

  const trendingPosts = [...(posts?.filter((p) => p.visibility === 'public') || [])]
    .sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0))
    .slice(0, 5);

  const handleExploreCategory = (categoryName) => {
    setSelectedCategory(categoryName);
    document.getElementById('posts-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  if (isLoading) return <Loading text="Loading..." />;

  const slide = categorySlides[currentSlide];
  const SlideIcon = slide.icon;

  return (
    <PageWrapper>
      {/* Primary Brand Hero */}
      <MainHero>
        <Container>
          <HeroBadge>
            <Sparkles size={14} /> Modern Publishing Platform
          </HeroBadge>
          <HeroTitle>
            Where great ideas find their <span>voice.</span>
          </HeroTitle>
          <HeroSubtitle>
            Discover thought-provoking articles, technical tutorials, and creative stories written
            by independent creators and developers worldwide.
          </HeroSubtitle>
          <HeroCTA>
            <Button
              variant="primary"
              size="lg"
              onClick={() =>
                document.getElementById('posts-section')?.scrollIntoView({ behavior: 'smooth' })
              }
            >
              Explore Stories <ArrowRight size={18} />
            </Button>
            {isAuthenticated ? (
              <Button variant="outline" size="lg" onClick={() => navigate('/write')}>
                Write a Story <PenTool size={18} />
              </Button>
            ) : (
              <Button variant="outline" size="lg" onClick={() => navigate('/register')}>
                Get Started Free
              </Button>
            )}
          </HeroCTA>
        </Container>
      </MainHero>

      {/* Featured Category Carousel */}
      <HeroSection>
        <SlideContainer>
          <SlideCard $visible={true}>
            <SlideVisual $gradient={slide.gradient}>
              <IconWrapper>
                <SlideIcon />
              </IconWrapper>
            </SlideVisual>
            <SlideContent>
              <SlideLabel>
                <Sparkles size={14} />
                Featured Category
              </SlideLabel>
              <SlideTitle>{slide.name}</SlideTitle>
              <SlideDescription>{slide.description}</SlideDescription>
              <TopicBadges>
                {slide.topics.map((topic) => (
                  <TopicBadge key={topic}>{topic}</TopicBadge>
                ))}
              </TopicBadges>
              <ExploreButton onClick={() => handleExploreCategory(slide.name)}>
                Explore {slide.name}
                <ArrowRight size={18} />
              </ExploreButton>
            </SlideContent>
          </SlideCard>

          <SlideControls>
            {categorySlides.map((_, index) => (
              <SlideDot
                key={index}
                $active={index === currentSlide}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </SlideControls>
        </SlideContainer>
      </HeroSection>

      {/* Platform Feature Value Prop Grid */}
      <Container>
        <FeaturesGridSection>
          <SectionHeadline>
            <SubHeading>Built for writers & readers</SubHeading>
            <SubText>Everything you need to read, write, and grow your audience.</SubText>
          </SectionHeadline>
          <GridFour>
            <FeatureCard>
              <FeatureIcon $bg="rgba(99, 102, 241, 0.1)" $color="#6366f1">
                <PenTool size={24} />
              </FeatureIcon>
              <FeatureTitle>Markdown Editor</FeatureTitle>
              <FeatureDesc>
                Write seamlessly with live markdown preview, code blocks, and rich media embedding.
              </FeatureDesc>
            </FeatureCard>

            <FeatureCard>
              <FeatureIcon $bg="rgba(168, 85, 247, 0.1)" $color="#a855f7">
                <BarChart2 size={24} />
              </FeatureIcon>
              <FeatureTitle>Real-Time Analytics</FeatureTitle>
              <FeatureDesc>
                Track post views, reader engagement, and popularity metrics with built-in analytics.
              </FeatureDesc>
            </FeatureCard>

            <FeatureCard>
              <FeatureIcon $bg="rgba(236, 72, 153, 0.1)" $color="#ec4899">
                <Zap size={24} />
              </FeatureIcon>
              <FeatureTitle>Lightning Fast</FeatureTitle>
              <FeatureDesc>
                Powered by Vite and Radix primitives for ultra-responsive, accessible performance.
              </FeatureDesc>
            </FeatureCard>

            <FeatureCard>
              <FeatureIcon $bg="rgba(20, 184, 166, 0.1)" $color="#14b8a6">
                <BookOpen size={24} />
              </FeatureIcon>
              <FeatureTitle>Categorized Feed</FeatureTitle>
              <FeatureDesc>
                Filter and discover content curated across tech, design, science, and lifestyle.
              </FeatureDesc>
            </FeatureCard>
          </GridFour>
        </FeaturesGridSection>
      </Container>

      {/* Main Content & Feed */}
      <Container>
        <MainSection id="posts-section">
          <FeedSection>
            <SectionHeader>
              <SectionIcon>
                <Sparkles size={16} />
              </SectionIcon>
              <SectionTitle>
                {selectedCategory === 'all' ? 'Latest Stories' : `${selectedCategory} Stories`}
              </SectionTitle>
            </SectionHeader>

            <FilterTabs>
              <FilterTab
                $active={selectedCategory === 'all'}
                onClick={() => setSelectedCategory('all')}
              >
                All
              </FilterTab>
              {categories.slice(0, 6).map((cat) => (
                <FilterTab
                  key={cat._id}
                  $active={selectedCategory === cat.name}
                  onClick={() => setSelectedCategory(cat.name)}
                >
                  {cat.name}
                </FilterTab>
              ))}
            </FilterTabs>

            {publicPosts.length === 0 ? (
              <WelcomeShowcase>
                <WelcomeBadge>
                  <Compass />
                </WelcomeBadge>
                <WelcomeTitle>Welcome to BlogHub</WelcomeTitle>
                <WelcomeDesc>
                  {selectedCategory === 'all'
                    ? 'Our platform is live and ready for stories! Be the first creator to share your knowledge with the world.'
                    : `No stories in ${selectedCategory} yet. Be the first to publish a post here!`}
                </WelcomeDesc>
                <HeroCTA style={{ justifyContent: 'center' }}>
                  {isAuthenticated ? (
                    <Button variant="primary" size="md" onClick={() => navigate('/write')}>
                      <PenTool size={16} /> Publish First Post
                    </Button>
                  ) : (
                    <Button variant="primary" size="md" onClick={() => navigate('/register')}>
                      Join & Start Writing
                    </Button>
                  )}
                </HeroCTA>

                <StarterGrid>
                  <StarterCard>
                    <StarterCardTitle>
                      <Code size={18} color="#6366f1" /> Tech & Programming
                    </StarterCardTitle>
                    <StarterCardDesc>
                      Share tutorials, architectural decisions, and code snippets.
                    </StarterCardDesc>
                  </StarterCard>

                  <StarterCard>
                    <StarterCardTitle>
                      <Palette size={18} color="#ec4899" /> Design & UI/UX
                    </StarterCardTitle>
                    <StarterCardDesc>
                      Publish design systems, component case studies, and visual guides.
                    </StarterCardDesc>
                  </StarterCard>

                  <StarterCard>
                    <StarterCardTitle>
                      <Briefcase size={18} color="#14b8a6" /> Startups & Business
                    </StarterCardTitle>
                    <StarterCardDesc>
                      Write about product launches, growth tactics, and lessons learned.
                    </StarterCardDesc>
                  </StarterCard>
                </StarterGrid>
              </WelcomeShowcase>
            ) : (
              <PostList>
                {publicPosts.map((post) => (
                  <PostCard key={post._id} post={post} />
                ))}
              </PostList>
            )}
          </FeedSection>

          <Sidebar>
            {isAuthenticated && (
              <WriteCard>
                <WriteTitle>Share your story</WriteTitle>
                <WriteText>Your voice matters. Start writing today.</WriteText>
                <WriteButton to="/write">
                  <Sparkles size={16} />
                  Write a story
                </WriteButton>
              </WriteCard>
            )}

            {trendingPosts.length > 0 && (
              <SidebarCard>
                <SidebarTitle>
                  <TrendingUp size={18} />
                  Trending
                </SidebarTitle>
                <TrendingList>
                  {trendingPosts.map((post, index) => (
                    <TrendingItem key={post._id} to={`/post/${post._id}`}>
                      <TrendingNumber>0{index + 1}</TrendingNumber>
                      <TrendingContent>
                        <TrendingAuthor>
                          <TrendingAvatar>
                            {post.user?.username?.[0]?.toUpperCase() || 'U'}
                          </TrendingAvatar>
                          <TrendingAuthorName>
                            {post.user?.username || 'Anonymous'}
                          </TrendingAuthorName>
                        </TrendingAuthor>
                        <TrendingTitle>{post.title}</TrendingTitle>
                        <TrendingMeta>
                          {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                        </TrendingMeta>
                      </TrendingContent>
                    </TrendingItem>
                  ))}
                </TrendingList>
              </SidebarCard>
            )}

            {categories.length > 0 && (
              <SidebarCard>
                <SidebarTitle>Discover Topics</SidebarTitle>
                <TopicList>
                  {categories.slice(0, 10).map((cat) => (
                    <TopicTag
                      key={cat._id}
                      $active={selectedCategory === cat.name}
                      onClick={() => setSelectedCategory(cat.name)}
                    >
                      {cat.name}
                    </TopicTag>
                  ))}
                </TopicList>
              </SidebarCard>
            )}
          </Sidebar>
        </MainSection>
      </Container>
    </PageWrapper>
  );
}
