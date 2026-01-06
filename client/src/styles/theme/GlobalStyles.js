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
    text-rendering: optimizeLegibility;
  }

  body {
    font-family: ${({ theme }) => theme.fonts.body};
    font-size: ${({ theme }) => theme.fontSizes.md};
    line-height: ${({ theme }) => theme.lineHeights.normal};
    color: ${({ theme }) => theme.colors.textPrimary};
    background-color: ${({ theme }) => theme.colors.bgSecondary};
    min-height: 100vh;
    transition: background-color ${({ theme }) => theme.transitions.normal},
                color ${({ theme }) => theme.transitions.normal};
  }

  /* Links */
  a {
    text-decoration: none;
    color: inherit;
    transition: color ${({ theme }) => theme.transitions.fast};
  }

  /* Headings */
  h1, h2, h3, h4, h5, h6 {
    font-family: ${({ theme }) => theme.fonts.heading};
    font-weight: ${({ theme }) => theme.fontWeights.semibold};
    color: ${({ theme }) => theme.colors.textPrimary};
    letter-spacing: ${({ theme }) => theme.letterSpacing.tight};
  }

  /* Paragraphs */
  p {
    color: ${({ theme }) => theme.colors.textSecondary};
    line-height: ${({ theme }) => theme.lineHeights.relaxed};
  }

  /* Code */
  code, pre {
    font-family: ${({ theme }) => theme.fonts.mono};
  }

  code {
    background: ${({ theme }) => theme.colors.codeBg};
    padding: 2px 6px;
    border-radius: ${({ theme }) => theme.radii.sm};
    font-size: 0.9em;
  }

  pre {
    background: ${({ theme }) => theme.colors.codeBg};
    padding: ${({ theme }) => theme.spacing.md};
    border-radius: ${({ theme }) => theme.radii.md};
    overflow-x: auto;
    font-size: ${({ theme }) => theme.fontSizes.sm};
  }

  pre code {
    background: none;
    padding: 0;
    border-radius: 0;
  }

  /* Images */
  img {
    max-width: 100%;
    height: auto;
    display: block;
  }

  /* Buttons reset */
  button {
    font-family: inherit;
    cursor: pointer;
    border: none;
    background: none;
  }

  /* Input reset */
  input, textarea, select {
    font-family: inherit;
    font-size: inherit;
  }

  /* Scrollbar - minimal */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.scrollbarTrack};
  }

  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.scrollbarThumb};
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.colors.scrollbarThumbHover};
  }

  /* Focus - clean ring */
  *:focus-visible {
    outline: none;
    box-shadow: ${({ theme }) => theme.shadows.focusRing};
  }

  /* Selection */
  ::selection {
    background: ${({ theme }) => theme.colors.selection};
    color: ${({ theme }) => theme.colors.selectionText};
  }

  /* Post Content */
  .post-content {
    font-family: ${({ theme }) => theme.fonts.body};
    font-size: ${({ theme }) => theme.fontSizes.lg};
    line-height: ${({ theme }) => theme.lineHeights.loose};
    color: ${({ theme }) => theme.colors.textPrimary};
  }

  .post-content h1,
  .post-content h2,
  .post-content h3 {
    font-weight: ${({ theme }) => theme.fontWeights.semibold};
    margin-top: 2em;
    margin-bottom: 0.75em;
    color: ${({ theme }) => theme.colors.textPrimary};
    letter-spacing: ${({ theme }) => theme.letterSpacing.tight};
  }

  .post-content h1 { font-size: 1.75rem; }
  .post-content h2 { font-size: 1.5rem; }
  .post-content h3 { font-size: 1.25rem; }

  .post-content p {
    margin-bottom: 1.25em;
    color: ${({ theme }) => theme.colors.textSecondary};
  }

  .post-content ul,
  .post-content ol {
    margin-bottom: 1.25em;
    padding-left: 1.5em;
    color: ${({ theme }) => theme.colors.textSecondary};
  }

  .post-content li {
    margin-bottom: 0.5em;
  }

  .post-content blockquote {
    border-left: 3px solid ${({ theme }) => theme.colors.border};
    padding-left: ${({ theme }) => theme.spacing.md};
    margin: 1.5em 0;
    color: ${({ theme }) => theme.colors.textMuted};
    font-style: italic;
  }

  .post-content img {
    border-radius: ${({ theme }) => theme.radii.lg};
    margin: 1.5em 0;
  }

  /* Rich Text Editor */
  .ql-container {
    min-height: 300px;
    font-size: ${({ theme }) => theme.fontSizes.md};
    font-family: ${({ theme }) => theme.fonts.body};
    border: 1px solid ${({ theme }) => theme.colors.inputBorder} !important;
    border-top: none !important;
    border-radius: 0 0 ${({ theme }) => theme.radii.md} ${({ theme }) => theme.radii.md};
    background: ${({ theme }) => theme.colors.inputBg};
  }

  .ql-toolbar {
    border-radius: ${({ theme }) => theme.radii.md} ${({ theme }) => theme.radii.md} 0 0;
    background: ${({ theme }) => theme.colors.bgTertiary};
    border: 1px solid ${({ theme }) => theme.colors.inputBorder} !important;
    font-family: ${({ theme }) => theme.fonts.body};
  }

  .ql-editor {
    min-height: 300px;
    font-family: ${({ theme }) => theme.fonts.body};
    line-height: ${({ theme }) => theme.lineHeights.relaxed};
    color: ${({ theme }) => theme.colors.textPrimary};
  }

  .ql-editor.ql-blank::before {
    color: ${({ theme }) => theme.colors.inputPlaceholder};
    font-style: normal;
  }

  /* Utility Classes */
  .text-truncate {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .text-truncate-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .text-truncate-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  /* Responsive */
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    .hide-mobile {
      display: none !important;
    }
  }

  @media (min-width: calc(${({ theme }) => theme.breakpoints.md} + 1px)) {
    .hide-desktop {
      display: none !important;
    }
  }
`;
