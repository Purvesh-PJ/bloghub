import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  *,
  *::before,
  *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    font-size: 16px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    /* Let the opsz axis pick display shapes at large sizes automatically. */
    font-optical-sizing: auto;
    /* Inter's contextual alternates — a better single-storey 'a' at display sizes and
       improved figure spacing. Harmless on the serifs, which do not define them. */
    font-feature-settings: 'cv11', 'ss01';
    scroll-behavior: smooth;
    scroll-padding-top: calc(${({ theme }) => theme.layout.headerHeight} + 24px);
  }

  body {
    font-family: ${({ theme }) => theme.fonts.ui};
    font-size: ${({ theme }) => theme.text.md[0]};
    line-height: ${({ theme }) => theme.text.md[1]};
    color: ${({ theme }) => theme.colors.textPrimary};
    background: ${({ theme }) => theme.colors.surfacePage};
    min-height: 100vh;
    transition:
      background ${({ theme }) => theme.transitions.normal},
      color ${({ theme }) => theme.transitions.normal};
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: ${({ theme }) => theme.fonts.display};
    color: ${({ theme }) => theme.colors.textPrimary};
    text-wrap: balance;
    /*
      Fraunces' SOFT axis rounds the terminals. At 0 it is a sharp Scotch-style face that
      turns brittle on a screen; a little softness is what makes it read as warm rather
      than as a newspaper masthead. WONK swaps in the angled 'g' and 'y' — the detail that
      makes the face recognisable rather than generic.
    */
    font-variation-settings: 'SOFT' 24, 'WONK' 1;
  }

  p {
    text-wrap: pretty;
  }

  code, pre, kbd, samp {
    font-family: ${({ theme }) => theme.fonts.mono};
  }

  img, svg, video {
    max-width: 100%;
    display: block;
  }

  button {
    font-family: inherit;
    font-size: inherit;
    cursor: pointer;
    border: none;
    background: none;
    color: inherit;
  }

  input, textarea, select {
    font-family: inherit;
    font-size: inherit;
    color: inherit;
  }

  /* One focus ring for the whole application. Radix decides *when* focus is visible. */
  :focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.lineFocus};
    outline-offset: 2px;
  }

  ::selection {
    background: ${({ theme }) => theme.colors.selection};
    color: ${({ theme }) => theme.colors.selectionText};
  }

  /* ── Scrollbars — thin, floating, no gutter ─────────────────────────────── */
  * {
    scrollbar-width: thin;
    scrollbar-color: ${({ theme }) => theme.colors.lineStrong} transparent;
  }

  ::-webkit-scrollbar { width: 12px; height: 12px; }
  ::-webkit-scrollbar-track { background: transparent; }

  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.lineStrong};
    border-radius: ${({ theme }) => theme.radii.full};
    border: 4px solid transparent;
    background-clip: content-box;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.colors.textMuted};
    background-clip: content-box;
  }

  /* ── Article body ────────────────────────────────────────────────────────── */
  .post-content {
    font-size: ${({ theme }) => theme.text.lg[0]};
    line-height: ${({ theme }) => theme.text.lg[1]};
    color: ${({ theme }) => theme.colors.textSecondary};
  }

  .post-content > * + * { margin-top: 1.4em; }

  .post-content h1,
  .post-content h2,
  .post-content h3 {
    color: ${({ theme }) => theme.colors.textPrimary};
    letter-spacing: ${({ theme }) => theme.tracking.tight};
    font-weight: ${({ theme }) => theme.weights.semibold};
    margin-top: 2em;
    margin-bottom: 0.6em;
  }

  .post-content h1 { font-size: ${({ theme }) => theme.display.md[0]}; }
  .post-content h2 { font-size: ${({ theme }) => theme.display.sm[0]}; }
  .post-content h3 { font-size: ${({ theme }) => theme.display.xs[0]}; }

  .post-content a {
    color: ${({ theme }) => theme.colors.textLink};
    text-decoration: underline;
    text-underline-offset: 0.2em;
    text-decoration-thickness: 1px;
    text-decoration-color: ${({ theme }) => theme.colors.accentLine};
  }

  .post-content a:hover { text-decoration-color: currentColor; }

  .post-content ul,
  .post-content ol { padding-left: 1.4em; }
  .post-content li + li { margin-top: 0.4em; }

  .post-content blockquote {
    border-left: 3px solid ${({ theme }) => theme.colors.accentLine};
    padding-left: ${({ theme }) => theme.spacing.xl};
    color: ${({ theme }) => theme.colors.textSecondary};
  }

  .post-content img {
    border-radius: ${({ theme }) => theme.radii.xl};
    margin: 2.5em 0;
  }

  .post-content pre {
    background: ${({ theme }) => theme.colors.surfaceContainer};
    padding: ${({ theme }) => theme.spacing.xl};
    border-radius: ${({ theme }) => theme.radii.lg};
    overflow-x: auto;
    font-size: ${({ theme }) => theme.text.sm[0]};
    line-height: 1.6;
  }

  .post-content code {
    background: ${({ theme }) => theme.colors.surfaceContainer};
    padding: 0.15em 0.4em;
    border-radius: ${({ theme }) => theme.radii.xs};
    font-size: 0.875em;
  }

  .post-content pre code { background: none; padding: 0; }

  .post-content hr {
    border: none;
    border-top: 1px solid ${({ theme }) => theme.colors.lineSubtle};
    margin: 3em 0;
  }

  /* ── Markdown editor ─────────────────────────────────────────────────────── */
  .w-md-editor {
    background: ${({ theme }) => theme.colors.surfaceContainerLow} !important;
    color: ${({ theme }) => theme.colors.textPrimary} !important;
    border: 1px solid ${({ theme }) => theme.colors.lineSubtle} !important;
    border-radius: ${({ theme }) => theme.radii.lg} !important;
    box-shadow: none !important;
    overflow: hidden;
  }

  .w-md-editor-toolbar {
    background: ${({ theme }) => theme.colors.surfaceContainer} !important;
    border-bottom: 1px solid ${({ theme }) => theme.colors.lineSubtle} !important;
    padding: ${({ theme }) => theme.spacing.sm} !important;
  }

  .w-md-editor-text-input,
  .w-md-editor-text-pre > code {
    font-family: ${({ theme }) => theme.fonts.mono} !important;
    font-size: ${({ theme }) => theme.text.md[0]} !important;
    line-height: 1.7 !important;
  }

  /* ── Utilities ───────────────────────────────────────────────────────────── */
  .text-truncate {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  @media (prefers-reduced-motion: reduce) {
    html { scroll-behavior: auto; }
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
`;
