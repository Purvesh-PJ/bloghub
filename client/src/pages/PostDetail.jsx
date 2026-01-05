import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box,
  Container,
  Flex,
  Heading,
  Text,
  Avatar,
  Badge,
  Button,
  Separator,
  TextArea,
  Card,
} from '@radix-ui/themes';
import { Heart, MessageCircle, Share2, Pencil, Trash2 } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import toast from 'react-hot-toast';
import { postService } from '../services/postService';
import { commentService } from '../services/commentService';
import { likeService } from '../services/likeService';
import { analyticsService } from '../services/analyticsService';
import { useAuthStore } from '../store/authStore';
import { Loading } from '../components/common/Loading';

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
      <Container size="2" py="9">
        <Card>
          <Flex direction="column" align="center" py="6">
            <Text size="3" mb="3">Post not found</Text>
            <Button variant="soft" asChild>
              <Link to="/">Go Home</Link>
            </Button>
          </Flex>
        </Card>
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
    <Container size="2" py="5">
      <Flex direction="column" gap="4">
        {/* Categories */}
        <Flex gap="2" wrap="wrap">
          {post.categories?.map((cat) => (
            <Badge key={cat._id} variant="soft" color="gray" size="1">
              {cat.name}
            </Badge>
          ))}
        </Flex>

        {/* Title */}
        <Heading size="6" style={{ lineHeight: 1.3 }}>{post.title}</Heading>

        {/* Author & Meta */}
        <Flex align="center" justify="between" wrap="wrap" gap="3">
          <Flex align="center" gap="2">
            <Avatar
              size="2"
              fallback={post.user?.username?.[0]?.toUpperCase() || 'U'}
              radius="full"
              color="gray"
            />
            <Box>
              <Text size="2" weight="medium">{post.user?.username || 'Anonymous'}</Text>
              <Text size="1" color="gray">
                {format(new Date(post.createdAt), 'MMM d, yyyy')}
              </Text>
            </Box>
          </Flex>

          {isAuthor && (
            <Flex gap="2">
              <Button variant="soft" size="1" asChild>
                <Link to={`/edit/${post._id}`}>
                  <Pencil size={12} /> Edit
                </Link>
              </Button>
              <Button variant="soft" color="red" size="1" onClick={handleDelete}>
                <Trash2 size={12} /> Delete
              </Button>
            </Flex>
          )}
        </Flex>

        {/* Cover Image */}
        {post.imageURL && (
          <Box style={{ borderRadius: '6px', overflow: 'hidden' }}>
            <img
              src={post.imageURL}
              alt={post.title}
              style={{ width: '100%', maxHeight: '400px', objectFit: 'cover' }}
            />
          </Box>
        )}

        {/* Content */}
        <Box
          className="post-content"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <Separator size="4" />

        {/* Engagement */}
        <Flex gap="3" align="center">
          <Button variant="ghost" size="1" onClick={handleLike}>
            <Heart size={14} fill={liked ? 'currentColor' : 'none'} color={liked ? 'var(--red-9)' : undefined} />
            <Text size="1">{post.likes?.length || 0}</Text>
          </Button>
          <Button variant="ghost" size="1">
            <MessageCircle size={14} />
            <Text size="1">{post.comments?.length || 0}</Text>
          </Button>
          <Button variant="ghost" size="1" onClick={handleShare}>
            <Share2 size={14} />
            <Text size="1">Share</Text>
          </Button>
        </Flex>

        <Separator size="4" />

        {/* Comments */}
        <Box>
          <Text size="3" weight="medium" mb="3">
            Comments ({post.comments?.length || 0})
          </Text>

          {isAuthenticated ? (
            <form onSubmit={handleComment}>
              <Card mb="4">
                <Box p="3">
                  <Flex direction="column" gap="2">
                    <TextArea
                      placeholder="Write a comment..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      rows={2}
                    />
                    <Flex justify="end">
                      <Button size="1" type="submit" disabled={commentMutation.isPending || !comment.trim()}>
                        {commentMutation.isPending ? 'Posting...' : 'Post'}
                      </Button>
                    </Flex>
                  </Flex>
                </Box>
              </Card>
            </form>
          ) : (
            <Card mb="4">
              <Flex align="center" justify="center" p="3" gap="1">
                <Text size="2" color="gray">
                  <Link to="/login" style={{ color: 'var(--accent-color)' }}>Sign in</Link> to comment
                </Text>
              </Flex>
            </Card>
          )}

          <Flex direction="column" gap="3">
            {post.comments?.length === 0 ? (
              <Text size="2" color="gray" align="center" py="3">No comments yet</Text>
            ) : (
              post.comments?.map((cmt) => (
                <Card key={cmt._id}>
                  <Box p="3">
                    <Flex gap="2">
                      <Avatar
                        size="1"
                        fallback={cmt.user?.username?.[0]?.toUpperCase() || 'U'}
                        radius="full"
                        color="gray"
                      />
                      <Box style={{ flex: 1 }}>
                        <Flex justify="between" align="center" mb="1">
                          <Text size="2" weight="medium">{cmt.user?.username || 'Anonymous'}</Text>
                          <Text size="1" color="gray">
                            {formatDistanceToNow(new Date(cmt.date), { addSuffix: true })}
                          </Text>
                        </Flex>
                        <Text size="2">{cmt.message}</Text>
                        
                        {isAuthenticated && (
                          <Button
                            variant="ghost"
                            size="1"
                            mt="1"
                            onClick={() => setReplyTo(replyTo === cmt._id ? null : cmt._id)}
                          >
                            Reply
                          </Button>
                        )}

                        {replyTo === cmt._id && (
                          <form onSubmit={(e) => handleReply(e, cmt._id)}>
                            <Flex direction="column" gap="2" mt="2">
                              <TextArea
                                placeholder="Write a reply..."
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                rows={2}
                              />
                              <Flex gap="2" justify="end">
                                <Button variant="ghost" size="1" onClick={() => setReplyTo(null)}>
                                  Cancel
                                </Button>
                                <Button size="1" type="submit" disabled={replyMutation.isPending}>
                                  Reply
                                </Button>
                              </Flex>
                            </Flex>
                          </form>
                        )}

                        {cmt.replies?.length > 0 && (
                          <Box mt="2" pl="3" style={{ borderLeft: '2px solid var(--border-color)' }}>
                            <Flex direction="column" gap="2">
                              {cmt.replies.map((reply) => (
                                <Flex key={reply._id} gap="2">
                                  <Avatar
                                    size="1"
                                    fallback={reply.user?.username?.[0]?.toUpperCase() || 'U'}
                                    radius="full"
                                    color="gray"
                                  />
                                  <Box>
                                    <Flex align="center" gap="2">
                                      <Text size="1" weight="medium">{reply.user?.username || 'Anonymous'}</Text>
                                      <Text size="1" color="gray">
                                        {formatDistanceToNow(new Date(reply.date), { addSuffix: true })}
                                      </Text>
                                    </Flex>
                                    <Text size="2">{reply.message}</Text>
                                  </Box>
                                </Flex>
                              ))}
                            </Flex>
                          </Box>
                        )}
                      </Box>
                    </Flex>
                  </Box>
                </Card>
              ))
            )}
          </Flex>
        </Box>
      </Flex>
    </Container>
  );
}
