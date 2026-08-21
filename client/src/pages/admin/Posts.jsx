import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import styled from 'styled-components';
import { formatDistanceToNow } from 'date-fns';
import {
  Search as SearchIcon,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  FileText,
  Globe,
  Lock,
  FileEdit,
} from 'lucide-react';
import toast from 'react-hot-toast';

import { postService } from '../../services/postService';
import { useDebounced } from '../../hooks/useDebounced';
import { Section } from '../../components/layout/PageShell';
import {
  Button,
  Card,
  Input,
  Chip,
  Badge,
  Modal,
  Table,
  EmptyState,
  DropdownMenu,
  Skeleton,
  Pagination,
} from '../../components/ui';
import { text, clamp } from '../../styles/theme/mixins';
import { queryKeys } from '../../services/queryKeys';

/**
 * Post moderation.
 *
 * Filtering, searching and paging happen on the server. This screen used to ask for a flat
 * fifty posts and do all three in the browser, which meant a site with more than fifty
 * stories offered no way to reach the rest of them — and the counts on the filter chips
 * described the fifty that happened to load rather than the site.
 *
 * The bulk bar is the other half. `POST /posts/bulk` has always accepted an administrator's
 * ids and applied one action to all of them, and the console had no way to select anything:
 * unpublishing ten posts meant ten trips through a dropdown menu.
 */

const Toolbar = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-wrap: wrap;
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.surfaceContainerLow};
  border: 1px solid ${({ theme }) => theme.colors.lineSubtle};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

/* Pushed to the end of the toolbar so the filters stay left-aligned with the table. */
const SearchField = styled.div`
  flex: 1;
  min-width: 200px;
  max-width: 320px;
  margin-left: auto;
`;

const CellTitle = styled(Link)`
  ${text('sm', 'semibold')}
  color: ${({ theme }) => theme.colors.textPrimary};
  ${clamp(1)}
  max-width: 320px;

  &:hover {
    color: ${({ theme }) => theme.colors.accentText};
  }
`;

const MenuTrigger = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: ${({ theme }) => theme.radii.full};
  color: ${({ theme }) => theme.colors.textMuted};
  transition: background ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.surfaceContainerHigh};
    color: ${({ theme }) => theme.colors.textPrimary};
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const Checkbox = styled.input`
  width: 16px;
  height: 16px;
  accent-color: ${({ theme }) => theme.colors.accentSolid};
  cursor: pointer;
`;

/* Appears only when something is selected, so it never occupies space it is not using. */
const BulkBar = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-wrap: wrap;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.accentContainer};
  border: 1px solid ${({ theme }) => theme.colors.accentLine};
`;

const BulkCount = styled.span`
  ${text('sm', 'semibold')}
  color: ${({ theme }) => theme.colors.accentText};
  margin-right: auto;
