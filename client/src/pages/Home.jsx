import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Avatar } from '@radix-ui/themes';
import { Plus } from 'lucide-react';
import styled from 'styled-components';
import { postService } from '../services/postService';
import { categoryService } from '../services/categoryService';
import { PostCard } from '../components/common/PostCard';
import { Loading } from '../components/common/Loading';
import { useAuthStore } from '../store/authStore';

const PageWrapper = styled.div`
  padding: ${({ theme }) => theme.spacing.xl} 0;
`;

const Container = styled.div`
  max-width: ${({ theme }) => theme.layout.maxContentWidth};
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.md};
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing.xl};

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 2fr 1fr;
  }
`;

const MainContent = styled.div``;

const Sidebar = styled.aside`
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    display: none;
  }
`;

const Card = styled.div`
  background: ${({ theme }) => theme.colors.cardBg};
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  transition: all ${({ theme }) => theme.transitions.fast};
`;

const FeaturedCard = styled(Card)`
  &:hover {
    border-color: ${({ theme }) => theme.colors.borderHover};
  }
`;

const FeaturedImage = styled.div`
  border-radius: ${({ theme }) => theme.radii.md};
  overflow: hidden;
  height: 240px;
  margin-bottom: ${({ theme }) => theme.spacing.md};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform ${({ theme }) => theme.transitions.normal};
  }

  &:hover img {
    transform: scale(1.02);
  }
`;

const BadgeContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
  flex-wrap: wrap;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 2px ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.textSecondary};
  background: ${({ theme }) => theme.colors.bgTertiary};
  border-radius: ${({ theme }) => theme.radii.sm};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.bgHover};
  }

  &[data-active='true'] {
    background: ${({ theme }) => theme.colors.accent};
    color: ${({ theme }) => theme.colors.textInverse};
  }
`;

const FeaturedTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes['3xl']};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  line-height: 1.3;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const FeaturedExcerpt = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.base};
  color: ${({ theme }) => theme.colors.textMuted};
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const AuthorRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.md};
`;

const AuthorName = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const Separator = styled.span`
  color: ${({ theme }) => theme.colors.textMuted};
`;

const FilterRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-wrap: wrap;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const PostCount = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};

  span {
    font-size: ${({ theme }) => theme.fontSizes.base};
    font-weight: ${({ theme }) => theme.fontWeights.medium};
    color: ${({ theme }) => theme.colors.textMuted};
  }
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
  padding: ${({ theme }) => theme.spacing.xxl};
  gap: ${({ theme }) => theme.spacing.md};
  text-align: center;
`;

const EmptyTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const EmptyText = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.base};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const Button = styled.button`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.fontSizes.base};
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
    color: ${({ theme }) => theme.colors.buttonPrimaryText};
  }
`;

const GhostButton = styled(Button)`
  background: transparent;
  color: ${({ theme }) => theme.colors.textSecondary};
  justify-content: flex-start;
  width: 100%;

  &:hover {
    background: ${({ theme }) => theme.colors.bgHover};
    color: ${({ theme }) => theme.colors.textPrimary};
  }
`;

const SidebarTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.base};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const AuthorItem = styled(Link)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.xs} 0;
  transition: opacity ${({ theme }) => theme.transitions.fast};

  &:hover {
    opacity: 0.8;
  }
`;

const AuthorInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const AuthorUsername = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.base};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const AuthorPostCount = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const CategoryItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.xs} 0;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover span:first-child {
    color: ${({ theme }) => theme.colors.textLink};
  }
`;

const CategoryName = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.base};
  color: ${({ $active, theme }) =>
    $active ? theme.colors.textPrimary : theme.colors.textMuted};
  transition: color ${({ theme }) => theme.transitions.fast};
`;

const CategoryCount = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const CTACard = styled(Card)`
  h3 {
    font-size: ${({ theme }) => theme.fontSizes.base};
    font-weight: ${({ theme }) => theme.fontWeights.medium};
    color: ${({ theme }) => theme.colors.textPrimary};
    margin-bottom: ${({ theme }) => theme.spacing.xs};
  }

  p {
    font-size: ${({ theme }) => theme.fontSizes.base};
    color: ${({ theme }) => theme.colors.textMuted};
    margin-bottom: ${({ theme }) => theme.spacing.md};
  }
`;

