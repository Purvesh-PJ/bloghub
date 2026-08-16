import { slate, sky, grass, amber, red, blue, blackA } from '@radix-ui/colors';
import { createTheme } from './createTheme';

/**
 * Light mode — Crisp White Paper with Sky Blue Primary/Accent.
 *
 * Neutral is `slate`: clean, modern, crisp cool-grey tones that pair perfectly with white paper.
 * Accent is `sky`: vibrant sky blue (#0284c7 / #0ea5e9 / #38bdf8) for high-impact primary actions,
 * interactive badges, glowing focus rings, and read-through indicators.
 */
export const lightTheme = createTheme(
  {
    neutral: slate,
    accent: sky,
    success: grass,
    warning: amber,
    danger: red,
    info: blue,
    alpha: blackA,
  },
  'light'
);
