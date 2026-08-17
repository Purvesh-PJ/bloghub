import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import styled from 'styled-components';
import MDEditor from '@uiw/react-md-editor';
import { format, formatDistanceToNow } from 'date-fns';
import { Heart, MessageCircle, Share2, Pencil, Trash2, FileQuestion, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

import { postService } from '../services/postService';
import { commentService } from '../services/commentService';
import { likeService } from '../services/likeService';
import { analyticsService } from '../services/analyticsService';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../styles/ThemeProvider';
import { useReadTracking, useReadingProgress } from '../hooks/useReading';
import { markdownRehypePlugins } from '../config/markdown';
import { PageShell } from '../components/layout/PageShell';
import { ReadRateBar } from '../components/stats/ReadRateBar';
import { Button, Card, TextArea, Chip, Modal, EmptyState, Avatar } from '../components/ui';
import { PostDetailSkeleton } from '../components/posts/PostDetailSkeleton';
import { display, text, media, interactive } from '../styles/theme/mixins';
import { readingTime } from '../utils/text';

/**
 * The article page.
 *
 * Two things were wrong beyond the styling. The markdown body was rendered with
 * `data-color-mode="light"` hard-coded, so in dark mode the article kept a white background
 * while the page around it went dark. And the reader's progress was never reported: the
 * service had trackPostRead and nothing anywhere called it, so no Read document was ever
 * created by the running application and read-through rate would have stayed at 0% in
 * production regardless of how many people finished a piece.
 */

/* ── Progress ────────────────────────────────────────────────────────────────
   A reading platform that measures how far people get should show the reader the
   same thing. Sits under the header, which is 64px tall and sticky. */

const Progress = styled.div`
  position: fixed;
  top: ${({ theme }) => theme.layout.headerHeight};
  left: 0;
  right: 0;
  height: 2px;
  z-index: ${({ theme }) => theme.zIndices.sticky};
  background: transparent;
  pointer-events: none;
`;

const ProgressFill = styled.div`
  height: 100%;
  width: ${({ $percent }) => $percent}%;
  background: ${({ theme }) => theme.colors.accentSolid};
  transition: width 80ms linear;
`;

/* ── Header ──────────────────────────────────────────────────────────────── */

const Cover = styled.div`
  width: 100%;
  aspect-ratio: 21 / 9;
  border-radius: ${({ theme }) => theme.radii['2xl']};
  overflow: hidden;
  background: ${({ theme }) => theme.colors.surfaceContainer};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  ${media.down('sm')`aspect-ratio: 16 / 9;`}
`;

const Title = styled.h1`
  ${display('md')}
  color: ${({ theme }) => theme.colors.textPrimary};

  ${media.down('sm')`font-size: ${({ theme }) => theme.display.sm[0]};`}
`;

const Byline = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.lg};
  flex-wrap: wrap;
  padding-bottom: ${({ theme }) => theme.spacing.xl};
  border-bottom: 1px solid ${({ theme }) => theme.colors.lineSubtle};
`;

const Author = styled(Link)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const AuthorName = styled.span`
  ${text('md', 'bold')}
  color: ${({ theme }) => theme.colors.textPrimary};
  display: block;
`;

const Meta = styled.span`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  ${text('xs')}
  color: ${({ theme }) => theme.colors.textMuted};

  svg {
    width: 12px;
    height: 12px;
  }
`;

const OwnerActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`;

/* ── Body ────────────────────────────────────────────────────────────────── */

