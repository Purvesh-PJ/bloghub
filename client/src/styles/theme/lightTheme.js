import { sand, tomato, grass, amber, red, blue, blackA } from '@radix-ui/colors';
import { createTheme } from './createTheme';

/**
 * Light mode.
 *
 * Neutral is `sand`, not `slate`. A cool blue-grey neutral with an indigo accent is the
 * default palette of every SaaS dashboard built in the last five years, and this is not a
 * dashboard — it is a place people read. Sand is warm, closer to paper than to glass, and
 * it makes long-form text look like something worth sitting with.
 *
 * Accent is `tomato`: one warm, saturated colour used sparingly for links, marks and the
 * read-rate bar. Primary buttons deliberately do not use it — they are set in ink, which is
 * what stops the interface reading as "brand colour applied to everything".
 *
 * To re-theme the entire application, swap a ramp here and in darkTheme.js. Nothing else
 * needs to change.
 */
export const lightTheme = createTheme(
  {
    neutral: sand,
    accent: tomato,
    success: grass,
    warning: amber,
    danger: red,
    info: blue,
    alpha: blackA,
  },
  'light'
);
