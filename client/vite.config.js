/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  envDir: '../',
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  /*
    The suite runs in jsdom because most of what is worth testing here — the axios
    interceptors, the service layer's request shapes, the text helpers — is exercised by
    calling it rather than by rendering, and jsdom supplies the localStorage and window the
    auth store and the api module reach for at import time.
  */
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.js'],
    // vitest's default also picks up anything under node_modules/.
    include: ['src/**/*.test.{js,jsx}'],
  },

  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          /*
            The framework, which changes only when a dependency is upgraded.

            `react-dom` alone did not match: the application imports `react-dom/client`, a
            different module id, so React's ~130 kB renderer stayed in the main chunk and was
            re-downloaded on every deploy that touched application code. `scheduler` is
            react-dom's own dependency and belongs with it rather than wherever it is first
            reached from.
          */
          vendor: [
            'react',
            'react/jsx-runtime',
            'react-dom',
            'react-dom/client',
            'scheduler',
            'react-router-dom',
          ],
          // The headless Radix primitives, which every page pulls in through ui/.
          // @radix-ui/themes used to be chunked here; it was never configured with a
          // stylesheet or a provider, so everything built on it rendered unstyled.
          radix: [
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-select',
            '@radix-ui/react-tabs',
            '@radix-ui/react-avatar',
          ],
          /*
            The editor and the renderer are split apart deliberately.

            `@uiw/react-md-editor` re-exports the preview component, so leaving them in one
            chunk meant every reader downloaded the toolbar, the command set and the textarea
            to read an article. Naming the preview package here keeps the read path on the
            small chunk even though the editor depends on the same module.
          */
          'markdown-preview': ['@uiw/react-markdown-preview/nohighlight'],
          /*
            Syntax highlighting on its own, because it is the expensive part.

            `rehype-prism-plus` pulls in refractor, which registers every language Prism
            supports. Without naming it here it lands in whichever chunk first reaches it —
            the editor's — and the post page's dynamic import would then pull the whole editor
            down to colour a code block.
          */
          'syntax-highlight': ['rehype-prism-plus'],
          editor: ['@uiw/react-md-editor'],
        },
      },
    },
  },
});
