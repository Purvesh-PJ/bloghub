// import { useEffect, useState } from 'react';
import {
  Container,
  MainContainer,
  LeftContainer,
  RightContainer,
  LoadingWrapper,
  RelatedPostsSection,
  PostTitle,
  ReadingProgress,
  TableOfContentsWrapper,
  BackToTopButton,
  PostNavigation,
} from './Page_SinglePost.styles';
import { Post } from '../../components/CompletePost/Post.js';
import { useParams, Link } from 'react-router-dom';
import PostComment from '../../components/FullpostComponents/PostComment.js';
import DisplayComments from '../../components/FullpostComponents/DisplayComments.js';
import useFetchSinglePost from '../../../../shared/hooks/useFetchSinglePost.js';
import { useState, useEffect, useRef } from 'react';
import { BiBookmark, BiArrowToTop, BiErrorCircle } from 'react-icons/bi';
import { FaTags, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import TableOfContents from '../../components/FullpostComponents/TableOfContents.js';
import {
  Alert,
  Skeleton,
  Chip,
  IconWrapper,
  Stack,
  Flex,
  Card,
  Divider,
  Button,
} from '../../../../components/ui/primitives';

const Page_SinglePost = () => {
  const { _id } = useParams();
  const { postUser, postData, postComments, postError, postLoading } = useFetchSinglePost(_id);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const contentRef = useRef(null);

  // Popular tags - in a real app these would be dynamically generated
  const popularTags = [
    { id: 1, name: 'Technology' },
    { id: 2, name: 'Programming' },
    { id: 3, name: 'JavaScript' },
    { id: 4, name: 'Web Development' },
    { id: 5, name: 'React' },
    { id: 6, name: 'Node.js' },
    { id: 7, name: 'MongoDB' },
  ];

  // Handle scroll events for reading progress
  useEffect(() => {
    const handleScroll = () => {
      // Update reading progress
      const totalHeight =
        document.documentElement.scrollHeight - document.documentElement.clientHeight;
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
      behavior: 'smooth',
    });
  };

  // Mock next/previous posts - in a real app these would be fetched from the backend
  const previousPost = { _id: 'prev-post-id', title: 'Previous post title' };
  const nextPost = { _id: 'next-post-id', title: 'Next post title' };

  return (
    <>
      <ReadingProgress style={{ width: `${scrollProgress}%` }} />

      <Container>
        {postLoading && (
          <LoadingWrapper>
            <Skeleton.Text $lines={2} style={{ marginBottom: '1rem' }} />
            <Skeleton.Card />
            <Skeleton.Text $lines={5} style={{ marginTop: '1rem' }} />
          </LoadingWrapper>
        )}

        {postError && (
          <Alert $variant="error" style={{ margin: '2rem 0' }}>
            <Alert.Icon>
              <BiErrorCircle size={24} />
            </Alert.Icon>
            <Alert.Content>{postError}</Alert.Content>
          </Alert>
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
              <Card $p={5}>
                <Flex $align="center" $gap={2} style={{ marginBottom: '1rem' }}>
                  <IconWrapper $size="md">
                    <FaTags />
                  </IconWrapper>
                  <PostTitle style={{ margin: 0 }}>Popular Tags</PostTitle>
                </Flex>
                <Divider $my={3} />
                <Flex $wrap $gap={2}>
                  {popularTags.map((tag) => (
                    <Chip
                      key={tag.id}
                      $variant="outlined"
                      $size="sm"
                      as={Link}
                      to={`/tags/${tag.name.toLowerCase()}`}
                      style={{ cursor: 'pointer', textDecoration: 'none' }}
                    >
                      #{tag.name}
                    </Chip>
                  ))}
                </Flex>
              </Card>
            </LeftContainer>

            <MainContainer ref={contentRef}>
              <Post blogs={postData} />

              {/* Author Profile */}
              <Card $p={6}>
                <Card.Header $divider $p={0} style={{ paddingBottom: '1rem' }}>
                  <Card.Title>About the Author</Card.Title>
                </Card.Header>
                <Flex $gap={4} $align="flex-start">
                  <img
                    src={postData?.user?.profileImage || 'https://via.placeholder.com/60'}
                    alt={postData?.user?.username || 'Author'}
                    style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                    }}
                  />
                  <Stack $gap={2} style={{ flex: 1 }}>
                    <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '600' }}>
                      {postData?.user?.username}
                    </h4>
                    <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: '1.6', color: '#666' }}>
                      {postData?.user?.bio ||
                        'Passionate writer and content creator sharing insights about technology, programming and web development.'}
                    </p>
                    <Link
                      to={`/author/${postData?.user?._id}`}
                      style={{
                        color: '#3b82f6',
                        textDecoration: 'none',
                        fontSize: '0.9rem',
                        fontWeight: '500',
                      }}
                    >
                      View all posts →
                    </Link>
                  </Stack>
                </Flex>
              </Card>

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
              <Card $p={6}>
                <Card.Header $divider $p={0} style={{ paddingBottom: '1rem' }}>
                  <Card.Title>Stay Updated</Card.Title>
                </Card.Header>
                <Stack $gap={3}>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>
                    Get the latest posts delivered straight to your inbox
                  </p>
                  <Stack $gap={2} as="form">
                    <input
                      type="email"
                      placeholder="Your email address"
                      required
                      style={{
                        padding: '0.75rem',
                        border: '1px solid #e5e7eb',
                        borderRadius: '0.5rem',
                        fontSize: '0.95rem',
                      }}
                    />
                    <Button type="submit" style={{ width: '100%' }}>
                      Subscribe
                    </Button>
                  </Stack>
                  <small style={{ fontSize: '0.8rem', color: '#9ca3af' }}>
                    We'll never share your email with anyone else.
                  </small>
                </Stack>
              </Card>

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
