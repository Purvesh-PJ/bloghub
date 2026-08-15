import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Heart, MessageCircle, Share2, Pencil, Trash2 } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import styled from 'styled-components';
import toast from 'react-hot-toast';
import MDEditor from '@uiw/react-md-editor';
import { postService } from '../services/postService';
import { commentService } from '../services/commentService';
import { likeService } from '../services/likeService';
import { analyticsService } from '../services/analyticsService';
import { userService } from '../services/userService';
import { useAuth } from '../context/AuthContext';
import { Loading } from '../components/ui';
import { Button } from '../components/ui';

/* Reading surface. Editorial half of the design language: serif, generous, capped measure. */

const PageWrapper = styled.div`
  background: ${({ theme }) => theme.colors.surfacePage};
  min-height: calc(100vh - ${({ theme }) => theme.layout.headerHeight});
  padding-bottom: ${({ theme }) => theme.spacing['5xl']};
`;

const HeroImage = styled.figure`
  max-width: 1080px;
  margin: ${({ theme }) => theme.spacing.xl} auto 0;
  padding: 0 ${({ theme }) => theme.spacing.lg};

  img {
    width: 100%;
    /* Capped so the cover frames the piece instead of burying the headline. */
    aspect-ratio: 21 / 9;
    object-fit: cover;
    border-radius: ${({ theme }) => theme.radii.xl};
  }
`;

const Container = styled.div`
  max-width: ${({ theme }) => theme.layout.contentWidth};
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing['3xl']} ${({ theme }) => theme.spacing.lg} 0;
`;

const Category = styled(Link)`
  display: inline-block;
  font-family: ${({ theme }) => theme.fonts.ui};
  font-size: ${({ theme }) => theme.ui.xs[0]};
  font-weight: ${({ theme }) => theme.weights.semibold};
  letter-spacing: ${({ theme }) => theme.tracking.caps};
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.accentText};
  margin-bottom: ${({ theme }) => theme.spacing.lg};

  &:hover {
    color: ${({ theme }) => theme.colors.textLinkHover};
  }
`;

const Title = styled.h1`
  font-family: ${({ theme }) => theme.fonts.reading};
  font-size: ${({ theme }) => theme.display.xl[0]};
  line-height: ${({ theme }) => theme.display.xl[1]};
  font-weight: ${({ theme }) => theme.weights.bold};
  letter-spacing: ${({ theme }) => theme.tracking.tight};
  color: ${({ theme }) => theme.colors.textPrimary};
  text-wrap: balance;
  margin-bottom: ${({ theme }) => theme.spacing.xl};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: ${({ theme }) => theme.display.lg[0]};
  }
`;

const AuthorSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: ${({ theme }) => theme.spacing.xl};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const AuthorInfo = styled(Link)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const AuthorAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.radii.full};
  background: ${({ theme }) => theme.colors.accentSubtle};
  color: ${({ theme }) => theme.colors.accentText};
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: ${({ theme }) => theme.fonts.ui};
  font-size: ${({ theme }) => theme.ui.md[0]};
  font-weight: ${({ theme }) => theme.weights.semibold};
