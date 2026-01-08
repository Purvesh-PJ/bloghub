import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Plus, ArrowRight } from 'lucide-react';
import styled from 'styled-components';
import { postService } from '../services/postService';
import { categoryService } from '../services/categoryService';
import { PostCard } from '../components/common/PostCard';
import { Loading } from '../components/common/Loading';
import { useAuthStore } from '../store/authStore';

const PageWrapper = styled.div`
  padding: ${({ theme }) => theme.spacing.xl} 0;
  min-height: calc(100vh - ${({ theme }) => theme.layout.headerHeight});
`;

const Container = styled.div`
  max-width: ${({ theme }) => theme.layout.maxContentWidth};
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.lg};
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing.xl};
  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 1fr 320px;
    gap: ${({ theme }) => theme.spacing.xxl};
  }
`;

const MainContent = styled.main``;
const Sidebar = styled.aside`
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    display: none;
  }
`;

const Card = styled.div`
  background: ${({ theme }) => theme.colors.cardBg};
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: ${({ theme }) => theme.shadows.card};
  transition: all ${({ theme }) => theme.transitions.normal};
`;

const FeaturedCard = styled(Card)`
  display: block;
  overflow: hidden;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.cardHover};
    transform: translateY(-2px);
  }
`;

const FeaturedImage = styled.div`
  height: 280px;
  overflow: hidden;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform ${({ theme }) => theme.transitions.slow};
  }
  ${FeaturedCard}:hover & img {
    transform: scale(1.03);
  }
`;

const FeaturedContent = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
`;

const BadgeRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-wrap: wrap;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme, $active }) =>
    $active ? theme.colors.badgeActiveText : theme.colors.badgeText};
  background: ${({ theme, $active }) =>
    $active ? theme.colors.badgeActiveBg : theme.colors.badgeBg};
  border-radius: ${({ theme }) => theme.radii.full};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  &:hover {
    background: ${({ theme, $active }) =>
      $active ? theme.colors.badgeActiveBg : theme.colors.bgActive};
  }
`;

const FeaturedTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes['3xl']};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  line-height: ${({ theme }) => theme.lineHeights.tight};
  letter-spacing: ${({ theme }) => theme.letterSpacing.tight};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const FeaturedExcerpt = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: ${({ theme }) => theme.lineHeights.relaxed};
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const MetaRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const MetaDot = styled.span`
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.textMuted};
`;

const FilterSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  padding-bottom: ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const FilterTabs = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-wrap: wrap;
`;

const PostCount = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const PostList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const EmptyState = styled(Card)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xxl};
  text-align: center;
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
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 40px;
  padding: 0 ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  border-radius: ${({ theme }) => theme.radii.md};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  text-decoration: none;
  border: none;
`;

const PrimaryButton = styled(Button)`
  background: ${({ theme }) => theme.colors.buttonPrimaryBg};
  color: ${({ theme }) => theme.colors.buttonPrimaryText};
  &:hover {
    background: ${({ theme }) => theme.colors.buttonPrimaryHover};
  }
`;

const GhostButton = styled(Button)`
  background: transparent;
  color: ${({ theme }) => theme.colors.textSecondary};
  padding: 0 ${({ theme }) => theme.spacing.sm};
  height: auto;
  &:hover {
    color: ${({ theme }) => theme.colors.textPrimary};
    background: ${({ theme }) => theme.colors.buttonGhostHover};
  }
`;

const SidebarCard = styled(Card)`
  padding: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const SidebarTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const AuthorList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const AuthorItem = styled(Link)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  &:hover {
    opacity: 0.8;
  }
`;

const AuthorAvatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.bgTertiary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const AuthorInfo = styled.div``;
const AuthorName = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.textPrimary};
`;
const AuthorMeta = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const CategoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const CategoryItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.sm};
  margin: 0 -${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.radii.md};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  &:hover {
    background: ${({ theme }) => theme.colors.bgHover};
  }
`;

const CategoryName = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ $active, theme }) =>
    $active ? theme.colors.textPrimary : theme.colors.textSecondary};
  font-weight: ${({ $active }) => ($active ? 500 : 400)};
`;

const CategoryCount = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.textMuted};
  background: ${({ theme }) => theme.colors.bgTertiary};
  padding: 2px 8px;
  border-radius: ${({ theme }) => theme.radii.full};
`;

const CTACard = styled(SidebarCard)`
  background: ${({ theme }) => theme.colors.bgTertiary};
  box-shadow: none;
`;

const CTATitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const CTAText = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  line-height: ${({ theme }) => theme.lineHeights.relaxed};
`;

export function Home() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { isAuthenticated } = useAuthStore();

  const { data: posts, isLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: postService.getPosts,
  });

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: categoryService.getCategories,
  });

  const categories = categoriesData?.data || [];
  let publicPosts = posts?.filter((post) => post.visibility === 'public') || [];

  if (selectedCategory !== 'all') {
    publicPosts = publicPosts.filter((post) =>
      post.categories?.some((cat) => cat.name === selectedCategory || cat === selectedCategory)
    );
  }

  const featuredPost = [...publicPosts].sort(
    (a, b) => (b.likes?.length || 0) - (a.likes?.length || 0)
  )[0];
  const remainingPosts = publicPosts.filter((p) => p._id !== featuredPost?._id);
  const authors = [
    ...new Map(publicPosts.map((p) => [p.user?._id, p.user]).filter(([id]) => id)).values(),
  ].slice(0, 5);

  if (isLoading) return <Loading text="Loading posts..." />;

  return (
    <PageWrapper>
      <Container>
        <Grid>
          <MainContent>
            {featuredPost && (
              <FeaturedCard as={Link} to={`/post/${featuredPost._id}`}>
                {featuredPost.imageURL && (
                  <FeaturedImage>
                    <img src={featuredPost.imageURL} alt={featuredPost.title} />
                  </FeaturedImage>
                )}
                <FeaturedContent>
                  <BadgeRow>
                    {featuredPost.categories?.slice(0, 2).map((cat) => (
                      <Badge key={cat._id || cat}>{cat.name || cat}</Badge>
                    ))}
                  </BadgeRow>
                  <FeaturedTitle>{featuredPost.title}</FeaturedTitle>
                  <FeaturedExcerpt>
                    {featuredPost.content?.replace(/<[^>]*>/g, '').substring(0, 200)}...
                  </FeaturedExcerpt>
                  <MetaRow>
                    <span>{featuredPost.user?.username || 'Anonymous'}</span>
                    <MetaDot />
                    <span>{featuredPost.likes?.length || 0} likes</span>
                  </MetaRow>
                </FeaturedContent>
              </FeaturedCard>
            )}

            <FilterSection>
              <FilterTabs>
                <Badge
                  $active={selectedCategory === 'all'}
                  onClick={() => setSelectedCategory('all')}
                >
                  All Posts
                </Badge>
                {categories.slice(0, 5).map((cat) => (
                  <Badge
                    key={cat._id}
                    $active={selectedCategory === cat.name}
                    onClick={() => setSelectedCategory(cat.name)}
                  >
                    {cat.name}
                  </Badge>
                ))}
              </FilterTabs>
              <PostCount>
                {remainingPosts.length} {remainingPosts.length === 1 ? 'post' : 'posts'}
              </PostCount>
            </FilterSection>

            {remainingPosts.length === 0 && !featuredPost ? (
              <EmptyState>
                <EmptyTitle>No posts yet</EmptyTitle>
                <EmptyText>Be the first to share your thoughts.</EmptyText>
                {isAuthenticated ? (
                  <PrimaryButton as={Link} to="/write">
                    <Plus size={16} /> Write a Post
                  </PrimaryButton>
                ) : (
                  <PrimaryButton as={Link} to="/register">
                    Get Started <ArrowRight size={16} />
                  </PrimaryButton>
                )}
              </EmptyState>
            ) : (
              <PostList>
                {remainingPosts.map((post) => (
                  <PostCard key={post._id} post={post} />
                ))}
              </PostList>
            )}
          </MainContent>

          <Sidebar>
            {isAuthenticated && (
              <SidebarCard>
                <PrimaryButton as={Link} to="/write" style={{ width: '100%' }}>
                  <Plus size={16} /> Write a Post
                </PrimaryButton>
                <div
                  style={{
                    marginTop: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                  }}
                >
                  <GhostButton
                    as={Link}
                    to="/my-posts"
                    style={{ width: '100%', justifyContent: 'flex-start' }}
                  >
                    My Posts
                  </GhostButton>
                  <GhostButton
                    as={Link}
                    to="/analytics"
                    style={{ width: '100%', justifyContent: 'flex-start' }}
                  >
                    Analytics
                  </GhostButton>
                </div>
              </SidebarCard>
            )}

            {authors.length > 0 && (
              <SidebarCard>
                <SidebarTitle>Top Writers</SidebarTitle>
                <AuthorList>
                  {authors.map((author) => (
                    <AuthorItem key={author._id} to={`/user/${author._id}`}>
                      <AuthorAvatar>{author.username?.[0]?.toUpperCase() || 'U'}</AuthorAvatar>
                      <AuthorInfo>
                        <AuthorName>{author.username}</AuthorName>
                        <AuthorMeta>
                          {publicPosts.filter((p) => p.user?._id === author._id).length} posts
                        </AuthorMeta>
                      </AuthorInfo>
                    </AuthorItem>
                  ))}
                </AuthorList>
              </SidebarCard>
            )}

            {categories.length > 0 && (
              <SidebarCard>
                <SidebarTitle>Categories</SidebarTitle>
                <CategoryList>
                  {categories.slice(0, 8).map((cat) => (
                    <CategoryItem key={cat._id} onClick={() => setSelectedCategory(cat.name)}>
                      <CategoryName $active={selectedCategory === cat.name}>
                        {cat.name}
                      </CategoryName>
                      <CategoryCount>{cat.posts?.length || 0}</CategoryCount>
                    </CategoryItem>
                  ))}
                </CategoryList>
              </SidebarCard>
            )}

            {!isAuthenticated && (
              <CTACard>
                <CTATitle>Join BlogHub</CTATitle>
                <CTAText>
                  Create an account to start writing and connect with the community.
                </CTAText>
                <PrimaryButton as={Link} to="/register" style={{ width: '100%' }}>
                  Sign Up Free
                </PrimaryButton>
              </CTACard>
            )}
          </Sidebar>
        </Grid>
      </Container>
    </PageWrapper>
  );
}