const Article = styled.article`
  /* Clean Tailwind prose styling */
  .wmde-markdown {
    background: transparent;
    color: ${({ theme }) => theme.colors.textPrimary};
    font-family: ${({ theme }) => theme.fonts.reading};
    font-size: 1.125rem;
    line-height: 1.8;
  }

  .wmde-markdown > * + * {
    margin-top: 1.5em;
  }

  .wmde-markdown h1,
  .wmde-markdown h2,
  .wmde-markdown h3,
  .wmde-markdown h4 {
    color: ${({ theme }) => theme.colors.textPrimary};
    border-bottom: none;
    margin-top: ${({ theme }) => theme.spacing['2xl']};
    margin-bottom: ${({ theme }) => theme.spacing.md};
    letter-spacing: ${({ theme }) => theme.tracking.tight};
    font-weight: 700;
  }

  .wmde-markdown p,
  .wmde-markdown li {
    color: ${({ theme }) => theme.colors.textSecondary};
  }

  .wmde-markdown a {
    color: ${({ theme }) => theme.colors.accentText};
  }

  .wmde-markdown blockquote {
    border-left: 3px solid ${({ theme }) => theme.colors.accentLine};
    background: ${({ theme }) => theme.colors.surfaceContainerLow};
    border-radius: ${({ theme }) => theme.radii.sm};
    padding: ${({ theme }) => theme.spacing.lg};
    color: ${({ theme }) => theme.colors.textSecondary};
  }

  .wmde-markdown pre,
  .wmde-markdown code {
    background: ${({ theme }) => theme.colors.surfaceContainer};
    border-radius: ${({ theme }) => theme.radii.sm};
  }

  .wmde-markdown img {
    border-radius: ${({ theme }) => theme.radii.lg};
    max-width: 100%;
  }

  .wmde-markdown table {
    display: block;
    overflow-x: auto;
  }
`;

/* ── Engagement ──────────────────────────────────────────────────────────── */

const Bar = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-wrap: wrap;
  padding: ${({ theme }) => theme.spacing.xl} 0;
  border-top: 1px solid ${({ theme }) => theme.colors.lineSubtle};
  border-bottom: 1px solid ${({ theme }) => theme.colors.lineSubtle};
`;

const Action = styled.button`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  height: 40px;
  padding: 0 ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.radii.full};
  ${text('sm', 'medium')}
  ${interactive}

  background: ${({ theme, $active }) =>
    $active ? theme.colors.dangerContainer : theme.colors.surfaceContainer};
  color: ${({ theme, $active }) =>
    $active ? theme.colors.dangerText : theme.colors.textSecondary};

  &:hover {
    background: ${({ theme, $active }) =>
      $active ? theme.colors.dangerContainerHover : theme.colors.surfaceContainerHigh};
    color: ${({ theme, $active }) =>
      $active ? theme.colors.dangerText : theme.colors.textPrimary};
  }

  svg {
    width: 16px;
    height: 16px;
    fill: ${({ $active }) => ($active ? 'currentColor' : 'none')};
  }
`;

/* ── Comments ────────────────────────────────────────────────────────────── */

const Comments = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};
`;

const CommentsTitle = styled.h2`
  ${display('xs')}
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const Thread = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};
`;

const CommentRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
`;

const CommentBody = styled.div`
  flex: 1;
  min-width: 0;
`;

const CommentHead = styled.div`
  display: flex;
  align-items: baseline;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-wrap: wrap;
`;

const CommentAuthor = styled.span`
  ${text('sm', 'semibold')}
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const CommentWhen = styled.span`
  ${text('xs')}
  color: ${({ theme }) => theme.colors.textMuted};
`;

const CommentText = styled.p`
  ${text('md')}
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-top: ${({ theme }) => theme.spacing.xs};
  white-space: pre-wrap;
`;

const ReplyToggle = styled.button`
  ${text('xs', 'medium')}
  color: ${({ theme }) => theme.colors.textMuted};
  margin-top: ${({ theme }) => theme.spacing.sm};

  &:hover {
    color: ${({ theme }) => theme.colors.accentText};
  }
`;

/* Nesting drawn with a rule rather than indentation alone, so a deep thread stays readable. */
const Replies = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  margin-top: ${({ theme }) => theme.spacing.lg};
  padding-left: ${({ theme }) => theme.spacing.lg};
  border-left: 2px solid ${({ theme }) => theme.colors.lineSubtle};
`;

const Composer = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: flex-end;

  > * {
    width: 100%;
  }

  button {
    width: auto;
  }
`;

