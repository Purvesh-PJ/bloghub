# AspectRatio Primitive

A flexible primitive component for maintaining consistent aspect ratios across your application. Perfect for images, videos, cards, and any content that needs to maintain specific proportions.

## Features

- **Preset Ratios**: Common aspect ratios like 16:9, square, golden ratio, etc.
- **Custom Ratios**: Support for any custom aspect ratio
- **Theme Integration**: Uses theme system for styling
- **Responsive**: Maintains aspect ratio across all screen sizes
- **Flexible Content**: Works with images, videos, or any content
- **Object Fit Control**: Built-in object-fit and object-position support

## Available Presets

### Video Ratios
- `16/9` - Standard widescreen (56.25%)
- `21/9` - Ultrawide (42.857%)
- `4/3` - Traditional TV (75%)
- `3/2` - Classic photo (66.667%)

### Square and Portrait
- `square` or `1/1` - Perfect square (100%)
- `3/4` - Portrait photo (133.333%)
- `9/16` - Mobile/story format (177.778%)

### Social Media
- `instagram` - Square posts (100%)
- `story` - Instagram/TikTok stories (177.778%)
- `cover` - Facebook cover (37.5%)

### Design Ratios
- `golden` - Golden ratio 1:1.618 (61.803%)
- `silver` - Silver ratio 1:1.414 (70.711%)

### UI Ratios
- `card` - Card ratio 8:5 (62.5%)
- `banner` - Banner ratio 4:1 (25%)
- `hero` - Hero section 5:2 (40%)

## Basic Usage

```jsx
import { AspectRatio } from '@/components/ui/primitives';

// Using preset ratios
<AspectRatio $ratio="16/9">
  <img src="video-thumbnail.jpg" alt="Video" />
</AspectRatio>

<AspectRatio $ratio="square">
  <div>Square content</div>
</AspectRatio>

// Custom ratios
<AspectRatio $ratio="5/4">
  <img src="custom-image.jpg" alt="Custom ratio" />
</AspectRatio>

// Decimal ratios
<AspectRatio $ratio={1.5}>
  <video src="video.mp4" />
</AspectRatio>
```

## Convenience Components

Pre-configured components for common use cases:

```jsx
import { 
  VideoAspectRatio,
  SquareAspectRatio,
  StoryAspectRatio,
  CardAspectRatio,
  HeroAspectRatio
} from '@/components/ui/primitives';

<VideoAspectRatio>
  <img src="video.jpg" alt="Video thumbnail" />
</VideoAspectRatio>

<SquareAspectRatio>
  <img src="profile.jpg" alt="Profile" />
</SquareAspectRatio>
```

## Styling Props

### Layout Props
- `$ratio` - Aspect ratio (preset or custom)
- `$align` - Vertical alignment of content ('center', 'flex-start', 'flex-end')
- `$justify` - Horizontal alignment of content ('center', 'flex-start', 'flex-end')

### Content Props
- `$fill` - Whether content should fill container (default: true)
- `$objectFit` - Object fit for images/videos ('cover', 'contain', 'fill', 'none', 'scale-down')
- `$objectPosition` - Object position for images/videos ('center', 'top', 'bottom', etc.)

### Styling Props
- `$radius` - Border radius ('xs', 'sm', 'md', 'lg', 'xl', 'full')
- `$bg` - Background color ('surface', 'subtle', 'default', or custom)
- `$border` - Border (true for default, or custom border string)
- `$shadow` - Box shadow ('sm', 'md', 'lg', or custom)

## Examples

### Image Gallery
```jsx
<Grid $cols="repeat(auto-fit, minmax(200px, 1fr))" $gap={4}>
  <AspectRatio $ratio="square" $radius="lg" $shadow="sm">
    <img src="photo1.jpg" alt="Photo 1" />
  </AspectRatio>
  <AspectRatio $ratio="square" $radius="lg" $shadow="sm">
    <img src="photo2.jpg" alt="Photo 2" />
  </AspectRatio>
</Grid>
```

### Video Thumbnail with Overlay
```jsx
<VideoAspectRatio $radius="lg" $shadow="md">
  <img src="thumbnail.jpg" alt="Video thumbnail" />
  
  {/* Duration overlay */}
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
    }}
  >
    5:42
  </Box>
  
  {/* Play button */}
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
```

### Profile Card
```jsx
<Card $p={6}>
  <Flex $direction="column" $align="center" $gap={4}>
    <SquareAspectRatio 
      $radius="full" 
      style={{ width: '120px' }}
    >
      <img src="avatar.jpg" alt="User avatar" />
    </SquareAspectRatio>
    
    <Box $textAlign="center">
      <Text $fontSize="lg" $fontWeight="bold">John Doe</Text>
      <Text $fontSize="sm" $color="secondary">Developer</Text>
    </Box>
  </Flex>
</Card>
```

### Hero Banner
```jsx
<HeroAspectRatio
  $radius="xl"
  $shadow="lg"
  style={{
    backgroundImage: 'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(hero-bg.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }}
>
  <Flex
    $direction="column"
    $align="center"
    $justify="center"
    $gap={4}
    style={{ color: 'white', textAlign: 'center' }}
  >
    <H1>Welcome to Our Platform</H1>
    <Text $fontSize="lg">Discover amazing content</Text>
    <Button $size="lg">Get Started</Button>
  </Flex>
</HeroAspectRatio>
```

### Story Preview
```jsx
<StoryAspectRatio
  $radius="xl"
  $border
  style={{ 
    width: '80px',
    borderColor: '#3b82f6',
    borderWidth: '2px'
  }}
>
  <img src="story.jpg" alt="Story" />
  
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
    <Text $fontSize="xs" $color="white" $fontWeight="medium">
      Story Title
    </Text>
  </Box>
</StoryAspectRatio>
```

## Custom Ratios

You can use any custom aspect ratio:

```jsx
// Fraction format
<AspectRatio $ratio="5/4">Content</AspectRatio>

// Colon format  
<AspectRatio $ratio="5:4">Content</AspectRatio>

// Decimal format
<AspectRatio $ratio={1.25}>Content</AspectRatio>

// Very custom ratios
<AspectRatio $ratio="7/3">Wide banner</AspectRatio>
```

## Responsive Behavior

AspectRatio maintains its proportions across all screen sizes, making it perfect for responsive designs:

```jsx
<Grid 
  $cols="repeat(auto-fit, minmax(250px, 1fr))" 
  $gap={4}
>
  {images.map(image => (
    <CardAspectRatio key={image.id} $radius="lg">
      <img src={image.src} alt={image.alt} />
    </CardAspectRatio>
  ))}
</Grid>
```

## Best Practices

1. **Choose appropriate ratios**: Use 16:9 for videos, square for avatars, card ratio for content cards
2. **Consistent ratios**: Use the same ratio for similar content types
3. **Consider content**: Make sure your content works well with the chosen aspect ratio
4. **Use presets**: Leverage the built-in presets for common use cases
5. **Combine with other primitives**: Use with Grid, Flex, and Card for complex layouts

## Accessibility

- Images should always have proper `alt` attributes
- Videos should have appropriate controls and captions
- Interactive content should be keyboard accessible
- Consider providing alternative content for screen readers

## Migration from Fixed Heights

### Before
```jsx
<div style={{ height: '200px', overflow: 'hidden' }}>
  <img src="image.jpg" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
</div>
```

### After
```jsx
<AspectRatio $ratio="card" $objectFit="cover">
  <img src="image.jpg" alt="Description" />
</AspectRatio>
```

The AspectRatio primitive provides consistent, responsive, and theme-integrated aspect ratio control for all your content needs.