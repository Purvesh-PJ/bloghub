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
import { useAuth } from '../context/AuthContext';
import { Loading } from '../components/common/Loading';

const PageWrapper = styled.div`
  background: ${({ theme }) => theme.colors.bgPrimary};
  min-height: calc(100vh - ${({ theme }) => theme.layout.headerHeight});
`;

const HeroImage = styled.div`
  width: 100%;
  max-height: 480px;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const Container = styled.div`
  max-width: 680px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.lg};
`;

const Category = styled(Link)`
  display: inline-block;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.accent};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  
  &:hover {
    text-decoration: underline;
  }
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  line-height: 1.2;
  letter-spacing: -0.02em;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 1.875rem;
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
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.accent}, #8b5cf6);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: white;
`;

const AuthorDetails = styled.div``;

const AuthorName = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const PostMeta = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.sm};
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
  
  &[data-danger="true"]:hover {
    border-color: ${({ theme }) => theme.colors.error};
    color: ${({ theme }) => theme.colors.error};
  }
  
  svg { width: 16px; height: 16px; }
`;

const Content = styled.article`
  font-size: 1.125rem;
  line-height: 1.8;
  color: ${({ theme }) => theme.colors.textPrimary};
  
  .wmde-markdown {
    background: transparent !important;
    font-size: 1.125rem;
    line-height: 1.8;
    color: ${({ theme }) => theme.colors.textSecondary};
  }
  
  h1, h2, h3, h4,
  .wmde-markdown h1, .wmde-markdown h2, .wmde-markdown h3, .wmde-markdown h4 {
    font-weight: ${({ theme }) => theme.fontWeights.bold};
    color: ${({ theme }) => theme.colors.textPrimary};
    margin: 2em 0 0.5em;
    line-height: 1.3;
    border-bottom: none;
  }
  
  h1, .wmde-markdown h1 { font-size: 1.75rem; }
  h2, .wmde-markdown h2 { font-size: 1.5rem; }
  h3, .wmde-markdown h3 { font-size: 1.25rem; }
  
  p, .wmde-markdown p {
    margin-bottom: 1.5em;
    color: ${({ theme }) => theme.colors.textSecondary};
  }
  
  ul, ol, .wmde-markdown ul, .wmde-markdown ol {
    margin-bottom: 1.5em;
    padding-left: 1.5em;
    color: ${({ theme }) => theme.colors.textSecondary};
  }
  
  li, .wmde-markdown li { margin-bottom: 0.5em; }
  
  blockquote, .wmde-markdown blockquote {
    border-left: 3px solid ${({ theme }) => theme.colors.accent};
    padding: 0.5em 0 0.5em 1.5em;
    margin: 2em 0;
    font-size: 1.25rem;
    font-style: italic;
    color: ${({ theme }) => theme.colors.textSecondary};
    background: transparent;
  }
  
  pre, .wmde-markdown pre {
    background: ${({ theme }) => theme.colors.bgSecondary};
    border: 1px solid ${({ theme }) => theme.colors.border};
    padding: 1.25em;
    border-radius: ${({ theme }) => theme.radii.lg};
    overflow-x: auto;
    margin: 2em 0;
    font-size: 0.9rem;
  }
  
  code, .wmde-markdown code {
    background: ${({ theme }) => theme.colors.bgSecondary};
    padding: 0.2em 0.5em;
    border-radius: 4px;
    font-size: 0.9em;
    color: ${({ theme }) => theme.colors.accent};
  }
  
  .wmde-markdown pre code {
    background: transparent;
    padding: 0;
    color: inherit;
  }
  
  img, .wmde-markdown img {
    max-width: 100%;
    border-radius: ${({ theme }) => theme.radii.lg};
    margin: 2em 0;
  }
  
  a, .wmde-markdown a {
    color: ${({ theme }) => theme.colors.accent};
    text-decoration: underline;
    text-underline-offset: 2px;
  }
`;