export function Home() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { isAuthenticated } = useAuthStore();

  const { data: posts, isLoading: postsLoading } = useQuery({
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
      post.categories?.some(
        (cat) => cat.name === selectedCategory || cat === selectedCategory
      )
    );
  }

  const featuredPost = [...publicPosts].sort(
    (a, b) => (b.likes?.length || 0) - (a.likes?.length || 0)
  )[0];

  const remainingPosts = publicPosts.filter((p) => p._id !== featuredPost?._id);

  const authors = [
    ...new Map(
      publicPosts.map((p) => [p.user?._id, p.user]).filter(([id]) => id)
    ).values(),
  ].slice(0, 5);

  if (postsLoading) {
    return <Loading text="Loading..." />;
  }

  return (
    <PageWrapper>
      <Container>
        <Grid>
          <MainContent>
            {/* Featured Post */}
            {featuredPost && (
              <FeaturedCard as={Link} to={`/post/${featuredPost._id}`}>
                {featuredPost.imageURL && (
                  <FeaturedImage>
                    <img src={featuredPost.imageURL} alt={featuredPost.title} />
                  </FeaturedImage>
                )}
                <BadgeContainer>
                  {featuredPost.categories?.slice(0, 2).map((cat) => (
                    <Badge key={cat._id || cat}>{cat.name || cat}</Badge>
                  ))}
                </BadgeContainer>
                <FeaturedTitle>{featuredPost.title}</FeaturedTitle>
                <FeaturedExcerpt>
                  {featuredPost.content?.replace(/<[^>]*>/g, '').substring(0, 180)}
                  ...
                </FeaturedExcerpt>
                <AuthorRow>
                  <Avatar
                    size="1"
                    fallback={featuredPost.user?.username?.[0]?.toUpperCase() || 'U'}
                    radius="full"
                    color="gray"
                  />
                  <AuthorName>
                    {featuredPost.user?.username || 'Anonymous'}
                  </AuthorName>
                  <Separator>·</Separator>
                  <AuthorName>{featuredPost.likes?.length || 0} likes</AuthorName>
                </AuthorRow>
              </FeaturedCard>
            )}

            {/* Category Filter */}
            {categories.length > 0 && (
              <FilterRow>
                <Badge
                  data-active={selectedCategory === 'all'}
                  onClick={() => setSelectedCategory('all')}
                >
                  All
                </Badge>
                {categories.map((cat) => (
                  <Badge
                    key={cat._id}
                    data-active={selectedCategory === cat.name}
                    onClick={() => setSelectedCategory(cat.name)}
                  >
                    {cat.name}
                  </Badge>
                ))}
              </FilterRow>
            )}

            {/* Posts List */}
            {remainingPosts.length === 0 && !featuredPost ? (
              <EmptyState>
                <EmptyTitle>No posts yet</EmptyTitle>
                <EmptyText>Be the first to share something.</EmptyText>
                {isAuthenticated ? (
                  <PrimaryButton as={Link} to="/write">
                    <Plus size={16} /> Write Post
                  </PrimaryButton>
                ) : (
                  <PrimaryButton as={Link} to="/register">
                    Get Started
                  </PrimaryButton>
                )}
              </EmptyState>
            ) : (
              <>
                <PostCount>
                  <span>
                    {remainingPosts.length}{' '}
                    {remainingPosts.length === 1 ? 'post' : 'posts'}
                    {selectedCategory !== 'all' && ` in ${selectedCategory}`}
                  </span>
                </PostCount>
                <PostList>
                  {remainingPosts.map((post) => (
                    <PostCard key={post._id} post={post} />
                  ))}
                </PostList>
              </>
            )}
          </MainContent>

          <Sidebar>
            {/* Quick Actions */}
            {isAuthenticated && (
              <Card>
                <SidebarTitle>Quick Actions</SidebarTitle>
                <PrimaryButton
                  as={Link}
                  to="/write"
                  style={{ width: '100%', justifyContent: 'center', marginBottom: '8px' }}
                >
                  <Plus size={14} /> New Post
                </PrimaryButton>
                <GhostButton as={Link} to="/my-posts">
                  My Posts
                </GhostButton>
                <GhostButton as={Link} to="/analytics">
                  Analytics
                </GhostButton>
              </Card>
            )}

            {/* Top Writers */}
            {authors.length > 0 && (
              <Card>
                <SidebarTitle>Top Writers</SidebarTitle>
                {authors.map((author) => (
                  <AuthorItem key={author._id} to={`/user/${author._id}`}>
                    <Avatar
                      size="1"
                      fallback={author.username?.[0]?.toUpperCase() || 'U'}
                      radius="full"
                      color="gray"
                    />
                    <AuthorInfo>
                      <AuthorUsername>{author.username}</AuthorUsername>
                      <AuthorPostCount>
                        {publicPosts.filter((p) => p.user?._id === author._id).length}{' '}
                        posts
                      </AuthorPostCount>
                    </AuthorInfo>
                  </AuthorItem>
                ))}
              </Card>
            )}

            {/* Categories */}
            {categories.length > 0 && (
              <Card>
                <SidebarTitle>Categories</SidebarTitle>
                {categories.slice(0, 8).map((cat) => (
                  <CategoryItem
                    key={cat._id}
                    onClick={() => setSelectedCategory(cat.name)}
                  >
                    <CategoryName $active={selectedCategory === cat.name}>
                      {cat.name}
                    </CategoryName>
                    <CategoryCount>{cat.posts?.length || 0}</CategoryCount>
                  </CategoryItem>
                ))}
              </Card>
            )}

            {/* Sign Up CTA */}
            {!isAuthenticated && (
              <CTACard>
                <h3>Join BlogHub</h3>
                <p>
                  Create an account to start writing and engaging with the
                  community.
                </p>
                <PrimaryButton as={Link} to="/register" style={{ width: '100%', justifyContent: 'center' }}>
                  Sign Up
                </PrimaryButton>
              </CTACard>
            )}
          </Sidebar>
        </Grid>
      </Container>
    </PageWrapper>
  );
}
