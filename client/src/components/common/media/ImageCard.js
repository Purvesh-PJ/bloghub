import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Card, Box, Text, Flex, Button, AspectRatio } from '../../ui/primitives';
import styled from 'styled-components';

const ImageContainer = styled(Box)`
  position: relative;
  overflow: hidden;
  border-radius: ${(p) => p.theme.radii.lg} ${(p) => p.theme.radii.lg} 0 0;
  background: ${(p) => p.theme.palette.background.subtle};
`;

const Image = styled.img`
  width: 100%;
  height: ${(p) => p.$height || 'auto'};
  object-fit: ${(p) => p.$objectFit || 'cover'};
  transition: transform ${(p) => p.theme.motion.duration.normal}
    ${(p) => p.theme.motion.easing.standard};

  ${(p) =>
    p.$interactive &&
    `
    &:hover {
      transform: scale(1.05);
    }
  `}
`;

const ImageOverlay = styled(Box)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.7) 100%);
  display: flex;
  align-items: flex-end;
  padding: ${(p) => p.theme.spacing(4)};
  opacity: ${(p) => (p.$visible ? 1 : 0)};
  transition: opacity ${(p) => p.theme.motion.duration.normal}
    ${(p) => p.theme.motion.easing.standard};
`;

const PlaceholderContainer = styled(Flex)`
  height: ${(p) => p.$height || '200px'};
  background: ${(p) => p.theme.palette.background.subtle};
  color: ${(p) => p.theme.palette.text.muted};
  border-radius: ${(p) => p.theme.radii.lg} ${(p) => p.theme.radii.lg} 0 0;
`;

const ContentContainer = styled(Box)`
  padding: ${(p) => p.theme.spacing(4)};
`;

/**
 * ImageCard - A card component with image and content
 *
 * @param {Object} props
 * @param {string} props.src - Image source URL
 * @param {string} props.alt - Image alt text
 * @param {string} props.title - Card title
 * @param {string} props.description - Card description
 * @param {React.ReactNode} props.content - Additional content
 * @param {React.ReactNode} props.actions - Action buttons
 * @param {string} props.aspectRatio - Image aspect ratio (e.g., '16/9', 'square', 'card')
 * @param {string} props.imageHeight - Image height (deprecated - use aspectRatio instead)
 * @param {string} props.objectFit - Image object-fit property
 * @param {boolean} props.interactive - Whether image is interactive
 * @param {boolean} props.showOverlay - Whether to show overlay on hover
 * @param {React.ReactNode} props.overlayContent - Content to show in overlay
 * @param {Function} props.onImageClick - Image click handler
 * @param {Function} props.onCardClick - Card click handler
 * @param {React.ReactNode} props.placeholder - Placeholder when no image
 * @param {Object} props.cardProps - Additional props for card
 */
export const ImageCard = ({
  src,
  alt = '',
  title,
  description,
  content,
  actions,
  aspectRatio = 'card',
  imageHeight = '200px', // Deprecated - use aspectRatio instead
  objectFit = 'cover',
  interactive = false,
  showOverlay = false,
  overlayContent,
  onImageClick,
  onCardClick,
  placeholder = '🖼️',
  cardProps = {},
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(false);
  };

  const handleImageClick = (event) => {
    if (onImageClick) {
      event.stopPropagation();
      onImageClick();
    }
  };

  const shouldShowImage = src && !imageError;
  const shouldShowOverlay = showOverlay && (overlayContent || isHovered);

  return (
    <Card
      $interactive={!!onCardClick}
      onClick={onCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ padding: 0, overflow: 'hidden' }}
      {...cardProps}
    >
      {/* Image or Placeholder */}
      <AspectRatio
        $ratio={aspectRatio}
        $objectFit={objectFit}
        onClick={handleImageClick}
        style={{ 
          cursor: onImageClick ? 'pointer' : 'default',
          borderRadius: '12px 12px 0 0',
          overflow: 'hidden'
        }}
      >
        {shouldShowImage ? (
          <>
            <img
              src={src}
              alt={alt}
              onLoad={handleImageLoad}
              onError={handleImageError}
              style={{ 
                width: '100%',
                height: '100%',
                objectFit,
                transition: interactive ? 'transform 0.3s ease' : 'none',
                transform: interactive && isHovered ? 'scale(1.05)' : 'scale(1)'
              }}
            />
            
            {/* Overlay */}
            {shouldShowOverlay && (
              <Box
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.7) 100%)',
                  display: 'flex',
                  alignItems: 'flex-end',
                  padding: '16px',
                  opacity: shouldShowOverlay ? 1 : 0,
                  transition: 'opacity 0.3s ease',
                }}
              >
                {overlayContent}
              </Box>
            )}
          </>
        ) : (
          <Flex
            $align="center"
            $justify="center"
            $direction="column"
            $gap={2}
            style={{
              background: 'var(--background-subtle)',
              color: 'var(--text-muted)',
              width: '100%',
              height: '100%'
            }}
          >
            <Text $fontSize="2xl">{placeholder}</Text>
            {imageError && (
              <Text $fontSize="sm" $color="muted">
                Failed to load image
              </Text>
            )}
          </Flex>
        )}
      </AspectRatio>

      {/* Content */}
      {(title || description || content || actions) && (
        <ContentContainer>
          {title && (
            <Text
              $fontSize="lg"
              $fontWeight="semibold"
              $color="primary"
              style={{ marginBottom: '8px' }}
            >
              {title}
            </Text>
          )}

          {description && (
            <Text
              $fontSize="sm"
              $color="secondary"
              style={{ marginBottom: content || actions ? '12px' : '0' }}
            >
              {description}
            </Text>
          )}

          {content && <Box style={{ marginBottom: actions ? '16px' : '0' }}>{content}</Box>}

          {actions && (
            <Flex $gap={2} $wrap>
              {actions}
            </Flex>
          )}
        </ContentContainer>
      )}
    </Card>
  );
};

ImageCard.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  content: PropTypes.node,
  actions: PropTypes.node,
  aspectRatio: PropTypes.string,
  imageHeight: PropTypes.string, // Deprecated
  objectFit: PropTypes.oneOf(['cover', 'contain', 'fill', 'none', 'scale-down']),
  interactive: PropTypes.bool,
  showOverlay: PropTypes.bool,
  overlayContent: PropTypes.node,
  onImageClick: PropTypes.func,
  onCardClick: PropTypes.func,
  placeholder: PropTypes.node,
  cardProps: PropTypes.object,
};