`;

const AuthorDetails = styled.div``;

const AuthorName = styled.div`
  font-family: ${({ theme }) => theme.fonts.ui};
  font-size: ${({ theme }) => theme.ui.md[0]};
  font-weight: ${({ theme }) => theme.weights.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const PostMeta = styled.div`
  font-family: ${({ theme }) => theme.fonts.ui};
  font-size: ${({ theme }) => theme.ui.base[0]};
  color: ${({ theme }) => theme.colors.textMuted};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const AuthorActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const ActionBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.textSecondary};
  background: ${({ theme }) => theme.colors.bgSecondary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    border-color: ${({ theme }) => theme.colors.accent};
    color: ${({ theme }) => theme.colors.accent};
  }

  &[data-danger='true']:hover {
    border-color: ${({ theme }) => theme.colors.error};
    color: ${({ theme }) => theme.colors.error};
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

/**
 * The article itself.
 *
 * Body copy is serif at 18px/1.75 and rendered in `textPrimary`. It was previously sans at
 * `textSecondary` — grey body text on a light ground is the single biggest reason the
 * reading experience felt washed out.
 */
const Content = styled.article`
  font-family: ${({ theme }) => theme.fonts.reading};
  font-size: ${({ theme }) => theme.reading.body[0]};
  line-height: ${({ theme }) => theme.reading.body[1]};
  color: ${({ theme }) => theme.colors.textPrimary};

  .wmde-markdown {
    background: transparent !important;
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
    color: inherit;
  }

  h1,
  h2,
  h3,
  h4,
  .wmde-markdown h1,
  .wmde-markdown h2,
  .wmde-markdown h3,
  .wmde-markdown h4 {
    font-family: ${({ theme }) => theme.fonts.reading};
    font-weight: ${({ theme }) => theme.weights.semibold};
    letter-spacing: ${({ theme }) => theme.tracking.tight};
    color: ${({ theme }) => theme.colors.textPrimary};
    margin: 1.9em 0 0.55em;
    line-height: 1.3;
    border-bottom: none;
    text-wrap: balance;
  }

  h1,
  .wmde-markdown h1 {
    font-size: ${({ theme }) => theme.display.lg[0]};
  }
  h2,
  .wmde-markdown h2 {
    font-size: ${({ theme }) => theme.display.md[0]};
  }
  h3,
  .wmde-markdown h3 {
    font-size: ${({ theme }) => theme.display.sm[0]};
  }

  p,
  .wmde-markdown p {
    margin-bottom: 1.35em;
    color: inherit;
  }

  ul,
  ol,
  .wmde-markdown ul,
  .wmde-markdown ol {
    margin-bottom: 1.35em;
    padding-left: 1.4em;
    color: inherit;
  }

  li,
  .wmde-markdown li {
    margin-bottom: 0.45em;
  }

  /* A hairline rule reads as an aside; a heavy accent bar competes with the headline. */
  blockquote,
  .wmde-markdown blockquote {
    border-left: 2px solid ${({ theme }) => theme.colors.accentLine};
    padding: 0 0 0 1.5em;
    margin: 2em 0;
    font-size: ${({ theme }) => theme.reading.lead[0]};
    font-style: italic;
    color: ${({ theme }) => theme.colors.textSecondary};
    background: transparent;
  }

  pre,
  .wmde-markdown pre {
    background: ${({ theme }) => theme.colors.surfaceSunken};
    border: 1px solid ${({ theme }) => theme.colors.lineSubtle};
    padding: 1.15em 1.25em;
    border-radius: ${({ theme }) => theme.radii.lg};
    overflow-x: auto;
    margin: 2em 0;
    font-size: ${({ theme }) => theme.ui.md[0]};
    line-height: 1.6;
  }

  code,
  .wmde-markdown code {
    font-family: ${({ theme }) => theme.fonts.mono};
    background: ${({ theme }) => theme.colors.surfaceSunken};
    border: 1px solid ${({ theme }) => theme.colors.lineSubtle};
    padding: 0.1em 0.35em;
    border-radius: ${({ theme }) => theme.radii.sm};
    font-size: 0.85em;
    color: ${({ theme }) => theme.colors.textPrimary};
  }

  .wmde-markdown pre code {
    background: transparent;
    border: none;
    padding: 0;
    color: inherit;
    font-size: inherit;
  }

  img,
  .wmde-markdown img {
    max-width: 100%;
    border-radius: ${({ theme }) => theme.radii.lg};
    margin: 2.25em 0;
  }

  a,
  .wmde-markdown a {
    color: ${({ theme }) => theme.colors.textLink};
    text-decoration: underline;
    text-underline-offset: 0.2em;
    text-decoration-thickness: 1px;
    text-decoration-color: ${({ theme }) => theme.colors.accentLine};

    &:hover {
      text-decoration-color: currentColor;
    }
  }
`;

const Engagement = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.lg} 0;
  margin-top: ${({ theme }) => theme.spacing['3xl']};
  border-top: 1px solid ${({ theme }) => theme.colors.lineSubtle};
  border-bottom: 1px solid ${({ theme }) => theme.colors.lineSubtle};
`;

/* Quiet by default — the article is the subject, not its toolbar. Colour arrives on action. */
const EngageBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.xs} 0;
  font-family: ${({ theme }) => theme.fonts.ui};
  font-size: ${({ theme }) => theme.ui.md[0]};
  font-weight: ${({ theme }) => theme.weights.medium};
  color: ${({ $active, theme }) =>
    $active ? theme.colors.dangerText : theme.colors.textSecondary};
  background: none;
  border: none;
  cursor: pointer;
  transition: color ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ $active, theme }) =>
      $active ? theme.colors.dangerText : theme.colors.textPrimary};
  }

  svg {
    width: 18px;
    height: 18px;
    fill: ${({ $active, theme }) => ($active ? theme.colors.dangerSolid : 'none')};
    stroke: ${({ $active, theme }) => ($active ? theme.colors.dangerSolid : 'currentColor')};
    transition: fill ${({ theme }) => theme.transitions.fast};
  }
