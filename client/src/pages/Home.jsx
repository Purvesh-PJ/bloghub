import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  TrendingUp, Sparkles, ArrowRight,
  Code, Palette, Briefcase, Heart,
  Cpu, Plane
} from 'lucide-react';
import styled from 'styled-components';
import { postService } from '../services/postService';
import { categoryService } from '../services/categoryService';
import { PostCard } from '../components/common/PostCard';
import { Loading } from '../components/common/Loading';
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

// Category Slideshow Hero
const HeroSection = styled.section`
  padding: ${({ theme }) => theme.spacing.xl} 0 ${({ theme }) => theme.spacing.xxl};
`;

const SlideContainer = styled.div`
  position: relative;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.lg};
`;

const SlideCard = styled.div`
  background: ${({ theme }) => theme.colors.bgPrimary};
  border-radius: 32px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  overflow: hidden;
  display: grid;
  grid-template-columns: 1fr 1.4fr;
  min-height: 420px;
  opacity: ${({ $visible }) => $visible ? 1 : 0};
  transform: ${({ $visible }) => $visible ? 'scale(1)' : 'scale(0.98)'};
  transition: opacity 0.5s ease, transform 0.5s ease;
  
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
    background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing.xl};
    min-height: 220px;
  }
`;

const IconWrapper = styled.div`
  width: 160px;
  height: 160px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    width: 80px;
    height: 80px;
    color: white;
    stroke-width: 1.5;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 120px;
    height: 120px;
    
    svg {
      width: 60px;
      height: 60px;
    }
  }
`;

const SlideContent = styled.div`
  padding: ${({ theme }) => theme.spacing.xxl} ${({ theme }) => theme.spacing.xxl};
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
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const SlideTitle = styled.h2`
  font-size: 2.75rem;
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  line-height: 1.1;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 2rem;
  }
`;

const SlideDescription = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.7;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const TopicBadges = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const TopicBadge = styled.span`
  padding: 8px 16px;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.textSecondary};
  background: ${({ theme }) => theme.colors.bgSecondary};
  border-radius: ${({ theme }) => theme.radii.full};
`;

const ExploreButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 16px 32px;
  background: ${({ theme }) => theme.colors.accent};
  color: white;
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  border: none;
  border-radius: ${({ theme }) => theme.radii.full};
  cursor: pointer;
  transition: all 0.3s ease;
  align-self: flex-start;
  
  &:hover {
    background: ${({ theme }) => theme.colors.accentHover};
    gap: 14px;
  }
`;

const SlideControls = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.xl};
`;

const SlideDot = styled.button`
  width: ${({ $active }) => $active ? '32px' : '10px'};
  height: 10px;
  border-radius: 5px;
  background: ${({ $active, theme }) => $active ? theme.colors.accent : theme.colors.border};
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${({ $active, theme }) => $active ? theme.colors.accent : theme.colors.textMuted};
  }
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
  color: ${({ $active, theme }) => $active ? theme.colors.buttonPrimaryText : theme.colors.textSecondary};
  background: ${({ $active, theme }) => $active ? theme.colors.accent : theme.colors.bgPrimary};
  border: 1px solid ${({ $active, theme }) => $active ? theme.colors.accent : theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.full};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.accent};
    color: ${({ $active, theme }) => $active ? theme.colors.buttonPrimaryText : theme.colors.accent};
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
  color: ${({ $active, theme }) => $active ? theme.colors.badgeActiveText : theme.colors.badgeText};
  background: ${({ $active, theme }) => $active ? theme.colors.badgeActiveBg : theme.colors.badgeBg};
  border: none;
  border-radius: ${({ theme }) => theme.radii.full};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    background: ${({ $active, theme }) => $active ? theme.colors.accentHover : theme.colors.accentMuted};
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

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xxl};
  background: ${({ theme }) => theme.colors.bgPrimary};
  border-radius: ${({ theme }) => theme.radii.xl};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const EmptyTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const EmptyText = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.textMuted};
`;

// Category slide data with icons and gradients
const categorySlides = [
  {
    name: 'Technology',
    icon: Code,
    gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    description: 'Explore the latest in software development, AI, web technologies, and digital innovation. Stay ahead with cutting-edge tech insights.',
    topics: ['Programming', 'AI & ML', 'Web Dev', 'Cloud', 'DevOps']
  },
  {
    name: 'Design',
    icon: Palette,
    gradient: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)',
    description: 'Discover creative inspiration, UI/UX trends, graphic design tips, and visual storytelling techniques from talented designers.',
    topics: ['UI/UX', 'Graphic Design', 'Typography', 'Branding', 'Motion']
  },
  {
    name: 'Business',
    icon: Briefcase,
    gradient: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
    description: 'Insights on entrepreneurship, startups, marketing strategies, and business growth. Learn from industry leaders and innovators.',
    topics: ['Startups', 'Marketing', 'Leadership', 'Finance', 'Strategy']
  },
  {
    name: 'Lifestyle',
    icon: Heart,
    gradient: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
    description: 'Stories about wellness, personal growth, relationships, and living your best life. Find inspiration for everyday moments.',
    topics: ['Wellness', 'Fitness', 'Mindfulness', 'Productivity', 'Self-care']
  },
  {
    name: 'Science',
    icon: Cpu,
    gradient: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    description: 'Fascinating discoveries, research breakthroughs, and scientific explanations that make complex topics accessible to everyone.',
    topics: ['Physics', 'Biology', 'Space', 'Research', 'Innovation']
  },
  {
    name: 'Travel',
    icon: Plane,
    gradient: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
    description: 'Adventure awaits! Explore travel guides, destination reviews, cultural experiences, and tips for your next journey.',
    topics: ['Destinations', 'Culture', 'Adventure', 'Food', 'Tips']
  }
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

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % categorySlides.length);

  const handleExploreCategory = (categoryName) => {
    setSelectedCategory(categoryName);
    document.getElementById('posts-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  if (isLoading) return <Loading text="Loading..." />;

  const slide = categorySlides[currentSlide];
  const SlideIcon = slide.icon;

  return (
    <PageWrapper>
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
              <EmptyState>
                <EmptyTitle>No stories yet</EmptyTitle>
                <EmptyText>
                  {selectedCategory === 'all' 
                    ? 'Be the first to share something amazing.'
                    : `No stories in ${selectedCategory} yet. Try another category!`}
                </EmptyText>
              </EmptyState>
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
