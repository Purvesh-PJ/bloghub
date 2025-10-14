import styled from 'styled-components';

/**
 * AspectRatio - A primitive for maintaining consistent aspect ratios
 * 
 * Supports preset ratios and custom ratios
 * 
 * @example
 * <AspectRatio $ratio="16/9">
 *   <img src="image.jpg" alt="Video thumbnail" />
 * </AspectRatio>
 * 
 * <AspectRatio $ratio="square">
 *   <div>Square content</div>
 * </AspectRatio>
 */

// Preset aspect ratios
const ASPECT_RATIO_PRESETS = {
    // Common video ratios
    '16/9': '56.25%',      // 9/16 * 100 = 56.25% (widescreen)
    '21/9': '42.857%',     // 9/21 * 100 = 42.857% (ultrawide)
    '4/3': '75%',          // 3/4 * 100 = 75% (traditional TV)
    '3/2': '66.667%',      // 2/3 * 100 = 66.667% (classic photo)

    // Square and portrait
    'square': '100%',      // 1/1 * 100 = 100%
    '1/1': '100%',         // Same as square
    '3/4': '133.333%',     // 4/3 * 100 = 133.333% (portrait photo)
    '9/16': '177.778%',    // 16/9 * 100 = 177.778% (mobile/story)

    // Social media ratios
    'instagram': '100%',   // Square posts
    'story': '177.778%',   // 9:16 stories
    'cover': '37.5%',      // Facebook cover (851x315)

    // Design ratios
    'golden': '61.803%',   // Golden ratio (1:1.618)
    'silver': '70.711%',   // Silver ratio (1:1.414)

    // Card ratios
    'card': '62.5%',       // 8:5 ratio for cards
    'banner': '25%',       // 4:1 ratio for banners
    'hero': '40%',         // 5:2 ratio for hero sections
};

const AspectRatioContainer = styled.div`
  position: relative;
  width: 100%;
  overflow: hidden;
  
  /* Calculate padding-bottom based on aspect ratio */
  padding-bottom: ${(p) => {
        if (!p.$ratio) return '56.25%'; // Default to 16:9

        // Check if it's a preset
        if (ASPECT_RATIO_PRESETS[p.$ratio]) {
            return ASPECT_RATIO_PRESETS[p.$ratio];
        }

        // Handle custom ratios like "4/3" or "16:9"
        const ratio = p.$ratio.toString();
        if (ratio.includes('/') || ratio.includes(':')) {
            const separator = ratio.includes('/') ? '/' : ':';
            const [width, height] = ratio.split(separator).map(Number);
            if (width && height) {
                return `${(height / width) * 100}%`;
            }
        }

        // Handle decimal ratios like 1.5
        const numericRatio = parseFloat(ratio);
        if (!isNaN(numericRatio) && numericRatio > 0) {
            return `${(1 / numericRatio) * 100}%`;
        }

        // Fallback to 16:9
        return '56.25%';
    }};
  
  /* Border radius */
  border-radius: ${(p) => {
        if (!p.$radius) return '0';
        if (p.$radius === 'xs') return p.theme.radii.xs;
        if (p.$radius === 'sm') return p.theme.radii.sm;
        if (p.$radius === 'md') return p.theme.radii.md;
        if (p.$radius === 'lg') return p.theme.radii.lg;
        if (p.$radius === 'xl') return p.theme.radii.xl;
        if (p.$radius === 'full') return p.theme.radii.pill;
        return typeof p.$radius === 'number' ? p.theme.spacing(p.$radius) : p.$radius;
    }};
  
  /* Background */
  background: ${(p) => {
        if (!p.$bg) return 'transparent';
        if (p.$bg === 'surface') return p.theme.palette.background.surface;
        if (p.$bg === 'default') return p.theme.palette.background.default;
        if (p.$bg === 'subtle') return p.theme.palette.background.subtle;
        return p.$bg;
    }};
  
  /* Border */
  border: ${(p) => {
        if (!p.$border) return 'none';
        if (p.$border === true) return `${p.theme.borderWidth.thin} solid ${p.theme.palette.divider}`;
        return p.$border;
    }};
  
  /* Shadow */
  box-shadow: ${(p) => {
        if (!p.$shadow) return 'none';
        if (p.$shadow === 'sm') return p.theme.shadows.sm;
        if (p.$shadow === 'md') return p.theme.shadows.md;
        if (p.$shadow === 'lg') return p.theme.shadows.lg;
        return p.$shadow;
    }};
`;

const AspectRatioContent = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: ${(p) => p.$align || 'center'};
  justify-content: ${(p) => p.$justify || 'center'};
  
  /* Ensure content fills the container */
  > * {
    ${(p) => p.$fill && `
      width: 100%;
      height: 100%;
      object-fit: ${p.$objectFit || 'cover'};
    `}
  }
  
  /* Image specific styles */
  > img {
    width: 100%;
    height: 100%;
    object-fit: ${(p) => p.$objectFit || 'cover'};
    object-position: ${(p) => p.$objectPosition || 'center'};
  }
  
  /* Video specific styles */
  > video {
    width: 100%;
    height: 100%;
    object-fit: ${(p) => p.$objectFit || 'cover'};
    object-position: ${(p) => p.$objectPosition || 'center'};
  }
`;

export const AspectRatio = ({
    children,
    $ratio = '16/9',
    $align = 'center',
    $justify = 'center',
    $fill = true,
    $objectFit = 'cover',
    $objectPosition = 'center',
    $radius,
    $bg,
    $border,
    $shadow,
    ...props
}) => {
    return (
        <AspectRatioContainer
            $ratio={$ratio}
            $radius={$radius}
            $bg={$bg}
            $border={$border}
            $shadow={$shadow}
            {...props}
        >
            <AspectRatioContent
                $align={$align}
                $justify={$justify}
                $fill={$fill}
                $objectFit={$objectFit}
                $objectPosition={$objectPosition}
            >
                {children}
            </AspectRatioContent>
        </AspectRatioContainer>
    );
};

// Export preset ratios for reference
export const ASPECT_RATIOS = ASPECT_RATIO_PRESETS;

// Convenience components for common use cases
export const VideoAspectRatio = (props) => (
    <AspectRatio $ratio="16/9" {...props} />
);

export const SquareAspectRatio = (props) => (
    <AspectRatio $ratio="square" {...props} />
);

export const StoryAspectRatio = (props) => (
    <AspectRatio $ratio="story" {...props} />
);

export const CardAspectRatio = (props) => (
    <AspectRatio $ratio="card" {...props} />
);

export const HeroAspectRatio = (props) => (
    <AspectRatio $ratio="hero" {...props} />
);