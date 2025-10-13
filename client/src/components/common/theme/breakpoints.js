// Breakpoint values
export const breakpoints = {
  mobile: '640px',
  tablet: '768px',
  desktop: '1024px',
  wide: '1280px',
  // Legacy support
  xs: '320px',
  sm: '576px',
  md: '768px',
  lg: '992px',
  xl: '1200px',
};

// Helper functions for styled-components
export const breakpoint = {
  down: (size) => `@media (max-width: ${breakpoints[size]})`,
  up: (size) => `@media (min-width: ${breakpoints[size]})`,
  between: (min, max) =>
    `@media (min-width: ${breakpoints[min]}) and (max-width: ${breakpoints[max]})`,
};

// Default export for backward compatibility
export default breakpoints;
