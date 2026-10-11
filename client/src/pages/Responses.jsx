import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import { MessageSquare, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

import { postService } from '../services/postService';
import { commentService } from '../services/commentService';
import { PageShell } from '../components/layout/PageShell';
import {
  Button,
  Card,
  Select,
  Avatar,
  Modal,
  EmptyState,
  ErrorState,
  Skeleton,
  SkeletonText,
} from '../components/ui';
import { queryKeys } from '../services/queryKeys';

export function Responses() {
  const queryClient = useQueryClient();
  const [postId, setPostId] = useState('');
  const [pendingDelete, setPendingDelete] = useState(null);

  const { data: postsData, isLoading: postsLoading } = useQuery({
    queryKey: queryKeys.posts.mine({ limit: 50, sort: 'newest' }),
    queryFn: () => postService.getMyPosts({ limit: 50, sort: 'newest' }),
  });

  const posts = postsData?.data ?? [];
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
        <div className="flex flex-col gap-4" aria-hidden="true">
          <Skeleton width="300px" height={40} className="rounded-xl" />
          <Card tone="low" radius="xl" padding="md">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="flex gap-4 py-4 border-b border-[hsl(var(--border))/0.4] last:border-b-0"
              >
                <Skeleton variant="circle" width={36} height={36} />
                <div className="flex-1 flex flex-col gap-2">
                  <Skeleton width="140px" height={14} className="rounded" />
                  <SkeletonText lines={2} lineHeight="14px" lastLineWidth="80%" gap="xs" />
                </div>
              </div>
            ))}
          </Card>
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
          {/* Post picker toolbar */}
          <div className="flex items-center gap-4 flex-wrap p-4 px-6 rounded-2xl bg-[hsl(var(--card))] border border-[hsl(var(--border))/0.6] mb-6">
            <div className="min-w-[260px] flex-1 max-w-[440px] max-sm:max-w-full">
              <Select
                label="Story"
                value={selectedId}
                onValueChange={setPostId}
                options={posts.map((post) => ({
                  value: post._id,
                  label: post.title || 'Untitled',
                }))}
              />
            </div>

            {selectedPost && (
              <span className="text-sm font-semibold text-[hsl(var(--primary))] inline-flex items-center gap-1.5 whitespace-nowrap shrink-0">
                <span>Viewing:</span>
                <Link to={`/post/${selectedPost._id}`} className="hover:underline">
                  {selectedPost.title || 'Untitled'}
                </Link>
              </span>
            )}

            <span className="text-xs text-[hsl(var(--muted-foreground))] tabular-nums ml-auto">
              {commentsData?.pagination?.total ?? comments.length} response
              {(commentsData?.pagination?.total ?? comments.length) === 1 ? '' : 's'}
            </span>
          </div>

          {commentsLoading ? (
            <Card tone="low" radius="xl" padding="md" aria-hidden="true">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="flex gap-4 py-4 border-b border-[hsl(var(--border))/0.4] last:border-b-0"
                >
                  <Skeleton variant="circle" width={36} height={36} />
                  <div className="flex-1 flex flex-col gap-2">
                    <Skeleton width="140px" height={14} className="rounded" />
                    <SkeletonText lines={2} lineHeight="14px" lastLineWidth="80%" gap="xs" />
                  </div>
                </div>
              ))}
            </Card>
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
            <Card tone="low" radius="xl" padding="sm">
              <div className="flex flex-col divide-y divide-[hsl(var(--border))/0.4]">
                {comments.map((comment) => (
                  <div
                    key={comment._id}
                    className="grid grid-cols-[auto_1fr_auto] gap-4 items-start p-4 hover:bg-[hsl(var(--muted))/0.5] transition-colors rounded-xl"
                  >
                    <Avatar name={comment.user?.username} size="sm" />
                    <div className="min-w-0">
                      <div className="flex items-baseline gap-2 flex-wrap mb-0.5">
                        <span className="text-sm font-semibold text-[hsl(var(--foreground))]">
                          {comment.user?.username || 'Someone'}
                        </span>
                        <span className="text-xs text-[hsl(var(--muted-foreground))]">
                          {comment.createdAt
                            ? formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })
                            : 'recently'}
                        </span>
                      </div>
                      <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed whitespace-pre-wrap break-words">
                        {comment.message}
                      </p>

                      {comment.replies?.length > 0 && (
                        <div className="mt-3 pl-4 border-l-2 border-[hsl(var(--border))/0.6] flex flex-col gap-3">
                          {comment.replies.map((reply) => (
                            <div key={reply._id}>
                              <div className="flex items-baseline gap-2 flex-wrap mb-0.5">
                                <span className="text-sm font-semibold text-[hsl(var(--foreground))]">
                                  {reply.user?.username || 'Someone'}
                                </span>
                                <span className="text-xs text-[hsl(var(--muted-foreground))]">
                                  {reply.createdAt
                                    ? formatDistanceToNow(new Date(reply.createdAt), {
                                        addSuffix: true,
                                      })
                                    : 'recently'}
                                </span>
                              </div>
                              <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed whitespace-pre-wrap break-words">
                                {reply.message}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      aria-label={`Remove response from ${comment.user?.username || 'this reader'}`}
                      onClick={() => setPendingDelete(comment)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        open={Boolean(pendingDelete)}
        onOpenChange={(open) => !open && setPendingDelete(null)}
        title="Remove this response?"
        description={
          pendingDelete?.replies?.length
            ? `The ${pendingDelete.replies.length} repl${pendingDelete.replies.length === 1 ? 'y' : 'ies'} beneath it go too. This cannot be undone.`
            : 'It will be removed from your story. This cannot be undone.'
        }
      >
        <Card tone="low" radius="md" padding="md" className="mt-2">
          <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed m-0">
            {pendingDelete?.message}
          </p>
        </Card>
        <Modal.Footer>
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
        </Modal.Footer>
      </Modal>
    </PageShell>
  );
}
