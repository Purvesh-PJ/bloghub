import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import styled from 'styled-components';
import { formatDistanceToNow } from 'date-fns';
import {
  PenLine,
  Search as SearchIcon,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  FileText,
} from 'lucide-react';
import toast from 'react-hot-toast';

import { postService } from '../../services/postService';
import { PageHeader, Section } from '../../components/layout/PageShell';
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
} from '../../components/ui';
import { text, clamp } from '../../styles/theme/mixins';

/**
 * Post moderation.
 *
 * Same listing as before, rebuilt on the shared primitives. The four stat cards became
 * counts on the filter chips: they showed the same four numbers the filter row already
 * implied, and a row of cards that only restates the control beneath it is decoration.
 */

const Toolbar = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-wrap: wrap;
`;

/* Pushed to the end of the toolbar so the filters stay left-aligned with the table. */
const SearchField = styled.div`
  flex: 1;
  min-width: 200px;
  max-width: 300px;
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

const TONE = { public: 'success', draft: 'warning', private: 'neutral' };
const LABEL = { public: 'Published', draft: 'Draft', private: 'Private' };

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'public', label: 'Published' },
  { id: 'draft', label: 'Drafts' },
  { id: 'private', label: 'Private' },
];

export function AdminPosts() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [pendingDelete, setPendingDelete] = useState(null);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');

  // Moderation view — includes drafts and private posts, unlike the public ['posts'] key.
  const { data: postsResponse, isLoading } = useQuery({
    queryKey: ['allPosts'],
    queryFn: () => postService.getAllPosts({ limit: 50 }),
  });

  const deleteMutation = useMutation({
    mutationFn: postService.deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allPosts'] });
      queryClient.invalidateQueries({ queryKey: ['adminAnalytics'] });
      setPendingDelete(null);
      toast.success('Post deleted');
    },
    onError: () => toast.error('Could not delete the post'),
  });

  const posts = useMemo(() => postsResponse?.data || [], [postsResponse]);

  const counts = useMemo(
    () => ({
      all: posts.length,
      public: posts.filter((post) => post.visibility === 'public').length,
      draft: posts.filter((post) => post.visibility === 'draft').length,
      private: posts.filter((post) => post.visibility === 'private').length,
    }),
    [posts]
  );

  const visible = useMemo(() => {
    let list = posts;
    if (filter !== 'all') list = list.filter((post) => post.visibility === filter);
    if (query.trim()) {
      const needle = query.trim().toLowerCase();
      list = list.filter(
        (post) =>
          post.title?.toLowerCase().includes(needle) ||
          post.user?.username?.toLowerCase().includes(needle)
      );
    }
    return list;
  }, [posts, filter, query]);

  if (isLoading) {
    return (
      <div aria-hidden="true">
        <PageHeader
          title="Posts"
          subtitle="Loading directory…"
          actions={
            <Button as={Link} to="/write">
              <PenLine /> New post
            </Button>
          }
        />
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
      <PageHeader
        title="Posts"
        subtitle={`${counts.all} loaded, including drafts and private posts.`}
        actions={
          <Button as={Link} to="/write">
            <PenLine /> New post
          </Button>
        }
      />

      <Section>
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
              placeholder="Search title or author"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              aria-label="Search posts by title or author"
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
          </Card>
        )}
      </Section>

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
