import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

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

  /* Radix themes integration */
  .radix-themes {
    --default-font-family: ${({ theme }) => theme.fonts.body};
  }

  /* Links */
  a {
    text-decoration: none;
    color: inherit;
    transition: color ${({ theme }) => theme.transitions.fast};
  }

  a:hover {
    color: ${({ theme }) => theme.colors.textLink};
  }

  /* Headings */
  h1, h2, h3, h4, h5, h6 {
    font-family: ${({ theme }) => theme.fonts.heading};
    font-weight: ${({ theme }) => theme.fontWeights.semibold};
    color: ${({ theme }) => theme.colors.textPrimary};
    line-height: ${({ theme }) => theme.lineHeights.tight};
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
    padding: 0.2em 0.4em;
    border-radius: ${({ theme }) => theme.radii.sm};
    font-size: ${({ theme }) => theme.fontSizes.base};
  }

  pre {
    background: ${({ theme }) => theme.colors.codeBg};
    border: 1px solid ${({ theme }) => theme.colors.codeBorder};
    border-radius: ${({ theme }) => theme.radii.md};
    padding: ${({ theme }) => theme.spacing.md};
    overflow-x: auto;
    font-size: ${({ theme }) => theme.fontSizes.base};
  }

  pre code {
    background: none;
    padding: 0;
    border-radius: 0;
  }

  /* Layout */
  .app-layout {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  .main-content {
    flex: 1;
    padding-top: ${({ theme }) => theme.layout.headerHeight};
  }

  /* Post Content */
  .post-content {
    font-family: ${({ theme }) => theme.fonts.body};
    line-height: ${({ theme }) => theme.lineHeights.loose};
    font-size: ${({ theme }) => theme.fontSizes.lg};
    color: ${({ theme }) => theme.colors.textPrimary};
  }

  .post-content h1,
  .post-content h2,
  .post-content h3 {
    font-weight: ${({ theme }) => theme.fontWeights.semibold};
    margin-top: 1.5em;
    margin-bottom: 0.5em;
    color: ${({ theme }) => theme.colors.textPrimary};
  }

  .post-content h1 { font-size: 1.75rem; }
  .post-content h2 { font-size: 1.375rem; }
  .post-content h3 { font-size: 1.125rem; }

  .post-content p {
    margin-bottom: 1em;
    color: ${({ theme }) => theme.colors.textSecondary};
  }

  .post-content ul,
  .post-content ol {
    margin-bottom: 1em;
    padding-left: 1.5em;
  }

  .post-content blockquote {
    border-left: 3px solid ${({ theme }) => theme.colors.border};
    padding-left: 1em;
    margin: 1em 0;
    color: ${({ theme }) => theme.colors.textSecondary};
  }

  .post-content img {
    max-width: 100%;
    border-radius: ${({ theme }) => theme.radii.md};
    margin: 1em 0;
  }

  /* Rich Text Editor */
  .ql-container {
    min-height: 300px;
    font-size: ${({ theme }) => theme.fontSizes.md};
    font-family: ${({ theme }) => theme.fonts.body};
    border-color: ${({ theme }) => theme.colors.border};
    border-bottom-left-radius: ${({ theme }) => theme.radii.md};
    border-bottom-right-radius: ${({ theme }) => theme.radii.md};
    background: ${({ theme }) => theme.colors.inputBg};
  }

  .ql-toolbar {
    border-top-left-radius: ${({ theme }) => theme.radii.md};
    border-top-right-radius: ${({ theme }) => theme.radii.md};
    background: ${({ theme }) => theme.colors.bgSecondary};
    border-color: ${({ theme }) => theme.colors.border};
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

  /* Radix Card override */
  .rt-Card {
    background: ${({ theme }) => theme.colors.cardBg};
    border: 1px solid ${({ theme }) => theme.colors.cardBorder};
    box-shadow: ${({ theme }) => theme.shadows.sm};
    transition: border-color ${({ theme }) => theme.transitions.fast},
                box-shadow ${({ theme }) => theme.transitions.fast};
  }

  .rt-Card:hover {
    border-color: ${({ theme }) => theme.colors.borderHover};
  }

  /* Scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.scrollbarTrack};
  }

  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.scrollbarThumb};
    border-radius: ${({ theme }) => theme.radii.sm};
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.colors.scrollbarThumbHover};
  }

  /* Focus */
  *:focus-visible {
    outline: none;
    box-shadow: ${({ theme }) => theme.shadows.focus};
  }

  /* Selection */
  ::selection {
    background: ${({ theme }) => theme.colors.selection};
    color: ${({ theme }) => theme.colors.selectionText};
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
