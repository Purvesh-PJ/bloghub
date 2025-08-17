import { useState, useEffect } from 'react';
import { 
  Container, 
  MainContent,
  SectionDivider,
  LoadingContainer,
  ErrorContainer,
  SectionHeader,
  StatsBar,
  StatCard
} from './Page_Home-Style';

// Components
import Header from '../../../Components/Home-Components/Header/Header';
import HeroSection from '../../../Components/Home-Components/Home_Herosection/HeroSection';
import FeaturedPosts from '../../../Components/Home-Components/Featured_Posts/FeaturedPosts';
import { PostSection } from '../../../Components/Home-Components/Home_Posts_Section/PostSection';
import CategoriesSection from '../../../Components/Home-Components/Categories/CategoriesSection';
import CommunitySection from '../../../Components/Home-Components/Community/CommunitySection';
import Newsletter from '../../../Components/Home-Components/Newsletter/Newsletter';

// Hooks
import useGetPosts from '../../../hooks/useGetPosts';
import useGetCategories from '../../../hooks/useGetCategories';
import useGetTopAuthors from '../../../hooks/useGetTopAuthors';
import { FaExclamationTriangle, FaChevronRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Page_Home = () => {
    const { posts, loading, error } = useGetPosts();
    const { categories } = useGetCategories();
    const { authors } = useGetTopAuthors();
    const [stats, setStats] = useState({
        totalPosts: 0,
        totalUsers: 0,
        totalCategories: 0,
        totalComments: 0
    });
    
    // Calculate statistics when posts data is available
    useEffect(() => {
        if (posts && posts.length > 0) {
            // Extract unique authors from posts
            const uniqueAuthors = [...new Set(posts.map(post => post.user?._id).filter(Boolean))];
            
            // Calculate total comments
            const totalComments = posts.reduce((sum, post) => {
                return sum + (post.commentCount || 0);
            }, 0);
            
            setStats({
                totalPosts: posts.length,
                totalUsers: uniqueAuthors.length,
                totalCategories: categories.length,
                totalComments: totalComments
            });
        }
    }, [posts, categories]);
    
    // Get featured posts (most recent)
    const featuredPosts = posts && posts.length > 0 
        ? posts.slice(0, 4)
        : [];
    
    // Get recent posts (excluding featured)
    const recentPosts = posts && posts.length > 0 
        ? posts.slice(4)
        : [];

    return (
        <>
            {error && (
                <ErrorContainer>
                    <FaExclamationTriangle />
                    <h3>Error Loading Content</h3>
                    <p>{error}</p>
                </ErrorContainer>
            )}
            
            {loading && (
                <LoadingContainer>
                    <div className="loader"></div>
                    <p>Loading amazing content...</p>
                </LoadingContainer>
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