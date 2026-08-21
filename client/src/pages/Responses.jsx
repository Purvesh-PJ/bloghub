import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import styled from 'styled-components';
import { formatDistanceToNow } from 'date-fns';
import { MessageSquare, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

import { postService } from '../services/postService';
import { commentService } from '../services/commentService';
import { PageShell } from '../components/layout/PageShell';
import {
  Button,
  Surface,
  Card,
  Select,
  Avatar,
  Modal,
  EmptyState,
  ErrorState,
  Skeleton,
  SkeletonText,
} from '../components/ui';
import { text, media } from '../styles/theme/mixins';
import { queryKeys } from '../services/queryKeys';

/**
 * Responses — what readers have said, and the only place an author can moderate it.
 *
 * The API could already list a post's comments and delete one, and the workspace had no
 * screen for either: an author could be commented on and never see it, and had no way to
 * remove anything from their own thread.
 */

const Toolbar = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.surfaceContainerLow};
  border: 1px solid ${({ theme }) => theme.colors.lineSubtle};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const PostPicker = styled.div`
  min-width: 260px;
  flex: 1;
  max-width: 440px;

  ${media.down('sm')`max-width: 100%;`}
`;

const Thread = styled.div`
  display: flex;
  flex-direction: column;
`;

const Entry = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: start;
  padding: ${({ theme }) => theme.spacing.lg};
  transition: background ${({ theme }) => theme.transitions.fast};

  & + & {
    box-shadow: inset 0 1px 0 ${({ theme }) => theme.colors.lineSubtle};
  }

  &:hover {
    background: ${({ theme }) => theme.colors.surfaceContainer};
  }
`;

const Body = styled.div`
  min-width: 0;
`;

const Who = styled.div`
  display: flex;
  align-items: baseline;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-wrap: wrap;
  margin-bottom: 2px;
`;

const Name = styled.span`
  ${text('sm', 'semibold')}
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const When = styled.span`
  ${text('xs')}
  color: ${({ theme }) => theme.colors.textMuted};
`;

const Message = styled.p`
  ${text('sm')}
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.6;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
`;

const Replies = styled.div`
  margin-top: ${({ theme }) => theme.spacing.md};
  padding-left: ${({ theme }) => theme.spacing.lg};
  border-left: 2px solid ${({ theme }) => theme.colors.lineSubtle};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const PostTitleRow = styled.span`
  ${text('sm', 'semibold')}
  color: ${({ theme }) => theme.colors.accentText};
  display: inline-flex;
  align-items: center;
  gap: 4px;
  /* Two words that must not wrap or clip; clamping them rendered "Open sto…". */
  white-space: nowrap;
  flex-shrink: 0;
`;

const Count = styled.span`
  ${text('xs')}
  color: ${({ theme }) => theme.colors.textMuted};
  font-variant-numeric: tabular-nums;
