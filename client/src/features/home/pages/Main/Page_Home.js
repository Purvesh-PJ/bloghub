import { useState, useEffect } from 'react';
import {
  Container,
  MainContent,
  SectionDivider,
  SectionHeader,
  StatsBar,
  StatCard,
} from './Page_Home.styles';
import { Alert, Skeleton, Stack, Flex } from '../../../../components/ui/primitives';
import { BiErrorCircle } from 'react-icons/bi';

// Components
import HeroSection from '../../components/Herosection/HeroSection';
import FeaturedPosts from '../../components/FeaturedPosts/FeaturedPosts';
import { PostSection } from '../../components/PostsSection/PostSection';
import CategoriesSection from '../../components/Categories/CategoriesSection';
import CommunitySection from '../../components/Community/CommunitySection';
import Newsletter from '../../components/Newsletter/Newsletter';

// Hooks
import useGetPosts from '../../../../shared/hooks/useGetPosts';
import useGetCategories from '../../../../shared/hooks/useGetCategories';
import useGetTopAuthors from '../../../../shared/hooks/useGetTopAuthors';
import { FaChevronRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Page_Home = () => {
  const { posts, loading, error } = useGetPosts();
  const { categories } = useGetCategories();
  const { authors } = useGetTopAuthors();
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalUsers: 0,
    totalCategories: 0,
    totalComments: 0,
  });

  // Calculate statistics when posts data is available
  useEffect(() => {
    if (posts && posts.length > 0) {
      // Extract unique authors from posts
      const uniqueAuthors = [...new Set(posts.map((post) => post.user?._id).filter(Boolean))];

      // Calculate total comments
      const totalComments = posts.reduce((sum, post) => {
        return sum + (post.commentCount || 0);
      }, 0);

      setStats({
        totalPosts: posts.length,
        totalUsers: uniqueAuthors.length,
        totalCategories: categories.length,
        totalComments: totalComments,
      });
    }
  }, [posts, categories]);

  // Get featured posts (most recent)
  const featuredPosts = posts && posts.length > 0 ? posts.slice(0, 4) : [];

  // Get recent posts (excluding featured)
  const recentPosts = posts && posts.length > 0 ? posts.slice(4) : [];

  return (
    <>
      {error && (
        <Container>
          <Alert $variant="error" style={{ margin: '2rem 0' }}>
            <Alert.Icon>
              <BiErrorCircle size={24} />
            </Alert.Icon>
            <Alert.Content>
              <strong>Error Loading Content</strong>
              <div>{error}</div>
            </Alert.Content>
          </Alert>
        </Container>
      )}

      {loading && (
        <Container>
          <Stack $gap={6} style={{ padding: '2rem 0' }}>
            <Skeleton.Card style={{ height: '400px' }} />
            <Skeleton.Text $lines={3} />
            <Flex $gap={4} $wrap>
              <Skeleton.Card style={{ flex: 1, minWidth: '250px', height: '300px' }} />
              <Skeleton.Card style={{ flex: 1, minWidth: '250px', height: '300px' }} />
              <Skeleton.Card style={{ flex: 1, minWidth: '250px', height: '300px' }} />
            </Flex>
          </Stack>
        </Container>
      )}

      {!error && !loading && (
        <>
          <HeroSection />

          <Container>
            <MainContent>
              {/* Stats Bar */}
              <StatsBar>
                <StatCard>
                  <h3>{stats.totalPosts}</h3>
                  <p>Published Articles</p>
                </StatCard>
                <StatCard>
                  <h3>{stats.totalUsers}</h3>
                  <p>Active Authors</p>
                </StatCard>
                <StatCard>
                  <h3>{stats.totalCategories}</h3>
                  <p>Content Categories</p>
                </StatCard>
                <StatCard>
                  <h3>{stats.totalComments}</h3>
                  <p>Community Comments</p>
                </StatCard>
              </StatsBar>

              <FeaturedPosts posts={featuredPosts} />

              <SectionDivider />

              <SectionHeader>
                <h2>Latest Articles</h2>
                <Link to="/posts">
                  Browse all articles <FaChevronRight />
                </Link>
              </SectionHeader>
              <PostSection data={recentPosts} />

              <SectionDivider />

              <SectionHeader>
                <h2>Explore Categories</h2>
                <Link to="/categories">
                  View all categories <FaChevronRight />
                </Link>
              </SectionHeader>
              <CategoriesSection categories={categories} />

              <SectionDivider />

              <SectionHeader>
                <h2>Our Community</h2>
                <Link to="/authors">
                  Meet our authors <FaChevronRight />
                </Link>
              </SectionHeader>
              <CommunitySection authors={authors} stats={stats} />

              <SectionDivider />

              <Newsletter />
            </MainContent>
          </Container>
        </>
      )}
    </>
  );
};

export default Page_Home;
