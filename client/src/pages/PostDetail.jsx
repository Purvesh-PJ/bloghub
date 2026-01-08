import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Heart, MessageCircle, Share2, Pencil, Trash2 } from 'lucide-react';
import { Avatar } from '../components/common/Avatar';
import { formatDistanceToNow, format } from 'date-fns';
import styled from 'styled-components';
import toast from 'react-hot-toast';
import { postService } from '../services/postService';
import { commentService } from '../services/commentService';
import { likeService } from '../services/likeService';
import { analyticsService } from '../services/analyticsService';
import { useAuthStore } from '../store/authStore';
import { Loading } from '../components/common/Loading';

const Container = styled.div`
  max-width: 720px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.md};
`;

const BadgeContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
  flex-wrap: wrap;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const Badge = styled.span`
  display: inline-flex;
  padding: 2px ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.textSecondary};
  background: ${({ theme }) => theme.colors.bgTertiary};
  border-radius: ${({ theme }) => theme.radii.sm};
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['5xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  line-height: 1.3;
  margin-bottom: ${({ theme }) => theme.spacing.lg};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: ${({ theme }) => theme.fontSizes['3xl']};
  }
`;

const MetaRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const AuthorInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const AuthorDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const AuthorName = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.base};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const PostDate = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const ActionButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.textSecondary};
  background: ${({ theme }) => theme.colors.bgTertiary};
  border: none;
  border-radius: ${({ theme }) => theme.radii.md};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  text-decoration: none;

  &:hover {
    background: ${({ theme }) => theme.colors.bgHover};
    color: ${({ theme }) => theme.colors.textPrimary};
  }

  &[data-danger='true']:hover {
    background: ${({ theme }) => theme.colors.errorBg};
    color: ${({ theme }) => theme.colors.error};
  }
`;

const CoverImage = styled.div`
  border-radius: ${({ theme }) => theme.radii.lg};
  overflow: hidden;
  margin-bottom: ${({ theme }) => theme.spacing.xl};

  img {
    width: 100%;
    max-height: 400px;
    object-fit: cover;
  }
`;

const Content = styled.div`
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  line-height: ${({ theme }) => theme.lineHeights.loose};
  color: ${({ theme }) => theme.colors.textPrimary};

  h1,
  h2,
  h3 {
    font-weight: ${({ theme }) => theme.fontWeights.semibold};
    margin-top: 1.5em;
    margin-bottom: 0.5em;
    color: ${({ theme }) => theme.colors.textPrimary};
  }

  h1 {
    font-size: 1.75rem;
  }
  h2 {
    font-size: 1.375rem;
  }
  h3 {
    font-size: 1.125rem;
  }

  p {
    margin-bottom: 1em;
    color: ${({ theme }) => theme.colors.textSecondary};
  }

  ul,
  ol {
    margin-bottom: 1em;
    padding-left: 1.5em;
  }

  blockquote {
    border-left: 3px solid ${({ theme }) => theme.colors.border};
    padding-left: 1em;
    margin: 1em 0;
    color: ${({ theme }) => theme.colors.textSecondary};
  }

  pre {
    background: ${({ theme }) => theme.colors.codeBg};
    border: 1px solid ${({ theme }) => theme.colors.codeBorder};
    padding: 1em;
    border-radius: ${({ theme }) => theme.radii.md};
    overflow-x: auto;
    margin: 1em 0;
    font-size: ${({ theme }) => theme.fontSizes.base};
  }

  code {
    background: ${({ theme }) => theme.colors.codeBg};
    padding: 0.2em 0.4em;
    border-radius: ${({ theme }) => theme.radii.sm};
    font-size: ${({ theme }) => theme.fontSizes.base};
  }

  img {
    max-width: 100%;
    border-radius: ${({ theme }) => theme.radii.md};
    margin: 1em 0;
  }
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  margin: ${({ theme }) => theme.spacing.xl} 0;
`;

const EngagementBar = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: center;
`;

const EngagementButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme, $active }) => ($active ? theme.colors.error : theme.colors.textMuted)};
  background: transparent;
  border: none;
  border-radius: ${({ theme }) => theme.radii.md};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.bgHover};
  }

  svg {
    fill: ${({ $active }) => ($active ? 'currentColor' : 'none')};
  }
`;

const CommentsSection = styled.div`
  margin-top: ${({ theme }) => theme.spacing.xl};
`;

const SectionTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const Card = styled.div`
  background: ${({ theme }) => theme.colors.cardBg};
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 80px;
  padding: ${({ theme }) => theme.spacing.sm};
  background: ${({ theme }) => theme.colors.inputBg};
  border: 1px solid ${({ theme }) => theme.colors.inputBorder};
  border-radius: ${({ theme }) => theme.radii.md};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: ${({ theme }) => theme.fontSizes.base};
  color: ${({ theme }) => theme.colors.textPrimary};
  resize: vertical;
  transition: all ${({ theme }) => theme.transitions.fast};

  &::placeholder {
    color: ${({ theme }) => theme.colors.inputPlaceholder};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.inputBorderFocus};
    box-shadow: ${({ theme }) => theme.shadows.focus};
  }
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