`;

const ShareBtn = styled(EngageBtn)`
  margin-left: auto;
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  margin: ${({ theme }) => theme.spacing.xl} 0;
`;

/* Below the article the surface switches to the interface scale: sans, tighter, denser.
   Comments are a tool, not prose. */
const CommentsSection = styled.section`
  font-family: ${({ theme }) => theme.fonts.ui};
  margin-top: ${({ theme }) => theme.spacing['3xl']};
`;

const CommentsHeader = styled.h2`
  font-family: ${({ theme }) => theme.fonts.ui};
  font-size: ${({ theme }) => theme.display.sm[0]};
  font-weight: ${({ theme }) => theme.weights.semibold};
  letter-spacing: ${({ theme }) => theme.tracking.tight};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const CommentForm = styled.form`
  margin-bottom: ${({ theme }) => theme.spacing['2xl']};
`;

const CommentInput = styled.textarea`
  width: 100%;
  min-height: 104px;
  padding: ${({ theme }) => theme.spacing.md};
  font-family: ${({ theme }) => theme.fonts.ui};
  font-size: ${({ theme }) => theme.ui.md[0]};
  line-height: ${({ theme }) => theme.ui.md[1]};
  color: ${({ theme }) => theme.colors.textPrimary};
  background: ${({ theme }) => theme.colors.surfaceRaised};
  border: 1px solid ${({ theme }) => theme.colors.lineDefault};
  border-radius: ${({ theme }) => theme.radii.lg};
  resize: vertical;
  transition: border-color ${({ theme }) => theme.transitions.fast};

  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
  }

  &:hover {
    border-color: ${({ theme }) => theme.colors.lineStrong};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.lineFocus};
  }
`;

const CommentActions = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

const LoginPrompt = styled.p`
  padding: ${({ theme }) => theme.spacing.lg};
  text-align: center;
  color: ${({ theme }) => theme.colors.textMuted};
  background: ${({ theme }) => theme.colors.bgSecondary};
  border-radius: ${({ theme }) => theme.radii.lg};

  a {
    color: ${({ theme }) => theme.colors.accent};
    font-weight: ${({ theme }) => theme.fontWeights.medium};
  }
`;

const CommentsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const Comment = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
`;

const CommentAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: ${({ theme }) => theme.radii.full};
  background: ${({ theme }) => theme.colors.accentSubtle};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ theme }) => theme.ui.sm[0]};
  font-weight: ${({ theme }) => theme.weights.semibold};
  color: ${({ theme }) => theme.colors.accentText};
  flex-shrink: 0;
`;

const CommentBody = styled.div`
  flex: 1;
`;

