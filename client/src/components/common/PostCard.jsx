import { Link } from 'react-router-dom';
import { Box, Card, Flex, Text, Avatar, Badge } from '@radix-ui/themes';
import { Heart, MessageCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export function PostCard({ post }) {
  const stripHtml = (html) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  };

  return (
    <Card>
      <Flex gap="4" p="1">
        {post.imageURL && (
          <Link to={`/post/${post._id}`}>
            <Box
              style={{
                width: '120px',
                height: '80px',
                borderRadius: '4px',
                overflow: 'hidden',
                flexShrink: 0,
              }}
            >
              <img
                src={post.imageURL}
                alt={post.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => e.target.style.display = 'none'}
              />
            </Box>
          </Link>
        )}

        <Flex direction="column" gap="1" style={{ flex: 1, minWidth: 0 }}>
          <Flex gap="2" wrap="wrap">
            {post.categories?.slice(0, 2).map((cat) => (
              <Badge key={cat._id || cat} variant="soft" color="gray" size="1">
                {cat.name || cat}
              </Badge>
            ))}
          </Flex>

          <Link to={`/post/${post._id}`}>
            <Text size="3" weight="medium" className="text-truncate-2" style={{ lineHeight: 1.4 }}>
              {post.title}
            </Text>
          </Link>

          <Text size="2" color="gray" className="text-truncate-2">
            {stripHtml(post.content)}
          </Text>

          <Flex justify="between" align="center" mt="1">
            <Flex align="center" gap="2">
              <Link to={post.user?._id ? `/user/${post.user._id}` : '#'}>
                <Flex align="center" gap="1">
                  <Avatar
                    size="1"
                    fallback={post.user?.username?.[0]?.toUpperCase() || 'U'}
                    radius="full"
                    color="gray"
                  />
                  <Text size="1" color="gray">
                    {post.user?.username || 'Anonymous'}
                  </Text>
                </Flex>
              </Link>
              <Text size="1" color="gray">·</Text>
              <Text size="1" color="gray">
                {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
              </Text>
            </Flex>

            <Flex gap="3" align="center">
              <Flex align="center" gap="1">
                <Heart size={12} color="var(--text-muted)" />
                <Text size="1" color="gray">{post.likes?.length || 0}</Text>
              </Flex>
              <Flex align="center" gap="1">
                <MessageCircle size={12} color="var(--text-muted)" />
                <Text size="1" color="gray">{post.comments?.length || 0}</Text>
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Card>
  );
}
