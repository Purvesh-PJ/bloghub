import React from 'react';
import PropTypes from 'prop-types';
import { 
  AspectRatio, 
  VideoAspectRatio, 
  SquareAspectRatio, 
  StoryAspectRatio,
  CardAspectRatio,
  HeroAspectRatio,
  Box, 
  Text, 
  Flex, 
  Grid,
  H3 
} from '../../ui/primitives';

/**
 * AspectRatioGallery - Example component showing different aspect ratios
 */
export const AspectRatioGallery = () => {
  const examples = [
    { ratio: '16/9', label: 'Video (16:9)', color: '#3b82f6' },
    { ratio: 'square', label: 'Square (1:1)', color: '#10b981' },
    { ratio: '4/3', label: 'Photo (4:3)', color: '#f59e0b' },
    { ratio: '3/2', label: 'Classic (3:2)', color: '#ef4444' },
    { ratio: 'story', label: 'Story (9:16)', color: '#8b5cf6' },
    { ratio: 'golden', label: 'Golden Ratio', color: '#f97316' },
    { ratio: 'card', label: 'Card (8:5)', color: '#06b6d4' },
    { ratio: 'hero', label: 'Hero (5:2)', color: '#84cc16' },
  ];

  return (
    <Box $p={6}>
      <H3 $mb={6}>Aspect Ratio Examples</H3>
      <Grid $cols="repeat(auto-fit, minmax(200px, 1fr))" $gap={4}>
        {examples.map((example) => (
          <Box key={example.ratio}>
            <AspectRatio
              $ratio={example.ratio}
              $radius="lg"
              $border
              $shadow="sm"
            >
              <Flex
                $direction="column"
                $align="center"
                $justify="center"
                $gap={2}
                style={{ 
                  background: example.color,
                  color: 'white',
                  padding: '16px',
                  textAlign: 'center'
                }}
              >
                <Text $fontWeight="bold">{example.label}</Text>
                <Text $fontSize="sm" $opacity={0.9}>
                  {example.ratio}
                </Text>
              </Flex>
            </AspectRatio>
          </Box>
        ))}
      </Grid>
    </Box>
  );
};

/**
 * VideoThumbnail - Example video thumbnail component
 */
export const VideoThumbnail = ({ 
  src, 
  alt, 
  title, 
  duration, 
  onClick 
}) => {
  return (
    <Box>
      <VideoAspectRatio
        $radius="lg"
        $shadow="md"
        onClick={onClick}
        style={{ cursor: onClick ? 'pointer' : 'default' }}
      >
        <img src={src} alt={alt} />
        
        {/* Duration overlay */}
        {duration && (
          <Box
            style={{
              position: 'absolute',
              bottom: '8px',
              right: '8px',
              background: 'rgba(0, 0, 0, 0.8)',
              color: 'white',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: '500',
            }}
          >
            {duration}
          </Box>
        )}
        
        {/* Play button overlay */}
        <Box
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '60px',
            height: '60px',
            background: 'rgba(0, 0, 0, 0.7)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '24px',
          }}
        >
          ▶
        </Box>
      </VideoAspectRatio>
      
      {title && (
        <Text $mt={2} $fontWeight="medium">
          {title}
        </Text>
      )}
    </Box>
  );
};

/**
 * ProfileCard - Example profile card with square avatar
 */
export const ProfileCard = ({ 
  avatar, 
  name, 
  role, 
  bio 
}) => {
  return (
    <Box $p={6} $bg="surface" $radius="xl" $shadow="md">
      <Flex $direction="column" $align="center" $gap={4}>
        <SquareAspectRatio
          $radius="full"
          style={{ width: '120px' }}
        >
          <img 
            src={avatar} 
            alt={name}
            style={{ borderRadius: '50%' }}
          />
        </SquareAspectRatio>
        
        <Box $textAlign="center">
          <Text $fontSize="lg" $fontWeight="bold" $mb={1}>
            {name}
          </Text>
          <Text $fontSize="sm" $color="primary" $mb={2}>
            {role}
          </Text>
          <Text $fontSize="sm" $color="secondary">
            {bio}
          </Text>
        </Box>
      </Flex>
    </Box>
  );
};

/**
 * StoryPreview - Example story preview component
 */
export const StoryPreview = ({ 
  image, 
  title, 
  author, 
  isViewed = false 
}) => {
  return (
    <Box style={{ width: '80px' }}>
      <StoryAspectRatio
        $radius="xl"
        $border={!isViewed}
        style={{
          borderColor: isViewed ? 'transparent' : '#3b82f6',
          borderWidth: '2px',
          opacity: isViewed ? 0.6 : 1,
        }}
      >
        <img src={image} alt={title} />
        
        {/* Gradient overlay */}
        <Box
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '50%',
            background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
            display: 'flex',
            alignItems: 'flex-end',
            padding: '8px',
          }}
        >
          <Text 
            $fontSize="xs" 
            $color="white" 
            $fontWeight="medium"
            style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
          >
            {title}
          </Text>
        </Box>
      </StoryAspectRatio>
      
      <Text 
        $fontSize="xs" 
        $textAlign="center" 
        $mt={1}
        $color={isViewed ? 'muted' : 'primary'}
      >
        {author}
      </Text>
    </Box>
  );
};

/**
 * HeroBanner - Example hero banner component
 */
export const HeroBanner = ({ 
  backgroundImage, 
  title, 
  subtitle, 
  action 
}) => {
  return (
    <HeroAspectRatio
      $radius="xl"
      $shadow="lg"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Flex
        $direction="column"
        $align="center"
        $justify="center"
        $gap={4}
        $p={8}
        style={{ color: 'white', textAlign: 'center' }}
      >
        <Text $fontSize="3xl" $fontWeight="bold">
          {title}
        </Text>
        <Text $fontSize="lg" $opacity={0.9}>
          {subtitle}
        </Text>
        {action}
      </Flex>
    </HeroAspectRatio>
  );
};

// PropTypes
VideoThumbnail.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  title: PropTypes.string,
  duration: PropTypes.string,
  onClick: PropTypes.func,
};

ProfileCard.propTypes = {
  avatar: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  role: PropTypes.string,
  bio: PropTypes.string,
};

StoryPreview.propTypes = {
  image: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  isViewed: PropTypes.bool,
};

HeroBanner.propTypes = {
  backgroundImage: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  action: PropTypes.node,
};