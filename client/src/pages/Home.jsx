import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Box, Container, Grid, Heading, Text, Flex, Badge, Card, Button, Avatar } from '@radix-ui/themes';
import { Plus } from 'lucide-react';
import { postService } from '../services/postService';
import { categoryService } from '../services/categoryService';
import { PostCard } from '../components/common/PostCard';
import { Loading } from '../components/common/Loading';
import { useAuthStore } from '../store/authStore';

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
      post.categories?.some((cat) => cat.name === selectedCategory || cat === selectedCategory)
    );
  }

  const featuredPost = [...publicPosts].sort((a, b) => 
    (b.likes?.length || 0) - (a.likes?.length || 0)
  )[0];

  const remainingPosts = publicPosts.filter(p => p._id !== featuredPost?._id);

  const authors = [...new Map(publicPosts.map(p => [p.user?._id, p.user]).filter(([id]) => id)).values()].slice(0, 5);

  if (postsLoading) {
    return <Loading text="Loading..." />;
  }

  return (
    <Box py="5">
      <Container size="4">
        <Grid columns={{ initial: '1', lg: '3' }} gap="6">
          {/* Main Content */}
          <Box style={{ gridColumn: 'span 2' }}>
            {/* Featured Post */}
            {featuredPost && (
              <Card mb="5">
                <Link to={`/post/${featuredPost._id}`}>
                  <Flex direction="column" gap="3">
                    {featuredPost.imageURL && (
                      <Box style={{ 
                        borderRadius: '6px', 
                        overflow: 'hidden',
                        height: '240px'
                      }}>
                        <img 
                          src={featuredPost.imageURL} 
                          alt={featuredPost.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </Box>
                    )}
                    <Box p="1">
                      <Flex gap="2" mb="2">
                        {featuredPost.categories?.slice(0, 2).map((cat) => (
                          <Badge key={cat._id || cat} variant="soft" color="gray" size="1">
                            {cat.name || cat}
                          </Badge>
                        ))}
                      </Flex>
                      <Heading size="5" mb="2" style={{ lineHeight: 1.3 }}>
                        {featuredPost.title}
                      </Heading>
                      <Text size="2" color="gray" className="text-truncate-2">
                        {featuredPost.content?.replace(/<[^>]*>/g, '').substring(0, 180)}...
                      </Text>
                      <Flex align="center" gap="2" mt="3">
                        <Avatar 
                          size="1" 
                          fallback={featuredPost.user?.username?.[0]?.toUpperCase() || 'U'} 
                          radius="full"
                          color="gray"
                        />
                        <Text size="1" color="gray">{featuredPost.user?.username || 'Anonymous'}</Text>
                        <Text size="1" color="gray">·</Text>
                        <Text size="1" color="gray">
                          {featuredPost.likes?.length || 0} likes
                        </Text>
                      </Flex>
                    </Box>
                  </Flex>
                </Link>
              </Card>
            )}

            {/* Category Filter */}
            {categories.length > 0 && (
              <Flex gap="2" wrap="wrap" mb="4">
                <Badge
                  variant={selectedCategory === 'all' ? 'solid' : 'soft'}
                  color="gray"
                  size="1"
                  style={{ cursor: 'pointer' }}
                  onClick={() => setSelectedCategory('all')}
                >
                  All
                </Badge>
                {categories.map((cat) => (
                  <Badge
                    key={cat._id}
                    variant={selectedCategory === cat.name ? 'solid' : 'soft'}
                    color="gray"
                    size="1"
                    style={{ cursor: 'pointer' }}
                    onClick={() => setSelectedCategory(cat.name)}
                  >
                    {cat.name}
                  </Badge>
                ))}
              </Flex>
            )}

            {/* Posts List */}
            {remainingPosts.length === 0 && !featuredPost ? (
              <Card>
                <Flex direction="column" align="center" py="8" gap="3">
                  <Text size="3" weight="medium">No posts yet</Text>
                  <Text size="2" color="gray">Be the first to share something.</Text>
                  {isAuthenticated ? (
                    <Button size="2" variant="soft" asChild>
                      <Link to="/write">
                        <Plus size={16} /> Write Post
                      </Link>
                    </Button>
                  ) : (
                    <Button size="2" variant="soft" asChild>
                      <Link to="/register">Get Started</Link>
                    </Button>
                  )}
                </Flex>
              </Card>
            ) : (
              <>
                <Flex justify="between" align="center" mb="3">
                  <Text size="2" weight="medium" color="gray">
                    {remainingPosts.length} {remainingPosts.length === 1 ? 'post' : 'posts'}
                    {selectedCategory !== 'all' && ` in ${selectedCategory}`}
                  </Text>
                </Flex>
                <Flex direction="column" gap="3">
                  {remainingPosts.map((post) => (
                    <PostCard key={post._id} post={post} />
                  ))}
                </Flex>
              </>
            )}
          </Box>

          {/* Sidebar */}
          <Box className="hide-mobile">
            {/* Quick Actions */}
            {isAuthenticated && (
              <Card mb="4">
                <Flex direction="column" gap="2" p="1">
                  <Text size="2" weight="medium" mb="1">Quick Actions</Text>
                  <Button variant="soft" size="2" asChild style={{ justifyContent: 'flex-start' }}>
                    <Link to="/write">
                      <Plus size={14} /> New Post
                    </Link>
                  </Button>
                  <Button variant="ghost" size="2" asChild style={{ justifyContent: 'flex-start' }}>
                    <Link to="/my-posts">My Posts</Link>
                  </Button>
                  <Button variant="ghost" size="2" asChild style={{ justifyContent: 'flex-start' }}>
                    <Link to="/analytics">Analytics</Link>
                  </Button>
                </Flex>
              </Card>
            )}

            {/* Top Writers */}
            {authors.length > 0 && (
              <Card mb="4">
                <Flex direction="column" gap="3" p="1">
                  <Text size="2" weight="medium">Top Writers</Text>
                  {authors.map((author) => (
                    <Link key={author._id} to={`/user/${author._id}`}>
                      <Flex align="center" gap="2">
                        <Avatar 
                          size="1" 
                          fallback={author.username?.[0]?.toUpperCase() || 'U'} 
                          radius="full"
                          color="gray"
                        />
                        <Box>
                          <Text size="2">{author.username}</Text>
                          <Text size="1" color="gray">
                            {publicPosts.filter(p => p.user?._id === author._id).length} posts
                          </Text>
                        </Box>
                      </Flex>
                    </Link>
                  ))}
                </Flex>
              </Card>
            )}

            {/* Categories */}
            {categories.length > 0 && (
              <Card>
                <Flex direction="column" gap="2" p="1">
                  <Text size="2" weight="medium">Categories</Text>
                  {categories.slice(0, 8).map((cat) => (
                    <Flex 
                      key={cat._id} 
                      justify="between" 
                      align="center"
                      style={{ cursor: 'pointer' }}
                      onClick={() => setSelectedCategory(cat.name)}
                    >
                      <Text size="2" color={selectedCategory === cat.name ? undefined : 'gray'}>
                        {cat.name}
                      </Text>
                      <Text size="1" color="gray">{cat.posts?.length || 0}</Text>
                    </Flex>
                  ))}
                </Flex>
              </Card>
            )}

            {/* Sign Up CTA */}
            {!isAuthenticated && (
              <Card mt="4">
                <Flex direction="column" gap="2" p="1">
                  <Text size="2" weight="medium">Join BlogHub</Text>
                  <Text size="2" color="gray">Create an account to start writing and engaging with the community.</Text>
                  <Button size="2" asChild mt="1">
                    <Link to="/register">Sign Up</Link>
                  </Button>
                </Flex>
              </Card>
            )}
          </Box>
        </Grid>
      </Container>
    </Box>
  );
}
