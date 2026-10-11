import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
import { queryKeys } from '../../services/queryKeys';

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

  const filterKey = `${filter}|${debouncedQuery.trim()}`;
  const [syncedFilter, setSyncedFilter] = useState(filterKey);
  if (syncedFilter !== filterKey) {
    setSyncedFilter(filterKey);
    setPage(1);
    setSelectedIds([]);
  }

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
  const counts = postsResponse?.counts ?? { all: 0, public: 0, draft: 0, private: 0 };

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
        <Card tone="low" radius="xl" padding="lg">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between py-3 border-b border-[hsl(var(--border))/0.4] last:border-b-0"
            >
              <div className="flex flex-col gap-1.5 flex-1">
                <Skeleton width="55%" height={16} className="rounded" />
                <Skeleton width="25%" height={12} className="rounded" />
              </div>
              <Skeleton width={60} height={22} className="rounded-full" />
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
          <div className="flex items-center gap-2 flex-wrap p-3 px-5 mb-4 rounded-2xl bg-[hsl(var(--primary))/0.12] border border-[hsl(var(--primary))/0.2]">
            <span className="text-sm font-semibold text-[hsl(var(--primary))] mr-auto">
              {selectedIds.length} selected on this page
            </span>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => bulkMutation.mutate({ ids: selectedIds, action: 'public' })}
              disabled={bulkMutation.isPending}
            >
              <Globe className="w-3.5 h-3.5 mr-1" /> Publish
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => bulkMutation.mutate({ ids: selectedIds, action: 'draft' })}
              disabled={bulkMutation.isPending}
            >
              <FileEdit className="w-3.5 h-3.5 mr-1" /> Unpublish
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => bulkMutation.mutate({ ids: selectedIds, action: 'private' })}
              disabled={bulkMutation.isPending}
            >
              <Lock className="w-3.5 h-3.5 mr-1" /> Make private
            </Button>
            <Button
              size="sm"
              variant="danger"
              onClick={() => setPendingBulkDelete(selectedIds)}
              disabled={bulkMutation.isPending}
            >
              <Trash2 className="w-3.5 h-3.5 mr-1" /> Delete
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setSelectedIds([])}>
              Clear
            </Button>
          </div>
        )}

        {/* Toolbar with filter chips and search */}
        <div className="flex items-center gap-2.5 flex-wrap p-3 rounded-2xl bg-[hsl(var(--card))] border border-[hsl(var(--border))/0.6] mb-4">
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

          <div className="flex-1 min-w-[200px] max-w-[320px] ml-auto max-sm:ml-0 max-sm:max-w-full">
            <Input
              icon={<SearchIcon />}
              placeholder="Search by title"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              aria-label="Search posts by title"
            />
          </div>
        </div>

        {visible.length === 0 ? (
          <EmptyState icon={FileText} title="Nothing here">
            {query || filter !== 'all'
              ? 'No posts match that filter. Try another one, or clear the search.'
              : 'Nobody has written anything yet.'}
          </EmptyState>
        ) : (
          <Card tone="low" radius="xl" padding="none" className="overflow-hidden">
            <Table>
              <Table.Head>
                <tr>
                  <th className="w-10 pl-6">
                    <input
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
                      className="w-4 h-4 rounded accent-[hsl(var(--primary))] cursor-pointer"
                    />
                  </th>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Status</th>
                  <th>Engagement</th>
                  <th>Created</th>
                  <th aria-label="Actions" className="pr-6" />
                </tr>
              </Table.Head>
              <Table.Body>
                {visible.map((post) => (
                  <tr key={post._id}>
                    <td className="pl-6">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(post._id)}
                        onChange={() => toggleSelected(post._id)}
                        aria-label={`Select ${post.title}`}
                        className="w-4 h-4 rounded accent-[hsl(var(--primary))] cursor-pointer"
                      />
                    </td>
                    <td>
                      <Link
                        to={`/post/${post._id}`}
                        className="text-sm font-semibold text-[hsl(var(--foreground))] hover:text-[hsl(var(--primary))] transition-colors line-clamp-1 max-w-[320px] no-underline block"
                      >
                        {post.title}
                      </Link>
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
                    <td className="text-right pr-6">
                      <DropdownMenu
                        trigger={
                          <button
                            type="button"
                            aria-label={`Actions for ${post.title}`}
                            className="inline-flex items-center justify-center w-8 h-8 rounded-full text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))] transition-colors cursor-pointer"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        }
                      >
                        <DropdownMenu.Item onSelect={() => navigate(`/post/${post._id}`)}>
                          <Eye className="w-3.5 h-3.5 mr-2" /> View
                        </DropdownMenu.Item>
                        <DropdownMenu.Item onSelect={() => navigate(`/edit/${post._id}`)}>
                          <Pencil className="w-3.5 h-3.5 mr-2" /> Edit
                        </DropdownMenu.Item>
                        <DropdownMenu.Separator />
                        <DropdownMenu.Item tone="danger" onSelect={() => setPendingDelete(post)}>
                          <Trash2 className="w-3.5 h-3.5 mr-2 text-red-500" /> Delete
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
        <Modal.Footer>
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
        </Modal.Footer>
      </Modal>

      <Modal
        open={Boolean(pendingDelete)}
        onOpenChange={(open) => !open && setPendingDelete(null)}
        title="Delete this post?"
        description={
          pendingDelete
            ? `"${pendingDelete.title}" by ${pendingDelete.user?.username || 'an unknown author'} and its comments will be removed. This cannot be undone.`
            : ''
        }
      >
        <Modal.Footer>
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
        </Modal.Footer>
      </Modal>
    </>
  );
}
