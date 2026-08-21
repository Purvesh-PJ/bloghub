import { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import styled from 'styled-components';
/*
  The preview package, not the editor.

  `@uiw/react-md-editor` re-exports this component as `MDEditor.Markdown`, so importing the
  editor to render a post pulled its toolbar, its command set, its textarea and the syntax
  highlighting they need into the same chunk — 1.1 MB that every reader downloaded to look at
  an article they cannot edit. Reading and writing now load separately; the editor stays on
  the pages that actually edit.
*/
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
import { display, text, media, interactive } from '../styles/theme/mixins';
import { readingTime } from '../utils/text';
import { queryKeys } from '../services/queryKeys';

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

const TagList = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;
  padding: ${({ theme }) => theme.spacing.lg} 0 ${({ theme }) => theme.spacing.md};
`;

const TagLink = styled(Link)`
  ${text('sm', 'semibold')}
  color: ${({ theme }) => theme.colors.accentText};
  text-decoration: none;
  transition: all ${({ theme }) => theme.transitions.fast};
  ${interactive}

  &:hover {
    color: ${({ theme }) => theme.colors.accentSolidHover};
    text-decoration: underline;
    text-underline-offset: 4px;
  }
`;

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
/* Reply and Delete sit on one line beneath a response rather than stacking two controls. */
const CommentActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const DeleteResponse = styled(ReplyToggle)`
  &:hover {
    color: ${({ theme }) => theme.colors.dangerText ?? theme.colors.accentText};
  }
`;

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

  // A view is one per page load. Guarded so React's development double-invoke does not
  // record two.
  const viewed = useRef(null);
  useEffect(() => {
    if (!id || viewed.current === id) return;
    viewed.current = id;
    analyticsService.trackPageView(id).catch(() => {});
  }, [id]);

  /*
    Whether this reader has already liked the story.

    Derived from the post rather than copied into state by an effect. The effect this replaces
    only assigned when both `post.likes` and a signed-in user were present, so the flag kept
    its previous value when either went away — signing out left the heart filled, and it
    survived navigating to a different story until the new post's likes arrived.

    `likedOverride` carries the optimistic flip so the heart responds to the click rather than
    to the refetch that follows it, and is dropped as soon as the server's answer changes.
  */
  const likedByServer = Boolean(
    user?.user_id &&
    // Likes are populated with their user reference; fall back to a bare id in case the
    // payload is not populated.
    post?.likes?.some((like) => String(like?.user ?? like) === String(user.user_id))
  );

  if (syncedLike !== likedByServer) {
    setSyncedLike(likedByServer);
    setLikedOverride(null);
  }

  const liked = likedOverride ?? likedByServer;

  const isAuthor = user?.user_id === post?.user?._id;

  /* The author sees how their own piece is doing, in the same shape the dashboard uses. */
  const { data: analytics } = useQuery({
    queryKey: queryKeys.analytics.forPost(id),
    /*
      One post's figures.

      This used to call getUserAnalytics and search the result for this post — every story the
      author has ever written, fetched and discarded, to display one row of it. The per-post
      endpoint answers the actual question, and is restricted to the author and administrators
      for the same reason this query is only enabled for the author.
    */
    queryFn: () => analyticsService.getPostAnalytics(id),
    enabled: Boolean(isAuthor && id),
    retry: false,
  });

  const postStats = analytics?.data;

  /*
    The public view count.

    `GET /page-views/post/:id/count` is the one figure here that is not the author's private
    business, and nothing displayed it — the action bar showed likes and responses beside a
    story whose reach was invisible to everybody, the author included until they opened the
    dashboard.
  */
  const { data: viewCount } = useQuery({
    queryKey: queryKeys.analytics.viewsForPost(id),
    queryFn: () => analyticsService.getPageViewCount(id),
    enabled: Boolean(id),
    retry: false,
  });

  /*
    Syntax highlighting, fetched only when the post has code in it.

    See config/markdown.js: the highlighted renderer is 350 kB gzipped because it registers
    every Prism language, and most posts have no code. The article renders immediately without
    it; when there is a fenced block the plugin arrives a moment later and the code is
    recoloured in place.
  */
  const [highlightPlugin, setHighlightPlugin] = useState(null);
  const needsHighlighting = hasCodeBlock(post?.content);

  useEffect(() => {
    if (!needsHighlighting || highlightPlugin) return undefined;

    let cancelled = false;
    loadSyntaxHighlighting().then((plugin) => {
      // Stored behind a function so React does not call the plugin as a state updater.
      if (!cancelled && plugin) setHighlightPlugin(() => plugin);
    });

    return () => {
      cancelled = true;
    };
  }, [needsHighlighting, highlightPlugin]);

  // Sanitisation runs last, so nothing the highlighter adds can widen what reaches the DOM.
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

  /*
    Removing a response.

    The API has always allowed the comment's author, the author of the post it sits on, and
    administrators to delete one — and the reader had no control for it anywhere, so a writer
    could be commented on and had no way to moderate their own thread from the story itself.
  */
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
    // Flip immediately, then let the refetched post confirm it.
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

  const comments = post.comments || [];

  return (
    <>
      <Progress aria-hidden="true">
        <ProgressFill $percent={progress} />
      </Progress>

      <PageShell $width="reading">
        {post.imageURL && (
          <Cover>
            {/*
              The cover is the page's largest contentful paint. `lazy` here would be actively
              wrong — it is above the fold — so it is marked high priority instead, and decoded
              off the main thread so a large image cannot block the article rendering.
            */}
            <img
              src={post.imageURL}
              alt={`Cover image for ${post.title}`}
              fetchPriority="high"
              decoding="async"
            />
          </Cover>
        )}

        <Title>{post.title}</Title>

        <Byline>
          <Author to={post.user?._id ? `/user/${post.user._id}` : '#'}>
            <AuthorByline
              layout="stacked"
              name={post.author?.name || post.user?.username}
              at={post.createdAt}
              dateStyle="absolute"
              readingMinutes={readingTime(post.content)}
            />
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
            <Markdown source={post.content} rehypePlugins={rehypePlugins} />
          </div>
        </Article>

        {post.tags && post.tags.length > 0 && (
          <TagList>
            {post.tags.map((tag) => {
              const rawName = typeof tag === 'string' ? tag : tag?.name;
              if (!rawName) return null;
              const name = String(rawName)
                .trim()
                .toLowerCase()
                .replace(/^[#_-]+/, '');
              return (
                <TagLink key={name} to={`/search?topic=${encodeURIComponent(name)}`}>
                  #{name}
                </TagLink>
              );
            })}
          </TagList>
        )}

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
          {typeof viewCount?.count === 'number' && viewCount.count > 0 && (
            <Action
              as="span"
              aria-label={`${viewCount.count} ${viewCount.count === 1 ? 'reader has' : 'readers have'} opened this`}
            >
              <Eye aria-hidden="true" /> {viewCount.count}
            </Action>
          )}
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

                    <CommentActions>
                      {isAuthenticated && (
                        <ReplyToggle
                          onClick={() => setReplyTo(replyTo === entry._id ? null : entry._id)}
                        >
                          {replyTo === entry._id ? 'Cancel' : 'Reply'}
                        </ReplyToggle>
                      )}

                      {canDeleteComment(entry) && (
                        <DeleteResponse
                          onClick={() => setPendingCommentDelete(entry)}
                          aria-label={`Delete the response from ${entry.user?.username || 'this reader'}`}
                        >
                          Delete
                        </DeleteResponse>
                      )}
                    </CommentActions>

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
                                  {/* Guarded like the parent above: an undefined or malformed
                                      date rendered the literal string "Invalid Date". */}
                                  {(() => {
                                    const d = reply.date ? new Date(reply.date) : null;
                                    return d && !isNaN(d.getTime())
                                      ? formatDistanceToNow(d, { addSuffix: true })
                                      : 'recently';
                                  })()}
                                </CommentWhen>
                              </CommentHead>
                              <CommentText>{reply.message}</CommentText>

                              {canDeleteComment(reply) && (
                                <CommentActions>
                                  <DeleteResponse
                                    onClick={() => setPendingCommentDelete(reply)}
                                    aria-label={`Delete the reply from ${reply.user?.username || 'this reader'}`}
                                  >
                                    Delete
                                  </DeleteResponse>
                                </CommentActions>
                              )}
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
