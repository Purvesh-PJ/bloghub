import js from '@eslint/js';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import globals from 'globals';

export default [
  js.configs.recommended,
  {
    ignores: ['dist/**', 'node_modules/**'],
  },
  {
    files: ['src/**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
    },
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      // The plugins were registered but their rules were never enabled. Without
      // react/jsx-uses-vars, no-unused-vars cannot see a component referenced only in JSX
      // and reports every import as unused.
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,

      // React 19's automatic JSX runtime needs no React import.
      'react/react-in-jsx-scope': 'off',
      // No runtime type checking is used in this codebase.
      'react/prop-types': 'off',
      // Unescaped apostrophes in copy are intentional and readable.
      'react/no-unescaped-entities': 'off',

      'react-hooks/exhaustive-deps': 'warn',
      // Four pages hydrate local form state from a query inside an effect. The pattern
      // works but causes a cascading render; refactoring it needs tests in place first,
      // so it is tracked rather than blocking. See docs — BUG-15.
      'react-hooks/set-state-in-effect': 'warn',
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'no-console': 'off',
    },
  },
];
