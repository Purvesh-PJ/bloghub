import {
  slateDark,
  skyDark,
  grassDark,
  amberDark,
  redDark,
  blueDark,
  whiteA,
} from '@radix-ui/colors';
import { createTheme } from './createTheme';

/**
 * Dark mode — Obsidian & Slate Dark with vibrant Sky Blue accents.
 */
export const darkTheme = createTheme(
  {
    neutral: slateDark,
    accent: skyDark,
    success: grassDark,
    warning: amberDark,
    danger: redDark,
    info: blueDark,
    alpha: whiteA,
  },
  'dark'
);