const Engagement = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.xl} 0;
  margin-top: ${({ theme }) => theme.spacing.xl};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const EngageBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ $active, theme }) => $active ? '#fff' : theme.colors.textSecondary};
  background: ${({ $active, theme }) => $active ? theme.colors.error : theme.colors.bgSecondary};
  border: 1px solid ${({ $active, theme }) => $active ? theme.colors.error : theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.full};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    border-color: ${({ $active, theme }) => $active ? theme.colors.error : theme.colors.textMuted};
  }
  
  svg {
    width: 18px;
    height: 18px;
    fill: ${({ $active }) => $active ? 'currentColor' : 'none'};
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

const CommentsSection = styled.section``;

const CommentsHeader = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const CommentForm = styled.form`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const CommentInput = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: ${({ theme }) => theme.spacing.md};
  font-family: inherit;
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.textPrimary};
  background: ${({ theme }) => theme.colors.bgPrimary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  resize: none;
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
  }
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.accent};
  }
`;

const CommentActions = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

const SubmitBtn = styled.button`
  padding: 10px 24px;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: white;
  background: ${({ theme }) => theme.colors.accent};
  border: none;
  border-radius: ${({ theme }) => theme.radii.full};
  cursor: pointer;
  
  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.accentHover};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
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
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.accentSubtle};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.accent};
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
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const CommentDate = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const CommentText = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.6;
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
      setLiked(data.data.likes.some((like) => like.user === user.user_id || like === user.user_id));
    }
  }, [data, user]);

  const deleteMutation = useMutation({
    mutationFn: () => postService.deletePost(id),
    onSuccess: () => { toast.success('Deleted'); navigate('/'); },
  });

  const commentMutation = useMutation({
    mutationFn: (d) => commentService.createComment(d),
    onSuccess: () => { setComment(''); queryClient.invalidateQueries(['post', id]); },
  });

  const replyMutation = useMutation({
    mutationFn: ({ userId, repliedCommentId, message }) => 
      commentService.replyToComment(userId, repliedCommentId, message),
    onSuccess: () => { setReplyTo(null); setReplyText(''); queryClient.invalidateQueries(['post', id]); },
  });

  const likeMutation = useMutation({
    mutationFn: () => (liked ? likeService.unlikePost(id) : likeService.likePost(id)),
    onSuccess: () => { setLiked(!liked); queryClient.invalidateQueries(['post', id]); },
  });

  if (isLoading) return <Loading text="Loading..." />;
  
  if (error || !data?.success) {
    return (
      <PageWrapper>
        <ErrorPage>
          <h2>Post not found</h2>
          <p>The post you're looking for doesn't exist or has been removed.</p>
          <SubmitBtn as={Link} to="/">Back to Home</SubmitBtn>
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
              <ActionBtn data-danger="true" onClick={() => window.confirm('Delete this post?') && deleteMutation.mutate()}>
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
            onClick={() => isAuthenticated ? likeMutation.mutate() : toast.error('Please sign in')}
          >
            <Heart /> {post.likes?.length || 0} Likes
          </EngageBtn>
          <EngageBtn as="a" href="#comments">
            <MessageCircle /> {post.comments?.length || 0} Comments
          </EngageBtn>
          <ShareBtn onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success('Link copied!'); }}>
            <Share2 /> Share
          </ShareBtn>
        </Engagement>

        <Divider />

        <CommentsSection id="comments">
          <CommentsHeader>Comments ({post.comments?.length || 0})</CommentsHeader>

          {isAuthenticated ? (
            <CommentForm onSubmit={(e) => { e.preventDefault(); comment.trim() && commentMutation.mutate({ userId: user.user_id, postId: id, message: comment }); }}>
              <CommentInput
                placeholder="Share your thoughts..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <CommentActions>
                <SubmitBtn type="submit" disabled={!comment.trim() || commentMutation.isPending}>
                  Post Comment
                </SubmitBtn>
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
                      <CommentDate>{formatDistanceToNow(new Date(c.date), { addSuffix: true })}</CommentDate>
                    </CommentMeta>
                    <CommentText>{c.message}</CommentText>
                    
                    {isAuthenticated && (
                      <ReplyBtn onClick={() => setReplyTo(replyTo === c._id ? null : c._id)}>
                        Reply
                      </ReplyBtn>
                    )}
                    
                    {replyTo === c._id && (
                      <form onSubmit={(e) => { e.preventDefault(); replyText.trim() && replyMutation.mutate({ userId: user.user_id, repliedCommentId: c._id, message: replyText }); }} style={{ marginTop: 12 }}>
                        <CommentInput
                          placeholder="Write a reply..."
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          style={{ minHeight: 80 }}
                        />
                        <CommentActions>
                          <SubmitBtn type="submit" disabled={!replyText.trim()}>Reply</SubmitBtn>
                        </CommentActions>
                      </form>
                    )}
                    
                    {c.replies?.length > 0 && (
                      <Replies>
                        {c.replies.map((r) => (
                          <Comment key={r._id}>
                            <CommentAvatar>{r.user?.username?.[0]?.toUpperCase() || 'U'}</CommentAvatar>
                            <CommentBody>
                              <CommentMeta>
                                <CommentAuthor>{r.user?.username || 'Anonymous'}</CommentAuthor>
                                <CommentDate>{formatDistanceToNow(new Date(r.date), { addSuffix: true })}</CommentDate>
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
