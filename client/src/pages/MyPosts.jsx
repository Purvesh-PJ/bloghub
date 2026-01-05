import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box,
  Container,
  Flex,
  Heading,
  Text,
  Card,
  Table,
  Button,
  Badge,
  AlertDialog,
  DropdownMenu,
  TextField,
  Select,
} from '@radix-ui/themes';
import {
  Pencil1Icon,
  TrashIcon,
  PlusIcon,
  DotsHorizontalIcon,
  EyeOpenIcon,
  MagnifyingGlassIcon,
} from '@radix-ui/react-icons';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';
import { userService } from '../services/userService';
import { postService } from '../services/postService';
import { Loading } from '../components/common/Loading';

export function MyPosts() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [deleteId, setDeleteId] = useState(null);

  const { data: posts, isLoading } = useQuery({
    queryKey: ['userPosts'],
    queryFn: userService.getUserPosts,
  });

  const deleteMutation = useMutation({
    mutationFn: postService.deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries(['userPosts']);
      toast.success('Post deleted successfully');
      setDeleteId(null);
    },
    onError: () => toast.error('Failed to delete post'),
  });

  if (isLoading) return <Loading text="Loading your posts..." />;

  const getVisibilityColor = (visibility) => {
    switch (visibility) {
      case 'public': return 'green';
      case 'private': return 'orange';
      default: return 'gray';
    }
  };

  // Filter posts
  let filteredPosts = posts || [];
  
  if (searchQuery) {
    filteredPosts = filteredPosts.filter((post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }
  
  if (filterStatus !== 'all') {
    filteredPosts = filteredPosts.filter((post) => post.visibility === filterStatus);
  }

  const totalPosts = posts?.length || 0;
  const publicCount = posts?.filter((p) => p.visibility === 'public').length || 0;
  const draftCount = posts?.filter((p) => p.visibility === 'draft').length || 0;
  const privateCount = posts?.filter((p) => p.visibility === 'private').length || 0;

  return (
    <Container size="4" py="6">
      <Flex direction="column" gap="6">
        <Flex justify="between" align="center">
          <Box>
            <Heading size="7">My Posts</Heading>
            <Text size="2" color="gray">Manage all your blog posts</Text>
          </Box>
          <Button asChild>
            <Link to="/write">
              <PlusIcon /> New Post
            </Link>
          </Button>
        </Flex>

        {/* Stats */}
        <Flex gap="4">
          <Card style={{ flex: 1 }}>
            <Flex direction="column" align="center" p="3">
              <Text size="5" weight="bold">{totalPosts}</Text>
              <Text size="1" color="gray">Total</Text>
            </Flex>
          </Card>
          <Card style={{ flex: 1 }}>
            <Flex direction="column" align="center" p="3">
              <Text size="5" weight="bold" color="green">{publicCount}</Text>
              <Text size="1" color="gray">Published</Text>
            </Flex>
          </Card>
          <Card style={{ flex: 1 }}>
            <Flex direction="column" align="center" p="3">
              <Text size="5" weight="bold" color="orange">{draftCount}</Text>
              <Text size="1" color="gray">Drafts</Text>
            </Flex>
          </Card>
          <Card style={{ flex: 1 }}>
            <Flex direction="column" align="center" p="3">
              <Text size="5" weight="bold" color="gray">{privateCount}</Text>
              <Text size="1" color="gray">Private</Text>
            </Flex>
          </Card>
        </Flex>

        {/* Filters */}
        <Card>
          <Flex gap="4" p="4" align="center">
            <Box style={{ flex: 1 }}>
              <TextField.Root
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              >
                <TextField.Slot>
                  <MagnifyingGlassIcon height="16" width="16" />
                </TextField.Slot>
              </TextField.Root>
            </Box>
            <Select.Root value={filterStatus} onValueChange={setFilterStatus}>
              <Select.Trigger placeholder="Filter by status" />
              <Select.Content>
                <Select.Item value="all">All Posts</Select.Item>
                <Select.Item value="public">Published</Select.Item>
                <Select.Item value="draft">Drafts</Select.Item>
                <Select.Item value="private">Private</Select.Item>
              </Select.Content>
            </Select.Root>
          </Flex>
        </Card>

        {/* Posts Table */}
        <Card>
          {filteredPosts.length === 0 ? (
            <Flex direction="column" align="center" py="9">
              <Text color="gray" mb="3">
                {searchQuery || filterStatus !== 'all' ? 'No posts match your filters' : 'No posts yet'}
              </Text>
              {!searchQuery && filterStatus === 'all' && (
                <Button asChild>
                  <Link to="/write">Write your first post</Link>
                </Button>
              )}
            </Flex>
          ) : (
            <Table.Root>
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeaderCell>Title</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Engagement</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Created</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {filteredPosts.map((post) => (
                  <Table.Row key={post._id}>
                    <Table.Cell>
                      <Link to={`/post/${post._id}`}>
                        <Text weight="medium" className="text-truncate" style={{ maxWidth: '300px', display: 'block' }}>
                          {post.title}
                        </Text>
                      </Link>
                    </Table.Cell>
                    <Table.Cell>
                      <Badge color={getVisibilityColor(post.visibility)}>{post.visibility}</Badge>
                    </Table.Cell>
                    <Table.Cell>
                      <Text size="2" color="gray">
                        {post.likes?.length || 0} likes • {post.comments?.length || 0} comments
                      </Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text size="2" color="gray">
                        {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                      </Text>
                    </Table.Cell>
                    <Table.Cell>
                      <DropdownMenu.Root>
                        <DropdownMenu.Trigger>
                          <Button variant="ghost" size="1">
                            <DotsHorizontalIcon />
                          </Button>
                        </DropdownMenu.Trigger>
                        <DropdownMenu.Content>
                          <DropdownMenu.Item asChild>
                            <Link to={`/post/${post._id}`}>
                              <EyeOpenIcon /> View
                            </Link>
                          </DropdownMenu.Item>
                          <DropdownMenu.Item asChild>
                            <Link to={`/edit/${post._id}`}>
                              <Pencil1Icon /> Edit
                            </Link>
                          </DropdownMenu.Item>
                          <DropdownMenu.Separator />
                          <DropdownMenu.Item color="red" onClick={() => setDeleteId(post._id)}>
                            <TrashIcon /> Delete
                          </DropdownMenu.Item>
                        </DropdownMenu.Content>
                      </DropdownMenu.Root>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          )}
        </Card>

        {/* Delete Confirmation Dialog */}
        <AlertDialog.Root open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
          <AlertDialog.Content>
            <AlertDialog.Title>Delete Post</AlertDialog.Title>
            <AlertDialog.Description>
              Are you sure you want to delete this post? This action cannot be undone.
            </AlertDialog.Description>
            <Flex gap="3" mt="4" justify="end">
              <AlertDialog.Cancel>
                <Button variant="soft" color="gray">Cancel</Button>
              </AlertDialog.Cancel>
              <AlertDialog.Action>
                <Button color="red" onClick={() => deleteMutation.mutate(deleteId)}>
                  Delete
                </Button>
              </AlertDialog.Action>
            </Flex>
          </AlertDialog.Content>
        </AlertDialog.Root>
      </Flex>
    </Container>
  );
}
