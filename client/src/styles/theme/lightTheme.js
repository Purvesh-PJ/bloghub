import { slate, indigo, grass, amber, red, blue, blackA } from '@radix-ui/colors';
import { createTheme } from './createTheme';

/**
 * Light mode.
 *
 * Neutral is `slate` — a cool grey with a faint blue cast. Cool neutrals are what read as
 * "product" rather than "document"; it is the family apple.com and developer.android.com
 * both sit in, and it harmonises with the indigo accent instead of fighting it.
 *
 * To re-theme the entire application, swap a ramp here and in darkTheme.js. Nothing else
 * needs to change.
 */
export const lightTheme = createTheme(
  {
    neutral: slate,
    accent: indigo,
    success: grass,
    warning: amber,
    danger: red,
    info: blue,
    alpha: blackA,
  },
  'light'
);
