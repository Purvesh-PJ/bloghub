import {
  slateDark,
  indigoDark,
  grassDark,
  amberDark,
  redDark,
  blueDark,
  whiteA,
} from '@radix-ui/colors';
import { createTheme } from './createTheme';

/**
 * Dark mode — the same semantic mapping as light, fed the dark ramps.
 *
 * Radix dark ramps keep the 12-step semantics and the same key names, so every token
 * defined in light is necessarily defined here too. Tonal layering does most of the work in
 * dark, where shadows barely register.
 */
export const darkTheme = createTheme(
  {
    neutral: slateDark,
    accent: indigoDark,
    success: grassDark,
    warning: amberDark,
    danger: redDark,
    info: blueDark,
    alpha: whiteA,
  },
  'dark'
);
