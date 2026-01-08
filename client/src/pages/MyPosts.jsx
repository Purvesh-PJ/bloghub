import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, MoreHorizontal, Eye, Pencil, Trash2, FileText, X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';
import styled from 'styled-components';
import { userService } from '../services/userService';
import { postService } from '../services/postService';
import { Loading } from '../components/common/Loading';

const PageWrapper = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.lg};
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.md};
    align-items: flex-start;
  }
`;

const TitleSection = styled.div``;

const PageTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['3xl']};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  letter-spacing: ${({ theme }) => theme.letterSpacing.tight};
  margin-bottom: 4px;
`;

const PageSubtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const PrimaryButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: ${({ theme }) => theme.colors.buttonPrimaryBg};
  color: ${({ theme }) => theme.colors.buttonPrimaryText};
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.buttonPrimaryHover};
    color: ${({ theme }) => theme.colors.buttonPrimaryText};
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.xl};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const StatCard = styled.div`
  background: ${({ theme }) => theme.colors.cardBg};
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: ${({ theme }) => theme.shadows.card};
  padding: ${({ theme }) => theme.spacing.lg};
  text-align: center;
`;

const StatValue = styled.div`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 4px;
`;

const StatLabel = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const FiltersCard = styled.div`
  background: ${({ theme }) => theme.colors.cardBg};
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: ${({ theme }) => theme.shadows.card};
  padding: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: center;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
  }
`;

const SearchWrapper = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  background: ${({ theme }) => theme.colors.bgSecondary};
  border-radius: ${({ theme }) => theme.radii.md};
  padding: 0 12px;
  border: 1px solid transparent;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:focus-within {
    border-color: ${({ theme }) => theme.colors.borderFocus};
    background: ${({ theme }) => theme.colors.inputBg};
  }

  svg {
    width: 16px;
    height: 16px;
    color: ${({ theme }) => theme.colors.textMuted};
  }
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 10px 0;
  background: transparent;
  border: none;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textPrimary};

  &::placeholder {
    color: ${({ theme }) => theme.colors.inputPlaceholder};
  }

  &:focus {
    outline: none;
  }
`;

const FilterSelect = styled.select`
  padding: 10px 32px 10px 12px;
  background: ${({ theme }) => theme.colors.bgSecondary};
  border: 1px solid transparent;
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textPrimary};
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236b6b6b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 8px center;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.borderFocus};
    background-color: ${({ theme }) => theme.colors.inputBg};
  }
`;

const PostsCard = styled.div`
  background: ${({ theme }) => theme.colors.cardBg};
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: ${({ theme }) => theme.shadows.card};
  overflow: hidden;
`;

const PostsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.thead`
  background: ${({ theme }) => theme.colors.bgSecondary};
`;

const TableHeaderCell = styled.th`
  padding: ${({ theme }) => theme.spacing.md};
  text-align: left;
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.05em;

  &:last-child {
    text-align: right;
  }
`;

const TableBody = styled.tbody``;

const TableRow = styled.tr`
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  transition: background ${({ theme }) => theme.transitions.fast};

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: ${({ theme }) => theme.colors.bgHover};
  }
`;

const TableCell = styled.td`
  padding: ${({ theme }) => theme.spacing.md};
  vertical-align: middle;

  &:last-child {
    text-align: right;
  }
`;

const PostTitle = styled(Link)`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.textPrimary};
  display: block;
  max-width: 300px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: color ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`;

const Badge = styled.span`
  display: inline-flex;
  padding: 4px 10px;
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  border-radius: ${({ theme }) => theme.radii.full};
  text-transform: capitalize;

  ${({ $variant, theme }) => {
    switch ($variant) {
      case 'public':
        return `
          background: ${theme.colors.successBg};
          color: ${theme.colors.success};
        `;
      case 'draft':
        return `
          background: ${theme.colors.warningBg};
          color: ${theme.colors.warning};
        `;
      case 'private':
        return `
          background: ${theme.colors.badgeBg};
          color: ${theme.colors.textSecondary};
        `;
      default:
        return `
          background: ${theme.colors.badgeBg};
          color: ${theme.colors.badgeText};
        `;
    }
  }}
`;

const MetaText = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const ActionButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: transparent;
  border: none;
  border-radius: ${({ theme }) => theme.radii.md};
  color: ${({ theme }) => theme.colors.textMuted};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.bgHover};
    color: ${({ theme }) => theme.colors.textPrimary};
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const DropdownWrapper = styled.div`
  position: relative;
  display: inline-block;
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 4px;
  background: ${({ theme }) => theme.colors.cardBg};
  border-radius: ${({ theme }) => theme.radii.md};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  min-width: 140px;
  z-index: ${({ theme }) => theme.zIndices.dropdown};
  overflow: hidden;
`;

const DropdownItem = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 10px 12px;
  background: transparent;
  border: none;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ $danger, theme }) => ($danger ? theme.colors.error : theme.colors.textPrimary)};
  cursor: pointer;
  transition: background ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.bgHover};
  }

  svg {
    width: 14px;
    height: 14px;
  }
`;

const DropdownLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 10px 12px;
  background: transparent;
  border: none;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textPrimary};
  cursor: pointer;
  transition: background ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.bgHover};
    color: ${({ theme }) => theme.colors.textPrimary};
  }

  svg {
    width: 14px;
    height: 14px;
  }
`;

const DropdownDivider = styled.div`
  height: 1px;
  background: ${({ theme }) => theme.colors.border};
  margin: 4px 0;
`;

const EmptyState = styled.div`
  padding: ${({ theme }) => theme.spacing.xxl};
  text-align: center;
