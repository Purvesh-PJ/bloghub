// import { useEffect, useState } from 'react';
import { 
    Container, 
    MainContainer, 
    LeftContainer, 
    RightContainer, 
    LoadingWrapper, 
    ErrorMessage, 
    RelatedPostsSection, 
    PostTitle,
    ReadingProgress,
    TableOfContentsWrapper,
    BackToTopButton,
    AuthorProfileCard,
    SubscriptionBox,
    PopularTagsWrapper,
    TagsList,
    TagLink,
    PostNavigation
} from './Page_SinglePost-Style.js';
import { Post } from '../../../Components/Home-Components/Home_Complete_Post/Post.js';
import { useParams, Link } from 'react-router-dom';
import PostComment from '../../../Components/Home-Components/Home_Fullpost_Components/PostComment.js';
import DisplayComments from '../../../Components/Home-Components/Home_Fullpost_Components/DisplayComments.js';
import useFetchSinglePost from '../../../hooks/useFetchSinglePost.js';
import { useState, useEffect, useRef } from 'react';
import { BiLoader, BiBookmark, BiArrowToTop } from 'react-icons/bi';
import { MdErrorOutline } from 'react-icons/md';
import { FaTags, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import TableOfContents from '../../../Components/Home-Components/Home_Fullpost_Components/TableOfContents.js';

const Page_SinglePost = () => {
    const { _id } = useParams();
    const { postUser, postData, postComments, postError, postLoading } = useFetchSinglePost(_id);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [showBackToTop, setShowBackToTop] = useState(false);
    const contentRef = useRef(null);
    
    // Popular tags - in a real app these would be dynamically generated
    const popularTags = [
        { id: 1, name: "Technology" },
        { id: 2, name: "Programming" },
        { id: 3, name: "JavaScript" },
        { id: 4, name: "Web Development" },
        { id: 5, name: "React" },
        { id: 6, name: "Node.js" },
        { id: 7, name: "MongoDB" }
    ];
    
    // Handle scroll events for reading progress
    useEffect(() => {
        const handleScroll = () => {
            // Update reading progress
            const totalHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const progress = (window.scrollY / totalHeight) * 100;
            setScrollProgress(progress);
            
            // Show back to top button when scrolled down enough
            setShowBackToTop(window.scrollY > 500);
        };
        
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };
    
    // Mock next/previous posts - in a real app these would be fetched from the backend
    const previousPost = { _id: "prev-post-id", title: "Previous post title" };
    const nextPost = { _id: "next-post-id", title: "Next post title" };

    return (
        <>
            <ReadingProgress style={{ width: `${scrollProgress}%` }} />
            
            <Container>
                {postLoading && (
                    <LoadingWrapper>
                        <BiLoader className="loading-icon" />
                        <span>Loading post content...</span>
                    </LoadingWrapper>
                )}
                
                {postError && (
                    <ErrorMessage>
                        <MdErrorOutline />
                        <p>{postError}</p>
                    </ErrorMessage>
                )}
                
                {!postLoading && !postError && (
                    <>
                        <LeftContainer>
                            {/* Table of Contents */}
                            <TableOfContentsWrapper>
                                <PostTitle>Contents</PostTitle>
                                <TableOfContents content={postData?.content} />
                            </TableOfContentsWrapper>
                            
                            {/* Popular Tags */}
                            <PopularTagsWrapper>
                                <PostTitle>
                                    <FaTags style={{ marginRight: '8px' }} />
                                    Popular Tags
                                </PostTitle>
                                <TagsList>
                                    {popularTags.map(tag => (
                                        <TagLink key={tag.id} to={`/tags/${tag.name.toLowerCase()}`}>
                                            #{tag.name}
                                        </TagLink>
                                    ))}
                                </TagsList>
                            </PopularTagsWrapper>
                        </LeftContainer>
                        
                        <MainContainer ref={contentRef}>
                            <Post blogs={postData} />
                            
                            {/* Author Profile */}
                            <AuthorProfileCard>
                                <img 
                                    src={postData?.user?.profileImage || "https://via.placeholder.com/60"} 
                                    alt={postData?.user?.username || "Author"} 
                                />
                                <div className="author-info">
                                    <h3>About the Author</h3>
                                    <h4>{postData?.user?.username}</h4>
                                    <p>{postData?.user?.bio || "Passionate writer and content creator sharing insights about technology, programming and web development."}</p>
                                    <Link to={`/author/${postData?.user?._id}`} className="view-profile">
                                        View all posts
                                    </Link>
                                </div>
                            </AuthorProfileCard>
                            
                            {/* Previous/Next Post Navigation */}
                            <PostNavigation>
                                {previousPost && (
                                    <Link to={`/post/${previousPost._id}`} className="prev-post">
                                        <FaChevronLeft />
                                        <div>
                                            <span>Previous Post</span>
                                            <p>{previousPost.title}</p>
                                        </div>
                                    </Link>
                                )}
                                
                                {nextPost && (
                                    <Link to={`/post/${nextPost._id}`} className="next-post">
                                        <div>
                                            <span>Next Post</span>
                                            <p>{nextPost.title}</p>
                                        </div>
                                        <FaChevronRight />
                                    </Link>
                                )}
                            </PostNavigation>
                            
                            <PostComment />
                            <DisplayComments comments={postComments} postUserId={postUser} />
                        </MainContainer>

                        <RightContainer>
                            {/* Subscribe Box */}
                            <SubscriptionBox>
                                <h3>Stay Updated</h3>
                                <p>Get the latest posts delivered straight to your inbox</p>
                                <form>
                                    <input type="email" placeholder="Your email address" required />
                                    <button type="submit">Subscribe</button>
                                </form>
                                <small>We'll never share your email with anyone else.</small>
                            </SubscriptionBox>
                            
                            {/* Bookmark Button */}
                            <button className="bookmark-button">
                                <BiBookmark />
                                <span>Save for later</span>
                            </button>
                            
                            {/* Popular Posts */}
                            <RelatedPostsSection>
                                <PostTitle>Popular Posts</PostTitle>
                                {/* Popular posts would go here */}
                                <p className="placeholder-text">Trending on the platform</p>
                            </RelatedPostsSection>
                            
                            {/* Related Posts - Moved from left section to right section */}
                            <RelatedPostsSection>
                                <PostTitle>Related Posts</PostTitle>
                                {/* Related posts would go here */}
                                <p className="placeholder-text">Discover more posts like this</p>
                            </RelatedPostsSection>
                        </RightContainer>
                    </>
                )}
            </Container>
            
            {showBackToTop && (
                <BackToTopButton onClick={scrollToTop}>
                    <BiArrowToTop />
                </BackToTopButton>
            )}
        </>
    );
};

export default Page_SinglePost;