`;

export function Responses() {
  const queryClient = useQueryClient();
  const [postId, setPostId] = useState('');
  const [pendingDelete, setPendingDelete] = useState(null);

  // Every story the author has, so the picker can offer them. Drafts included — a private
  // post can still carry the author's own notes.
  const { data: postsData, isLoading: postsLoading } = useQuery({
    queryKey: queryKeys.posts.mine({ limit: 50, sort: 'newest' }),
    queryFn: () => postService.getMyPosts({ limit: 50, sort: 'newest' }),
  });

  const posts = postsData?.data ?? [];
  // Falls back to the newest story rather than showing an empty picker on arrival.
  const selectedId = postId || posts[0]?._id || '';
  const selectedPost = posts.find((post) => post._id === selectedId);

  const {
    data: commentsData,
    isLoading: commentsLoading,
    isError: commentsFailed,
    error: commentsError,
    refetch: refetchComments,
  } = useQuery({
    queryKey: queryKeys.comments.forPost(selectedId),
    queryFn: () => commentService.getPostComments(selectedId, { limit: 50 }),
    enabled: Boolean(selectedId),
  });

  const comments = commentsData?.data ?? [];

  const deleteMutation = useMutation({
    mutationFn: (id) => commentService.deleteComment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.comments.forPost(selectedId) });
      setPendingDelete(null);
      toast.success('Response removed');
    },
    onError: (error) =>
      toast.error(error.response?.data?.message || 'Could not remove that response'),
  });

  if (postsLoading) {
    return (
      <PageShell>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }} aria-hidden="true">
          <Skeleton $width="300px" $height={40} $radius="md" />
          <Surface $tone="low" $radius="xl" $padding="md">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  gap: 16,
                  padding: '16px 0',
                  borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                }}
              >
                <Skeleton $variant="circle" $width={36} $height={36} />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <Skeleton $width="140px" $height={14} $radius="xs" />
                  <SkeletonText lines={2} lineHeight="14px" lastLineWidth="80%" gap="xs" />
                </div>
              </div>
            ))}
          </Surface>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      {posts.length === 0 ? (
        <EmptyState
          icon={MessageSquare}
          title="Nothing to respond to yet"
          actions={
            <Button as={Link} to="/write" size="sm">
              Write a story
            </Button>
          }
        >
          Once you publish a story, replies from readers collect here so you can follow the
          conversation and remove anything that does not belong.
        </EmptyState>
      ) : (
        <>
          <Toolbar>
            <PostPicker>
              <Select
                label="Story"
                value={selectedId}
                onValueChange={setPostId}
                options={posts.map((post) => ({
                  value: post._id,
                  label: post.title || 'Untitled',
                }))}
              />
            </PostPicker>

            {selectedPost && (
              <PostTitleRow>
                <span>Viewing:</span>
                <Link to={`/post/${selectedPost._id}`}>{selectedPost.title || 'Untitled'}</Link>
              </PostTitleRow>
            )}

            <Count style={{ marginLeft: 'auto' }}>
              {commentsData?.pagination?.total ?? comments.length} response
              {(commentsData?.pagination?.total ?? comments.length) === 1 ? '' : 's'}
            </Count>
          </Toolbar>

          {commentsLoading ? (
            <Surface $tone="low" $radius="xl" $padding="md" aria-hidden="true">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    gap: 16,
                    padding: '16px 0',
                    borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                  }}
                >
                  <Skeleton $variant="circle" $width={36} $height={36} />
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <Skeleton $width="140px" $height={14} $radius="xs" />
                    <SkeletonText lines={2} lineHeight="14px" lastLineWidth="80%" gap="xs" />
                  </div>
                </div>
              ))}
            </Surface>
          ) : commentsFailed ? (
            <ErrorState
              title="Responses did not load"
              error={commentsError}
              onRetry={() => refetchComments()}
            />
          ) : comments.length === 0 ? (
            <EmptyState icon={MessageSquare} title="No responses on this story yet">
              When somebody replies, it appears here.
            </EmptyState>
          ) : (
            <Surface $tone="low" $radius="xl" $padding="sm">
              <Thread>
                {comments.map((comment) => (
                  <Entry key={comment._id}>
                    <Avatar name={comment.user?.username} size="sm" />
                    <Body>
                      <Who>
                        <Name>{comment.user?.username || 'Someone'}</Name>
                        <When>
                          {comment.createdAt
                            ? formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })
                            : 'recently'}
                        </When>
                      </Who>
                      <Message>{comment.message}</Message>

                      {comment.replies?.length > 0 && (
                        <Replies>
                          {comment.replies.map((reply) => (
                            <div key={reply._id}>
                              <Who>
                                <Name>{reply.user?.username || 'Someone'}</Name>
                                <When>
                                  {reply.createdAt
                                    ? formatDistanceToNow(new Date(reply.createdAt), {
                                        addSuffix: true,
                                      })
                                    : 'recently'}
                                </When>
                              </Who>
                              <Message>{reply.message}</Message>
                            </div>
                          ))}
                        </Replies>
                      )}
                    </Body>

                    <Button
                      variant="ghost"
                      size="sm"
                      aria-label={`Remove response from ${comment.user?.username || 'this reader'}`}
                      onClick={() => setPendingDelete(comment)}
                    >
                      <Trash2 size={15} />
                    </Button>
                  </Entry>
                ))}
              </Thread>
            </Surface>
          )}
        </>
      )}

      <Modal
        open={!!pendingDelete}
        onOpenChange={(open) => !open && setPendingDelete(null)}
        title="Remove this response?"
        description={
          pendingDelete?.replies?.length
            ? `The ${pendingDelete.replies.length} repl${pendingDelete.replies.length === 1 ? 'y' : 'ies'} beneath it go too. This cannot be undone.`
            : 'It will be removed from your story. This cannot be undone.'
        }
      >
        <Card tone="low" radius="md" padding="md" style={{ marginTop: 8 }}>
          <Message>{pendingDelete?.message}</Message>
        </Card>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 16 }}>
          <Button variant="secondary" onClick={() => setPendingDelete(null)}>
            Keep it
          </Button>
          <Button
            variant="danger"
            onClick={() => deleteMutation.mutate(pendingDelete._id)}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? 'Removing…' : 'Remove'}
          </Button>
        </div>
      </Modal>
    </PageShell>
  );
}
