import React from 'react';
import PropTypes from 'prop-types';
import { Card, Box, Text, Flex, Badge, Button } from '../../ui/primitives';
import { UserAvatar } from './UserAvatar';
import styled from 'styled-components';

const CardHeader = styled(Flex)`
  padding: ${(p) => p.theme.spacing(4)} ${(p) => p.theme.spacing(4)} 0;
  margin-bottom: ${(p) => p.theme.spacing(3)};
`;

const CardContent = styled(Box)`
  padding: 0 ${(p) => p.theme.spacing(4)};
  margin-bottom: ${(p) => p.theme.spacing(4)};
`;

const CardFooter = styled(Flex)`
  padding: ${(p) => p.theme.spacing(3)} ${(p) => p.theme.spacing(4)};
  border-top: ${(p) => p.theme.borderWidth.thin} solid ${(p) => p.theme.palette.divider};
  margin-top: auto;
`;

const MetaInfo = styled(Flex)`
  gap: ${(p) => p.theme.spacing(2)};
  align-items: center;
  flex-wrap: wrap;
`;

const Timestamp = styled(Text)`
  color: ${(p) => p.theme.palette.text.muted};
  font-size: ${(p) => p.theme.typography.size.xs};
`;

/**
 * ContentCard - A versatile content card for posts, articles, etc.
 *
 * @param {Object} props
 * @param {string} props.title - Content title
 * @param {string} props.excerpt - Content excerpt/description
 * @param {React.ReactNode} props.content - Main content
 * @param {Object} props.author - Author object {name, avatar, email}
 * @param {string|Date} props.publishedAt - Publication date
 * @param {Array} props.tags - Array of tag strings
 * @param {string} props.status - Content status ('draft', 'published', 'archived')
 * @param {React.ReactNode} props.actions - Action buttons
 * @param {React.ReactNode} props.media - Media content (image, video, etc.)
 * @param {Function} props.onAuthorClick - Author click handler
 * @param {Function} props.onTagClick - Tag click handler
 * @param {Function} props.onCardClick - Card click handler
 * @param {boolean} props.interactive - Whether card is interactive
 * @param {Object} props.cardProps - Additional props for card
 */
export const ContentCard = ({
  title,
  excerpt,
  content,
  author,
  publishedAt,
  tags = [],
  status,
  actions,
  media,
  onAuthorClick,
  onTagClick,
  onCardClick,
  interactive = false,
  cardProps = {},
}) => {
  const formatDate = (date) => {
    if (!date) return '';
    const dateObj = date instanceof Date ? date : new Date(date);
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'published':
        return { bg: '#dcfce7', color: '#166534' };
      case 'draft':
        return { bg: '#fef3c7', color: '#92400e' };
      case 'archived':
        return { bg: '#f3f4f6', color: '#374151' };
      default:
        return { bg: '#f3f4f6', color: '#374151' };
    }
  };

  return (
    <Card
      $interactive={interactive || !!onCardClick}
      onClick={onCardClick}
      style={{ padding: 0, display: 'flex', flexDirection: 'column' }}
      {...cardProps}
    >
      {/* Media */}
      {media && <Box style={{ marginBottom: '16px' }}>{media}</Box>}

      {/* Header with author and meta */}
      <CardHeader $align="center" $justify="space-between">
        <Flex $align="center" $gap={3} $flex="1">
          {author && <UserAvatar user={author} size="sm" showName onClick={onAuthorClick} />}

          <MetaInfo>
            {publishedAt && <Timestamp>{formatDate(publishedAt)}</Timestamp>}

            {status && (
              <Badge $bg={getStatusColor(status).bg} $color={getStatusColor(status).color}>
                {status}
              </Badge>
            )}
          </MetaInfo>
        </Flex>
      </CardHeader>

      {/* Content */}
      <CardContent>
        {title && (
          <Text
            $fontSize="xl"
            $fontWeight="semibold"
            $color="primary"
            style={{ marginBottom: '12px', lineHeight: '1.4' }}
          >
            {title}
          </Text>
        )}

        {excerpt && (
          <Text
            $fontSize="md"
            $color="secondary"
            style={{ marginBottom: '16px', lineHeight: '1.6' }}
          >
            {excerpt}
          </Text>
        )}

        {content && <Box>{content}</Box>}

        {/* Tags */}
        {tags.length > 0 && (
          <Flex $gap={2} $wrap style={{ marginTop: '16px' }}>
            {tags.map((tag, index) => (
              <Badge
                key={index}
                $interactive={!!onTagClick}
                onClick={() => onTagClick?.(tag)}
                style={{ cursor: onTagClick ? 'pointer' : 'default' }}
              >
                #{tag}
              </Badge>
            ))}
          </Flex>
        )}
      </CardContent>

      {/* Footer with actions */}
      {actions && (
        <CardFooter $justify="flex-end" $gap={2}>
          {actions}
        </CardFooter>
      )}
    </Card>
  );
};

ContentCard.propTypes = {
  title: PropTypes.string,
  excerpt: PropTypes.string,
  content: PropTypes.node,
  author: PropTypes.shape({
    name: PropTypes.string,
    avatar: PropTypes.string,
    email: PropTypes.string,
  }),
  publishedAt: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
  tags: PropTypes.arrayOf(PropTypes.string),
  status: PropTypes.oneOf(['draft', 'published', 'archived']),
  actions: PropTypes.node,
  media: PropTypes.node,
  onAuthorClick: PropTypes.func,
  onTagClick: PropTypes.func,
  onCardClick: PropTypes.func,
  interactive: PropTypes.bool,
  cardProps: PropTypes.object,
};
