import { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Markdown from '@uiw/react-markdown-preview/nohighlight';
import { formatDistanceToNow } from 'date-fns';
import { Heart, MessageCircle, Share2, Eye, Pencil, Trash2, FileQuestion } from 'lucide-react';
import toast from 'react-hot-toast';

import { postService } from '../services/postService';
import { commentService } from '../services/commentService';
import { likeService } from '../services/likeService';
import { analyticsService } from '../services/analyticsService';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../styles/ThemeProvider';
import { useReadTracking, useReadingProgress } from '../hooks/useReading';
import { markdownRehypePlugins, hasCodeBlock, loadSyntaxHighlighting } from '../config/markdown';
import { AuthorByline } from '../components/posts/AuthorByline';
import { PageShell } from '../components/layout/PageShell';
import { ReadRateBar } from '../components/stats/ReadRateBar';
import { Button, Card, TextArea, Modal, EmptyState, Avatar } from '../components/ui';
import { PostDetailSkeleton } from '../components/posts/PostDetailSkeleton';
import { readingTime } from '../utils/text';
import { queryKeys } from '../services/queryKeys';
import { cn } from '../lib/utils';

export function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isAuthenticated, user } = useAuth();
  const { mode } = useTheme();

  const [comment, setComment] = useState('');
  const [likedOverride, setLikedOverride] = useState(null);
  const [syncedLike, setSyncedLike] = useState(false);
  const [replyTo, setReplyTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [pendingCommentDelete, setPendingCommentDelete] = useState(null);

  const articleRef = useRef(null);
  const progress = useReadingProgress(articleRef);

  const { data, isLoading, error } = useQuery({
    queryKey: queryKeys.posts.detail(id),
    queryFn: () => postService.getPost(id),
    enabled: Boolean(id),
    retry: false,
  });

  const post = data?.data;
  useReadTracking(post?._id, post?.content, articleRef);

  // A view is one per page load. Guarded so React's development double-invoke does not record two.
  const viewed = useRef(null);
  useEffect(() => {
    if (!id || viewed.current === id) return;
    viewed.current = id;
    analyticsService.trackPageView(id).catch(() => {});
  }, [id]);

  const likedByServer = Boolean(
    user?.user_id &&
      post?.likes?.some((like) => String(like?.user ?? like) === String(user.user_id))
  );

  if (syncedLike !== likedByServer) {
    setSyncedLike(likedByServer);
    setLikedOverride(null);
  }

  const liked = likedOverride ?? likedByServer;
  const isAuthor = user?.user_id === post?.user?._id;

  const { data: analytics } = useQuery({
    queryKey: queryKeys.analytics.forPost(id),
    queryFn: () => analyticsService.getPostAnalytics(id),
    enabled: Boolean(isAuthor && id),
    retry: false,
  });

  const postStats = analytics?.data;

  const { data: viewCount } = useQuery({
    queryKey: queryKeys.analytics.viewsForPost(id),
    queryFn: () => analyticsService.getPageViewCount(id),
    enabled: Boolean(id),
    retry: false,
  });

  const [highlightPlugin, setHighlightPlugin] = useState(null);
  const needsHighlighting = hasCodeBlock(post?.content);

  useEffect(() => {
    if (!needsHighlighting || highlightPlugin) return undefined;

    let cancelled = false;
    loadSyntaxHighlighting().then((plugin) => {
      if (!cancelled && plugin) setHighlightPlugin(() => plugin);
    });

    return () => {
      cancelled = true;
    };
  }, [needsHighlighting, highlightPlugin]);

  const rehypePlugins = useMemo(
    () => (highlightPlugin ? [highlightPlugin, ...markdownRehypePlugins] : markdownRehypePlugins),
    [highlightPlugin]
  );

  const deleteMutation = useMutation({
    mutationFn: () => postService.deletePost(id),
    onSuccess: () => {
      toast.success('Post deleted');
      navigate('/dashboard');
    },
    onError: () => toast.error('Could not delete the post'),
  });

  const commentMutation = useMutation({
    mutationFn: (payload) => commentService.createComment(payload),
    onSuccess: () => {
      setComment('');
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.detail(id) });
    },
    onError: () => toast.error('Could not post that comment'),
  });

  const replyMutation = useMutation({
    mutationFn: ({ userId, repliedCommentId, message }) =>
      commentService.replyToComment(userId, repliedCommentId, message),
    onSuccess: () => {
      setReplyTo(null);
      setReplyText('');
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.detail(id) });
    },
    onError: () => toast.error('Could not post that reply'),
  });

  const deleteCommentMutation = useMutation({
    mutationFn: (commentId) => commentService.deleteComment(commentId),
    onSuccess: () => {
      setPendingCommentDelete(null);
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.detail(id) });
      toast.success('Response removed');
    },
    onError: (error) =>
      toast.error(error.response?.data?.message || 'Could not remove that response'),
  });

  const canDeleteComment = (entry) =>
    isAuthenticated &&
    (String(entry.user?._id) === String(user?.user_id) ||
      isAuthor ||
      user?.roles?.includes('admin'));

  const likeMutation = useMutation({
    mutationFn: () => (liked ? likeService.unlikePost(id) : likeService.likePost(id)),
    onMutate: () => setLikedOverride(!liked),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.posts.detail(id) }),
    onError: (error) => {
      setLikedOverride(null);
      toast.error(error.response?.data?.message || 'Could not register that');
    },
  });

  if (isLoading) return <PostDetailSkeleton />;

  if (error || !data?.success || !post) {
    return (
      <PageShell width="reading">
        <EmptyState
          icon={FileQuestion}
          title="This post is not here"
          actions={
            <Button as={Link} to="/">
              Back to the feed
            </Button>
          }
        >
          It may have been deleted, or made private by its author.
        </EmptyState>
      </PageShell>
    );
  }

  const comments = post.comments || [];

  return (
    <>
      {/* Reading Progress Indicator under header */}
      <div
        className="fixed top-14 left-0 right-0 h-[2px] z-[200] bg-transparent pointer-events-none"
        aria-hidden="true"
      >
        <div
          className="h-full bg-[hsl(var(--primary))] transition-[width] duration-75 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>

      <PageShell width="reading">
        {/* Cover Image */}
        {post.imageURL && (
          <div className="w-full aspect-[16/9] sm:aspect-[21/9] rounded-[28px] sm:rounded-[36px] overflow-hidden bg-[hsl(var(--muted))] border border-[hsl(var(--border))/0.4]">
            <img
              src={post.imageURL}
              alt={`Cover image for ${post.title}`}
              fetchPriority="high"
              decoding="async"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Article Title */}
        <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-[hsl(var(--foreground))] leading-tight sm:leading-snug">
          {post.title}
        </h1>

        {/* Byline & Author Actions */}
        <div className="flex items-center justify-between gap-4 flex-wrap pb-6 border-b border-[hsl(var(--border))/0.6]">
          <Link
            to={post.user?._id ? `/user/${post.user._id}` : '#'}
            className="hover:opacity-90 transition-opacity"
          >
            <AuthorByline
              layout="stacked"
              name={post.author?.name || post.user?.username}
              at={post.createdAt}
              dateStyle="absolute"
              readingMinutes={readingTime(post.content)}
            />
          </Link>

          {isAuthor && (
            <div className="flex items-center gap-2">
              <Button as={Link} to={`/edit/${post._id}`} variant="secondary" size="sm">
                <Pencil className="h-3.5 w-3.5 mr-1" /> Edit
              </Button>
              <Button variant="dangerTonal" size="sm" onClick={() => setConfirmDelete(true)}>
                <Trash2 className="h-3.5 w-3.5 mr-1" /> Delete
              </Button>
            </div>
          )}
        </div>

        {/* Author Stats Bar */}
        {isAuthor && postStats && postStats.views > 0 && (
          <Card tone="low" radius="lg" padding="lg">
            <ReadRateBar
              views={postStats.views}
              reads={postStats.reads}
              rate={postStats.readRate}
              size="lg"
            />
          </Card>
        )}

        {/* Article Body */}
        <article
          ref={articleRef}
          className="text-[17px] sm:text-lg leading-[1.8] text-[hsl(var(--foreground))] [&_.wmde-markdown]:bg-transparent [&_.wmde-markdown]:text-inherit [&_.wmde-markdown]:font-sans [&_.wmde-markdown_h1]:text-3xl [&_.wmde-markdown_h1]:font-bold [&_.wmde-markdown_h1]:mt-8 [&_.wmde-markdown_h1]:mb-3 [&_.wmde-markdown_h2]:text-2xl [&_.wmde-markdown_h2]:font-bold [&_.wmde-markdown_h2]:mt-7 [&_.wmde-markdown_h2]:mb-3 [&_.wmde-markdown_h3]:text-xl [&_.wmde-markdown_h3]:font-semibold [&_.wmde-markdown_h3]:mt-6 [&_.wmde-markdown_h3]:mb-2 [&_.wmde-markdown_p]:text-[hsl(var(--muted-foreground))] [&_.wmde-markdown_p]:mb-4 [&_.wmde-markdown_li]:text-[hsl(var(--muted-foreground))] [&_.wmde-markdown_a]:text-[hsl(var(--primary))] [&_.wmde-markdown_a]:underline [&_.wmde-markdown_blockquote]:border-l-4 [&_.wmde-markdown_blockquote]:border-[hsl(var(--primary))] [&_.wmde-markdown_blockquote]:bg-[hsl(var(--muted))/0.5] [&_.wmde-markdown_blockquote]:rounded-r-xl [&_.wmde-markdown_blockquote]:p-4 [&_.wmde-markdown_blockquote]:my-4 [&_.wmde-markdown_pre]:rounded-xl [&_.wmde-markdown_pre]:bg-[hsl(var(--card))] [&_.wmde-markdown_img]:rounded-2xl"
        >
          <div data-color-mode={mode}>
            <Markdown source={post.content} rehypePlugins={rehypePlugins} />
          </div>
        </article>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap py-2">
            {post.tags.map((tag) => {
              const rawName = typeof tag === 'string' ? tag : tag?.name;
              if (!rawName) return null;
              const name = String(rawName)
                .trim()
                .toLowerCase()
                .replace(/^[#_-]+/, '');
              return (
                <Link
                  key={name}
                  to={`/search?topic=${encodeURIComponent(name)}`}
                  className="px-3 py-1 rounded-full text-xs font-semibold bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))/0.1] transition-colors"
                >
                  #{name}
                </Link>
              );
            })}
          </div>
        )}

        {/* Actions Bar (Likes, Comments Count, Views, Share) */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap py-4 border-y border-[hsl(var(--border))/0.6]">
          <button
            onClick={() => {
              isAuthenticated ? likeMutation.mutate() : toast.error('Sign in to like this');
            }}
            aria-pressed={liked}
            aria-label={liked ? 'Unlike this post' : 'Like this post'}
            className={cn(
              'inline-flex items-center gap-2 h-10 px-4 rounded-full text-sm font-medium transition-colors select-none cursor-pointer',
              liked
                ? 'bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20'
                : 'bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))/0.8]'
            )}
          >
            <Heart
              className={cn('h-4 w-4 shrink-0', liked && 'fill-current text-red-500')}
              aria-hidden="true"
            />
            <span>{post.likes?.length || 0}</span>
          </button>

          <a
            href="#comments"
            aria-label={`Jump to ${comments.length} responses`}
            className="inline-flex items-center gap-2 h-10 px-4 rounded-full text-sm font-medium bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))/0.8] transition-colors select-none"
          >
            <MessageCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{comments.length}</span>
          </a>

          {typeof viewCount?.count === 'number' && viewCount.count > 0 && (
            <span
              aria-label={`${viewCount.count} ${viewCount.count === 1 ? 'reader has' : 'readers have'} opened this`}
              className="inline-flex items-center gap-2 h-10 px-4 rounded-full text-sm font-medium bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] select-none"
            >
              <Eye className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{viewCount.count}</span>
            </span>
          )}

          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              toast.success('Link copied to clipboard!');
            }}
            className="inline-flex items-center gap-2 h-10 px-4 rounded-full text-sm font-medium bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))/0.8] transition-colors select-none cursor-pointer"
          >
            <Share2 className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>Share</span>
          </button>
        </div>

        {/* Responses / Comments Section */}
        <section id="comments" className="flex flex-col gap-6 pt-2">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[hsl(var(--foreground))]">
            {comments.length} {comments.length === 1 ? 'response' : 'responses'}
          </h2>

          {isAuthenticated ? (
            <form
              onSubmit={(event) => {
                event.preventDefault();
                if (comment.trim()) {
                  commentMutation.mutate({ userId: user.user_id, postId: id, message: comment });
                }
              }}
              className="flex flex-col gap-3 items-end w-full"
            >
              <div className="w-full">
                <TextArea
                  placeholder="What did you make of it?"
                  value={comment}
                  onChange={(event) => setComment(event.target.value)}
                  rows={3}
                  aria-label="Write a response"
                />
              </div>
              <Button
                type="submit"
                isLoading={commentMutation.isPending}
                disabled={!comment.trim()}
              >
                Respond
              </Button>
            </form>
          ) : (
            <Card tone="low" radius="lg" padding="lg">
              <p className="text-sm text-[hsl(var(--muted-foreground))] m-0">
                <Link to="/login" className="text-[hsl(var(--primary))] font-medium hover:underline">
                  Sign in
                </Link>{' '}
                to join the conversation.
              </p>
            </Card>
          )}

          {comments.length === 0 ? (
            <EmptyState icon={MessageCircle} title="No responses yet" tone="low">
              Be the first to say something.
            </EmptyState>
          ) : (
            <div className="flex flex-col gap-6">
              {comments.map((entry) => (
                <div key={entry._id} className="flex gap-3">
                  <Avatar name={entry.user?.username} size="sm" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-[hsl(var(--foreground))]">
                        {entry.user?.username || 'Anonymous'}
                      </span>
                      <span className="text-xs text-[hsl(var(--muted-foreground))]">
                        {(() => {
                          const d = entry.date ? new Date(entry.date) : null;
                          return d && !isNaN(d.getTime())
                            ? formatDistanceToNow(d, { addSuffix: true })
                            : 'recently';
                        })()}
                      </span>
                    </div>
                    <p className="text-sm sm:text-base text-[hsl(var(--muted-foreground))] mt-1 whitespace-pre-wrap leading-relaxed">
                      {entry.message}
                    </p>

                    <div className="flex items-center gap-4 mt-2">
                      {isAuthenticated && (
                        <button
                          type="button"
                          onClick={() => setReplyTo(replyTo === entry._id ? null : entry._id)}
                          className="text-xs font-medium text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--primary))] transition-colors cursor-pointer"
                        >
                          {replyTo === entry._id ? 'Cancel' : 'Reply'}
                        </button>
                      )}

                      {canDeleteComment(entry) && (
                        <button
                          type="button"
                          onClick={() => setPendingCommentDelete(entry)}
                          aria-label={`Delete the response from ${entry.user?.username || 'this reader'}`}
                          className="text-xs font-medium text-[hsl(var(--muted-foreground))] hover:text-red-500 transition-colors cursor-pointer"
                        >
                          Delete
                        </button>
                      )}
                    </div>

                    {/* Reply Composer */}
                    {replyTo === entry._id && (
                      <form
                        onSubmit={(event) => {
                          event.preventDefault();
                          if (replyText.trim()) {
                            replyMutation.mutate({
                              userId: user.user_id,
                              repliedCommentId: entry._id,
                              message: replyText,
                            });
                          }
                        }}
                        className="flex flex-col gap-2 items-end mt-3 w-full"
                      >
                        <div className="w-full">
                          <TextArea
                            placeholder={`Reply to ${entry.user?.username || 'this'}`}
                            value={replyText}
                            onChange={(event) => setReplyText(event.target.value)}
                            rows={2}
                            aria-label="Write a reply"
                            autoFocus
                          />
                        </div>
                        <Button
                          type="submit"
                          size="sm"
                          disabled={!replyText.trim()}
                          isLoading={replyMutation.isPending}
                        >
                          Reply
                        </Button>
                      </form>
                    )}

                    {/* Nested Replies */}
                    {entry.replies?.length > 0 && (
                      <div className="flex flex-col gap-4 mt-4 pl-4 border-l-2 border-[hsl(var(--border))/0.6]">
                        {entry.replies.map((reply) => (
                          <div key={reply._id} className="flex gap-3">
                            <Avatar name={reply.user?.username} size="sm" />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-baseline gap-2 flex-wrap">
                                <span className="text-sm font-semibold text-[hsl(var(--foreground))]">
                                  {reply.user?.username || 'Anonymous'}
                                </span>
                                <span className="text-xs text-[hsl(var(--muted-foreground))]">
                                  {(() => {
                                    const d = reply.date ? new Date(reply.date) : null;
                                    return d && !isNaN(d.getTime())
                                      ? formatDistanceToNow(d, { addSuffix: true })
                                      : 'recently';
                                  })()}
                                </span>
                              </div>
                              <p className="text-sm sm:text-base text-[hsl(var(--muted-foreground))] mt-1 whitespace-pre-wrap leading-relaxed">
                                {reply.message}
                              </p>

                              {canDeleteComment(reply) && (
                                <div className="flex items-center gap-4 mt-2">
                                  <button
                                    type="button"
                                    onClick={() => setPendingCommentDelete(reply)}
                                    aria-label={`Delete the reply from ${reply.user?.username || 'this reader'}`}
                                    className="text-xs font-medium text-[hsl(var(--muted-foreground))] hover:text-red-500 transition-colors cursor-pointer"
                                  >
                                    Delete
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </PageShell>

      {/* Confirmation Modals */}
      <Modal
        open={Boolean(pendingCommentDelete)}
        onOpenChange={(open) => !open && setPendingCommentDelete(null)}
        title="Remove this response?"
        description={
          pendingCommentDelete?.replies?.length
            ? 'Its replies will be removed with it. This cannot be undone.'
            : 'This cannot be undone.'
        }
      >
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setPendingCommentDelete(null)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => deleteCommentMutation.mutate(pendingCommentDelete._id)}
            disabled={deleteCommentMutation.isPending}
          >
            {deleteCommentMutation.isPending ? 'Removing…' : 'Remove'}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        title="Delete this post?"
        description={`"${post.title}" and its responses will be removed. This cannot be undone.`}
      >
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setConfirmDelete(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => deleteMutation.mutate()}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? 'Deleting…' : 'Delete'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