const Button = styled.button`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  border-radius: ${({ theme }) => theme.radii.md};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  border: none;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const PrimaryButton = styled(Button)`
  background: ${({ theme }) => theme.colors.buttonPrimaryBg};
  color: ${({ theme }) => theme.colors.buttonPrimaryText};

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.buttonPrimaryHover};
  }
`;

const GhostButton = styled(Button)`
  background: transparent;
  color: ${({ theme }) => theme.colors.textSecondary};

  &:hover {
    background: ${({ theme }) => theme.colors.bgHover};
  }
`;

const SignInPrompt = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.fontSizes.base};
  color: ${({ theme }) => theme.colors.textMuted};

  a {
    color: ${({ theme }) => theme.colors.textLink};
    font-weight: ${({ theme }) => theme.fontWeights.medium};
  }
`;

const CommentItem = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const CommentContent = styled.div`
  flex: 1;
`;

const CommentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const CommentAuthor = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.base};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const CommentTime = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const CommentText = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.base};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.5;
`;

const ReplyButton = styled.button`
  padding: ${({ theme }) => theme.spacing.xs} 0;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textMuted};
  background: transparent;
  border: none;
  cursor: pointer;
  transition: color ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.textLink};
  }
`;

const RepliesContainer = styled.div`
  margin-top: ${({ theme }) => theme.spacing.sm};
  padding-left: ${({ theme }) => theme.spacing.md};
  border-left: 2px solid ${({ theme }) => theme.colors.border};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const ReplyItem = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const ReplyContent = styled.div``;

const ReplyHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const EmptyText = styled.p`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.fontSizes.base};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const ErrorCard = styled(Card)`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl};
`;

export function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isAuthenticated, user } = useAuthStore();
  const [comment, setComment] = useState('');
  const [liked, setLiked] = useState(false);
  const [replyTo, setReplyTo] = useState(null);
  const [replyText, setReplyText] = useState('');

  const { data, isLoading, error } = useQuery({
    queryKey: ['post', id],
    queryFn: () => postService.getPost(id),
  });

  useEffect(() => {
    if (id) {
      analyticsService.trackPageView(id).catch(() => {});
    }
  }, [id]);

  useEffect(() => {
    if (data?.data?.likes && user?.user_id) {
      const userLiked = data.data.likes.some(
        (like) => like.user === user.user_id || like === user.user_id
      );
      setLiked(userLiked);
    }
  }, [data, user]);

  const deleteMutation = useMutation({
    mutationFn: () => postService.deletePost(id),
    onSuccess: () => {
      toast.success('Post deleted');
      navigate('/');
    },
    onError: () => toast.error('Failed to delete'),
  });

  const commentMutation = useMutation({
    mutationFn: (commentData) => commentService.createComment(commentData),
    onSuccess: () => {
      setComment('');
      queryClient.invalidateQueries(['post', id]);
      toast.success('Comment added');
    },
    onError: () => toast.error('Failed to comment'),
  });

  const replyMutation = useMutation({
    mutationFn: ({ userId, repliedCommentId, message }) =>
      commentService.replyToComment(userId, repliedCommentId, message),
    onSuccess: () => {
      setReplyTo(null);
      setReplyText('');
      queryClient.invalidateQueries(['post', id]);
      toast.success('Reply added');
    },
    onError: () => toast.error('Failed to reply'),
  });

  const likeMutation = useMutation({
    mutationFn: () => (liked ? likeService.unlikePost(id) : likeService.likePost(id)),
    onSuccess: () => {
      setLiked(!liked);
      queryClient.invalidateQueries(['post', id]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed');
    },
  });

  if (isLoading) return <Loading text="Loading..." />;

  if (error || !data?.success) {
    return (
      <Container>
        <ErrorCard>
          <p style={{ marginBottom: '16px' }}>Post not found</p>
          <PrimaryButton as={Link} to="/">
            Go Home
          </PrimaryButton>
        </ErrorCard>
      </Container>
    );
  }

  const post = data.data;
  const isAuthor = user?.user_id === post.user?._id;

  const handleComment = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    if (!isAuthenticated) {
      toast.error('Please sign in');
      return;
    }
    commentMutation.mutate({
      userId: user.user_id,
      postId: id,
      message: comment,
    });
  };

  const handleReply = (e, commentId) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    if (!isAuthenticated) {
      toast.error('Please sign in');
      return;
    }
    replyMutation.mutate({
      userId: user.user_id,
      repliedCommentId: commentId,
      message: replyText,
    });
  };

  const handleDelete = () => {
    if (window.confirm('Delete this post?')) {
      deleteMutation.mutate();
    }
  };

  const handleLike = () => {
    if (!isAuthenticated) {
      toast.error('Please sign in');
      return;
    }
    likeMutation.mutate();
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied');
  };

  return (
    <Container>
      <BadgeContainer>
        {post.categories?.map((cat) => (
          <Badge key={cat._id}>{cat.name}</Badge>
        ))}
      </BadgeContainer>

      <Title>{post.title}</Title>

      <MetaRow>
        <AuthorInfo>
          <Avatar size="md" fallback={post.user?.username?.[0]?.toUpperCase() || 'U'} />
          <AuthorDetails>
            <AuthorName>{post.user?.username || 'Anonymous'}</AuthorName>
            <PostDate>{format(new Date(post.createdAt), 'MMM d, yyyy')}</PostDate>
          </AuthorDetails>
        </AuthorInfo>

        {isAuthor && (
          <ActionButtons>
            <ActionButton as={Link} to={`/edit/${post._id}`}>
              <Pencil size={14} /> Edit
            </ActionButton>
            <ActionButton data-danger="true" onClick={handleDelete}>
              <Trash2 size={14} /> Delete
            </ActionButton>
          </ActionButtons>
        )}
      </MetaRow>

      {post.imageURL && (
        <CoverImage>
          <img src={post.imageURL} alt={post.title} />
        </CoverImage>
      )}

      <Content dangerouslySetInnerHTML={{ __html: post.content }} />

      <Divider />

      <EngagementBar>
        <EngagementButton $active={liked} onClick={handleLike}>
          <Heart size={16} />
          <span>{post.likes?.length || 0}</span>
        </EngagementButton>
        <EngagementButton>
          <MessageCircle size={16} />
          <span>{post.comments?.length || 0}</span>
        </EngagementButton>
        <EngagementButton onClick={handleShare}>
          <Share2 size={16} />
          <span>Share</span>
        </EngagementButton>
      </EngagementBar>

      <Divider />

      <CommentsSection>
        <SectionTitle>Comments ({post.comments?.length || 0})</SectionTitle>

        {isAuthenticated ? (
          <Card>
            <form onSubmit={handleComment}>
              <TextArea
                placeholder="Write a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <ButtonRow>
                <PrimaryButton
                  type="submit"
                  disabled={commentMutation.isPending || !comment.trim()}
                >
                  {commentMutation.isPending ? 'Posting...' : 'Post'}
                </PrimaryButton>
              </ButtonRow>
            </form>
          </Card>
        ) : (
          <Card>
            <SignInPrompt>
              <Link to="/login">Sign in</Link> to comment
            </SignInPrompt>
          </Card>
        )}

        {post.comments?.length === 0 ? (
          <EmptyText>No comments yet</EmptyText>
        ) : (
          post.comments?.map((cmt) => (
            <Card key={cmt._id}>
              <CommentItem>
                <Avatar size="sm" fallback={cmt.user?.username?.[0]?.toUpperCase() || 'U'} />
                <CommentContent>
                  <CommentHeader>
                    <CommentAuthor>{cmt.user?.username || 'Anonymous'}</CommentAuthor>
                    <CommentTime>
                      {formatDistanceToNow(new Date(cmt.date), { addSuffix: true })}
                    </CommentTime>
                  </CommentHeader>
                  <CommentText>{cmt.message}</CommentText>

                  {isAuthenticated && (
                    <ReplyButton onClick={() => setReplyTo(replyTo === cmt._id ? null : cmt._id)}>
                      Reply
                    </ReplyButton>
                  )}

                  {replyTo === cmt._id && (
                    <form onSubmit={(e) => handleReply(e, cmt._id)}>
                      <TextArea
                        placeholder="Write a reply..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        style={{ marginTop: '8px' }}
                      />
                      <ButtonRow>
                        <GhostButton type="button" onClick={() => setReplyTo(null)}>
                          Cancel
                        </GhostButton>
                        <PrimaryButton type="submit" disabled={replyMutation.isPending}>
                          Reply
                        </PrimaryButton>
                      </ButtonRow>
                    </form>
                  )}

                  {cmt.replies?.length > 0 && (
                    <RepliesContainer>
                      {cmt.replies.map((reply) => (
                        <ReplyItem key={reply._id}>
                          <Avatar
                            size="sm"
                            fallback={reply.user?.username?.[0]?.toUpperCase() || 'U'}
                          />
                          <ReplyContent>
                            <ReplyHeader>
                              <CommentAuthor>{reply.user?.username || 'Anonymous'}</CommentAuthor>
                              <CommentTime>
                                {formatDistanceToNow(new Date(reply.date), {
                                  addSuffix: true,
                                })}
                              </CommentTime>
                            </ReplyHeader>
                            <CommentText>{reply.message}</CommentText>
                          </ReplyContent>
                        </ReplyItem>
                      ))}
                    </RepliesContainer>
                  )}
                </CommentContent>
              </CommentItem>
            </Card>
          ))
        )}
      </CommentsSection>
    </Container>
  );
}
