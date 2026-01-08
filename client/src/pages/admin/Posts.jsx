import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box,
  Flex,
  Heading,
  Text,
  Card,
  Table,
  Button,
  Badge,
  AlertDialog,
  TextField,
  Select,
  DropdownMenu,
} from '@radix-ui/themes';
import {
  Pencil1Icon,
  TrashIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  DotsHorizontalIcon,
  EyeOpenIcon,
} from '@radix-ui/react-icons';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';
import { postService } from '../../services/postService';
import { Loading } from '../../components/common/Loading';

export function AdminPosts() {
  const queryClient = useQueryClient();
  const [deleteId, setDeleteId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const { data: posts, isLoading } = useQuery({
    queryKey: ['allPosts'],
    queryFn: postService.getPosts,
  });

  const deleteMutation = useMutation({
    mutationFn: postService.deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries(['allPosts']);
      toast.success('Post deleted');
      setDeleteId(null);
    },
    onError: () => toast.error('Failed to delete post'),
  });

  if (isLoading) return <Loading text="Loading posts..." />;

  const getVisibilityColor = (visibility) => {
    switch (visibility) {
      case 'public':
        return 'green';
      case 'private':
        return 'orange';
      default:
        return 'gray';
    }
  };

  // Filter posts
  let filteredPosts = posts || [];

  if (searchQuery) {
    filteredPosts = filteredPosts.filter(
      (post) =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.user?.username?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  if (filterStatus !== 'all') {
    filteredPosts = filteredPosts.filter((post) => post.visibility === filterStatus);
  }

  return (
    <Box>
      <Flex justify="between" align="center" mb="6">
        <Box>
          <Heading size="7">Posts</Heading>
          <Text size="2" color="gray">
            Manage all blog posts
          </Text>
        </Box>
        <Button asChild>
          <Link to="/write">
            <PlusIcon /> New Post
          </Link>
        </Button>
      </Flex>

      {/* Filters */}
      <Card mb="4">
        <Flex gap="4" p="4" align="center">
          <Box style={{ flex: 1 }}>
            <TextField.Root
              placeholder="Search by title or author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            >
              <TextField.Slot>
                <MagnifyingGlassIcon height="16" width="16" />
              </TextField.Slot>
            </TextField.Root>
          </Box>
          <Select.Root value={filterStatus} onValueChange={setFilterStatus}>
            <Select.Trigger placeholder="Filter by status" style={{ width: '150px' }} />
            <Select.Content>
              <Select.Item value="all">All Status</Select.Item>
              <Select.Item value="public">Published</Select.Item>
              <Select.Item value="draft">Draft</Select.Item>
              <Select.Item value="private">Private</Select.Item>
            </Select.Content>
          </Select.Root>
        </Flex>
      </Card>

      {/* Stats */}
      <Flex gap="4" mb="4">
        <Card style={{ flex: 1 }}>
          <Flex direction="column" p="3">
            <Text size="1" color="gray">
              Total
            </Text>
            <Text size="5" weight="bold">
              {posts?.length || 0}
            </Text>
          </Flex>
        </Card>
        <Card style={{ flex: 1 }}>
          <Flex direction="column" p="3">
            <Text size="1" color="gray">
              Published
            </Text>
            <Text size="5" weight="bold" color="green">
              {posts?.filter((p) => p.visibility === 'public').length || 0}
            </Text>
          </Flex>
        </Card>
        <Card style={{ flex: 1 }}>
          <Flex direction="column" p="3">
            <Text size="1" color="gray">
              Drafts
            </Text>
            <Text size="5" weight="bold" color="orange">
              {posts?.filter((p) => p.visibility === 'draft').length || 0}
            </Text>
          </Flex>
        </Card>
        <Card style={{ flex: 1 }}>
          <Flex direction="column" p="3">
            <Text size="1" color="gray">
              Private
            </Text>
            <Text size="5" weight="bold" color="gray">
              {posts?.filter((p) => p.visibility === 'private').length || 0}
            </Text>
          </Flex>
        </Card>
      </Flex>

      {/* Posts Table */}
      <Card>
        {filteredPosts.length === 0 ? (
          <Flex direction="column" align="center" py="9">
            <Text color="gray">
              {searchQuery || filterStatus !== 'all'
                ? 'No posts match your filters'
                : 'No posts yet'}
            </Text>
          </Flex>
        ) : (
          <Table.Root>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell>Title</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Author</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Engagement</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Created</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell width="80px">Actions</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {filteredPosts.map((post) => (
                <Table.Row key={post._id}>
                  <Table.Cell>
                    <Link to={`/post/${post._id}`}>
                      <Text
                        weight="medium"
                        className="text-truncate"
                        style={{ maxWidth: '250px', display: 'block' }}
                      >
                        {post.title}
                      </Text>
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    <Text size="2">{post.user?.username || 'Unknown'}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Badge color={getVisibilityColor(post.visibility)} size="1">
                      {post.visibility}
                    </Badge>
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

      {/* Delete Dialog */}
      <AlertDialog.Root open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialog.Content>
          <AlertDialog.Title>Delete Post</AlertDialog.Title>
          <AlertDialog.Description>
            Are you sure you want to delete this post? This action cannot be undone.
          </AlertDialog.Description>
          <Flex gap="3" mt="4" justify="end">
            <AlertDialog.Cancel>
              <Button variant="soft" color="gray">
                Cancel
              </Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action>
              <Button color="red" onClick={() => deleteMutation.mutate(deleteId)}>
                Delete
              </Button>
            </AlertDialog.Action>
          </Flex>
        </AlertDialog.Content>
      </AlertDialog.Root>
    </Box>
  );
}
