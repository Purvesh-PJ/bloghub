// Layout Primitives - Individual files for better organization
export { Container } from './Container';
export { Flex } from './Flex';
export { Stack } from './Stack';
export { Grid } from './Grid';
export { Page } from './Page';
export { ContentSection } from './ContentSection';

// Also maintain Layout.js for backward compatibility
export { Container, Flex, Stack, Grid, Page, ContentSection } from './Layout';
export { Box, Section, Article, Aside, Header, Footer, Main, Nav } from './Box';
export { 
  AspectRatio, 
  VideoAspectRatio, 
  SquareAspectRatio, 
  StoryAspectRatio, 
  CardAspectRatio, 
  HeroAspectRatio,
  ASPECT_RATIOS 
} from '../utils/AspectRatio';