const CommentMeta = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: 6px;
`;

const CommentAuthor = styled.span`
  font-size: ${({ theme }) => theme.ui.md[0]};
  font-weight: ${({ theme }) => theme.weights.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const CommentDate = styled.span`
  font-size: ${({ theme }) => theme.ui.sm[0]};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const CommentText = styled.p`
  font-size: ${({ theme }) => theme.ui.md[0]};
  line-height: ${({ theme }) => theme.ui.md[1]};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const ReplyBtn = styled.button`
  margin-top: 8px;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.textMuted};
  background: none;
  border: none;
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.colors.accent};
  }
`;

const Replies = styled.div`
  margin-top: ${({ theme }) => theme.spacing.md};
  padding-left: ${({ theme }) => theme.spacing.lg};
  border-left: 2px solid ${({ theme }) => theme.colors.border};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const NoComments = styled.p`
  text-align: center;
  color: ${({ theme }) => theme.colors.textMuted};
  padding: ${({ theme }) => theme.spacing.xl};
`;

const ErrorPage = styled.div`
  text-align: center;
  padding: 100px ${({ theme }) => theme.spacing.lg};

  h2 {
    font-size: ${({ theme }) => theme.fontSizes['2xl']};
    color: ${({ theme }) => theme.colors.textPrimary};
    margin-bottom: ${({ theme }) => theme.spacing.sm};
  }

  p {
    color: ${({ theme }) => theme.colors.textMuted};
    margin-bottom: ${({ theme }) => theme.spacing.lg};
  }
`;

export function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isAuthenticated, user } = useAuth();
  const [comment, setComment] = useState('');
  const [liked, setLiked] = useState(false);
  const [replyTo, setReplyTo] = useState(null);
  const [replyText, setReplyText] = useState('');

  const { data, isLoading, error } = useQuery({
    queryKey: ['post', id],
    queryFn: () => postService.getPost(id),
  });

  useEffect(() => {
    if (id) analyticsService.trackPageView(id).catch(() => {});
  }, [id]);

  useEffect(() => {
    if (data?.data?.likes && user?.user_id) {
      // likes are populated with their user reference; fall back to a bare id in case the
      // payload is not populated.
      setLiked(
        data.data.likes.some((like) => {
          const likeUserId = like?.user ?? like;
          return String(likeUserId) === String(user.user_id);
        })
      );
    }
  }, [data, user]);

  const deleteMutation = useMutation({
    mutationFn: () => postService.deletePost(id),
    onSuccess: () => {
      toast.success('Deleted');
      navigate('/');
    },
  });

  const commentMutation = useMutation({
    mutationFn: (d) => commentService.createComment(d),
    onSuccess: () => {
      setComment('');
      queryClient.invalidateQueries(['post', id]);
    },
  });

  const replyMutation = useMutation({
    mutationFn: ({ userId, repliedCommentId, message }) =>
      commentService.replyToComment(userId, repliedCommentId, message),
    onSuccess: () => {
      setReplyTo(null);
      setReplyText('');
      queryClient.invalidateQueries(['post', id]);
    },
  });

  const likeMutation = useMutation({
    mutationFn: () => (liked ? likeService.unlikePost(id) : likeService.likePost(id)),
    onSuccess: () => {
      setLiked(!liked);
      queryClient.invalidateQueries(['post', id]);
    },
  });

  if (isLoading) return <Loading text="Loading..." />;

  if (error || !data?.success) {
    return (
      <PageWrapper>
        <ErrorPage>
          <h2>Post not found</h2>
          <p>The post you're looking for doesn't exist or has been removed.</p>
          <Button as={Link} to="/">
            Back to Home
          </Button>
        </ErrorPage>
      </PageWrapper>
    );
  }

  const post = data.data;
  const isAuthor = user?.user_id === post.user?._id;
  const category = post.categories?.[0];

  return (
    <PageWrapper>
      {post.imageURL && (
        <HeroImage>
          <img src={post.imageURL} alt={post.title} />
        </HeroImage>
      )}

      <Container>
        {category && <Category to={`/?category=${category.name}`}>{category.name}</Category>}

        <Title>{post.title}</Title>

        <AuthorSection>
          <AuthorInfo to={post.user?._id ? `/user/${post.user._id}` : '#'}>
            <AuthorAvatar>{post.user?.username?.[0]?.toUpperCase() || 'U'}</AuthorAvatar>
            <AuthorDetails>
              <AuthorName>{post.user?.username || 'Anonymous'}</AuthorName>
              <PostMeta>
                <span>{format(new Date(post.createdAt), 'MMM d, yyyy')}</span>
              </PostMeta>
            </AuthorDetails>
          </AuthorInfo>

          {isAuthor && (
            <AuthorActions>
              <ActionBtn as={Link} to={`/edit/${post._id}`}>
                <Pencil /> Edit
              </ActionBtn>
              <ActionBtn
                data-danger="true"
                onClick={() => window.confirm('Delete this post?') && deleteMutation.mutate()}
              >
                <Trash2 /> Delete
              </ActionBtn>
            </AuthorActions>
          )}
        </AuthorSection>

        <Content data-color-mode="light">
          {post.content?.startsWith('<') ? (
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          ) : (
            <MDEditor.Markdown source={post.content} />
          )}
        </Content>

        <Engagement>
          <EngageBtn
            $active={liked}
            onClick={() =>
              isAuthenticated ? likeMutation.mutate() : toast.error('Please sign in')
            }
          >
            <Heart /> {post.likes?.length || 0} Likes
          </EngageBtn>
          <EngageBtn as="a" href="#comments">
            <MessageCircle /> {post.comments?.length || 0} Comments
          </EngageBtn>
          <ShareBtn
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              toast.success('Link copied!');
            }}
          >
            <Share2 /> Share
          </ShareBtn>
        </Engagement>

        <Divider />

        <CommentsSection id="comments">
          <CommentsHeader>Comments ({post.comments?.length || 0})</CommentsHeader>

          {isAuthenticated ? (
            <CommentForm
              onSubmit={(e) => {
                e.preventDefault();
                comment.trim() &&
                  commentMutation.mutate({ userId: user.user_id, postId: id, message: comment });
              }}
            >
              <CommentInput
                placeholder="Share your thoughts..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <CommentActions>
                <Button
                  type="submit"
                  isLoading={commentMutation.isPending}
                  disabled={!comment.trim()}
                >
                  Post Comment
                </Button>
              </CommentActions>
            </CommentForm>
          ) : (
            <LoginPrompt>
              <Link to="/login">Sign in</Link> to join the conversation
            </LoginPrompt>
          )}

          {post.comments?.length === 0 ? (
            <NoComments>No comments yet. Start the conversation!</NoComments>
          ) : (
            <CommentsList>
              {post.comments?.map((c) => (
                <Comment key={c._id}>
                  <CommentAvatar>{c.user?.username?.[0]?.toUpperCase() || 'U'}</CommentAvatar>
                  <CommentBody>
                    <CommentMeta>
                      <CommentAuthor>{c.user?.username || 'Anonymous'}</CommentAuthor>
                      <CommentDate>
                        {formatDistanceToNow(new Date(c.date), { addSuffix: true })}
                      </CommentDate>
                    </CommentMeta>
                    <CommentText>{c.message}</CommentText>

                    {isAuthenticated && (
                      <ReplyBtn onClick={() => setReplyTo(replyTo === c._id ? null : c._id)}>
                        Reply
                      </ReplyBtn>
                    )}

                    {replyTo === c._id && (
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          replyText.trim() &&
                            replyMutation.mutate({
                              userId: user.user_id,
                              repliedCommentId: c._id,
                              message: replyText,
                            });
                        }}
                        style={{ marginTop: 12 }}
                      >
                        <CommentInput
                          placeholder="Write a reply..."
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          style={{ minHeight: 80 }}
                        />
                        <CommentActions>
                          <Button type="submit" disabled={!replyText.trim()}>
                            Reply
                          </Button>
                        </CommentActions>
                      </form>
                    )}

                    {c.replies?.length > 0 && (
                      <Replies>
                        {c.replies.map((r) => (
                          <Comment key={r._id}>
                            <CommentAvatar>
                              {r.user?.username?.[0]?.toUpperCase() || 'U'}
                            </CommentAvatar>
                            <CommentBody>
                              <CommentMeta>
                                <CommentAuthor>{r.user?.username || 'Anonymous'}</CommentAuthor>
                                <CommentDate>
                                  {formatDistanceToNow(new Date(r.date), { addSuffix: true })}
                                </CommentDate>
                              </CommentMeta>
                              <CommentText>{r.message}</CommentText>
                            </CommentBody>
                          </Comment>
                        ))}
                      </Replies>
                    )}
                  </CommentBody>
                </Comment>
              ))}
            </CommentsList>
          )}
        </CommentsSection>
      </Container>
    </PageWrapper>
  );
}