`;

const TONE = { public: 'success', draft: 'warning', private: 'neutral' };
const LABEL = { public: 'Published', draft: 'Draft', private: 'Private' };

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'public', label: 'Published' },
  { id: 'draft', label: 'Drafts' },
  { id: 'private', label: 'Private' },
];

const PAGE_SIZE = 20;

export function AdminPosts() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [pendingDelete, setPendingDelete] = useState(null);
  const [pendingBulkDelete, setPendingBulkDelete] = useState(null);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState([]);
  const debouncedQuery = useDebounced(query, 300);

  const listParams = useMemo(
    () => ({
      page,
      limit: PAGE_SIZE,
      ...(filter !== 'all' && { visibility: filter }),
      ...(debouncedQuery.trim() && { q: debouncedQuery.trim() }),
    }),
    [page, filter, debouncedQuery]
  );

  /*
    Changing a filter or the search term has to return to the first page: staying on page 4
    of the previous result set shows an empty table for a filter that plainly has matches.
    Adjusted during render so no request is ever issued with the stale page.
  */
  const filterKey = `${filter}|${debouncedQuery.trim()}`;
  const [syncedFilter, setSyncedFilter] = useState(filterKey);
  if (syncedFilter !== filterKey) {
    setSyncedFilter(filterKey);
    setPage(1);
    setSelectedIds([]);
  }

  // Moderation view — includes drafts and private posts, unlike the public ['posts'] key.
  const { data: postsResponse, isLoading } = useQuery({
    queryKey: queryKeys.posts.moderation(listParams),
    queryFn: () => postService.getAllPosts(listParams),
    placeholderData: (previous) => previous,
  });

  const refreshLists = () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.posts.moderation() });
    queryClient.invalidateQueries({ queryKey: queryKeys.analytics.site() });
  };

  const deleteMutation = useMutation({
    mutationFn: postService.deletePost,
    onSuccess: () => {
      refreshLists();
      setPendingDelete(null);
      toast.success('Post deleted');
    },
    onError: (error) => toast.error(error.response?.data?.message || 'Could not delete the post'),
  });

  /*
    One action applied to every selected story in a single request. The endpoint has always
    accepted this from an administrator; there was simply no way to select anything here.
  */
  const bulkMutation = useMutation({
    mutationFn: ({ ids, action }) => postService.bulkUpdate(ids, action),
    onSuccess: (response) => {
      refreshLists();
      setSelectedIds([]);
      setPendingBulkDelete(null);
      toast.success(response?.message || 'Stories updated');
    },
    onError: (error) =>
      toast.error(error.response?.data?.message || 'Could not update those stories'),
  });

  const visible = useMemo(() => postsResponse?.data || [], [postsResponse]);
  const pagination = postsResponse?.pagination ?? { page: 1, pages: 1, total: 0 };
  // Counted over the whole collection by the server, not over the page on screen.
  const counts = postsResponse?.counts ?? { all: 0, public: 0, draft: 0, private: 0 };

  // Selection is per page: leaving it drops the selection rather than acting on rows the
  // administrator can no longer see.
  const visibleIds = visible.map((post) => post._id);
  const allVisibleSelected =
    visibleIds.length > 0 && visibleIds.every((id) => selectedIds.includes(id));

  const toggleSelected = (id) =>
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((entry) => entry !== id) : [...current, id]
    );

  if (isLoading) {
    return (
      <div aria-hidden="true">
        <Card tone="low" radius="xl" style={{ padding: 20 }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 0',
                borderBottom: i < 5 ? '1px solid rgba(255,255,255,0.05)' : 'none',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
                <Skeleton $width="55%" $height={16} $radius="xs" />
                <Skeleton $width="25%" $height={12} $radius="xs" />
              </div>
              <Skeleton $width={60} $height={22} $radius="pill" />
            </div>
          ))}
        </Card>
      </div>
    );
  }

  return (
    <>
      <Section>
        {selectedIds.length > 0 && (
          <BulkBar>
            <BulkCount>{selectedIds.length} selected on this page</BulkCount>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => bulkMutation.mutate({ ids: selectedIds, action: 'public' })}
              disabled={bulkMutation.isPending}
            >
              <Globe /> Publish
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => bulkMutation.mutate({ ids: selectedIds, action: 'draft' })}
              disabled={bulkMutation.isPending}
            >
              <FileEdit /> Unpublish
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => bulkMutation.mutate({ ids: selectedIds, action: 'private' })}
              disabled={bulkMutation.isPending}
            >
              <Lock /> Make private
            </Button>
            <Button
              size="sm"
              variant="danger"
              onClick={() => setPendingBulkDelete(selectedIds)}
              disabled={bulkMutation.isPending}
            >
              <Trash2 /> Delete
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setSelectedIds([])}>
              Clear
            </Button>
          </BulkBar>
        )}

        <Toolbar>
          {FILTERS.map((option) => (
            <Chip
              key={option.id}
              selected={filter === option.id}
              onClick={() => setFilter(option.id)}
            >
              {option.label}
              {counts[option.id] > 0 ? ` (${counts[option.id]})` : ''}
            </Chip>
          ))}

          <SearchField>
            <Input
              icon={<SearchIcon />}
              placeholder="Search by title"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              aria-label="Search posts by title"
            />
          </SearchField>
        </Toolbar>

        {visible.length === 0 ? (
          <EmptyState icon={FileText} title="Nothing here">
            {query || filter !== 'all'
              ? 'No posts match that filter. Try another one, or clear the search.'
              : 'Nobody has written anything yet.'}
          </EmptyState>
        ) : (
          <Card tone="low" radius="xl" padding="sm">
            <Table>
              <Table.Head>
                <tr>
                  <th style={{ width: 40 }}>
                    <Checkbox
                      type="checkbox"
                      checked={allVisibleSelected}
                      onChange={() =>
                        setSelectedIds(
                          allVisibleSelected
                            ? selectedIds.filter((id) => !visibleIds.includes(id))
                            : [...new Set([...selectedIds, ...visibleIds])]
                        )
                      }
                      aria-label={
                        allVisibleSelected ? 'Clear this page' : 'Select every story on this page'
                      }
                    />
                  </th>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Status</th>
                  <th>Engagement</th>
                  <th>Created</th>
                  <th aria-label="Actions" />
                </tr>
              </Table.Head>
              <Table.Body>
                {visible.map((post) => (
                  <tr key={post._id}>
                    <td>
                      <Checkbox
                        type="checkbox"
                        checked={selectedIds.includes(post._id)}
                        onChange={() => toggleSelected(post._id)}
                        aria-label={`Select ${post.title}`}
                      />
                    </td>
                    <td>
                      <CellTitle to={`/post/${post._id}`}>{post.title}</CellTitle>
                    </td>
                    <td>{post.user?.username || 'Unknown'}</td>
                    <td>
                      <Badge variant={TONE[post.visibility] || 'neutral'}>
                        {LABEL[post.visibility] || post.visibility}
                      </Badge>
                    </td>
                    <td>
                      {post.likes?.length || 0} likes · {post.comments?.length || 0} replies
                    </td>
                    <td>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</td>
                    <td style={{ textAlign: 'right' }}>
                      <DropdownMenu
                        trigger={
                          <MenuTrigger aria-label={`Actions for ${post.title}`}>
                            <MoreHorizontal />
                          </MenuTrigger>
                        }
                      >
                        <DropdownMenu.Item onSelect={() => navigate(`/post/${post._id}`)}>
                          <Eye /> View
                        </DropdownMenu.Item>
                        <DropdownMenu.Item onSelect={() => navigate(`/edit/${post._id}`)}>
                          <Pencil /> Edit
                        </DropdownMenu.Item>
                        <DropdownMenu.Separator />
                        <DropdownMenu.Item $tone="danger" onSelect={() => setPendingDelete(post)}>
                          <Trash2 /> Delete
                        </DropdownMenu.Item>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </Table.Body>
            </Table>

            <Pagination
              page={pagination.page}
              pages={pagination.pages}
              total={pagination.total}
              noun="stories"
              onChange={(next) => {
                setPage(next);
                // Selection is per page; carrying it across would act on rows out of view.
                setSelectedIds([]);
              }}
            />
          </Card>
        )}
      </Section>

      <Modal
        open={Boolean(pendingBulkDelete)}
        onOpenChange={(open) => !open && setPendingBulkDelete(null)}
        title={`Delete ${pendingBulkDelete?.length ?? 0} ${
          pendingBulkDelete?.length === 1 ? 'story' : 'stories'
        }?`}
        description="They and their responses will be removed. This cannot be undone."
      >
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <Button variant="secondary" onClick={() => setPendingBulkDelete(null)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => bulkMutation.mutate({ ids: pendingBulkDelete, action: 'delete' })}
            disabled={bulkMutation.isPending}
          >
            {bulkMutation.isPending ? 'Deleting…' : 'Delete all'}
          </Button>
        </div>
      </Modal>

      <Modal
        open={!!pendingDelete}
        onOpenChange={(open) => !open && setPendingDelete(null)}
        title="Delete this post?"
        description={
          pendingDelete
            ? `"${pendingDelete.title}" by ${pendingDelete.user?.username || 'an unknown author'} and its comments will be removed. This cannot be undone.`
            : ''
        }
      >
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <Button variant="secondary" onClick={() => setPendingDelete(null)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => deleteMutation.mutate(pendingDelete._id)}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? 'Deleting…' : 'Delete'}
          </Button>
        </div>
      </Modal>
    </>
  );
}
