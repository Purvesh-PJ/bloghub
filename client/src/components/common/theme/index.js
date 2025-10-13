import colors from './colors';
import spacing from './spacing';
import breakpoints from './breakpoints';
import typography from './typography';

const theme = {
  colors,
  spacing,
  breakpoints,
  typography,
};

export default theme;

// Re-export everything for direct imports
export * from './themes';
export * from './animations';
export * from './breakpoints';
export { default as GlobalStyle } from './globalStyle';