`;

const EmptyIcon = styled.div`
  width: 48px;
  height: 48px;
  margin: 0 auto ${({ theme }) => theme.spacing.md};
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.bgTertiary};
  border-radius: ${({ theme }) => theme.radii.lg};
  color: ${({ theme }) => theme.colors.textMuted};

  svg {
    width: 24px;
    height: 24px;
  }
`;

const EmptyText = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.textMuted};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: ${({ theme }) => theme.colors.bgOverlay};
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: ${({ theme }) => theme.zIndices.modal};
  padding: ${({ theme }) => theme.spacing.lg};
`;

const ModalContent = styled.div`
  background: ${({ theme }) => theme.colors.cardBg};
  border-radius: ${({ theme }) => theme.radii.xl};
  box-shadow: ${({ theme }) => theme.shadows.xl};
  max-width: 400px;
  width: 100%;
  padding: ${({ theme }) => theme.spacing.xl};
`;

const ModalTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const ModalDescription = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: ${({ theme }) => theme.lineHeights.relaxed};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const ModalActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  justify-content: flex-end;
`;

const SecondaryButton = styled.button`
  padding: 10px 16px;
  background: ${({ theme }) => theme.colors.buttonSecondaryBg};
  color: ${({ theme }) => theme.colors.buttonSecondaryText};
  border: 1px solid ${({ theme }) => theme.colors.buttonSecondaryBorder};
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.buttonSecondaryHover};
  }
`;

const DangerButton = styled.button`
  padding: 10px 16px;
  background: ${({ theme }) => theme.colors.error};
  color: #ffffff;
  border: none;
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.errorHover};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

// Dropdown component with click outside handling
function ActionsDropdown({ post, onDelete }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <DropdownWrapper ref={dropdownRef}>
      <ActionButton onClick={() => setIsOpen(!isOpen)}>
        <MoreHorizontal />
      </ActionButton>
      {isOpen && (
        <DropdownMenu>
          <DropdownLink to={`/post/${post._id}`} onClick={() => setIsOpen(false)}>
            <Eye /> View
          </DropdownLink>
          <DropdownLink to={`/edit/${post._id}`} onClick={() => setIsOpen(false)}>
            <Pencil /> Edit
          </DropdownLink>
          <DropdownDivider />
          <DropdownItem
            $danger
            onClick={() => {
              onDelete(post._id);
              setIsOpen(false);
            }}
          >
            <Trash2 /> Delete
          </DropdownItem>
        </DropdownMenu>
      )}
    </DropdownWrapper>
  );
}

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
    <PageWrapper>
      <PageHeader>
        <TitleSection>
          <PageTitle>My Posts</PageTitle>
          <PageSubtitle>Manage all your blog posts</PageSubtitle>
        </TitleSection>
        <PrimaryButton to="/write">
          <Plus /> New Post
        </PrimaryButton>
      </PageHeader>

      <StatsGrid>
        <StatCard>
          <StatValue>{totalPosts}</StatValue>
          <StatLabel>Total</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{publicCount}</StatValue>
          <StatLabel>Published</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{draftCount}</StatValue>
          <StatLabel>Drafts</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{privateCount}</StatValue>
          <StatLabel>Private</StatLabel>
        </StatCard>
      </StatsGrid>

      <FiltersCard>
        <SearchWrapper>
          <Search />
          <SearchInput
            type="text"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </SearchWrapper>
        <FilterSelect value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="all">All Posts</option>
          <option value="public">Published</option>
          <option value="draft">Drafts</option>
          <option value="private">Private</option>
        </FilterSelect>
      </FiltersCard>

      <PostsCard>
        {filteredPosts.length === 0 ? (
          <EmptyState>
            <EmptyIcon>
              <FileText />
            </EmptyIcon>
            <EmptyText>
              {searchQuery || filterStatus !== 'all'
                ? 'No posts match your filters'
                : 'No posts yet'}
            </EmptyText>
            {!searchQuery && filterStatus === 'all' && (
              <PrimaryButton to="/write">Write your first post</PrimaryButton>
            )}
          </EmptyState>
        ) : (
          <PostsTable>
            <TableHeader>
              <tr>
                <TableHeaderCell>Title</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell>Engagement</TableHeaderCell>
                <TableHeaderCell>Created</TableHeaderCell>
                <TableHeaderCell>Actions</TableHeaderCell>
              </tr>
            </TableHeader>
            <TableBody>
              {filteredPosts.map((post) => (
                <TableRow key={post._id}>
                  <TableCell>
                    <PostTitle to={`/post/${post._id}`}>{post.title}</PostTitle>
                  </TableCell>
                  <TableCell>
                    <Badge $variant={post.visibility}>{post.visibility}</Badge>
                  </TableCell>
                  <TableCell>
                    <MetaText>
                      {post.likes?.length || 0} likes • {post.comments?.length || 0} comments
                    </MetaText>
                  </TableCell>
                  <TableCell>
                    <MetaText>
                      {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                    </MetaText>
                  </TableCell>
                  <TableCell>
                    <ActionsDropdown post={post} onDelete={setDeleteId} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </PostsTable>
        )}
      </PostsCard>

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <ModalOverlay onClick={() => setDeleteId(null)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalTitle>Delete Post</ModalTitle>
            <ModalDescription>
              Are you sure you want to delete this post? This action cannot be undone.
            </ModalDescription>
            <ModalActions>
              <SecondaryButton onClick={() => setDeleteId(null)}>Cancel</SecondaryButton>
              <DangerButton
                onClick={() => deleteMutation.mutate(deleteId)}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
              </DangerButton>
            </ModalActions>
          </ModalContent>
        </ModalOverlay>
      )}
    </PageWrapper>
  );
}
