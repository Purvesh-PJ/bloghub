import js from '@eslint/js';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import globals from 'globals';
import designSystem from './eslint-rules/design-system.js';

export default [
  { ignores: ['dist/**', 'node_modules/**'] },
  js.configs.recommended,

  // Config and tooling files run in Node, not the browser.
  {
    files: ['*.config.{js,cjs,mjs}', 'eslint-rules/**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { ...globals.node },
    },
  },

  // Application source.
  {
    files: ['src/**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: { ...globals.browser, ...globals.es2021 },
    },
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      'jsx-a11y': jsxA11y,
      'design-system': designSystem,
    },
    settings: { react: { version: 'detect' } },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,
      ...jsxA11y.flatConfigs.recommended.rules,

      // React 19 JSX runtime & copy settings
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react/no-unescaped-entities': 'off',

      // React safety & state guarantees
      'react-hooks/exhaustive-deps': 'error',
      'react-hooks/set-state-in-effect': 'error',
      'react/jsx-key': ['error', { checkFragmentShorthand: true }],
      'react/no-danger': 'error',
      'react/self-closing-comp': 'error',
      'react/no-array-index-key': 'warn',

      // Core JavaScript & bug prevention
      eqeqeq: ['error', 'always'],
      'no-var': 'error',
      'prefer-const': 'error',
      'no-duplicate-imports': 'error',
      'no-unneeded-ternary': 'error',
      'no-empty': ['error', { allowEmptyCatch: false }],
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'no-console': ['warn', { allow: ['warn', 'error'] }],

      // Size and complexity guards: flag components that need splitting
      'max-lines': ['warn', { max: 200, skipBlankLines: true, skipComments: true }],
      'max-lines-per-function': [
        'warn',
        { max: 150, skipBlankLines: true, skipComments: true, IIFEs: false },
      ],
      complexity: ['warn', 15],

      // Design system & UI consistency
      'design-system/enforce-tokens': 'error',
      'design-system/no-arbitrary-sizing': 'warn',
    },
  },
];
