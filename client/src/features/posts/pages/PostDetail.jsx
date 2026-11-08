import { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Markdown from '@uiw/react-markdown-preview/nohighlight';
import { FileQuestion } from 'lucide-react';
import toast from 'react-hot-toast';

import { postService } from '../services/postService';
import { commentService } from '../../comments/services/commentService';
import { likeService } from '../services/likeService';
import { analyticsService } from '../../analytics/services/analyticsService';
import { useAuth } from '../../../features/auth';
import { useTheme } from '../../../styles/ThemeProvider';
import { useReadTracking, useReadingProgress } from '../../analytics/hooks/useReading';
import {
  markdownRehypePlugins,
  hasCodeBlock,
  loadSyntaxHighlighting,
} from '../../../config/markdown';
import { PageShell } from '../../../components/layout/PageShell';
import { Button, EmptyState } from '../../../components/ui';
import { ConfirmDialog } from '../../../components/shared';
import { PostDetailSkeleton, PostHeader, PostActionBar, PostCommentsSection } from '../components';
import { queryKeys } from '../../../config/queryKeys';

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
    onError: (err) => toast.error(err.response?.data?.message || 'Could not remove that response'),
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
    onError: (err) => {
      setLikedOverride(null);
      toast.error(err.response?.data?.message || 'Could not register that');
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
      {/* Reading Progress Indicator */}
      <div
        className="fixed top-14 left-0 right-0 h-0.5 z-[200] bg-transparent pointer-events-none"
        aria-hidden="true"
      >
        <div
          className="h-full bg-primary transition-[width] duration-75 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>

      <PageShell width="reading">
        <PostHeader
          post={post}
          isAuthor={isAuthor}
          postStats={postStats}
          onOpenDelete={() => setConfirmDelete(true)}
        />

        {/* Article Body */}
        <article
          ref={articleRef}
          className="text-base sm:text-lg leading-[1.8] text-foreground [&_.wmde-markdown]:bg-transparent [&_.wmde-markdown]:text-inherit [&_.wmde-markdown]:font-sans [&_.wmde-markdown_h1]:text-3xl [&_.wmde-markdown_h1]:font-bold [&_.wmde-markdown_h1]:mt-8 [&_.wmde-markdown_h1]:mb-3 [&_.wmde-markdown_h1]:border-b-0 [&_.wmde-markdown_h2]:text-2xl [&_.wmde-markdown_h2]:font-bold [&_.wmde-markdown_h2]:mt-7 [&_.wmde-markdown_h2]:mb-3 [&_.wmde-markdown_h2]:border-b-0 [&_.wmde-markdown_h3]:text-xl [&_.wmde-markdown_h3]:font-semibold [&_.wmde-markdown_h3]:mt-6 [&_.wmde-markdown_h3]:mb-2 [&_.wmde-markdown_p]:text-muted-foreground [&_.wmde-markdown_p]:mb-4 [&_.wmde-markdown_li]:text-muted-foreground [&_.wmde-markdown_a]:text-primary [&_.wmde-markdown_a]:underline [&_.wmde-markdown_blockquote]:border-l-4 [&_.wmde-markdown_blockquote]:border-primary [&_.wmde-markdown_blockquote]:bg-muted/50 [&_.wmde-markdown_blockquote]:rounded-r-xl [&_.wmde-markdown_blockquote]:p-4 [&_.wmde-markdown_blockquote]:my-4 [&_.wmde-markdown_pre]:rounded-xl [&_.wmde-markdown_pre]:border [&_.wmde-markdown_pre]:border-border/40 [&_.wmde-markdown_pre]:p-4 sm:[&_.wmde-markdown_pre]:p-5 [&_.wmde-markdown_pre]:bg-muted/60 [&_.wmde-markdown_pre]:overflow-x-auto [&_.wmde-markdown_img]:rounded-2xl [&_.wmde-markdown_table]:rounded-xl"
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
                  className="px-3 py-1 rounded-full text-xs font-semibold bg-muted text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                >
                  #{name}
                </Link>
              );
            })}
          </div>
        )}

        <PostActionBar
          post={post}
          liked={liked}
          commentsCount={comments.length}
          viewCount={viewCount?.count}
          isAuthenticated={isAuthenticated}
          onLike={() => likeMutation.mutate()}
        />

        <PostCommentsSection
          comments={comments}
          isAuthenticated={isAuthenticated}
          comment={comment}
          setComment={setComment}
          onCommentSubmit={(e) => {
            e.preventDefault();
            if (comment.trim()) {
              commentMutation.mutate({ userId: user.user_id, postId: id, message: comment });
            }
          }}
          isCommentPending={commentMutation.isPending}
          replyTo={replyTo}
          setReplyTo={setReplyTo}
          replyText={replyText}
          setReplyText={setReplyText}
          onReplySubmit={(e, repliedCommentId) => {
            e.preventDefault();
            if (replyText.trim()) {
              replyMutation.mutate({
                userId: user.user_id,
                repliedCommentId,
                message: replyText,
              });
            }
          }}
          isReplyPending={replyMutation.isPending}
          canDeleteComment={canDeleteComment}
          pendingCommentDelete={pendingCommentDelete}
          setPendingCommentDelete={setPendingCommentDelete}
          onDeleteCommentConfirm={() => deleteCommentMutation.mutate(pendingCommentDelete._id)}
          isDeleteCommentPending={deleteCommentMutation.isPending}
        />
      </PageShell>

      {/* Delete Post Confirm Dialog */}
      <ConfirmDialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        title="Delete this post?"
        description={`"${post.title}" and its responses will be removed. This cannot be undone.`}
        confirmText="Delete"
        onConfirm={() => deleteMutation.mutate()}
        isLoading={deleteMutation.isPending}
      />
    </>
  );
}
