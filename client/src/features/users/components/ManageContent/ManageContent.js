import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Header,
  CreateButton,
  ToolbarSection,
  SearchContainer,
  SearchInput,
  StatusSelect,
  LinkRoute,
  Text,
  FixedHeaderSizeTitle,
  ActionWrapper,
  ActionButton,
  Edit,
  View,
  Delete,
  StatusBadge,
  TableContainer,
  TableWrapper,
} from './ManageContent.styles';
import { Skeleton, EmptyState, Stack, Card } from '../../../../components/ui/primitives';
import { BiFileBlank } from 'react-icons/bi';
import Table from '@/shared/components/Table/Table';
import { getUserPosts } from '../../../../shared/services/userApi';
import { deletePost } from '../../../../shared/services/postApi';
import { AddIcon, SearchIcon } from '../../../../shared/icons';
// import FilterListIcon from '@mui/icons-material/FilterList';

const ManageContent = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [filteredData, setFilteredData] = useState(null);

  // Fetch user posts
  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        setLoading(true);
        const userPostsData = await getUserPosts();
        setData(userPostsData.data);
        setFilteredData(userPostsData.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserPosts();
  }, []);

  // Apply filters when data, search term, or status filter changes
  useEffect(() => {
    if (!data) return;

    const filtered = data.filter((post) => {
      // Apply status filter
      if (statusFilter !== 'all' && post.visibility !== statusFilter) {
        return false;
      }

      // Apply search filter (case insensitive)
      if (searchTerm && !post.title.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }

      return true;
    });

    setFilteredData(filtered);
  }, [data, searchTerm, statusFilter]);

  // Handle navigation and actions
  const handleEdit = (id) => {
    navigate(`EditBlogPost/${id}`);
  };

  const handleView = (id) => {
    navigate(`ViewPost/${id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        const response = await deletePost(id);
        console.log(response);

        // Remove the deleted post from the data
        setData((prevData) => prevData.filter((post) => post._id !== id));
      } catch (error) {
        console.error('Error deleting post:', error);
        alert('Failed to delete post. Please try again.');
      }
    }
  };

  const handleCreatePost = () => {
    navigate('/User/CreatePost');
  };

  // Define columns for the table
  const columns = [
    {
      Header: 'Title',
      accessor: 'title',
      Cell: ({ value, row }) => (
        <FixedHeaderSizeTitle onClick={() => handleView(row.original._id)}>
          {value}
        </FixedHeaderSizeTitle>
      ),
    },
    {
      Header: 'Status',
      accessor: 'visibility',
      Cell: ({ value }) => (
        <StatusBadge status={value}>{value.charAt(0).toUpperCase() + value.slice(1)}</StatusBadge>
      ),
    },
    {
      Header: 'Created',
      accessor: 'createdAt',
      Cell: ({ value }) => {
        const date = new Date(value);
        return (
          <span>
            {date.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </span>
        );
      },
    },
    {
      Header: 'Actions',
      accessor: '_id',
      Cell: ({ value }) => (
        <ActionWrapper>
          <ActionButton>
            <View size={20} strokeWidth={2} onClick={() => handleView(value)} title="View post" />
            <Edit size={20} strokeWidth={2} onClick={() => handleEdit(value)} title="Edit post" />
            <Delete
              size={20}
              strokeWidth={2}
              onClick={() => handleDelete(value)}
              title="Delete post"
            />
          </ActionButton>
        </ActionWrapper>
      ),
    },
  ];

  if (loading) {
    return (
      <Container>
        <Card $p={6}>
          <Stack $gap={4}>
            <Skeleton.Text $lines={1} style={{ height: '2.5rem', width: '40%' }} />
            <Skeleton.Card style={{ height: '60px' }} />
            <Skeleton.Card style={{ height: '400px' }} />
          </Stack>
        </Card>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        {/* <Title>Manage Content</Title> */}
        <CreateButton onClick={handleCreatePost}>
          <AddIcon />
          <Text>Create New Post</Text>
        </CreateButton>
      </Header>

      {data && data.length > 0 && (
        <ToolbarSection>
          <SearchContainer>
            <SearchIcon />
            <SearchInput
              type="text"
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchContainer>

          <StatusSelect value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All Status</option>
            <option value="public">Public</option>
            <option value="private">Private</option>
            <option value="draft">Draft</option>
          </StatusSelect>
        </ToolbarSection>
      )}

      {!data || data.length === 0 ? (
        <EmptyState>
          <EmptyState.Icon $size="80px">
            <BiFileBlank />
          </EmptyState.Icon>
          <EmptyState.Title>No posts found</EmptyState.Title>
          <EmptyState.Description>
            Create your first post to get started with your blogging journey.
          </EmptyState.Description>
          <LinkRoute to="/User/CreatePost" style={{ marginTop: '1.5rem' }}>
            <AddIcon />
            <Text>Create New Post</Text>
          </LinkRoute>
        </EmptyState>
      ) : filteredData && filteredData.length === 0 ? (
        <EmptyState>
          <EmptyState.Icon $size="64px">
            <BiFileBlank />
          </EmptyState.Icon>
          <EmptyState.Title>No matching posts</EmptyState.Title>
          <EmptyState.Description>
            Try adjusting your search or filter to find what you're looking for.
          </EmptyState.Description>
        </EmptyState>
      ) : (
        <TableContainer>
          <TableWrapper>
            <Table data={filteredData} columns={columns} />
          </TableWrapper>
        </TableContainer>
      )}
    </Container>
  );
};

export default ManageContent;