export function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isAuthenticated, user } = useAuth();
  const { mode } = useTheme();

  const [comment, setComment] = useState('');
  const [liked, setLiked] = useState(false);
  const [replyTo, setReplyTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);

  const articleRef = useRef(null);
  const progress = useReadingProgress(articleRef);

  const { data, isLoading, error } = useQuery({
    queryKey: ['post', id],
    queryFn: () => postService.getPost(id),
    enabled: Boolean(id),
    retry: false,
  });

  const post = data?.data;
  useReadTracking(post?._id, post?.content, articleRef);

  // A view is one per page load. Guarded so React's development double-invoke does not
  // record two.
  const viewed = useRef(null);
  useEffect(() => {
    if (!id || viewed.current === id) return;
    viewed.current = id;
    analyticsService.trackPageView(id).catch(() => {});
  }, [id]);

  useEffect(() => {
    if (post?.likes && user?.user_id) {
      // Likes are populated with their user reference; fall back to a bare id in case the
      // payload is not populated.
      setLiked(post.likes.some((like) => String(like?.user ?? like) === String(user.user_id)));
    }
  }, [post, user]);

  const isAuthor = user?.user_id === post?.user?._id;

  /* The author sees how their own piece is doing, in the same shape the dashboard uses. */
  const { data: analytics } = useQuery({
    queryKey: ['userAnalytics', user?.user_id],
    queryFn: () => analyticsService.getUserAnalytics(user?.user_id),
    enabled: Boolean(isAuthor && user?.user_id),
    retry: false,
  });

  const postStats = analytics?.postsAnalytics?.find(
    (entry) => String(entry.postId) === String(post?._id)
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
      queryClient.invalidateQueries({ queryKey: ['post', id] });
    },
    onError: () => toast.error('Could not post that comment'),
  });

  const replyMutation = useMutation({
    mutationFn: ({ userId, repliedCommentId, message }) =>
      commentService.replyToComment(userId, repliedCommentId, message),
    onSuccess: () => {
      setReplyTo(null);
      setReplyText('');
      queryClient.invalidateQueries({ queryKey: ['post', id] });
    },
    onError: () => toast.error('Could not post that reply'),
  });

  const likeMutation = useMutation({
    mutationFn: () => (liked ? likeService.unlikePost(id) : likeService.likePost(id)),
    onSuccess: () => {
      setLiked((current) => !current);
      queryClient.invalidateQueries({ queryKey: ['post', id] });
    },
    onError: () => toast.error('Could not register that'),
  });

  if (isLoading) return <PostDetailSkeleton />;

  if (error || !data?.success || !post) {
    return (
      <PageShell $width="reading">
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

  const category = post.categories?.[0];
  const comments = post.comments || [];

  return (
    <>
      <Progress aria-hidden="true">
        <ProgressFill $percent={progress} />
      </Progress>

      <PageShell $width="reading">
        {post.imageURL && (
          <Cover>
            <img src={post.imageURL} alt={`Cover image for ${post.title}`} />
          </Cover>
        )}

        {category && (
          <div>
            <Chip size="sm" onClick={() => navigate('/search')}>
              {category.name ?? category}
            </Chip>
          </div>
        )}

        <Title>{post.title}</Title>

        <Byline>
          <Author to={post.user?._id ? `/user/${post.user._id}` : '#'}>
            <Avatar name={post.author?.name || post.user?.username} size="md" />
            <span>
              <AuthorName>{post.author?.name || post.user?.username || 'Anonymous'}</AuthorName>
              <Meta>
                {post.createdAt ? format(new Date(post.createdAt), 'd MMM yyyy') : 'Recent'}
                <Clock />
                {readingTime(post.content)} min read
              </Meta>
            </span>
          </Author>

          {isAuthor && (
            <OwnerActions>
              <Button as={Link} to={`/edit/${post._id}`} variant="secondary" size="sm">
                <Pencil /> Edit
              </Button>
              <Button variant="dangerTonal" size="sm" onClick={() => setConfirmDelete(true)}>
                <Trash2 /> Delete
              </Button>
            </OwnerActions>
          )}
        </Byline>

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

        <Article ref={articleRef}>
          <div data-color-mode={mode}>
            {/*
              One rendering path, always sanitised. Content that begins with a tag used to
              bypass Markdown entirely via dangerouslySetInnerHTML; the renderer handles
              inline HTML on its own, so the special case bought nothing and cost us an
              unsanitised sink.
            */}
            <MDEditor.Markdown source={post.content} rehypePlugins={markdownRehypePlugins} />
          </div>
        </Article>

        {/*
          Each control pairs an icon with a bare number, which a screen reader would otherwise
          announce as "button, 12". The visible count stays as it is; the label supplies the
          noun, and aria-pressed reports the like state rather than leaving it to the colour.
        */}
        <Bar>
          <Action
            $active={liked}
            aria-pressed={liked}
            aria-label={liked ? 'Unlike this post' : 'Like this post'}
            onClick={() => {
              isAuthenticated ? likeMutation.mutate() : toast.error('Sign in to like this');
            }}
          >
            <Heart aria-hidden="true" /> {post.likes?.length || 0}
          </Action>
          <Action as="a" href="#comments" aria-label={`Jump to ${comments.length} responses`}>
            <MessageCircle aria-hidden="true" /> {comments.length}
          </Action>
          <Action
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              toast.success('Link copied to clipboard!');
            }}
          >
            <Share2 aria-hidden="true" /> Share
          </Action>
        </Bar>

        <Comments id="comments">
          <CommentsTitle>
            {comments.length} {comments.length === 1 ? 'response' : 'responses'}
          </CommentsTitle>

          {isAuthenticated ? (
            <Composer
              onSubmit={(event) => {
                event.preventDefault();
                if (comment.trim()) {
                  commentMutation.mutate({ userId: user.user_id, postId: id, message: comment });
                }
              }}
            >
              <TextArea
                placeholder="What did you make of it?"
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                rows={3}
                aria-label="Write a response"
              />
              <Button
                type="submit"
                isLoading={commentMutation.isPending}
                disabled={!comment.trim()}
              >
                Respond
              </Button>
            </Composer>
          ) : (
            <Card tone="low" radius="lg" padding="lg">
              <CommentText style={{ margin: 0 }}>
                <Link to="/login">Sign in</Link> to join the conversation.
              </CommentText>
            </Card>
          )}

          {comments.length === 0 ? (
            <EmptyState icon={MessageCircle} title="No responses yet" tone="low">
              Be the first to say something.
            </EmptyState>
          ) : (
            <Thread>
              {comments.map((entry) => (
                <CommentRow key={entry._id}>
                  <Avatar name={entry.user?.username} size="sm" />
                  <CommentBody>
                    <CommentHead>
                      <CommentAuthor>{entry.user?.username || 'Anonymous'}</CommentAuthor>
                      <CommentWhen>
                        {(() => {
                          const d = entry.date ? new Date(entry.date) : null;
                          return d && !isNaN(d.getTime())
                            ? formatDistanceToNow(d, { addSuffix: true })
                            : 'recently';
                        })()}
                      </CommentWhen>
                    </CommentHead>
                    <CommentText>{entry.message}</CommentText>

                    {isAuthenticated && (
                      <ReplyToggle
                        onClick={() => setReplyTo(replyTo === entry._id ? null : entry._id)}
                      >
                        {replyTo === entry._id ? 'Cancel' : 'Reply'}
                      </ReplyToggle>
                    )}

                    {replyTo === entry._id && (
                      <Composer
                        style={{ marginTop: 12 }}
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
                      >
                        <TextArea
                          placeholder={`Reply to ${entry.user?.username || 'this'}`}
                          value={replyText}
                          onChange={(event) => setReplyText(event.target.value)}
                          rows={2}
                          aria-label="Write a reply"
                          autoFocus
                        />
                        <Button
                          type="submit"
                          size="sm"
                          disabled={!replyText.trim()}
                          isLoading={replyMutation.isPending}
                        >
                          Reply
                        </Button>
                      </Composer>
                    )}

                    {entry.replies?.length > 0 && (
                      <Replies>
                        {entry.replies.map((reply) => (
                          <CommentRow key={reply._id}>
                            <Avatar name={reply.user?.username} size="sm" />
                            <CommentBody>
                              <CommentHead>
                                <CommentAuthor>{reply.user?.username || 'Anonymous'}</CommentAuthor>
                                <CommentWhen>
                                  {formatDistanceToNow(new Date(reply.date), { addSuffix: true })}
                                </CommentWhen>
                              </CommentHead>
                              <CommentText>{reply.message}</CommentText>
                            </CommentBody>
                          </CommentRow>
                        ))}
                      </Replies>
                    )}
                  </CommentBody>
                </CommentRow>
              ))}
            </Thread>
          )}
        </Comments>
      </PageShell>

      <Modal
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        title="Delete this post?"
        description={`"${post.title}" and its responses will be removed. This cannot be undone.`}
      >
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
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
        </div>
      </Modal>
    </>
  );
}
